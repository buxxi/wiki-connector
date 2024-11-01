export type DrawFunction = (delta: number, animated: boolean) => void;

class DrawLoop {
	animate: boolean = false;
	drawFunc: DrawFunction;
	maxFps: number;
	lastDraw: number;

	constructor(drawFunc: DrawFunction, maxFps: number) {
		this.drawFunc = drawFunc;
		this.maxFps = maxFps;
		this.lastDraw = new Date().getTime();
	}

	start(animate: boolean) {
		this.animate = animate;
		this._draw();
	}

	stop() {
		this.animate = false;
	}

	forceDraw() {
		this.drawFunc(0, this.animate);
	}

	_draw() {
		let delta = (new Date().getTime() - this.lastDraw) / 1000;
		if (delta > 1 / this.maxFps || !this.animate) {
			this.drawFunc(delta, this.animate);
			this.lastDraw = new Date().getTime();
		}
		if (this.animate) {
			window.requestAnimationFrame(() => this._draw());
		}
	}
}

export default DrawLoop;