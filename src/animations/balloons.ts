import { BALLOON_COUNT, BALLOON_MAX_SIZE, BALLOON_MAX_SPEED, BALLOON_MIN_SIZE, BALLOON_MIN_SPEED } from "@/config";
import type { Animation } from "./animation";
import { Vector2 } from "three";

class Balloon {
	size: number;
	position: Vector2;
	speed: number;
	hue: number;
	path: Path2D;

	constructor(x: number, y: number, size: number, speed: number, hue: number) {
		this.position = new Vector2(x, y);
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

	draw(context: CanvasRenderingContext2D, screen: Vector2) {
		let drawPosition = this.position.clone().multiply(screen);
		var gr = context.createRadialGradient(0.25 * this.size, -0.25 * this.size, 1.5 * this.size, 0.25 * this.size, -0.25 * this.size, 0.5 * this.size);
		gr.addColorStop(0, `hsl(${this.hue}, 100%, 20%)`);
		gr.addColorStop(1, `hsl(${this.hue}, 100%, 50%)`);
		context.save();
		context.translate(drawPosition.x, drawPosition.y);
		context.fillStyle = gr;
		context.fill(this.path);
		context.restore();
	}

	move(delta: number, height: number): boolean {
		if (this.position.y < -(this.size / height)) {
			return false;
		}
		this.position.y = this.position.y - (this.speed * delta);
		return true;
	}
}

class BalloonsRising implements Animation {
	balloons: Balloon[] = [];
	width: number = 0;
	height: number = 0;

	init(width: number, height: number): void {
		this.balloons = new Array(BALLOON_COUNT).fill(0).map(i => {
			let size = BALLOON_MIN_SIZE + (Math.random() * (BALLOON_MAX_SIZE - BALLOON_MIN_SIZE));
			let x = Math.random();
			let y = 1 + Math.random();

			let speed = BALLOON_MIN_SPEED + (Math.random() * (BALLOON_MAX_SPEED - BALLOON_MIN_SPEED));
			let hue = Math.random() * 360;
			return new Balloon(x, y, size, speed, hue);
		});
		this.width = width;
		this.height = height;
	}

	draw(context: CanvasRenderingContext2D): void {
		let screen = new Vector2(this.width, this.height);
		for (let balloon of this.balloons) {
			balloon.draw(context, screen);
		}
	}

	update(delta: number): boolean {
		var i = this.balloons.length;
		while (i--) {
			if (!this.balloons[i]!.move(delta, this.height)) {
				this.balloons.splice(i, 1);
			}
		}
		return this.balloons.length > 0;
	}

	resize(width: number, height: number): void {
		this.width = width;
		this.height = height;
	}
}

export default BalloonsRising;