import type { Frame } from './frame';

type NativeScreen = {
  frame: Frame;
  visibleFrame: Frame;
};

export class Screen {
  normalized: NativeScreen;
  original: NativeScreen;

  constructor(normalized: NativeScreen, original: NativeScreen) {
    this.normalized = normalized;
    this.original = original;
  }

  static fromMap(map: any): Screen {
    console.log('screens', map);
    return new Screen(
      {
        visibleFrame: map.visible_frame,
        frame: map.frame,
      },
      {
        visibleFrame: map.cocoa.visible_frame,
        frame: map.cocoa.frame,
      }
    );
  }
}
