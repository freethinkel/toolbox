import { invoke } from "@tauri-apps/api";

export class NSColor {
  color: string;

  static async getAccentColor(): Promise<NSColor> {
    const payload = await invoke("nscolor_get_accent");

    return { color: String(payload) };
  }
}
