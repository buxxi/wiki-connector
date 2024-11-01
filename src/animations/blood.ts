import { BLOOD_MAXIMUM_SPEED, BLOOD_MINIMUM_SPEED, BLOOD_POINT_SPACING, BLOOD_RANDOM_Y_OFFSET } from "@/config";
import type { Animation } from "./animation";
import { Vector2 } from "three";

class BloodPoint {
	position: Vector2;
	speed: number;
	targetSpeed: number;

	constructor(x: number, y: number, speed: number) {
		this.position = new Vector2(x, y);
		this.speed = speed;
		this.targetSpeed = speed;
	}
}

class BloodFlow implements Animation {
	width: number = 0;
	height: number = 0;
	points: BloodPoint[] = [];

	init(width: number, height: number): void {
		this.width = width;
		this.height = height;
		this.points = this._generatePoints();
	}

	draw(context: CanvasRenderingContext2D): void {
		let screen = new Vector2(this.width, this.height);
		let halfSpacing = BLOOD_POINT_SPACING * this.width / 2;
		context.beginPath();
		context.moveTo(0, 0);

		for (let point of this.points) {
			let drawPosition = point.position.clone().multiply(screen);
			//TODO: this could be smoother
			context.bezierCurveTo(
				drawPosition.x - halfSpacing,
				drawPosition.y - halfSpacing,
				drawPosition.x - halfSpacing,
				drawPosition.y + halfSpacing,
				drawPosition.x, drawPosition.y
			);
		}

		context.lineTo(this.width + BLOOD_POINT_SPACING, 0);
		context.lineTo(0, 0);
		context.fillStyle = 'rgba(200, 0, 0, 0.75)';
		context.fill();
	}

	update(delta: number): boolean {
		for (let point of this.points) {
			if (point.position.y > 1.1) {
				continue;
			}
			point.position.y += delta * point.speed;
		}
		return true;
	}

	resize(width: number, height: number): void {
		this.width = width;
		this.height = height;
	}

	_generatePoints(): BloodPoint[] {
		let count = Math.ceil(this.width * BLOOD_POINT_SPACING) + 1;
		return Array.from({ length: count }).map((_, i) => this._generatePoint(i));
	}

	private _generatePoint(i: number): BloodPoint {
		return new BloodPoint(i * BLOOD_POINT_SPACING, -Math.random() * BLOOD_RANDOM_Y_OFFSET, this._generateSpeed());
	}

	_generateSpeed(): number {
		return BLOOD_MINIMUM_SPEED + (Math.random() * (BLOOD_MAXIMUM_SPEED - BLOOD_MINIMUM_SPEED));
	}
}

export default BloodFlow;