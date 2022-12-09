import { invoke } from '@tauri-apps/api';
import { listen, type UnlistenFn } from '@tauri-apps/api/event';
import type { ChannelMouseEvent } from '../models/channel';
import type { Frame, Screen } from '../models/window';

type ListenCallback = (event: ChannelMouseEvent) => void;

export class Channel {
	private _listeners: ListenCallback[] = [];
	private _unlisten?: UnlistenFn;
	static instance: Channel = new Channel();

	setWindowPosition() {}

	subscribe(cb: ListenCallback) {
		this._listeners.push(cb);
	}

	async setCurrentWindowFrame(frame: Frame) {
		invoke('set_current_window_position', { payload: JSON.stringify(frame) });
	}

	async getScreens(): Promise<Screen[]> {
		return invoke('get_screens');
	}

	async start() {
		this._unlisten = await listen('window_manager', (event) => {
			const payload = JSON.parse(event.payload as string);
			for (let cb of this._listeners) {
				cb(payload);
			}
		});
	}

	stop() {
		if (this._unlisten) {
			this._unlisten();
		}
	}
}
