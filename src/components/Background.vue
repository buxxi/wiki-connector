<script setup lang="ts">
	import { onMounted } from "vue";

	class JigsawPiece {
		x: number;
		y: number;
		size: number;
		holeSize: number;
		up: boolean;
		right: boolean;
		bottom: boolean;
		left: boolean;
		hue: number;

		constructor(x: number, y: number, size: number, holeSize: number, up: boolean, right: boolean, bottom: boolean, left: boolean, hue: number) {
			this.x = x;
			this.y = y;
			this.size = size;
			this.holeSize = holeSize;
			this.up = up;
			this.right = right;
			this.bottom = bottom;
			this.left = left;
			this.hue = hue;
		}

		draw(context: CanvasRenderingContext2D, lightness: number) {
			context.beginPath();
			context.moveTo(this.x, this.y);
			this._drawUpper(context, this.x, this.y, this.up ? 1 : -1);
			this._drawRight(context, this.x + this.size, this.y, this.right ? 1 : -1);
			this._drawBottom(context, this.x + this.size, this.y + this.size, this.bottom ? 1 : -1);
			this._drawLeft(context, this.x, this.y + this.size, this.left ? 1 : -1);

			context.fillStyle = `hsl(${this.hue}, 10%, ${20 + lightness * 10}%)`;
			context.fill();
			context.strokeStyle = `hsl(${this.hue}, 0%, 10%)`;
			context.stroke();
		}

		_drawUpper(context: CanvasRenderingContext2D, fromX: number, fromY: number, modY: number) {
			let centerX = fromX + (this.size / 2);
			let halfHoleWidth = this.holeSize / 2;
			context.lineTo(centerX - halfHoleWidth, fromY);
			context.lineTo(centerX - halfHoleWidth, fromY - (0.3 * this.holeSize * modY));
			context.bezierCurveTo(centerX - this.holeSize, fromY - (0.8 * this.holeSize * modY), centerX - this.holeSize, fromY - (1.3 * this.holeSize * modY), centerX, fromY - (1.3 * this.holeSize * modY));
			context.bezierCurveTo(centerX + this.holeSize, fromY - (1.3 * this.holeSize * modY), centerX + this.holeSize, fromY - (0.8 * this.holeSize * modY), centerX + halfHoleWidth, fromY - (0.3 * this.holeSize * modY));
			context.lineTo(centerX + halfHoleWidth, fromY);
			context.lineTo(fromX + this.size, fromY);
		}

		_drawBottom(context: CanvasRenderingContext2D, fromX: number, fromY: number, modY: number) {
			let centerX = fromX - (this.size / 2);
			let halfHoleWidth = this.holeSize / 2;
			context.lineTo(centerX + halfHoleWidth, fromY);
			context.lineTo(centerX + halfHoleWidth, fromY + (0.3 * this.holeSize * modY));
			context.bezierCurveTo(centerX + this.holeSize, fromY + (0.8 * this.holeSize * modY), centerX + this.holeSize, fromY + (1.3 * this.holeSize * modY), centerX, fromY + (1.3 * this.holeSize * modY));
			context.bezierCurveTo(centerX - this.holeSize, fromY + (1.3 * this.holeSize * modY), centerX - this.holeSize, fromY + (0.8 * this.holeSize * modY), centerX - halfHoleWidth, fromY + (0.3 * this.holeSize * modY));
			context.lineTo(centerX - halfHoleWidth, fromY);
			context.lineTo(fromX - this.size, fromY);
		}

		_drawRight(context: CanvasRenderingContext2D, fromX: number, fromY: number, modX: number) {
			let centerY = fromY + (this.size / 2);
			let halfHoleWidth = this.holeSize / 2;
			context.lineTo(fromX, centerY - halfHoleWidth);
			context.lineTo(fromX + (0.3 * this.holeSize * modX), centerY - halfHoleWidth);
			context.bezierCurveTo(fromX + (0.8 * this.holeSize * modX), centerY - this.holeSize, fromX + (1.3 * this.holeSize * modX), centerY - this.holeSize, fromX + (1.3 * this.holeSize * modX), centerY);
			context.bezierCurveTo(fromX + (1.3 * this.holeSize * modX), centerY + this.holeSize, fromX + (0.8 * this.holeSize * modX), centerY + this.holeSize, fromX + (0.3 * this.holeSize * modX), centerY + halfHoleWidth);
			context.lineTo(fromX, centerY + halfHoleWidth);
			context.lineTo(fromX, fromY + this.size);
		}

		_drawLeft(context: CanvasRenderingContext2D, fromX: number, fromY: number, modX: number) {
			let centerY = fromY - (this.size / 2);
			let halfHoleWidth = this.holeSize / 2;
			context.lineTo(fromX, centerY + halfHoleWidth);
			context.lineTo(fromX - (0.3 * this.holeSize * modX), centerY + halfHoleWidth);
			context.bezierCurveTo(fromX - (0.8 * this.holeSize * modX), centerY + this.holeSize, fromX - (1.3 * this.holeSize * modX), centerY + this.holeSize, fromX - (1.3 * this.holeSize * modX), centerY);
			context.bezierCurveTo(fromX - (1.3 * this.holeSize * modX), centerY - this.holeSize, fromX - (0.8 * this.holeSize * modX), centerY - this.holeSize, fromX - (0.3 * this.holeSize * modX), centerY - halfHoleWidth);
			context.lineTo(fromX, centerY - halfHoleWidth);
			context.lineTo(fromX, fromY - this.size);
		}
	}



	function generatePieces(width: number, height: number): JigsawPiece[][] {
		let size = 50;
		let holeSize = 10;
		let rows = Math.ceil(height / size);
		let cols = Math.ceil(width / size);
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
				currentRow.push(new JigsawPiece(x * size, y * size, size, holeSize, up, right, bottom, left, hue));
			}
			currentRow = [];
		}

		return result;
	}


	var pieces: JigsawPiece[][] = [];
	var context: CanvasRenderingContext2D;

	function recreate() {
		let bg = document.querySelector("#background")! as HTMLCanvasElement;
		bg.width = window.innerWidth;
		bg.height = window.innerHeight;
		context = bg.getContext("2d")!;

		pieces = generatePieces(bg.width, bg.height);

		draw();
	}

	function draw() {
		for (var y = 0; y < pieces.length; y++) {
			for (var x = 0; x < pieces[y].length; x++) {
				pieces[y][x].draw(context, 0);
			}
		}
		//window.requestAnimationFrame(draw);
	}

	onMounted(() => {
		recreate();
		window.addEventListener("resize", recreate);
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
