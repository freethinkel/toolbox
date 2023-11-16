import { SettingsStore } from "@/modules/settings/store/settings.store";
import type { Frame } from "@/modules/shared/models/frame";
import { ScreensStore, WindowManagerStore } from "@/modules/window-manager";
import { createEffect, sample } from "effector";

const $gap = SettingsStore.windowGap.$store;

const setWindowFrameFx = createEffect(async (frame: Frame) => {
  await ScreensStore.getScreensFx();
  await WindowManagerStore.getCurrentAccessibilityElementFx();

  await WindowManagerStore.setWindowFrameFx(frame);
});

sample({
  clock: SettingsStore.mappingActivated,
  source: {
    gap: $gap,
    screen: WindowManagerStore.$currentCGScreen,
  },
  fn: ({ gap, screen }, action) => {
    const placeholder = WindowManagerStore.frameToPlaceholder({ gap, screen })(
      action.frame,
    );
    const frame = WindowManagerStore.placeholderToScreen(screen)(placeholder);

    return frame;
  },
  target: setWindowFrameFx,
});
