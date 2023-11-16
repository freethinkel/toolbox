import { NSColor } from "@/modules/cocoa/models/nscolor";
import { createEffect, createStore, sample } from "effector";
import { transparentize } from "polished";

const style = document.createElement("style");
style.id = "__theme-vars__";
style.setAttribute("type", "text/css");
document.head.appendChild(style);

const initListenFx = createEffect(async () => {
  const color = await NSColor.getAccentColor();
  return color.color;
});

const $accent = createStore("#fcbfcb");

$accent.watch((color) => {
  style.innerHTML = `
  :root {
    --color-accent: ${color};
    --color-accent50: ${transparentize(1 - 0.5)(color)};
    --color-accent12: ${transparentize(1 - 0.12)(color)};
  }
  `;
});

sample({
  clock: initListenFx.doneData,
  target: $accent,
});

export const ThemeStore = {
  initListenFx,
};
