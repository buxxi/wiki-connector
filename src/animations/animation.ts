export type Animation = {
	init(width: number, height: number): void;

	draw(context: CanvasRenderingContext2D): void;

	update(delta: number): boolean;

	resize(width: number, height: number): void;
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

	update(delta: number): boolean {
		var i = this.layers.length;
		while (i--) {
			if (!this.layers[i].update(delta)) {
				this.layers.splice(i, 1);
			}
		}
		return this.layers.length > 0;
	}

	resize(width: number, height: number): void {
		this.layers.forEach(layer => layer.resize(width, height));
	}
}