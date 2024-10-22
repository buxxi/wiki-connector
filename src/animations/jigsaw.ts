const JIGSAW_PIECE_SIZE = 50;
const JIGSAW_HOLE_SIZE = 10;

class JigsawPiece {
	x: number;
	y: number;
	up: boolean;
	right: boolean;
	bottom: boolean;
	left: boolean;
	hue: number;
	path: Path2D;

	constructor(x: number, y: number, up: boolean, right: boolean, bottom: boolean, left: boolean, hue: number) {
		this.x = x;
		this.y = y;
		this.up = up;
		this.right = right;
		this.bottom = bottom;
		this.left = left;
		this.hue = hue;
		this.path = this._generatePath();
	}

	draw(context: CanvasRenderingContext2D, lightness: number) {
		context.fillStyle = `hsl(${this.hue}, 10%, ${15 + (lightness * 10)}%)`;
		context.fill(this.path);
		context.strokeStyle = `hsl(${this.hue}, 0%, 10%)`;
		context.stroke(this.path);
	}

	_generatePath(): Path2D {
		let path = new Path2D();
		path.moveTo(this.x, this.y);
		this._drawUpper(path, this.x, this.y, this.up ? 1 : -1);
		this._drawRight(path, this.x + JIGSAW_PIECE_SIZE, this.y, this.right ? 1 : -1);
		this._drawBottom(path, this.x + JIGSAW_PIECE_SIZE, this.y + JIGSAW_PIECE_SIZE, this.bottom ? 1 : -1);
		this._drawLeft(path, this.x, this.y + JIGSAW_PIECE_SIZE, this.left ? 1 : -1);
		return path;
	}

	_drawUpper(context: CanvasPath, fromX: number, fromY: number, modY: number) {
		let centerX = fromX + (JIGSAW_PIECE_SIZE / 2);
		const { halfHoleWidth, beforeHoleIndent, cp1Indent, cp2Indent } = this._sizes(modY);

		context.lineTo(centerX - halfHoleWidth, fromY);
		context.lineTo(centerX - halfHoleWidth, fromY - beforeHoleIndent);
		context.bezierCurveTo(centerX - JIGSAW_HOLE_SIZE, fromY - cp1Indent, centerX - JIGSAW_HOLE_SIZE, fromY - cp2Indent, centerX, fromY - cp2Indent);
		context.bezierCurveTo(centerX + JIGSAW_HOLE_SIZE, fromY - cp2Indent, centerX + JIGSAW_HOLE_SIZE, fromY - cp1Indent, centerX + halfHoleWidth, fromY - beforeHoleIndent);
		context.lineTo(centerX + halfHoleWidth, fromY);
		context.lineTo(fromX + JIGSAW_PIECE_SIZE, fromY);
	}

	_drawBottom(context: CanvasPath, fromX: number, fromY: number, modY: number) {
		let centerX = fromX - (JIGSAW_PIECE_SIZE / 2);
		const { halfHoleWidth, beforeHoleIndent, cp1Indent, cp2Indent } = this._sizes(modY);

		context.lineTo(centerX + halfHoleWidth, fromY);
		context.lineTo(centerX + halfHoleWidth, fromY + beforeHoleIndent);
		context.bezierCurveTo(centerX + JIGSAW_HOLE_SIZE, fromY + cp1Indent, centerX + JIGSAW_HOLE_SIZE, fromY + cp2Indent, centerX, fromY + cp2Indent);
		context.bezierCurveTo(centerX - JIGSAW_HOLE_SIZE, fromY + cp2Indent, centerX - JIGSAW_HOLE_SIZE, fromY + cp1Indent, centerX - halfHoleWidth, fromY + beforeHoleIndent);
		context.lineTo(centerX - halfHoleWidth, fromY);
		context.lineTo(fromX - JIGSAW_PIECE_SIZE, fromY);
	}

	_drawRight(context: CanvasPath, fromX: number, fromY: number, modX: number) {
		let centerY = fromY + (JIGSAW_PIECE_SIZE / 2);
		const { halfHoleWidth, beforeHoleIndent, cp1Indent, cp2Indent } = this._sizes(modX);

		context.lineTo(fromX, centerY - halfHoleWidth);
		context.lineTo(fromX + beforeHoleIndent, centerY - halfHoleWidth);
		context.bezierCurveTo(fromX + cp1Indent, centerY - JIGSAW_HOLE_SIZE, fromX + cp2Indent, centerY - JIGSAW_HOLE_SIZE, fromX + cp2Indent, centerY);
		context.bezierCurveTo(fromX + cp2Indent, centerY + JIGSAW_HOLE_SIZE, fromX + cp1Indent, centerY + JIGSAW_HOLE_SIZE, fromX + beforeHoleIndent, centerY + halfHoleWidth);
		context.lineTo(fromX, centerY + halfHoleWidth);
		context.lineTo(fromX, fromY + JIGSAW_PIECE_SIZE);
	}

	_drawLeft(context: CanvasPath, fromX: number, fromY: number, modX: number) {
		let centerY = fromY - (JIGSAW_PIECE_SIZE / 2);
		const { halfHoleWidth, beforeHoleIndent, cp1Indent, cp2Indent } = this._sizes(modX);
		context.lineTo(fromX, centerY + halfHoleWidth);
		context.lineTo(fromX - beforeHoleIndent, centerY + halfHoleWidth);
		context.bezierCurveTo(fromX - cp1Indent, centerY + JIGSAW_HOLE_SIZE, fromX - cp2Indent, centerY + JIGSAW_HOLE_SIZE, fromX - cp2Indent, centerY);
		context.bezierCurveTo(fromX - cp2Indent, centerY - JIGSAW_HOLE_SIZE, fromX - cp1Indent, centerY - JIGSAW_HOLE_SIZE, fromX - beforeHoleIndent, centerY - halfHoleWidth);
		context.lineTo(fromX, centerY - halfHoleWidth);
		context.lineTo(fromX, fromY - JIGSAW_PIECE_SIZE);
	}

	_sizes(mod: number) {
		return {
			halfHoleWidth: JIGSAW_HOLE_SIZE / 2,
			beforeHoleIndent: (0.3 * JIGSAW_HOLE_SIZE * mod),
			cp1Indent: (0.8 * JIGSAW_HOLE_SIZE * mod),
			cp2Indent: (1.3 * JIGSAW_HOLE_SIZE * mod)
		}
	}
}

class JigsawPattern {
	pieces: JigsawPiece[][] = [];
	shininess: number[][] = [];

	init(width: number, height: number): void {
		let rows = Math.ceil(height / JIGSAW_PIECE_SIZE);
		let cols = Math.ceil(width / JIGSAW_PIECE_SIZE);
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
				currentRow.push(new JigsawPiece(x * JIGSAW_PIECE_SIZE, y * JIGSAW_PIECE_SIZE, up, right, bottom, left, hue));
			}
			currentRow = [];
		}

		this.pieces = result;
		this.shininess = result.map(row => row.map(col => (Math.random() * 2) - 1));
	}

	draw(context: CanvasRenderingContext2D): void {
		for (var y = 0; y < this.pieces.length; y++) {
			for (var x = 0; x < this.pieces[y].length; x++) {
				this.pieces[y][x].draw(context, Math.abs(this.shininess[y][x]));
			}
		}
	}

	move(delta: number): boolean {
		for (var y = 0; y < this.pieces.length; y++) {
			for (var x = 0; x < this.pieces[y].length; x++) {
				let s = this.shininess[y][x] + (delta / 3);
				if (s > 1) {
					s = -1;
				}
				this.shininess[y][x] = s;
			}
		}
		return true;
	}
}

export default JigsawPattern;