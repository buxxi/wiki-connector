<script setup lang="ts">
import { onUpdated, onMounted, onUnmounted, ref } from "vue";
import Node, { type NodeEvent } from "./Node.vue";
import { ArticleState } from "@/domain/article";
import { Vector2 } from 'three';

export type GraphNode = {
    title: string;
    thumbnail: string;
    linkCount: number;
    links: GraphNode[];
    state: ArticleState;
}

type Position = {
    x: number;
    y: number;
}

type DrawFunction = (context : CanvasRenderingContext2D) => void;

type LineColor = "black" | "orangered" | "yellowgreen" | "silver";

const props = defineProps<{
    nodes: GraphNode[]
}>();

const NODE_FORCE_FIELD_SIZE = 200;
const BORDER_FORCE_FIELD_SIZE = 64;
const MOVE_SLOW_RATIO = 1.25;

const graph = ref<DomGraph | undefined>(undefined);

var lastDraw : (number | undefined) = undefined;

class DomGraphLine {
    from: DOMGraphNode;
    to: DOMGraphNode;
    color: LineColor;

    constructor(from: DOMGraphNode, to: DOMGraphNode, color: LineColor) {
        this.from = from;
        this.to = to;
        this.color = color;
    }

    draw(context: CanvasRenderingContext2D) : void {
        let from = this.from.getPosition()!;
        let to = this.to.getPosition()!;
        context.strokeStyle = this.color;
        context.lineWidth = 10;
        context.beginPath();
        context.moveTo(from.x, from.y);
        context.lineTo(to.x, to.y);
        context.closePath();
        context.stroke();

        context.strokeStyle = "white";
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(from.x, from.y);
        context.lineTo(to.x, to.y);
        context.closePath();
        context.stroke();
    }
}

class DOMGraphNode {
    elem: HTMLElement;
    force: Vector2;

    constructor(elem : HTMLElement, force: Vector2 | undefined) {
        this.elem = elem;
        this.force = force != undefined ? force : new Vector2(0, 0);
    }

    setPosition(position: Position) {
        this.elem.style.left = `${position.x}px`;
        this.elem.style.top = `${position.y}px`;
    }

    getPosition() : Position | undefined {
        let left = this.elem.style.left;
        let top = this.elem.style.top;

        if (!left || !top) {
            return undefined;
        }
        return {
            x: parseFloat((/(.*)px/.exec(left)![1])),
            y: parseFloat((/(.*)px/.exec(top)![1]))
        };
    } 
}

class DomGraph {
    elem: HTMLElement;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    nodes: DOMGraphNode[] = [];
    lines: DomGraphLine[] = [];
    highlightNode: GraphNode | undefined;

    constructor() {
        this.elem = document.querySelector("#graph")!;
        this.canvas = this.elem.querySelector("canvas")!;
        this.canvas.width = this.width();
        this.canvas.height = this.height();
        this.context = this.canvas.getContext("2d")!;
    }

    width() : number {
        return this.elem.getBoundingClientRect().width;
    }

    height() : number {
        return this.elem.getBoundingClientRect().height;
    }

    draw(drawFunction: DrawFunction) : void {
        this.context.reset();
        drawFunction(this.context);
    }

    resize() {
        this.canvas.width = this.width();
        this.canvas.height = this.height();
        this.context.reset();
    }

    recreateNodesAndLines() {
        let graphWidth = this.width();
        let graphHeight = this.height();

        graph.value!.nodes = [...document.querySelectorAll(".node")].map((node, i) => new DOMGraphNode(node as HTMLElement, graph.value!.nodes[i]?.force));
        graph.value!.nodes.forEach((node, i) => {
            if (node.getPosition() == undefined) {
                var previousPosition = { x : graphWidth / 2 , y : graphHeight / 2};
                for (var j = 0; j < i; j++) {
                    if (props.nodes[j].links.map(l => l.title).includes(props.nodes[i].title)) {
                        previousPosition = graph.value!.nodes[j].getPosition()!;
                    }
                }

                let radius = 32;
                let angle = i * 70;

                const toRadians = (degrees: number) => degrees * (Math.PI / 180);

                let newPosition = {
                    x: (previousPosition.x + radius * Math.cos(toRadians(angle))),
                    y: (previousPosition.y + radius* Math.sin(toRadians(angle)))
                };

                node.setPosition(newPosition);
            }
        });
        //TODO: skip duplicates
        let links = props.nodes.map(from => from.links.map(to => [from, to])).flatMap(e => e);
        graph.value!.lines = links.map(link => {
            let fromIndex = props.nodes.map(e => e.title).indexOf(link[0].title);
            let toIndex = props.nodes.map(e => e.title).indexOf(link[1].title);
            let fromNode = graph.value!.nodes[fromIndex];
            let toNode = graph.value!.nodes[toIndex];
            let color = lineColor(props.nodes[fromIndex], props.nodes[toIndex]);
            return new DomGraphLine(fromNode, toNode, color);
        });
    }

    reposition(delta: number) {
        this.calculateForces(this.width(), this.height());
        this.moveNodes(delta);
        this.drawLines();
    }

    moveNodes(delta: number) {
        for (let node of this.nodes) {
            if (node.force.x != 0 || node.force.y != 0) {
                let dir = node.force.clone().multiplyScalar(delta);
                let pos = node.getPosition()!;
                node.setPosition({ x : pos.x + dir.x , y : pos.y + dir.y });
                node.force.sub(node.force.clone().multiplyScalar(MOVE_SLOW_RATIO * delta));
            }
            
        }    
    }

    calculateForces(width: number, height: number) {
        for (let i in this.nodes) {
            let node = this.nodes[i];
            var force = new Vector2(0, 0);
            let position = node.getPosition()!;
            if (position.x < BORDER_FORCE_FIELD_SIZE) {
                force = force.add(new Vector2(1, 0));
            } else if (position.x > width - BORDER_FORCE_FIELD_SIZE) {
                force = force.add(new Vector2(-1, 0));
            }
            if (position.y < BORDER_FORCE_FIELD_SIZE) {
                force = force.add(new Vector2(0, 1));
            } else if (position.y > height - BORDER_FORCE_FIELD_SIZE) {
                force = force.add(new Vector2(0, -1));
            }
            for (let j in this.nodes) {
                if (i == j) {
                    continue;
                }
                let otherNode = this.nodes[j];
                let otherPosition = otherNode.getPosition()!;
                let diffForce = new Vector2(position.x - otherPosition.x, position.y - otherPosition.y);
                if (diffForce.length() < 1) {
                    force = force.add(i < j ? new Vector2(-1, 0) : new Vector2(1, 0));    
                } else if (diffForce.length() < NODE_FORCE_FIELD_SIZE) {
                    force = force.add(diffForce.normalize());
                }
            }
            force = force.normalize();
            node.force = node.force.add(force);
        }
    }

    drawLines() {
        let lines = graph.value!.lines;
        graph.value!.draw((context : CanvasRenderingContext2D) => {
            for (var i = 0; i < lines.length; i++) {
                lines[i].draw(context);
            }
        });
    }
}

function resized() {
    graph.value!.resize();
    graph.value!.recreateNodesAndLines();
}

function drawLoop() {
    if (lastDraw != undefined) {
        let before = lastDraw;
        lastDraw = new Date().getTime();
        let delta = (lastDraw - before) / 1000;
        graph.value?.reposition(delta);
        window.requestAnimationFrame(drawLoop);
    }
}

onMounted(() => {
    graph.value = new DomGraph();
    window.addEventListener("resize", resized);
    lastDraw = new Date().getTime();
    drawLoop();
});

onUnmounted(() => {
    window.removeEventListener("resize", resized);
    lastDraw = undefined;
});

onUpdated(() => {
    graph.value!.recreateNodesAndLines();
});

function lineColor(from: GraphNode, to: GraphNode) : LineColor {
    if (from.title == graph.value!.highlightNode?.title || to.title == graph.value!.highlightNode?.title) {
        return "silver";
    }
    if (from.state == ArticleState.BOMB || to.state == ArticleState.BOMB) {
        return "orangered";
    } else if ((from.state == ArticleState.CORRECT || from.state == ArticleState.START) && (to.state == ArticleState.CORRECT || to.state == ArticleState.START)) {
        return "yellowgreen";
    } else {
        return "black";
    }
}

function nodeStyle(node: GraphNode) : string {
    switch (node.state) {
        case ArticleState.ROOT:
        case ArticleState.NOT_FOUND:
        case ArticleState.FOUND:
            return 'normal';
        case ArticleState.START:
            return 'start';
        case ArticleState.BOMB:
            return 'bomb';
        case ArticleState.CORRECT:
            return 'correct';
    }
}

function dragNode(node: GraphNode, e: NodeEvent) : void {
    graph.value!.nodes[props.nodes.indexOf(node)].setPosition({ x: e.x, y: e.y});
}

function onDragOver(event: MouseEvent) {
    event.preventDefault();
}

function onHover(node: GraphNode, e: NodeEvent) : void {
    graph.value!.highlightNode = e.target != undefined ? node : undefined;
    graph.value!.recreateNodesAndLines();
    graph.value!.drawLines();
}

</script>

<template>
    <div id="graph" @dragover="onDragOver">
        <canvas></canvas>
        <ul>
            <Node :title="node.title" :thumbnail="node.thumbnail" :linkCount="node.linkCount" :style="nodeStyle(node)" @hover="(e) => onHover(node, e)" @drop="(e) => dragNode(node, e)" v-for="node in nodes"/>
        </ul>
    </div>
</template>
