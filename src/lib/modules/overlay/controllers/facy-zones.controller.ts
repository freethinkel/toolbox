import { ConfigController } from '$lib/modules/shared/controllers';
import {
  Config,
  type Frame,
  type GlobalMouseEvent,
  type Position,
  type Screen,
} from '$lib/modules/shared/models';
import { ChannelService } from '$lib/modules/shared/services';
import { get, writable } from 'svelte/store';

const MODES: Frame[][] = [
  [
    { size: { height: 1, width: 1 / 2 }, position: { x: 0, y: 0 } },
    { size: { height: 1, width: 1 / 2 }, position: { x: 1 / 2, y: 0 } },
  ],
  [
    { size: { height: 1, width: 3 / 4 }, position: { x: 0, y: 0 } },
    { size: { height: 1, width: 1 / 4 }, position: { x: 3 / 4, y: 0 } },
  ],
  [
    { size: { height: 1, width: (1 / 3) * 0.5 }, position: { x: 0, y: 0 } },
    { size: { height: 1, width: 2 / 3 }, position: { x: (1 / 3) * 0.5, y: 0 } },
    {
      size: { height: 1, width: (1 / 3) * 0.5 },
      position: { x: 2 / 3 + (1 / 3) * 0.5, y: 0 },
    },
  ],
  [
    { size: { height: 1 / 2, width: 1 / 2 }, position: { x: 0, y: 0 } },
    { size: { height: 1 / 2, width: 1 / 2 }, position: { x: 1 / 2, y: 0 } },
    { size: { height: 1 / 2, width: 1 / 2 }, position: { x: 0, y: 1 / 2 } },
    { size: { height: 1 / 2, width: 1 / 2 }, position: { x: 1 / 2, y: 1 / 2 } },
  ],
  [
    { size: { height: 1, width: 1 / 3 }, position: { x: 0, y: 0 } },
    { size: { height: 1, width: 1 / 3 }, position: { x: 1 / 3, y: 0 } },
    { size: { height: 1, width: 1 / 3 }, position: { x: 2 / 3, y: 0 } },
  ],
];

export class FancyZonesController {
  static readonly instance = new FancyZonesController();

  private enabled = false;
  private selectedFrame: Frame = null;
  private config = Config.default;

  MODES = MODES;
  currentScreen: Screen | null = null;
  lastPosition = writable<GlobalMouseEvent | null>(null);
  isDragging = writable(false);
  currentRelativeMousePosition = writable<Position | null>(null);

  async init() {
    ChannelService.instance.subscribeWindowManager((event) => {
      if (!this.enabled) {
        return;
      }
      this.fancyZonesLoop(event);
    });

    ChannelService.instance.listenUpdateScreen(() => {
      this.updateScreen();
    });

    ConfigController.instance.config.subscribe((config) => {
      this.config = config;
    });
  }

  async stop() {
    this.enabled = false;
    await ChannelService.instance.stopWindowManager();
  }

  async start() {
    this.enabled = true;
    await this.updateScreen();
    await ChannelService.instance.startWindowManager();
  }

  setSelectedFrame(frame: Frame | null) {
    this.selectedFrame = frame;
  }

  modeToFrame(mode: Frame): Frame | undefined {
    const screen = this.currentScreen.normalized.visibleFrame;
    const frame: Frame = {
      size: {
        height:
          screen.size.height * mode.size.height -
          this.config.windowPadding -
          (mode.size.height < 1
            ? this.config.windowGap / 2
            : this.config.windowPadding),
        width:
          screen.size.width * mode.size.width -
          this.config.windowPadding -
          (mode.size.width < 1
            ? this.config.windowGap / 2
            : this.config.windowPadding),
      },
      position: {
        x:
          screen.position.x +
          screen.size.width * mode.position.x +
          (mode.size.width < 1 && mode.position.x > 0
            ? this.config.windowGap / 2
            : this.config.windowPadding),
        y:
          screen.position.y +
          screen.size.height * mode.position.y +
          this.config.windowPadding,
      },
    };

    return frame;
  }

  private fancyZonesLoop(event: GlobalMouseEvent) {
    const handler = {
      mouse_up: () => {
        if (ConfigController.instance.isDebugMode) {
          console.log('on_mouse_up', event, this);
        }
        if (get(this.lastPosition)) {
          this.lastPosition.set(event);
          this.onMouseUp();
        }
        this.isDragging.set(false);
        this.lastPosition.set(null);
      },
      dragging: () => {
        this.isDragging.set(true);
        this.lastPosition.set(event);
      },
      mouse_down: () => {
        this.isDragging.set(false);
        this.lastPosition.set(null);
      },
    }[event.type];

    if (handler) {
      handler();
    }
  }

  private onMouseUp() {
    if (!this.selectedFrame) {
      return;
    }

    const frame = this.modeToFrame(this.selectedFrame);
    const position = get(this.lastPosition);
    ChannelService.instance.setWindowPosition({
      id: position.window.id,
      pid: position.window.pid,
      position: frame.position,
      size: frame.size,
    });
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
    const screens = await ChannelService.instance.getScreens();
    const screen = mouse
      ? screens.find(
          (screen) => !this.isMouseOutScreen(screen.normalized.frame, mouse)
        )
      : screens[0];

    if (screen) {
      this.currentScreen = screen;

      await ChannelService.instance.setCurrentWindowFrame(
        screen.original.visibleFrame
      );
    }
  }
}
