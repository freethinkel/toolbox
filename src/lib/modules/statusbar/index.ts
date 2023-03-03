import { PluginsStore } from "../plugins";
import { StatusbarStore } from "./store";
import Statusbar from "./view/Statusbar.svelte";

export const init = (el: HTMLElement) => {
  new Statusbar({ target: el, props: { plugins: PluginsStore.$plugins } });

  StatusbarStore.startStatusbarFx();
};
