import type { Config } from '$lib/models/config';
import type { ChannelMouseEvent } from '../models/channel';
import type { Frame, Screen } from '../models/window';

export enum SnapArea {
  left = 'left',
  right = 'right',
  full = 'full',
  topLeft = 'topLeft',
  topRight = 'topRight',
  bottomLeft = 'bottomLeft',
  bottomRight = 'bottomRight',
}

export class AreaCalculator {
  currentScreen?: Screen;
  config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  updateConfig(config: Config) {
    this.config = config;
  }

  setScreen(screen: Screen) {
    this.currentScreen = screen;
  }

  getActivatedSize() {
    const sensitive = 0.1;
    const screen = this.currentScreen;
    return screen.visible_frame.size.width > screen.visible_frame.size.height
      ? screen.visible_frame.size.height * sensitive
      : screen.visible_frame.size.width * sensitive;
  }

  rectFromSnapArea(area?: SnapArea): Frame | undefined {
    if (!area) {
      return;
    }

    const screen = this.currentScreen.visible_frame;
    const map: Record<SnapArea, Frame> = {
      [SnapArea.bottomRight]: {
        position: {
          x: screen.size.width / 2 + this.config.windowGap / 2,
          y: screen.size.height / 2 + this.config.windowGap / 2,
        },
        size: {
          width:
            screen.size.width / 2 -
            this.config.windowPadding -
            this.config.windowGap / 2,
          height:
            screen.size.height / 2 -
            this.config.windowPadding -
            this.config.windowGap / 2,
        },
      },
      [SnapArea.left]: {
        size: {
          width:
            screen.size.width / 2 -
            this.config.windowPadding -
            this.config.windowGap / 2,
          height: screen.size.height - this.config.windowPadding * 2,
        },
        position: {
          x: this.config.windowPadding,
          y: this.config.windowPadding,
        },
      },
      [SnapArea.right]: {
        size: {
          width:
            screen.size.width / 2 -
            this.config.windowPadding -
            this.config.windowGap / 2,
          height: screen.size.height - this.config.windowPadding * 2,
        },
        position: {
          x: screen.size.width / 2 + this.config.windowGap / 2,
          y: this.config.windowPadding,
        },
      },
      [SnapArea.full]: {
        size: {
          width: screen.size.width - this.config.windowPadding * 2,
          height: screen.size.height - this.config.windowPadding * 2,
        },
        position: {
          x: this.config.windowPadding,
          y: this.config.windowPadding,
        },
      },
      [SnapArea.topLeft]: {
        size: {
          width:
            screen.size.width / 2 -
            this.config.windowPadding -
            this.config.windowGap / 2,
          height:
            screen.size.height / 2 -
            this.config.windowPadding -
            this.config.windowGap / 2,
        },
        position: {
          x: this.config.windowPadding,
          y: this.config.windowPadding,
        },
      },
      [SnapArea.topRight]: {
        size: {
          width:
            screen.size.width / 2 -
            this.config.windowPadding -
            this.config.windowGap / 2,
          height:
            screen.size.height / 2 -
            this.config.windowPadding -
            this.config.windowGap / 2,
        },
        position: {
          x: screen.size.width / 2 + this.config.windowGap / 2,
          y: this.config.windowPadding,
        },
      },
      [SnapArea.bottomLeft]: {
        size: {
          width:
            screen.size.width / 2 -
            this.config.windowPadding -
            this.config.windowGap / 2,
          height:
            screen.size.height / 2 -
            this.config.windowPadding -
            this.config.windowGap / 2,
        },
        position: {
          x: this.config.windowPadding,
          y: screen.size.height / 2 + this.config.windowGap / 2,
        },
      },
    };

    return map[area];
  }

  fromMouseEvent(event: ChannelMouseEvent): SnapArea | undefined {
    if (!event) {
      return;
    }
    const point = event.point;
    const monitor = this.currentScreen.frame;
    const sensitive = this.getActivatedSize();

    if (
      point.x >= monitor.position.x &&
      point.x <= monitor.position.x + sensitive &&
      point.y >= monitor.position.y &&
      point.y <= monitor.position.y + sensitive
    ) {
      return SnapArea.topLeft;
    }

    if (
      point.x >= monitor.position.x + monitor.size.width - sensitive &&
      point.x <= monitor.position.x + monitor.size.width &&
      point.y >= monitor.position.y &&
      point.y <= monitor.position.y + sensitive
    ) {
      return SnapArea.topRight;
    }

    if (
      point.x >= monitor.position.x + monitor.size.width - sensitive &&
      point.x <= monitor.position.x + monitor.size.width &&
      point.y <= monitor.position.y + monitor.size.height &&
      point.y >= monitor.position.y + monitor.size.height - sensitive
    ) {
      return SnapArea.bottomRight;
    }

    if (
      point.x >= monitor.position.x &&
      point.x <= monitor.position.x + sensitive &&
      point.y <= monitor.position.y + monitor.size.height &&
      point.y >= monitor.position.y + monitor.size.height - sensitive
    ) {
      return SnapArea.bottomLeft;
    }
    if (
      point.x <= monitor.position.x + sensitive &&
      point.x >= monitor.position.x &&
      point.y >= monitor.position.y &&
      point.y <= monitor.position.y + monitor.size.height
    ) {
      return SnapArea.left;
    }
    if (
      point.x <= monitor.position.x + monitor.size.width &&
      point.x >= monitor.position.x + monitor.size.width - sensitive &&
      point.y >= monitor.position.y &&
      point.y <= monitor.position.y + monitor.size.height
    ) {
      return SnapArea.right;
    }
    if (
      point.x >= monitor.position.x &&
      point.x <= monitor.position.x + monitor.size.width &&
      point.y >= monitor.position.y &&
      point.y <= monitor.position.y + sensitive
    ) {
      return SnapArea.full;
    }
  }
}
