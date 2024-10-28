export type Animation = {
	init(width: number, height: number): void;

	draw(context: CanvasRenderingContext2D): void;

	move(delta: number): boolean;
}

export class LayeredAnimation implements Animation {
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