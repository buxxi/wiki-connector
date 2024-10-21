<script setup lang="ts">
	import { onMounted, watch } from "vue";

	const MAX_FPS = 30;
	const JIGSAW_PIECE_SIZE = 50;
	const JIGSAW_HOLE_SIZE = 10;
	const BALLOON_COUNT = 100;
	const BALLOON_MIN_SIZE = 25;
	const BALLOON_MAX_SIZE = 75;
	const BALLOON_MIN_SPEED = 100;

	const props = defineProps<{
		animate: boolean,
		won: boolean
	}>();

	class Balloon {
		size: number;
		x: number;
		y: number;
		speed: number;
		hue: number;
		path: Path2D;

		constructor(x: number, y: number, size: number, speed: number, hue: number) {
			this.x = x;
			this.y = y;
			this.size = size;
			this.speed = speed;
			this.hue = hue;
			this.path = this._generatePath();
		}

		_generatePath(): Path2D {
			let path = new Path2D();
			path.moveTo(0, -1.25 * this.size);
			path.bezierCurveTo(1.5 * this.size, -1.25 * this.size, 1.5 * this.size, 0.75 * this.size, 0, 1.25 * this.size);
			path.lineTo(0.1 * this.size, (1.4 * this.size));
			path.lineTo(-0.1 * this.size, (1.4 * this.size));
			path.lineTo(0, 1.25 * this.size);
			path.bezierCurveTo(-1.5 * this.size, 0.75 * this.size, -1.5 * this.size, -1.25 * this.size, 0, -1.25 * this.size);
			return path;
		}

		draw(context: CanvasRenderingContext2D) {
			if (this.y < -this.size) {
				return;
			}
			var gr = context.createRadialGradient(0.25 * this.size, -0.25 * this.size, 1.5 * this.size, 0.25 * this.size, -0.25 * this.size, 0.5 * this.size);
			gr.addColorStop(0, `hsl(${this.hue}, 100%, 20%)`);
			gr.addColorStop(1, `hsl(${this.hue}, 100%, 50%)`);
			context.save();
			context.translate(this.x, this.y);
			context.fillStyle = gr;
			context.fill(this.path);
			context.restore();
		}

		move(delta: number) {
			if (this.y < -this.size) {
				return;
			}
			this.y = this.y - (this.speed * delta);
		}
	}


	class JigsawPiece {
		x: number;
		y: number;
		up: boolean;
		right: boolean;
		bottom: boolean;
		left: boolean;
		hue: number;
		path: Path2D;

		constructor(x: number, y: number, up: boolean, right: boolean, bottom: boolean, left: boolean, hue: number) {
			this.x = x;
			this.y = y;
			this.up = up;
			this.right = right;
			this.bottom = bottom;
			this.left = left;
			this.hue = hue;
			this.path = this._generatePath();
		}

		draw(context: CanvasRenderingContext2D, lightness: number) {
			context.fillStyle = `hsl(${this.hue}, 10%, ${15 + (lightness * 10)}%)`;
			context.fill(this.path);
			context.strokeStyle = `hsl(${this.hue}, 0%, 10%)`;
			context.stroke(this.path);
		}

		_generatePath(): Path2D {
			let path = new Path2D();
			path.moveTo(this.x, this.y);
			this._drawUpper(path, this.x, this.y, this.up ? 1 : -1);
			this._drawRight(path, this.x + JIGSAW_PIECE_SIZE, this.y, this.right ? 1 : -1);
			this._drawBottom(path, this.x + JIGSAW_PIECE_SIZE, this.y + JIGSAW_PIECE_SIZE, this.bottom ? 1 : -1);
			this._drawLeft(path, this.x, this.y + JIGSAW_PIECE_SIZE, this.left ? 1 : -1);
			return path;
		}

		_drawUpper(context: CanvasPath, fromX: number, fromY: number, modY: number) {
			let centerX = fromX + (JIGSAW_PIECE_SIZE / 2);
			const { halfHoleWidth, beforeHoleIndent, cp1Indent, cp2Indent } = this._sizes(modY);

			context.lineTo(centerX - halfHoleWidth, fromY);
			context.lineTo(centerX - halfHoleWidth, fromY - beforeHoleIndent);
			context.bezierCurveTo(centerX - JIGSAW_HOLE_SIZE, fromY - cp1Indent, centerX - JIGSAW_HOLE_SIZE, fromY - cp2Indent, centerX, fromY - cp2Indent);
			context.bezierCurveTo(centerX + JIGSAW_HOLE_SIZE, fromY - cp2Indent, centerX + JIGSAW_HOLE_SIZE, fromY - cp1Indent, centerX + halfHoleWidth, fromY - beforeHoleIndent);
			context.lineTo(centerX + halfHoleWidth, fromY);
			context.lineTo(fromX + JIGSAW_PIECE_SIZE, fromY);
		}

		_drawBottom(context: CanvasPath, fromX: number, fromY: number, modY: number) {
			let centerX = fromX - (JIGSAW_PIECE_SIZE / 2);
			const { halfHoleWidth, beforeHoleIndent, cp1Indent, cp2Indent } = this._sizes(modY);

			context.lineTo(centerX + halfHoleWidth, fromY);
			context.lineTo(centerX + halfHoleWidth, fromY + beforeHoleIndent);
			context.bezierCurveTo(centerX + JIGSAW_HOLE_SIZE, fromY + cp1Indent, centerX + JIGSAW_HOLE_SIZE, fromY + cp2Indent, centerX, fromY + cp2Indent);
			context.bezierCurveTo(centerX - JIGSAW_HOLE_SIZE, fromY + cp2Indent, centerX - JIGSAW_HOLE_SIZE, fromY + cp1Indent, centerX - halfHoleWidth, fromY + beforeHoleIndent);
			context.lineTo(centerX - halfHoleWidth, fromY);
			context.lineTo(fromX - JIGSAW_PIECE_SIZE, fromY);
		}

		_drawRight(context: CanvasPath, fromX: number, fromY: number, modX: number) {
			let centerY = fromY + (JIGSAW_PIECE_SIZE / 2);
			const { halfHoleWidth, beforeHoleIndent, cp1Indent, cp2Indent } = this._sizes(modX);

			context.lineTo(fromX, centerY - halfHoleWidth);
			context.lineTo(fromX + beforeHoleIndent, centerY - halfHoleWidth);
			context.bezierCurveTo(fromX + cp1Indent, centerY - JIGSAW_HOLE_SIZE, fromX + cp2Indent, centerY - JIGSAW_HOLE_SIZE, fromX + cp2Indent, centerY);
			context.bezierCurveTo(fromX + cp2Indent, centerY + JIGSAW_HOLE_SIZE, fromX + cp1Indent, centerY + JIGSAW_HOLE_SIZE, fromX + beforeHoleIndent, centerY + halfHoleWidth);
			context.lineTo(fromX, centerY + halfHoleWidth);
			context.lineTo(fromX, fromY + JIGSAW_PIECE_SIZE);
		}

		_drawLeft(context: CanvasPath, fromX: number, fromY: number, modX: number) {
			let centerY = fromY - (JIGSAW_PIECE_SIZE / 2);
			const { halfHoleWidth, beforeHoleIndent, cp1Indent, cp2Indent } = this._sizes(modX);
			context.lineTo(fromX, centerY + halfHoleWidth);
			context.lineTo(fromX - beforeHoleIndent, centerY + halfHoleWidth);
			context.bezierCurveTo(fromX - cp1Indent, centerY + JIGSAW_HOLE_SIZE, fromX - cp2Indent, centerY + JIGSAW_HOLE_SIZE, fromX - cp2Indent, centerY);
			context.bezierCurveTo(fromX - cp2Indent, centerY - JIGSAW_HOLE_SIZE, fromX - cp1Indent, centerY - JIGSAW_HOLE_SIZE, fromX - beforeHoleIndent, centerY - halfHoleWidth);
			context.lineTo(fromX, centerY - halfHoleWidth);
			context.lineTo(fromX, fromY - JIGSAW_PIECE_SIZE);
		}

		_sizes(mod: number) {
			return {
				halfHoleWidth: JIGSAW_HOLE_SIZE / 2,
				beforeHoleIndent: (0.3 * JIGSAW_HOLE_SIZE * mod),
				cp1Indent: (0.8 * JIGSAW_HOLE_SIZE * mod),
				cp2Indent: (1.3 * JIGSAW_HOLE_SIZE * mod)
			}
		}
	}

	function generateBalloons(width: number, height: number): Balloon[] {
		return new Array(BALLOON_COUNT).fill(0).map(i => {
			let size = BALLOON_MIN_SIZE + (Math.random() * (BALLOON_MAX_SIZE - BALLOON_MIN_SIZE));
			let x = Math.random() * width;
			let y = height + (Math.random() * (height));

			let speed = BALLOON_MIN_SPEED + (Math.random() * size) + size;
			let hue = Math.random() * 360;
			return new Balloon(x, y, size, speed, hue);
		});
	}

	function generatePieces(width: number, height: number): JigsawPiece[][] {
		let rows = Math.ceil(height / JIGSAW_PIECE_SIZE);
		let cols = Math.ceil(width / JIGSAW_PIECE_SIZE);
		let result: JigsawPiece[][] = [];
		var currentRow: JigsawPiece[] = [];
		for (var y = 0; y < rows; y++) {
			result.push(currentRow);
			for (var x = 0; x < cols; x++) {
				let up = y == 0 || !result[y - 1][x].bottom;
				let right = Math.random() < 0.5;
				let bottom = Math.random() < 0.5;
				let left = x == 0 || !result[y][x - 1].right;
				let hue = Math.floor(Math.random() * 360);
				currentRow.push(new JigsawPiece(x * JIGSAW_PIECE_SIZE, y * JIGSAW_PIECE_SIZE, up, right, bottom, left, hue));
			}
			currentRow = [];
		}

		return result;
	}

	function generateShininess(size: any[][]): number[][] {
		return size.map(row => row.map(col => (Math.random() * 2) - 1));
	}


	var pieces: JigsawPiece[][] = [];
	var balloons: Balloon[] = [];
	var shininess: number[][] = [];
	var context: CanvasRenderingContext2D;
	var lastDraw: number = new Date().getTime() - 1000;

	function recreate() {
		let bg = document.querySelector("#background")! as HTMLCanvasElement;
		bg.width = window.innerWidth;
		bg.height = window.innerHeight;
		context = bg.getContext("2d")!;

		pieces = generatePieces(bg.width, bg.height);
		shininess = generateShininess(pieces);
		balloons = generateBalloons(bg.width, bg.height);

		draw();
	}

	function draw() {
		let delta = (new Date().getTime() - lastDraw) / 1000;
		if (delta > 1 / MAX_FPS) {
			drawJigsawPieces(delta);
			if (props.won) {
				drawBalloons(delta);
			}
			lastDraw = new Date().getTime();
		}
		if (props.animate) {
			window.requestAnimationFrame(draw);
		}
	}

	function drawBalloons(delta: number) {
		for (let balloon of balloons) {
			balloon.draw(context);
			balloon.move(delta);
		}
	}

	function drawJigsawPieces(delta: number) {
		for (var y = 0; y < pieces.length; y++) {
			for (var x = 0; x < pieces[y].length; x++) {
				let s = shininess[y][x] + (delta / 3);
				if (s > 1) {
					s = -1;
				}
				pieces[y][x].draw(context, Math.abs(s));
				shininess[y][x] = s;
			}
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
