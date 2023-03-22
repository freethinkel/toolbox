import { createSharedStore } from "@/modules/shared/helpers/store";

const $showFancyZonesPlaceholder = createSharedStore(
  "show_fancy_zones_placeholder",
  "settings",
  true
);

const $placeholderMode = createSharedStore<"bordered" | "blurred">(
  "window_manager_placeholder_mode",
  "settings",
  "bordered"
);

export const WindowManagerSettingsStore = {
  $showFancyZonesPlaceholder,
  $placeholderMode,
};
