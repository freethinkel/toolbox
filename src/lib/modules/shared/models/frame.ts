import type { Alignment } from "./geometry";

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

  alignmentFrameSize({
    size,
    alignment,
  }: {
    size: Size;
    alignment: Alignment;
  }): Frame {
    const x = (alignment.x + 1) / 2;
    const y = (alignment.y + 1) / 2;

    const position: Position = {
      x: this.position.x + this.size.width * x - size.width * x,
      y: this.position.y + this.size.height * y - size.height * y,
    };

    return new Frame(size, position);
  }

  compareSize(size: Size): boolean {
    return this.size.width === size.width && this.size.height === size.height;
  }
  comparePosition(position: Position): boolean {
    return this.position.x === position.x && this.position.y === position.y;
  }

  compare(frame: Frame): boolean {
    return this.compareSize(frame.size) && this.comparePosition(frame.position);
  }
}

export class Size {
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}

export class Position {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
