import { SettingsStore } from "@/modules/settings/store/settings.store";
import { Frame, Position, Size } from "@/modules/shared/models/frame";
import { ScreensStore, WindowManagerStore } from "@/modules/window-manager";
import { combine, createStore, sample } from "effector";
import { WindowManagerStatusbarStore } from "./statusbar.store";

const defaultZones = [
  [new Frame({ width: 1, height: 1 }, { x: 0, y: 0 })],

  [
    new Frame({ width: 0.5, height: 1 }, { x: 0, y: 0 }),
    new Frame({ width: 0.5, height: 1 }, { x: 0.5, y: 0 }),
  ],

  [
    new Frame({ width: 1, height: 0.5 }, { x: 0, y: 0 }),
    new Frame({ width: 1, height: 0.5 }, { x: 0, y: 0.5 }),
  ],

  [
    new Frame({ width: 1 / 6, height: 1 }, { x: 0, y: 0 }),
    new Frame({ width: 2 / 3, height: 1 }, { x: 1 / 6, y: 0 }),
    new Frame({ width: 1 / 6, height: 1 }, { x: 1 / 6 + 2 / 3, y: 0 }),
  ],

  [
    new Frame({ width: 0.5, height: 0.5 }, { x: 0, y: 0 }),
    new Frame({ width: 0.5, height: 0.5 }, { x: 0.5, y: 0 }),
    new Frame({ width: 0.5, height: 0.5 }, { x: 0, y: 0.5 }),
    new Frame({ width: 0.5, height: 0.5 }, { x: 0.5, y: 0.5 }),
  ],

  [
    new Frame({ width: 2 / 3, height: 1 }, { x: 0, y: 0 }),
    new Frame({ width: 1 / 3, height: 1 }, { x: 2 / 3, y: 0 }),
  ],
];

const SETTINGS = {
  groupSize: new Size(80, 50),
  padding: 10.0,
  groupGap: 7.0,
};

const $enabled = combine(
  [
    WindowManagerStatusbarStore.$enabled.$store,
    WindowManagerStatusbarStore.$mode.$store,
  ],
  ([enabled, mode]) => enabled && mode === "fancy_zones"
);
const $placeholder = createStore<Frame>(null);
const $zones = createStore([...defaultZones]);
const $activeZone = createStore<Frame>(null);
const $activeTop = WindowManagerStore.$currentCGScreen.map(
  (screen) =>
    (screen?.visibleFrame?.position?.y - screen?.frame?.position?.y || 0) + 15
);
const $isDraggingTop = createStore(false);
const $gap = SettingsStore.windowGap.$store;

sample({
  clock: WindowManagerStore.$draggingPositionFromScreen,
  filter: $enabled,
  fn: (point) => point?.y < 200,
  target: $isDraggingTop,
});

sample({
  clock: WindowManagerStore.$draggingPositionFromScreen,
  filter: $enabled,
  source: {
    zones: $zones,
    screen: WindowManagerStore.$currentScreen,
    activeTop: $activeTop,
  },
  fn: ({ screen, zones, activeTop }, point) => {
    if (!point) {
      return null;
    }

    const widthSum =
      SETTINGS.groupSize.width * zones.length +
      SETTINGS.groupGap * (zones.length - 1);

    const currentScreenFrame = screen?.frame;
    const startX = currentScreenFrame!.size.width / 2 - widthSum / 2;
    const zone = zones.find((_, index) => {
      return (
        point.x > startX &&
        point.x <
          startX +
            (SETTINGS.groupSize.width * (index + 1) + SETTINGS.groupGap * index)
      );
    });
    const offsetX =
      zones.indexOf(zone) * (SETTINGS.groupSize.width + SETTINGS.groupGap);
    const frame = zone?.find((frame) => {
      const size = new Size(
        frame.size.width * SETTINGS.groupSize.width,
        frame.size.height * SETTINGS.groupSize.height
      );
      const position = new Position(
        startX + offsetX + SETTINGS.groupSize.width * frame.position.x,
        activeTop +
          SETTINGS.padding +
          SETTINGS.groupSize.height * frame.position.y
      );
      const computedFrame = new Frame(size, position);
      return computedFrame.includesPoint(point);
    });

    return frame || null;
  },
  target: $activeZone,
});

sample({
  clock: $activeZone,
  filter: $enabled,
  source: {
    screen: WindowManagerStore.$currentCGScreen,
    gap: $gap,
  },
  fn: ({ screen, gap }, currentFrame) =>
    WindowManagerStore.frameToPlaceholder({ gap, screen })(currentFrame),
  target: $placeholder,
});

sample({
  clock: WindowManagerStore.onDragEnded,
  filter: combine($enabled, $placeholder).map(([enabled, placeholder]) =>
    Boolean(enabled && placeholder)
  ),
  source: {
    placeholder: $placeholder,
    screen: WindowManagerStore.$currentCGScreen,
  },
  fn: ({ placeholder, screen }, _) =>
    WindowManagerStore.placeholderToScreen(screen)(placeholder),
  target: WindowManagerStore.setWindowFrameFx,
});

sample({
  clock: WindowManagerStore.onDragEnded,
  filter: $enabled,
  fn: () => null,
  target: WindowManagerStore.$draggingPosition,
});

export const FancyZonesStore = {
  $zones,
  $activeTop,
  $activeZone,
  $isDraggingTop,
  $placeholder,
  SETTINGS,
};
