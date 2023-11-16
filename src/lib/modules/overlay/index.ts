import { PluginsStore } from "../plugins";
import { WindowManagerStore, ScreensStore } from "../window-manager";
import Overlay from "./view/Overlay.svelte";
import "../plugins/core/window-manager/store/mappings";

export const init = (el: HTMLElement): void => {
  const overlayView = new Overlay({
    target: el,
    props: { plugins: PluginsStore.$plugins },
  });

  WindowManagerStore.startWindowManagerListenFx();
  ScreensStore.getScreensFx();
};
