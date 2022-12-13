import type { Position, Size } from './frame';

export class WindowInfo {
  id: string;
  pid: number;
  size: Size;
  position: Position;
}
