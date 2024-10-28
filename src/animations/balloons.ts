import { BALLOON_COUNT, BALLOON_MAX_SIZE, BALLOON_MIN_SIZE, BALLOON_MIN_SPEED } from "@/config";
import type { Animation } from "./animation";

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

	move(delta: number): boolean {
		if (this.y < -this.size) {
			return false;
		}
		this.y = this.y - (this.speed * delta);
		return true;
	}
}

class BalloonsRising implements Animation {
	balloons: Balloon[] = [];

	init(width: number, height: number): void {
		this.balloons = new Array(BALLOON_COUNT).fill(0).map(i => {
			let size = BALLOON_MIN_SIZE + (Math.random() * (BALLOON_MAX_SIZE - BALLOON_MIN_SIZE));
			let x = Math.random() * width;
			let y = height + (Math.random() * (height));

			let speed = BALLOON_MIN_SPEED + (Math.random() * size) + size;
			let hue = Math.random() * 360;
			return new Balloon(x, y, size, speed, hue);
		});
	}

	draw(context: CanvasRenderingContext2D): void {
		for (let balloon of this.balloons) {
			balloon.draw(context);
		}
	}

	move(delta: number): boolean {
		var i = this.balloons.length;
		while (i--) {
			if (!this.balloons[i].move(delta)) {
				this.balloons.splice(i, 1);
			}
		}
		return this.balloons.length > 0;
	}
}

export default BalloonsRising;