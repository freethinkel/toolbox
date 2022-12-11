import { invoke } from '@tauri-apps/api';
import { listen, type UnlistenFn } from '@tauri-apps/api/event';
import type { ChannelMouseEvent } from '../models/channel';
import type { Frame, Position, Screen, WindowInfo } from '../models/window';

type ListenCallback = (event: ChannelMouseEvent) => void;

export class Channel {
	private _windowManagerListeners: ListenCallback[] = [];
	private _unlistenWindowManager?: UnlistenFn;
	static instance: Channel = new Channel();

	setWindowPosition(frame: WindowInfo) {
		invoke('change_window_position', { payload: JSON.stringify(frame) });
	}

	subscribeWindowManager(cb: ListenCallback) {
		this._windowManagerListeners.push(cb);
	}

	onStatusbarClick(cb: (point: Position) => void) {
		listen('on_statusbar_click', (event) => cb(event.payload as Position));
	}

	async setCurrentWindowFrame(frame: Frame) {
		invoke('set_current_window_position', { payload: JSON.stringify(frame) });
	}

	async getScreens(): Promise<Screen[]> {
		return invoke('get_screens');
	}

	async startWindowManager() {
		this._unlistenWindowManager = await listen('window_manager', (event) => {
			const payload = JSON.parse(event.payload as string);
			for (let cb of this._windowManagerListeners) {
				cb(payload);
			}
		});
	}

	stopWindowManager() {
		if (this._unlistenWindowManager) {
			this._unlistenWindowManager();
		}
	}
}
