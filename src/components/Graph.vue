<script setup lang="ts">
import { onUpdated, onMounted, onUnmounted, ref } from "vue";
import Node from "./Node.vue";
import { ArticleState } from "@/domain/article";

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

type LineColor = "black" | "orangered";

const props = defineProps<{
    nodes: GraphNode[]
}>();

const graph = ref<DomGraph | undefined>(undefined);

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

    constructor(elem : HTMLElement) {
        this.elem = elem;
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

    constructor() {
        this.elem = document.querySelector("#graph")!;
        this.canvas = document.createElement("canvas");
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
        drawFunction(this.context);
        this.elem.style.backgroundImage = `url(${this.canvas.toDataURL()})`;
    }

    resize() {
        //TODO: this doesn't really work right now
        this.canvas.width = this.width();
        this.canvas.height = this.height();
        this.context = this.canvas.getContext("2d")!;    
    }

    recreateNodesAndLines() {
        let graphWidth = this.width();
        let graphHeight = this.height();

        graph.value!.nodes = [...document.querySelectorAll(".node")].map(node => new DOMGraphNode(node as HTMLElement));
        for (let node of graph.value!.nodes) {
            if (node.getPosition() == undefined) {
                //TODO: not random
                node.setPosition({ x : graphWidth * Math.random(), y : graphHeight * Math.random()});
            }
        }
        //TODO: skip duplicates
        let links = props.nodes.map(from => from.links.map(to => [from, to])).flatMap(e => e);
        graph.value!.lines = links.map(link => {
            let fromIndex = props.nodes.map(e => e.title).indexOf(link[0].title);
            let toIndex = props.nodes.map(e => e.title).indexOf(link[1].title);
            let fromNode = graph.value!.nodes[fromIndex];
            let toNode = graph.value!.nodes[toIndex];
            let isBomb = props.nodes[fromIndex].state == ArticleState.BOMB || props.nodes[toIndex].state == ArticleState.BOMB;
            return new DomGraphLine(fromNode, toNode, isBomb ? "orangered" : "black");
        });
    }

    reposition() {
        //TODO: make all nodes have forces pushing the others away from them and run this a few times in a loop
        this.drawLines();
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
    graph.value!.recreateNodesAndLines();
    graph.value!.reposition();
}

onMounted(() => {
    graph.value = new DomGraph();
    window.addEventListener("resize", resized);
});

onUnmounted(() => {
    window.removeEventListener("resize", resized);
});

onUpdated(() => {
    graph.value!.recreateNodesAndLines();
    graph.value!.reposition();
});

function nodeStyle(node: GraphNode) {
    switch (node.state) {
        case ArticleState.ROOT:
        case ArticleState.NOT_FOUND:
        case ArticleState.FOUND:
            return 'normal';
        case ArticleState.START:
            return 'start';
        case ArticleState.BOMB:
            return 'bomb';
    }
}

//TODO: draw lines in different color on node hover
//TODO: have some way to debug the graph on node click

</script>

<template>
    <div id="graph">
        <ul>
            <Node :title="node.title" :thumbnail="node.thumbnail" :linkCount="node.linkCount" :style="nodeStyle(node)" v-for="node in nodes"/>
        </ul>
    </div>
</template>
