import { createSharedStore } from "@/modules/shared/helpers/store";
import { WindowManagerStore } from "@/modules/window-manager";
import { appWindow } from "@tauri-apps/api/window";
import { sample } from "effector";

const isOverlayWindow = appWindow.label === "main";

const $enabled = createSharedStore(
  "window_manager_enabled",
  "statusbar",
  false
);

const $mode = createSharedStore<"snapping" | "fancy_zones">(
  "window_manager_mode",
  "statusbar",
  "snapping"
);

sample({
  clock: $enabled.$store,
  filter: (value) => value && isOverlayWindow,
  target: WindowManagerStore.startWindowManagerListenFx,
});

sample({
  clock: $enabled.$store,
  filter: $enabled.$store.map((e) => !e && isOverlayWindow),
  target: WindowManagerStore.stopWindowManagerListenFx,
});

export const WindowManagerStatusbarStore = {
  $enabled,
  $mode,
};
