<script setup lang="ts">
import { onUpdated, onMounted, onUnmounted, ref, watch, nextTick } from "vue";
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

type LineClass = "normal" | "bomb" | "correct" | "hover";

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
    extraClass: LineClass;
    key: string;

    constructor(from: DOMGraphNode, to: DOMGraphNode, extraClass: LineClass) {
        this.from = from;
        this.to = to;
        this.extraClass = extraClass;
        this.key = Math.random().toString();
    }

    fromX() {
        return this.from.getPosition()?.x;
    }

    toX() {
        return this.to.getPosition()?.x;
    }

    fromY() {
        return this.from.getPosition()?.y;
    }

    toY() {
        return this.to.getPosition()?.y;
    }

    classes() {
        return ["line", this.extraClass];
    }

    rerender() {
        this.key = Math.random().toString();
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
    nodes: DOMGraphNode[] = [];
    lines: DomGraphLine[] = [];
    highlightNode: GraphNode | undefined;
    width: number = 0;
    height: number = 0;

    constructor() {
        this.elem = document.querySelector("#graph")!;
        this.resize();
    }

    resize() {
        this.width = this.elem.getBoundingClientRect().width;
        this.height = this.elem.getBoundingClientRect().height;
    }

    recreateNodesAndLines() {
        let graphWidth = this.width;
        let graphHeight = this.height;

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

        let links = props.nodes.map(from => from.links.map(to => [from, to])).flatMap(e => e);
        graph.value!.lines = links.map(link => {
            let fromIndex = props.nodes.map(e => e.title).indexOf(link[0].title);
            let toIndex = props.nodes.map(e => e.title).indexOf(link[1].title);
            if (fromIndex > toIndex) {
                return undefined;
            }

            let fromNode = graph.value!.nodes[fromIndex];
            let toNode = graph.value!.nodes[toIndex];
            let extraClass = lineClass(props.nodes[fromIndex], props.nodes[toIndex]);
            return new DomGraphLine(fromNode, toNode, extraClass);
        }).filter(e => e != undefined);
    }

    reposition(delta: number) {
        if (this.calculateForces(this.width, this.height)) {
            this.moveNodes(delta);
            this.drawLines();
        }
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

    calculateForces(width: number, height: number) : boolean {
        var anyForce = false;
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
            if (node.force.length() > 0.1) {
                anyForce = true;
            } else {
                node.force = new Vector2(0, 0);
            }
        }
        return anyForce;
    }

    drawLines() {
        console.log("drawing lines");
        let lines = graph.value!.lines;
        for (let line of lines) {
            line.rerender();
        }
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

var propsChanged = false;

watch(props.nodes, () => {
    propsChanged = true;
});

onUpdated(() => {
    if (propsChanged) {
        graph.value!.recreateNodesAndLines();
        propsChanged = false;
    }
});

function lineClass(from: GraphNode, to: GraphNode) : LineClass {
    if (from.title == graph.value!.highlightNode?.title || to.title == graph.value!.highlightNode?.title) {
        return "hover";
    }
    if (from.state == ArticleState.BOMB || to.state == ArticleState.BOMB) {
        return "bomb";
    } else if ((from.state == ArticleState.CORRECT || from.state == ArticleState.START) && (to.state == ArticleState.CORRECT || to.state == ArticleState.START)) {
        return "correct";
    } else {
        return "normal";
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
}

</script>

<template>
    <div id="graph" @dragover="onDragOver">
        <svg xmlns="http://www.w3.org/2000/svg" :viewBox="`0 0 ${graph?.width} ${graph?.height}`">
            <defs>
                <line v-for="(line, index) in graph?.lines" :key="line.key" :id="`chain-path-${index}`" :x1="line.fromX()" :x2="line.toX()" :y1="line.fromY()" :y2="line.toY()" fill="none" stroke-linecap="round"/>

                <mask v-for="(line, index) in graph?.lines" :id="`holes-${index}`">
                    <!-- white everywhere = keep everything... -->
                    <rect x="0%" y="0%" width="100%" height="100%" fill="white"/>

                    <!-- ...except holes -->
                    <use :href="`#chain-path-${index}`" stroke-width="4" stroke-dasharray="6 14" stroke-dashoffset="7" stroke="black"/>
                </mask>
            </defs>

            <!-- segments whose hole is visible, with holes cut out using mask-->
            <use v-for="(line, index) in graph?.lines" :href="`#chain-path-${index}`" stroke-width="8" stroke-dasharray="6 14" stroke-dashoffset="7" :class="line.classes()" stroke-opacity="1" :mask="`url(#holes-${index})`"/>

            <!-- segments whose hole isn't visible -->
            <use v-for="(line, index) in graph?.lines" :href="`#chain-path-${index}`" stroke-width="2" stroke-dasharray="12 8" :class="line.classes()" stroke-opacity="1"/>
        </svg>
        <ul>
            <Node :title="node.title" :thumbnail="node.thumbnail" :linkCount="node.linkCount" :style="nodeStyle(node)" @hover="(e) => onHover(node, e)" @drop="(e) => dragNode(node, e)" v-for="node in nodes"/>
        </ul>
    </div>
</template>
