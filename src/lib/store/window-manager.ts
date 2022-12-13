import { defaultConfig } from '$lib/service/config-reader';
import { get, writable } from 'svelte/store';
import type { ChannelMouseEvent } from '../models/channel';
import type { Frame, Position } from '../models/window';
import { AreaCalculator } from '../service/area-calculator';
import { Channel } from '../service/channel';

const DEFAULT = {
  areaCalculator: new AreaCalculator(defaultConfig),
  lastPosition: null as null | ChannelMouseEvent,
};

const store = writable({ ...DEFAULT });

let checking = false;

export const windowManager = {
  subscribe: store.subscribe,
  async updateScreen(mouse?: Position) {
    checking = true;
    const screens = await Channel.instance.getScreens();
    const screen = mouse
      ? screens.find((screen) => !checkMouseOut(screen.frame, mouse))
      : screens[0];
    store.update((state) => {
      state.areaCalculator.setScreen(screen);
      return state;
    });

    Channel.instance.setCurrentWindowFrame(screen.cocoa.visible_frame);

    checking = false;
  },
  async stop() {
    await Channel.instance.stopWindowManager();
  },
  init() {
    // Channel.instance.
    Channel.instance.listenAllWindows((event) => {
      if (event.type === 'window_manager_enabled') {
        if (event.enabled) {
          this.start();
        } else {
          this.stop();
        }
      }
    });

    Channel.instance.subscribeWindowManager((event) => {
      const { areaCalculator } = get(store);
      const isMouseOut = checkMouseOut(
        areaCalculator.currentScreen.frame,
        event.point
      );

      if (isMouseOut && !checking) {
        windowManager.updateScreen(event.point);
      }

      ({
        mouse_up: () => {
          const { lastPosition, areaCalculator } = get(store);
          if (lastPosition) {
            const area = areaCalculator.fromMouseEvent(lastPosition);
            if (area) {
              const frame = areaCalculator.rectFromSnapArea(area);

              frame.position.y =
                frame.position.y +
                areaCalculator.currentScreen.visible_frame.position.y;
              frame.position.x =
                frame.position.x +
                areaCalculator.currentScreen.visible_frame.position.x;

              Channel.instance.setWindowPosition({
                id: lastPosition.window_info.id,
                pid: lastPosition.window_info.pid,
                ...frame,
              });
            }
          }
          store.update((state) => {
            state.lastPosition = null;
            return state;
          });
        },
        dragging: () => {
          store.update((state) => {
            state.lastPosition = event;
            return state;
          });
        },
        mouse_down: () => {
          store.update((state) => {
            state.lastPosition = null;
            return state;
          });
        },
      }[event.event_type]());
    });
  },
  start() {
    windowManager.updateScreen();
    Channel.instance.startWindowManager();
  },
};

const checkMouseOut = (screen: Frame, mouse: Position): boolean => {
  const pos = screen.position;
  const size = screen.size;

  return (
    mouse.x < pos.x ||
    mouse.x > pos.x + size.width ||
    mouse.y < pos.y ||
    mouse.y > pos.y + size.height
  );
};
