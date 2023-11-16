import type { Frame } from "@/modules/shared/models/frame";

export class MappingAction {
  constructor(
    public frame: Frame,
    public shortcut: string[],
  ) {}

  keysToShortcut() {
    return this.shortcut
      .map(
        (char) =>
          ({
            Meta: "CommandOrControl",
            " ": "Space",
          })[char] || char,
      )
      .join("+");
  }
}

export class SettingsStoreHelpers {}
