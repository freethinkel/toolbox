import type { Alignment } from "./geometry";

export class Frame {
  constructor(
    public readonly size: Size,
    public readonly position: Position,
  ) {}

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

  toJSON(): object {
    return { size: this.size, position: this.position };
  }

  static fromMap(data: unknown): Frame {
    if (typeof data !== "object") {
      throw new Error(`data must be object but ${typeof data}`);
    }
    if (
      !(
        "size" in data &&
        typeof data.size === "object" &&
        "width" in data.size &&
        "height" in data.size &&
        typeof data.size.width === "number" &&
        typeof data.size.height === "number"
      )
    ) {
      throw new Error(`doesn't have 'size' property`);
    }
    if (
      !(
        "position" in data &&
        typeof data.position === "object" &&
        "x" in data.position &&
        "y" in data.position &&
        typeof data.position.x === "number" &&
        typeof data.position.y === "number"
      )
    ) {
      throw new Error(`doesn't have 'position' property`);
    }

    return new Frame(
      new Size(data.size.width, data.size.height),
      new Position(data.position.x, data.position.y),
    );
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
