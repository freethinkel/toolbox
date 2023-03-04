export class Alignment {
	constructor(public x: number, public y: number) {}

	static topLeft = new Alignment(-1.0, -1.0);
	static topCenter = new Alignment(0.0, -1.0);
	static topRight = new Alignment(1.0, -1.0);
	static centerLeft = new Alignment(-1.0, 0.0);
	static center = new Alignment(0.0, 0.0);
	static centerRight = new Alignment(1.0, 0.0);
	static bottomLeft = new Alignment(-1.0, 1.0);
	static bottomCenter = new Alignment(0.0, 1.0);
	static bottomRight = new Alignment(1.0, 1.0);
}
