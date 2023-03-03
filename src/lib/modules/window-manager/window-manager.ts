import type { NSScreen } from "../cocoa/models/nsscreen";
import { ScreensStore } from "./screens";

import type { Position } from "../shared/models/frame";
import { NSWindow } from "../cocoa/models/nswindow";
import { createEffect, createEvent, createStore } from "effector";
import { NSEvent, NSEventType } from "../cocoa/models/nsevent";

type MouseEvent<T extends "down" | "up" | "dragged"> = {
  type: T;
  position: Position;
};

export const onMouseDown = createEvent<MouseEvent<"down">>();
export const onMouseDragged = createEvent<MouseEvent<"dragged">>();
export const onMouseUp = createEvent<MouseEvent<"up">>();

const startWindowManagerListenFx = createEffect(() => {
  NSEvent.addGlobalMonitor(
    [
      NSEventType.leftMouseDownMask,
      NSEventType.leftMouseDraggedMask,
      NSEventType.leftMouseUpMask,
    ],
    (event) => {
      switch (event.type) {
        case NSEventType.leftMouseDownMask:
          onMouseDown({ type: "down", position: event.position });
          break;
        case NSEventType.leftMouseUpMask:
          onMouseUp({ type: "up", position: event.position });
          break;
        case NSEventType.leftMouseDraggedMask:
          onMouseDragged({ type: "dragged", position: event.position });
          break;
      }
    }
  );
});

const stopWindowManagerListenFx = createEffect(async () => {
  await NSEvent.removeMonitor();
});

const $mousePosition = createStore<Position>({ x: 0, y: 0 })
  .on(onMouseDown, (_state, event) => event.position)
  .on(onMouseDragged, (_state, event) => event.position)
  .on(onMouseUp, () => null);

const $currentScreen = createStore<NSScreen>(null)
  .on(ScreensStore.getScreensFx.doneData, (_, screens) => screens[0])
  .on($mousePosition, (prevScreen, position) => {
    const screens = ScreensStore.$screens.getState();
    const mainScreen = screens[0];

    if (!position || !mainScreen) {
      return prevScreen;
    }
    const findedScreen = screens.find((screen) =>
      ScreensStore.screenToCgScreen(screen).frame.includesPoint(position)
    );
    return findedScreen ?? prevScreen ?? mainScreen;
  });

const $currentCGScreen = $currentScreen.map(
  (state) => state && ScreensStore.screenToCgScreen(state)
);

$currentScreen.watch((screen) => {
  if (screen) {
    console.log("update screen");
    NSWindow.setFrame(screen.frame);
  }
});

export const WindowManagerStore = {
  $currentScreen,
  startWindowManagerListenFx,
  stopWindowManagerListenFx,
};
