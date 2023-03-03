import type { SvelteComponent } from "svelte";
import SnappingView from "./view/Snapping.svelte";
import StatusbarView from "./view/Statusbar.svelte";
import { TBPlugin } from "../../models/plugin";

class WindowManagerPlugin extends TBPlugin {
  override renderOverlay(): typeof SvelteComponent {
    return SnappingView;
  }

  override renderStatusbar(): typeof SvelteComponent {
    return StatusbarView;
  }
}

export const windowManagerPlugin = new WindowManagerPlugin();
