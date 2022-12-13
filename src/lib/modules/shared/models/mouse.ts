import type { Position } from './frame';

export type GlobalMouseWindowInfo = {
  id: string;
  pid: number;
  point: Position;
};

export class GlobalMouseEvent {
  type: 'dragging' | 'mouse_up' | 'mouse_down';
  window: GlobalMouseWindowInfo;
  mousePoint: Position;

  constructor(self: GlobalMouseEvent) {
    this.window = self.window;
    this.type = self.type;
    this.mousePoint = self.mousePoint;
  }

  static fromMap(map: any): GlobalMouseEvent {
    return new GlobalMouseEvent({
      window: map.window_info,
      mousePoint: map.point,
      type: map.event_type,
    });
  }
}
