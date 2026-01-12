import { CONFETTI_COLORS, CONFETTI_COUNT, CONFETTI_GRAVITY, CONFETTI_MAX_LENGTH, CONFETTI_MAX_ROTATION_SPEED, CONFETTI_MAX_SPEED, CONFETTI_MAX_THICKNESS, CONFETTI_MIN_LENGTH, CONFETTI_MIN_ROTATION_SPEED, CONFETTI_MIN_SPEED, CONFETTI_MIN_THICKNESS } from "@/config";
import { Vector2 } from "three";
import type { Animation } from "./animation";

class Confetti {
	position: Vector2;
	rotation: number;
	rotationDirection: number;
	rotationSpeed: number;
	force: Vector2;
	color: string;
	length: number;
	thickness: number;

	constructor(position: Vector2, direction: Vector2) {
		this.position = position;
		this.rotation = 0;
		this.rotationDirection = Math.random() > 0.5 ? 1 : -1;
		this.rotationSpeed = CONFETTI_MIN_ROTATION_SPEED + (Math.random() * (CONFETTI_MAX_ROTATION_SPEED - CONFETTI_MIN_ROTATION_SPEED));
		let speed = CONFETTI_MIN_SPEED + (Math.random() * (CONFETTI_MAX_SPEED - CONFETTI_MIN_SPEED));
		this.force = direction.multiplyScalar(speed);
		this.color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]!;
		this.length = CONFETTI_MIN_LENGTH + (Math.random() * (CONFETTI_MAX_LENGTH - CONFETTI_MIN_LENGTH));
		this.thickness = CONFETTI_MAX_THICKNESS + (Math.random() * (CONFETTI_MAX_THICKNESS - CONFETTI_MIN_THICKNESS));
	}

	draw(context: CanvasRenderingContext2D, screen: Vector2) {
		let drawPosition = this.position.clone().multiply(screen);
		context.save();
		context.fillStyle = this.color;
		context.translate(drawPosition.x, drawPosition.y);
		context.rotate(this.rotation * (Math.PI / 180));
		context.fillRect(-this.length, -this.thickness, this.length, this.thickness);
		context.translate(-drawPosition.x, -drawPosition.y);
		context.restore();
	}

	move(delta: number): boolean {
		this.rotation = this.rotation + (delta * this.rotationSpeed * this.rotationDirection);
		let deltaForce = this.force.clone().multiplyScalar(delta);
		this.position = this.position.clone().add(deltaForce);
		this.force = this.force.clone().sub(deltaForce.divideScalar(5)).add(new Vector2(0, CONFETTI_GRAVITY));
		return this.position.y < 1.2;
	}
}

class ConfettiCannon implements Animation {
	confetti: Confetti[] = [];
	width: number = 0;
	height: number = 0;

	init(width: number, height: number): void {
		this.confetti = new Array(CONFETTI_COUNT / 2).fill(0).map(i => {
			return new Confetti(
				new Vector2(0, 1.1),
				new Vector2(Math.random() * 10, -5 - (Math.random() * 5)).normalize()
			);
		}).concat(new Array(CONFETTI_COUNT / 2).fill(0).map(i => {
			return new Confetti(
				new Vector2(1, 1.1),
				new Vector2(Math.random() * -10, -5 - (Math.random() * 5)).normalize(),
			);
		}));
		this.width = width;
		this.height = height;
	}

	draw(context: CanvasRenderingContext2D): void {
		let screen = new Vector2(this.width, this.height);
		for (let conf of this.confetti) {
			conf.draw(context, screen);
		}
	}

	update(delta: number): boolean {
		var i = this.confetti.length;
		while (i--) {
			if (!this.confetti[i]!.move(delta)) {
				this.confetti.splice(i, 1);
			}
		}
		return this.confetti.length > 0;
	}

	resize(width: number, height: number): void {
		this.width = width;
		this.height = height;
	}
}

export default ConfettiCannon;