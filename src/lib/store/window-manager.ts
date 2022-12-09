import { writable } from 'svelte/store';
import type {
	ChannelMouseEvent,
	ChannelMouseWindowInfo,
} from '../models/channel';
import { Channel } from '../service/channel';

const DEFAULT = {
	lastPosition: null as null | ChannelMouseEvent,
};

const store = writable({ ...DEFAULT });

export const windowManager = {
	subscribe: store.subscribe,
	async updateScreen() {
		const screens = await Channel.instance.getScreens();
		const { visibleFrame } = screens[0]!;
		Channel.instance.setCurrentWindowFrame(visibleFrame);
	},
	start() {
		this.updateScreen();
		Channel.instance.subscribe((event) => {
			({
				mouse_up: () => {
					store.update((state) => {
						state.lastPosition = null;
						return state;
					});
				},
				dragging: () => {
					store.update((state) => {
						state.lastPosition = event;
						return state;
					});
				},
				mouse_down: () => {
					store.update((state) => {
						state.lastPosition = event;
						return state;
					});
				},
			}[event.event_type]());
		});
		Channel.instance.start();
	},
};
