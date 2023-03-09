import { emit, listen } from '@tauri-apps/api/event';
import { appWindow } from '@tauri-apps/api/window';
import { createEffect, createEvent, createStore, sample } from 'effector';

export const createSharedStore = <T>(
	name: string,
	label: string,
	initialValue?: T
) => {
	const key = `toolbox_window_channel__${name}`;
	if (appWindow.label !== label) {
		listen(key, ({ payload }) => {
			setValue(payload as T);
		});
	}
	const broadcastValueFx = createEffect((value: T) => {
		if (appWindow.label === label) {
			emit(key, value);
			localStorage.setItem(key, JSON.stringify(value));
		}
	});
	const setValue = createEvent<T>(key);
	const $store = createStore<T>(initialValue);

	sample({
		clock: $store,
		target: broadcastValueFx,
	});

	sample({
		clock: setValue,
		target: $store,
	});

	try {
		if (localStorage.getItem(key)) {
			setValue(JSON.parse(localStorage.getItem(key)) as T);
		}
	} catch (_) {}

	return {
		$store,
		setValue,
	};
};
