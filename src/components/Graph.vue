<script setup lang="ts">
	import { onMounted, onUnmounted, ref, useTemplateRef, watch } from "vue";
	import Node, { type NodeEvent } from "./Node.vue";
	import { ArticleState } from "@/domain/article";
	import { Vector2 } from 'three';
	import Chain from "./Chain.vue";
	import DrawLoop from "@/util/drawloop";
	import { BORDER_FORCE_FIELD_SIZE, MAX_FPS, MOVE_SLOW_RATIO, NODE_FORCE_FIELD_SIZE } from "@/config";

	export type GraphNode = {
		id: () => number;
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

	const props = defineProps<{
		nodes: GraphNode[],
		showLinks: boolean
	}>();

	const graph = ref<DomGraph | undefined>(undefined);
	const drawLoop = new DrawLoop(draw, MAX_FPS);
	const graphElement = useTemplateRef("graphElement");

	class DomGraphLine {
		id: string;
		from: DOMGraphNode;
		to: DOMGraphNode;

		constructor(id: string, from: DOMGraphNode, to: DOMGraphNode) {
			this.id = id;
			this.from = from;
			this.to = to;
		}

		fromX() {
			return this.from.drawPosition.x;
		}

		toX() {
			return this.to.drawPosition.x;
		}

		fromY() {
			return this.from.drawPosition.y;
		}

		toY() {
			return this.to.drawPosition.y;
		}

		classes(highlightNode: DOMGraphNode | undefined) {
			if (this.from.node.id() == highlightNode?.node.id() || this.to.node.id() == highlightNode?.node.id()) {
				return "chain hover";
			}
			if (this.from.node.state == ArticleState.BOMB || this.to.node.state == ArticleState.BOMB) {
				return "chain bomb";
			} else if ((this.from.node.state == ArticleState.CORRECT || this.from.node.state == ArticleState.START) && (this.to.node.state == ArticleState.CORRECT || this.to.node.state == ArticleState.START)) {
				return "chain correct";
			} else {
				return "chain normal";
			}
		}
	}

	class DOMGraphNode {
		drawPosition: Position;
		physicsPosition: Position;
		node: GraphNode;
		force: Vector2;

		constructor(node: GraphNode, position: Position, force: Vector2) {
			this.node = node;
			this.drawPosition = position;
			this.physicsPosition = position;
			this.force = force;
		}

		id() {
			return this.node.id();
		}

		title() {
			return this.node.title;
		}

		thumbnail() {
			return this.node.thumbnail;
		}

		linkCount() {
			return this.node.linkCount;
		}

		setPosition(position: Position) {
			this.physicsPosition = position;
			let newX = Math.floor(position.x);
			let newY = Math.floor(position.y);
			if (Math.floor(this.drawPosition.x) != newX || Math.floor(this.drawPosition.y) != newY) {
				this.drawPosition = position;
			}
		}

		getPhysicsPosition(): Position {
			return this.physicsPosition;
		}

		class() {
			switch (this.node.state) {
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
	}

	class DomGraph {
		nodes: DOMGraphNode[] = [];
		lines: DomGraphLine[] = [];
		highlightNode: DOMGraphNode | undefined;
		width: number = 0;
		height: number = 0;
		nodeSize: number = 0;

		constructor() {
			this.resize();
			this.recreateNodesAndLines();
		}

		resize() {
			this.width = graphElement.value!.getBoundingClientRect().width;
			this.height = graphElement.value!.getBoundingClientRect().height;
			let tempNode = document.createElement("div");
			tempNode.classList.add("node");
			graphElement.value!.appendChild(tempNode);
			this.nodeSize = Math.max(tempNode.clientWidth, tempNode.clientHeight);
			graphElement.value!.removeChild(tempNode);
		}

		recreateNodesAndLines() {
			this.nodes = props.nodes.map((node, i) => {
				let position: (Position | undefined) = this.nodes[i]?.physicsPosition;
				let force: (Vector2 | undefined) = this.nodes[i]?.force;
				return new DOMGraphNode(node, position == undefined ? this.defaultPosition(i) : position, force != undefined ? force : new Vector2(0, 0));
			});

			let links = props.nodes.map(from => from.links.map(to => [from, to])).flatMap(e => e);
			this.lines = links.map(link => {
				let fromIndex = props.nodes.map(e => e.id()).indexOf(link[0].id());
				let toIndex = props.nodes.map(e => e.id()).indexOf(link[1].id());
				return { fromIndex: fromIndex, toIndex: toIndex };
			}).filter(e => e.fromIndex > e.toIndex).map(e => {
				let fromNode = this.nodes[e.fromIndex];
				let toNode = this.nodes[e.toIndex];
				let id = `${e.fromIndex}-${e.toIndex}`;
				return new DomGraphLine(id, fromNode, toNode);
			});
		}

		private defaultPosition(i: number) {
			let graphWidth = this.width;
			let graphHeight = this.height;

			var previousPosition = { x: graphWidth / 2, y: graphHeight / 2 };
			for (var j = 0; j < i; j++) {
				if (props.nodes[j].links.map(l => l.id()).includes(props.nodes[i].id()) && j < this.nodes.length) {
					previousPosition = this.nodes[j].getPhysicsPosition();
				}
			}

			let radius = 32;
			let angle = i * 70;

			const toRadians = (degrees: number) => degrees * (Math.PI / 180);

			let newPosition = {
				x: (previousPosition.x + radius * Math.cos(toRadians(angle))),
				y: (previousPosition.y + radius * Math.sin(toRadians(angle)))
			};
			return newPosition;
		}

		reposition(delta: number) {
			if (this.calculateForces(this.width, this.height, delta)) {
				this.moveNodes(delta);
				this.decreaseForces(delta);
			}
		}

		moveNodes(delta: number) {
			for (let node of this.nodes) {
				if (node.force.x != 0 || node.force.y != 0) {
					let dir = node.force.clone().multiplyScalar(delta);
					let pos = node.getPhysicsPosition();
					node.setPosition({ x: pos.x + dir.x, y: pos.y + dir.y });
				}
			}
		}

		decreaseForces(delta: number) {
			for (let node of this.nodes) {
				if (node.force.x != 0 || node.force.y != 0) {
					node.force.sub(node.force.clone().multiplyScalar(MOVE_SLOW_RATIO * delta));
				}

			}
		}

		calculateForces(width: number, height: number, delta: number): boolean {
			var anyForce = false;
			for (let i in this.nodes) {
				let node = this.nodes[i];
				var force = new Vector2(0, 0);
				let position = node.getPhysicsPosition();
				if (position.x < (this.nodeSize * BORDER_FORCE_FIELD_SIZE)) {
					force = force.add(new Vector2(1, 0));
				} else if (position.x > width - (this.nodeSize * BORDER_FORCE_FIELD_SIZE)) {
					force = force.add(new Vector2(-1, 0));
				}
				if (position.y < (this.nodeSize * BORDER_FORCE_FIELD_SIZE)) {
					force = force.add(new Vector2(0, 1));
				} else if (position.y > height - (this.nodeSize * BORDER_FORCE_FIELD_SIZE)) {
					force = force.add(new Vector2(0, -1));
				}
				for (let j in this.nodes) {
					if (i == j) {
						continue;
					}
					let otherNode = this.nodes[j];
					let otherPosition = otherNode.getPhysicsPosition();
					let diffForce = new Vector2(position.x - otherPosition.x, position.y - otherPosition.y);
					if (diffForce.length() < 1) {
						force = force.add(i < j ? new Vector2(-1, 0) : new Vector2(1, 0));
					} else if (diffForce.length() < (this.nodeSize * NODE_FORCE_FIELD_SIZE)) {
						force = force.add(diffForce.normalize());
					}
				}
				force = force.normalize().multiplyScalar(this.nodeSize).multiplyScalar(delta);
				node.force = node.force.add(force);
				if (node.force.length() > 0.1) {
					anyForce = true;
				} else {
					node.force = new Vector2(0, 0);
				}
			}
			return anyForce;
		}
	}

	function resized() {
		graph.value!.resize();
	}

	function draw(delta: number, animate: boolean) {
		if (animate) {
			graph.value?.reposition(delta);
		} else {
			for (var i = 0; i < 20; i++) {
				graph.value?.reposition(0.5);
			}
		}
	}

	onMounted(() => {
		graph.value = new DomGraph();
		window.addEventListener("resize", resized);
		drawLoop.start(false);
	});

	onUnmounted(() => {
		window.removeEventListener("resize", resized);
	});

	watch(props.nodes, () => {
		graph.value!.recreateNodesAndLines();
		drawLoop.forceDraw();
	});

	function dragNode(node: DOMGraphNode, e: NodeEvent): void {
		node.setPosition({ x: e.x, y: e.y });
	}

	function onDragOver(event: MouseEvent) {
		event.preventDefault();
	}

	function onHover(node: DOMGraphNode, e: NodeEvent): void {
		graph.value!.highlightNode = e.target != undefined ? node : undefined;
	}

	function animationStart() {
		drawLoop.start(true);
	}

	function animationEnd() {
		drawLoop.stop();
	}

	function zoom(change: number) {
		let current = graphElement.value!.style.fontSize;
		let m = /([0-9\.]+)em/.exec(current);
		let val = parseFloat(m![1]) + change;
		graphElement.value!.style.fontSize = `${val}em`;
		resized();
	}

</script>

<template>
	<div id="zoom">
		<input type="button" value="+" @click="zoom(0.1)" />
		<input type="button" value="-" @click="zoom(-0.1)" />
	</div>
	<div ref="graphElement" id="graph" @dragover="onDragOver" @animationstart="animationStart" @:animationcancel="animationEnd" style="font-size: 1em">
		<Chain :id="line.id" :width="graph!.width" :height="graph!.height" :fromX="line.fromX()" :fromY="line.fromY()" :toX="line.toX()" :toY="line.toY()" :class="line.classes(graph?.highlightNode)" v-for="line in graph?.lines" />
		<Node :id="node.id()" :position="node.drawPosition" :title="node.title()" :thumbnail="node.thumbnail()" :linkCount="node.linkCount()" :style="node.class()" @hover="(e) => onHover(node, e)" @drop="(e) => dragNode(node, e)"
			:showLink="showLinks" v-for="node in graph?.nodes" />
	</div>
</template>

<style>
	#zoom {
		position: fixed;
		top: 1em;
		right: 1em;
		z-index: 10;
		display: flex;
		flex-direction: column;

		input[type="button"] {
			margin: 0.25em;
			font-size: 1em;
		}
	}

	#graph {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 10em;
	}
</style>