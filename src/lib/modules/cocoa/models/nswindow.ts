import type { Frame } from "@/modules/shared/models/frame";
import { invoke } from "@tauri-apps/api";

export class NSWindow {
  static async setFrame(frame: Frame): Promise<void> {
    await invoke("nswindow_set_frame", { frame });
  }

  static async setDecorations(label: string) {
    await invoke("nswindow_set_decorations", { label });
  }
}
