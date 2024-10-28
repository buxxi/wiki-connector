import { BLOOD_MAXIMUM_SPEED, BLOOD_MINIMUM_SPEED, BLOOD_POINT_SPACING, BLOOD_RANDOM_Y_OFFSET, BLOOD_SPEED_CHANGE } from "@/config";
import type { Animation } from "./animation";

class BloodPoint {
	x: number;
	y: number;
	speed: number;
	targetSpeed: number;

	constructor(x: number, y: number, speed: number) {
		this.x = x;
		this.y = y;
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
		context.beginPath();
		context.moveTo(0, 0);

		for (let point of this.points) {
			//TODO: this could be smoother
			context.bezierCurveTo(point.x - (BLOOD_POINT_SPACING / 2), point.y - (BLOOD_POINT_SPACING / 2), point.x - (BLOOD_POINT_SPACING / 2), point.y + (BLOOD_POINT_SPACING / 2), point.x, point.y);
		}

		context.lineTo(this.width, 0);
		context.lineTo(0, 0);
		context.fillStyle = 'rgba(200, 0, 0, 0.75)';
		context.fill();
	}

	move(delta: number): boolean {
		for (let point of this.points) {
			if (point.y > this.height) {
				continue;
			}
			point.y += delta * point.speed;
			if (point.speed < point.targetSpeed) {
				point.speed += delta * BLOOD_SPEED_CHANGE;
			} else {
				point.speed -= delta * BLOOD_SPEED_CHANGE;
			}
			if (point.speed - point.targetSpeed < BLOOD_SPEED_CHANGE) {
				point.targetSpeed = this._generateSpeed();
			}
		}
		return true;
	}

	_generatePoints(): BloodPoint[] {
		let count = Math.ceil(this.width / BLOOD_POINT_SPACING) + 1;
		return Array.from({ length: count }).map((_, i) => new BloodPoint(i * BLOOD_POINT_SPACING, - Math.random() * BLOOD_RANDOM_Y_OFFSET, this._generateSpeed()));
	}

	_generateSpeed(): number {
		return BLOOD_MINIMUM_SPEED + (Math.random() * (BLOOD_MAXIMUM_SPEED - BLOOD_MINIMUM_SPEED));
	}
}

export default BloodFlow;