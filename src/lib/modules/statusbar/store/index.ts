import { createEffect, createEvent, sample } from "effector";
import { listen } from "@tauri-apps/api/event";
import type { Position } from "@/modules/shared/models/frame";
import {
  appWindow,
  PhysicalPosition,
  PhysicalSize,
  WebviewWindow,
} from "@tauri-apps/api/window";
import { process } from "@tauri-apps/api";
import { NSWindow } from "@/modules/cocoa/models/nswindow";
import { wait } from "@/modules/shared/helpers";
import { CaffeinateStore } from "@/modules/plugins/core/caffeinate/store/caffeinate.store";

const onSystemTrayButtonClick = createEvent<Position>();
const onSettingsClick = createEvent();

const updateFrameSizeFx = createEffect(async () => {
  const currentSize = await appWindow.innerSize();
  const scaleFactor = await appWindow.scaleFactor();
  const statusbarEl = document.querySelector(
    ".statusbar__frame",
  ) as HTMLElement;
  statusbarEl.style.height = "auto";
  statusbarEl.style.minHeight = "auto";
  const height = (statusbarEl.clientHeight ?? 120) * scaleFactor;
  statusbarEl.style.height = "100%";
  statusbarEl.style.minHeight = "inherit";
  await appWindow.setSize(new PhysicalSize(currentSize.width, height));
});

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

const openSettingsWindowFx = createEffect(async () => {
  const settings = new WebviewWindow("settings", {
    titleBarStyle: "transparent",
    title: "",
    transparent: true,
    resizable: false,
    fullscreen: false,
    maximized: false,
    alwaysOnTop: true,
    width: 450,
    height: 400,
    visible: false,
  });
  await wait(100);
  await NSWindow.setDecorations(settings.label);
  await settings.show();
  settings.setFocus();
});

const exitAppFx = createEffect(async () => {
  await CaffeinateStore.changeCaffeinateFx(false);
  process.exit(0);
});

onSystemTrayButtonClick.watch(async (position) => {
  const isVisible = await appWindow.isVisible();
  if (isVisible) {
    appWindow.hide();
  } else {
    const newPosition = new PhysicalPosition(position.x, position.y + 10);
    await appWindow.setPosition(newPosition);
    await updateFrameSizeFx();
    appWindow.show();
    appWindow.setFocus();
  }
});

sample({
  clock: onSettingsClick,
  target: openSettingsWindowFx,
});

export const StatusbarStore = {
  startStatusbarFx,
  exitAppFx,
  onSettingsClick,
};
