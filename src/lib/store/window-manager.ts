import { get, writable } from 'svelte/store';
import type {
	ChannelMouseEvent,
	ChannelMouseWindowInfo,
} from '../models/channel';
import { AreaCalculator } from '../service/area-calculator';
import { Channel } from '../service/channel';

const DEFAULT = {
	areaCalculator: new AreaCalculator([]),
	lastPosition: null as null | ChannelMouseEvent,
};

const store = writable({ ...DEFAULT });

export const windowManager = {
	subscribe: store.subscribe,
	async updateScreen() {
		const screens = await Channel.instance.getScreens();
		const { visibleFrame } = screens[0]!;
		store.update((state) => {
			state.areaCalculator.setScreens(screens);
			return state;
		});
		Channel.instance.setCurrentWindowFrame(visibleFrame);
	},
	start() {
		this.updateScreen();
		Channel.instance.subscribeWindowManager((event) => {
			({
				mouse_up: () => {
					const { lastPosition, areaCalculator } = get(store);
					if (lastPosition) {
						const frame = areaCalculator.rectFromSnapArea(
							areaCalculator.fromMouseEvent(lastPosition)
						);
						Channel.instance.setWindowPosition({
							id: lastPosition.window_info.id,
							pid: lastPosition.window_info.pid,
							...frame,
						});
					}
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
						state.lastPosition = null;
						return state;
					});
				},
			}[event.event_type]());
		});
		Channel.instance.startWindowManager();
	},
};
