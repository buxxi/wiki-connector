<script setup lang="ts">
	import BalloonsRising from "@/animations/balloons";
	import ConfettiCannon from "@/animations/confetti";
	import JigsawPattern from "@/animations/jigsaw";
	import { onMounted, watch } from "vue";

	const MAX_FPS = 30;

	const props = defineProps<{
		animate: boolean,
		won: boolean
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

	var layers = new LayeredAnimation([]);

	var context: CanvasRenderingContext2D;
	var lastDraw: number = new Date().getTime() - 1000;

	function recreate() {
		let bg = document.querySelector("#background")! as HTMLCanvasElement;
		bg.width = window.innerWidth;
		bg.height = window.innerHeight;
		context = bg.getContext("2d")!;

		let layerArray: Animation[] = [new JigsawPattern()];
		if (props.won) {
			layerArray.push(new BalloonsRising());
			layerArray.push(new ConfettiCannon());
		}
		layers = new LayeredAnimation(layerArray);
		layers.init(bg.width, bg.height);

		draw();
	}

	function draw() {
		let delta = (new Date().getTime() - lastDraw) / 1000;
		if (delta > 1 / MAX_FPS) {
			layers.move(delta);
			layers.draw(context);
			lastDraw = new Date().getTime();
		}
		if (props.animate) {
			window.requestAnimationFrame(draw);
		}
	}

	onMounted(() => {
		recreate();
		window.addEventListener("resize", recreate);
	});

	watch(props, () => {
		recreate();
	});


</script>

<template>
	<canvas id="background"></canvas>
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
	}
</style>
