import {
  type GlobalMouseEvent,
  Config,
  Position,
  Frame,
} from '$lib/modules/shared/models';
import { ChannelService } from '$lib/modules/shared/services';
import { ConfigController } from '$lib/modules/shared/controllers';
import { writable } from 'svelte/store';
import { AreaCalculator, SnapArea } from './area-calculator.controller';

export class WindowManagerController {
  static readonly instance = new WindowManagerController();

  private _lastPosition: GlobalMouseEvent | null = null;
  private get lastPosition() {
    return this._lastPosition;
  }
  private set lastPosition(newValue: GlobalMouseEvent | null) {
    this._lastPosition = newValue;
    this.currentArea.set(this.areaCalculator.fromMouseEvent(newValue));
  }

  areaCalculator = new AreaCalculator(Config.default);

  private screenUpdating = false;

  currentArea = writable<null | SnapArea>(null);

  async init() {
    ChannelService.instance.listenBroadcast((event) => {
      if (event.type === 'window_manager_enabled') {
        if (event.enabled) {
          this.start();
        } else {
          this.stop();
        }
      }
    });
    ConfigController.instance.config.subscribe((config) => {
      this.areaCalculator.config = config;
    });

    ChannelService.instance.subscribeWindowManager((event) => {
      this.onUpdateMousePosition(event.mousePoint);

      const handler = {
        mouse_up: () => {
          if (this.lastPosition) {
            this.onMouseUp();
          }
          this.lastPosition = null;
        },
        dragging: () => {
          this.lastPosition = event;
        },
        mouse_down: () => {
          this.lastPosition = null;
        },
      }[event.type];

      if (handler) {
        handler();
      }
    });
  }

  private onUpdateMousePosition(point: Position) {
    if (this.screenUpdating || !this.areaCalculator.currentScreen) {
      return;
    }

    const isMouseOut = this.isMouseOutScreen(
      this.areaCalculator.currentScreen.original.frame,
      point
    );

    if (isMouseOut) {
      this.updateScreen(point);
    }
  }

  private onMouseUp() {
    const area = this.areaCalculator.fromMouseEvent(this.lastPosition);

    if (area) {
      const frame = this.areaCalculator.rectFromSnapArea(area);

      frame.position.y =
        frame.position.y +
        this.areaCalculator.currentScreen.normalized.visibleFrame.position.y;
      frame.position.x =
        frame.position.x +
        this.areaCalculator.currentScreen.normalized.visibleFrame.position.x;

      ChannelService.instance.setWindowPosition({
        id: this.lastPosition.window.id,
        pid: this.lastPosition.window.pid,
        ...frame,
      });
    }
  }

  private isMouseOutScreen(screen: Frame, mouse: Position): boolean {
    if (!screen) {
      return false;
    }
    const pos = screen.position;
    const size = screen.size;

    return (
      mouse.x < pos.x ||
      mouse.x > pos.x + size.width ||
      mouse.y < pos.y ||
      mouse.y > pos.y + size.height
    );
  }

  private async updateScreen(mouse?: Position) {
    this.screenUpdating = true;

    const screens = await ChannelService.instance.getScreens();
    const screen = mouse
      ? screens.find(
          (screen) => !this.isMouseOutScreen(screen.normalized.frame, mouse)
        )
      : screens[0];

    if (screen) {
      this.areaCalculator.setScreen(screen);

      ChannelService.instance.setCurrentWindowFrame(
        screen.original.visibleFrame
      );
    }

    this.screenUpdating = false;
  }

  private async stop() {
    await ChannelService.instance.stopWindowManager();
  }

  private start() {
    this.updateScreen();
    ChannelService.instance.startWindowManager();
  }

  dispose() {}
}
