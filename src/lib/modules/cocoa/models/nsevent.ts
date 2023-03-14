import type { Position } from "@/modules/shared/models/frame";
import { invoke, window } from "@tauri-apps/api";

export enum NSEventType {
  leftMouseDownMask = "NSEventType.leftMouseDownMask",
  leftMouseUpMask = "NSEventType.leftMouseUpMask",
  rightMouseDownMask = "NSEventType.rightMouseDownMask",
  rightMouseUpMask = "NSEventType.rightMouseUpMask",
  mouseMovedMask = "NSEventType.mouseMovedMask",
  leftMouseDraggedMask = "NSEventType.leftMouseDraggedMask",
  rightMouseDraggedMask = "NSEventType.rightMouseDraggedMask",
  mouseEnteredMask = "NSEventType.mouseEnteredMask",
  mouseExitedMask = "NSEventType.mouseExitedMask",
  keyDownMask = "NSEventType.keyDownMask",
  keyUpMask = "NSEventType.keyUpMask",
  flagsChangedMask = "NSEventType.flagsChangedMask",
  appKitDefinedMask = "NSEventType.appKitDefinedMask",
  systemDefinedMask = "NSEventType.systemDefinedMask",
  applicationDefinedMask = "NSEventType.applicationDefinedMask",
  periodicMask = "NSEventType.periodicMask",
  cursorUpdateMask = "NSEventType.cursorUpdateMask",
  scrollWheelMask = "NSEventType.scrollWheelMask",
  tabletPointMask = "NSEventType.tabletPointMask",
  tabletProximityMask = "NSEventType.tabletProximityMask",
  otherMouseDownMask = "NSEventType.otherMouseDownMask",
  otherMouseUpMask = "NSEventType.otherMouseUpMask",
  otherMouseDraggedMask = "NSEventType.otherMouseDraggedMask",
  eventMaskGesture = "NSEventType.eventMaskGesture",
  eventMaskSwipe = "NSEventType.eventMaskSwipe",
  eventMaskRotate = "NSEventType.eventMaskRotate",
  eventMaskBeginGesture = "NSEventType.eventMaskBeginGesture",
  eventMaskEndGesture = "NSEventType.eventMaskEndGesture",
  eventMaskPressure = "NSEventType.eventMaskPressure",
  anyEventMask = "NSEventType.anyEventMask",
}

const _maskToValue = (mask: NSEventType): number =>
  ({
    [NSEventType.leftMouseDownMask]: 1 << 1,
    [NSEventType.leftMouseUpMask]: 1 << 2,
    [NSEventType.rightMouseDownMask]: 1 << 3,
    [NSEventType.rightMouseUpMask]: 1 << 4,
    [NSEventType.mouseMovedMask]: 1 << 5,
    [NSEventType.leftMouseDraggedMask]: 1 << 6,
    [NSEventType.rightMouseDraggedMask]: 1 << 7,
    [NSEventType.mouseEnteredMask]: 1 << 8,
    [NSEventType.mouseExitedMask]: 1 << 9,
    [NSEventType.keyDownMask]: 1 << 10,
    [NSEventType.keyUpMask]: 1 << 11,
    [NSEventType.flagsChangedMask]: 1 << 12,
    [NSEventType.appKitDefinedMask]: 1 << 13,
    [NSEventType.systemDefinedMask]: 1 << 14,
    [NSEventType.applicationDefinedMask]: 1 << 15,
    [NSEventType.periodicMask]: 1 << 16,
    [NSEventType.cursorUpdateMask]: 1 << 17,
    [NSEventType.scrollWheelMask]: 1 << 22,
    [NSEventType.tabletPointMask]: 1 << 23,
    [NSEventType.tabletProximityMask]: 1 << 24,
    [NSEventType.otherMouseDownMask]: 1 << 25,
    [NSEventType.otherMouseUpMask]: 1 << 26,
    [NSEventType.otherMouseDraggedMask]: 1 << 27,
    [NSEventType.eventMaskGesture]: 1 << 29,
    [NSEventType.eventMaskSwipe]: 1 << 31,
    [NSEventType.eventMaskRotate]: 1 << 18,
    [NSEventType.eventMaskBeginGesture]: 1 << 19,
    [NSEventType.eventMaskEndGesture]: 1 << 20,
    [NSEventType.eventMaskPressure]: 1 << 34,
    [NSEventType.anyEventMask]: 0xffffffffffffffff,
  }[mask]);

const _valueToMask = (value: number): NSEventType =>
  ({
    1: NSEventType.leftMouseDownMask,
    2: NSEventType.leftMouseUpMask,
    3: NSEventType.rightMouseDownMask,
    4: NSEventType.rightMouseUpMask,
    5: NSEventType.mouseMovedMask,
    6: NSEventType.leftMouseDraggedMask,
    7: NSEventType.rightMouseDraggedMask,
    8: NSEventType.mouseEnteredMask,
    9: NSEventType.mouseExitedMask,
    10: NSEventType.keyDownMask,
    11: NSEventType.keyUpMask,
    12: NSEventType.flagsChangedMask,
    13: NSEventType.appKitDefinedMask,
    14: NSEventType.systemDefinedMask,
    15: NSEventType.applicationDefinedMask,
    16: NSEventType.periodicMask,
    17: NSEventType.cursorUpdateMask,
    22: NSEventType.scrollWheelMask,
    23: NSEventType.tabletPointMask,
    24: NSEventType.tabletProximityMask,
    25: NSEventType.otherMouseDownMask,
    26: NSEventType.otherMouseUpMask,
    27: NSEventType.otherMouseDraggedMask,
    29: NSEventType.eventMaskGesture,
    31: NSEventType.eventMaskSwipe,
    18: NSEventType.eventMaskRotate,
    19: NSEventType.eventMaskBeginGesture,
    20: NSEventType.eventMaskEndGesture,
    34: NSEventType.eventMaskPressure,
    0xffffffffffffffff: NSEventType.anyEventMask,
  }[value]);

export class NSEvent {
  position: Position;
  type: NSEventType;

  static async addGlobalMonitor(
    masks: NSEventType[],
    handler: (event: NSEvent) => void
  ) {
    let mask = 0;
    for (const m of masks) {
      mask = mask | _maskToValue(m)!;
    }
    let prevEvent: NSEvent = null;
    window.getCurrent().listen("nsevent_on_event", ({ payload }) => {
      let event: NSEvent = {
        type: _valueToMask((payload as any).event_type),
        position: (payload as any).point,
      };
      const isSameEvent =
        event.type === prevEvent?.type &&
        event.position.x === prevEvent?.position.x &&
        event.position.y === prevEvent?.position.y;

      if (!isSameEvent) {
        handler(event);
      }
      prevEvent = event;
    });
    await invoke("nsevent_add_global_monitor_for_events", { mask: mask });
  }

  static async removeMonitor() {
    await invoke("nsevent_remove_monitor");
  }
}
