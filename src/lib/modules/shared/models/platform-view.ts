import { window as tauriWindow } from '@tauri-apps/api';

export class PlatformView {
	static getKey(): string {
		return tauriWindow.getCurrent().label;
	}
}
