import { createEffect, createEvent } from "effector";
import { listen } from "@tauri-apps/api/event";
import type { Position } from "@/modules/shared/models/frame";
import { appWindow, PhysicalPosition } from "@tauri-apps/api/window";

const onSystemTrayButtonClick = createEvent<Position>();

const startStatusbarFx = createEffect(() => {
  listen("on_statusbar_click", ({ payload }) => {
    onSystemTrayButtonClick(payload as Position);
  });
  appWindow.onFocusChanged((event) => {
    if (!event.payload) {
      appWindow.hide();
    }
  });
});

onSystemTrayButtonClick.watch(async (position) => {
  const isVisible = await appWindow.isVisible();
  if (isVisible) {
    appWindow.hide();
  } else {
    const newPosition = new PhysicalPosition(position.x, position.y);
    await appWindow.setPosition(newPosition);
    appWindow.show();
    appWindow.setFocus();
  }
});

export const StatusbarStore = {
  startStatusbarFx,
};
