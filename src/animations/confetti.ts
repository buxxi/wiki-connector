import { Vector2 } from "three";

const CONFETTI_COLORS = ['red', 'white', 'blue', 'orange', 'green'];
const CONFETTI_COUNT = 3000;

class Confetti {
	position: Vector2;
	rotation: number;
	rotationDirection: number;
	rotationSpeed: number;
	force: Vector2;
	color: string;
	length: number;
	thickness: number;
	destroyWhenBelowHeight: number;

	constructor(position: Vector2, direction: Vector2, destroyWhenBelowHeight: number) {
		this.position = position;
		this.rotation = 0;
		this.rotationDirection = Math.random() > 0.5 ? 1 : -1;
		this.rotationSpeed = (Math.random() * 360) + 360;
		let speed = (Math.random() * 100) + 50;
		this.force = direction.multiplyScalar(speed);
		this.color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
		this.length = 5 + (Math.random() * 15);
		this.thickness = 4 + (Math.random() * 4);
		this.destroyWhenBelowHeight = destroyWhenBelowHeight;
	}

	draw(context: CanvasRenderingContext2D) {
		context.save();
		context.fillStyle = this.color;
		context.translate(this.position.x, this.position.y);
		context.rotate(this.rotation * (Math.PI / 180));
		context.fillRect(-this.length, -this.thickness, this.length, this.thickness);
		context.translate(-this.position.x, -this.position.y);
		context.restore();
	}

	move(delta: number): boolean {
		this.rotation = this.rotation + (delta * this.rotationSpeed * this.rotationDirection);
		let deltaForce = this.force.clone().multiplyScalar(delta);
		this.position = this.position.clone().add(deltaForce);
		this.force = this.force.clone().sub(deltaForce.divideScalar(5)).add(new Vector2(0, 10));
		return this.position.y < this.destroyWhenBelowHeight;
	}
}

class ConfettiCannon {
	confetti: Confetti[] = [];

	init(width: number, height: number): void {
		this.confetti = new Array(CONFETTI_COUNT / 2).fill(0).map(i => {
			return new Confetti(
				new Vector2(0, height * 1.1),
				new Vector2(Math.random() * 10, -5 - (Math.random() * 5)),
				height + 100
			);
		}).concat(new Array(CONFETTI_COUNT / 2).fill(0).map(i => {
			return new Confetti(
				new Vector2(width, height * 1.1),
				new Vector2(Math.random() * -10, -5 - (Math.random() * 5)),
				height + 100
			);
		}));
	}

	draw(context: CanvasRenderingContext2D): void {
		for (let conf of this.confetti) {
			conf.draw(context);
		}
	}

	move(delta: number): boolean {
		var i = this.confetti.length;
		while (i--) {
			if (!this.confetti[i].move(delta)) {
				this.confetti.splice(i, 1);
			}
		}
		return this.confetti.length > 0;
	}
}

export default ConfettiCannon;