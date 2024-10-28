<script setup lang="ts">
	import BalloonsRising from "@/animations/balloons";
	import BloodFlow from "@/animations/blood";
	import ConfettiCannon from "@/animations/confetti";
	import JigsawPattern from "@/animations/jigsaw";
	import { MAX_FPS } from "@/config";
	import DrawLoop from "@/util/drawloop";
	import { onMounted, ref, useTemplateRef, watch } from "vue";

	const props = defineProps<{
		won: boolean,
		lost: boolean
	}>();

	type Animation = {
		init(width: number, height: number): void;

		draw(context: CanvasRenderingContext2D): void;

		move(delta: number): boolean;
	}

	class LayeredAnimation {
		layers: Animation[];

		constructor(layers: Animation[]) {
			this.layers = layers;
		}

		init(width: number, height: number): void {
			this.layers.forEach(layer => layer.init(width, height));
		}

		draw(context: CanvasRenderingContext2D): void {
			this.layers.forEach(layer => layer.draw(context));
		}

		move(delta: number): boolean {
			var i = this.layers.length;
			while (i--) {
				if (!this.layers[i].move(delta)) {
					this.layers.splice(i, 1);
				}
			}
			return this.layers.length > 0;
		}
	}

	class AnimationLoop {
		layers: Animation;
		drawLoop: DrawLoop;
		context: (CanvasRenderingContext2D | undefined) = undefined;

		constructor() {
			this.layers = new LayeredAnimation([]);
			this.drawLoop = new DrawLoop((delta, animate) => this.draw(delta, animate), MAX_FPS);
		}

		init(width: number, height: number, context: CanvasRenderingContext2D): void {
			let layerArray: Animation[] = [new JigsawPattern()];
			if (props.won) {
				layerArray.push(new BalloonsRising());
				layerArray.push(new ConfettiCannon());
			} else if (props.lost) {
				layerArray.push(new BloodFlow());
			}
			this.context = context;
			this.layers = new LayeredAnimation(layerArray);
			this.layers.init(width, height);
		}

		draw(delta: number, animate: boolean): void {
			if (this.context == undefined) {
				return;
			}
			this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
			this.layers.move(delta);
			this.layers.draw(this.context);
		}

		start(animate: boolean): void {
			this.drawLoop.start(animate);
		}

		stop(): void {
			this.drawLoop.stop();
		}

		forceDraw(): void {
			this.drawLoop.forceDraw();
		}
	}

	const drawLoop = ref<AnimationLoop>(new AnimationLoop());
	const background = useTemplateRef("background");

	function recreate() {
		let bg = background.value;
		if (bg == undefined) {
			return;
		}
		bg.width = window.innerWidth;
		bg.height = window.innerHeight;
		let context = bg.getContext("2d")!;
		drawLoop.value.init(bg.width, bg.height, context);

	}

	function animationStart() {
		drawLoop.value.start(true);
	}

	function animationEnd() {
		drawLoop.value.stop();
	}

	onMounted(() => {
		recreate();
		drawLoop.value.start(false);
		window.addEventListener("resize", recreate);
	});

	watch(props, () => {
		recreate();
		drawLoop.value.forceDraw();
	});


</script>

<template>
	<canvas id="background" ref="background" @animationstart="animationStart" @:animationcancel="animationEnd"></canvas>
</template>

<style>
	#background {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		animation: 0.5s ease normal nothing infinite;
	}
</style>
