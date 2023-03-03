export class Frame {
	constructor(public readonly size: Size, public readonly position: Position) {}

	includesPoint(point?: Position): boolean {
		if (!point) {
			return false;
		}
		return (
			point.x >= this.position.x &&
			point.y >= this.position.y &&
			point.x <= this.position.x + this.size.width &&
			point.y <= this.position.y + this.size.height
		);
	}
}

export class Size {
	width: number;
	height: number;
}

export class Position {
	x: number;
	y: number;
}
