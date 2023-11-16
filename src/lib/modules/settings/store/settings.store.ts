import { createSharedStore } from "@/modules/shared/helpers/store";
import { Frame } from "@/modules/shared/models/frame";
import { globalShortcut } from "@tauri-apps/api";
import { appWindow } from "@tauri-apps/api/window";
import { createEvent } from "effector";
import { MappingAction } from "../model/mappings";
import { MAPPING_ACTIONS } from "./constants";

const windowGap = createSharedStore<number>("window_gap", "settings", 10);
const mappings = createSharedStore("mappings", "settings", MAPPING_ACTIONS, {
  mapper: (data) =>
    (data as Array<object>).map(
      (item: any) =>
        new MappingAction(Frame.fromMap(item.frame), item.shortcut),
    ),
});

const mappingActivated = createEvent<MappingAction>();

if (appWindow.label === "main") {
  mappings.$store.subscribe(async (mappings) => {
    await globalShortcut.unregisterAll();
    mappings.forEach((mapping) => {
      if (mapping.shortcut.length) {
        globalShortcut.register(mapping.keysToShortcut(), () => {
          mappingActivated(mapping);
        });
      }
    });
  });
}

export const SettingsStore = {
  windowGap,
  mappings,
  mappingActivated,
};
