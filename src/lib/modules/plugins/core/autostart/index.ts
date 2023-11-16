import { TBPlugin } from "../../models/plugin";
import AutostartView from "./view/Autostart.svelte";

class AutostartPlugin extends TBPlugin {
  name = "Autostart";

  override renderOverlay() {}

  override renderStatusbar() {}

  override renderSettings() {
    return AutostartView;
  }
}

export const autostartPlugin = new AutostartPlugin();
