import { writable } from 'svelte/store';

const DEFAULT = {
	windowManagerEnabled: false,
	caffeinateEnabled: false,
};

const store = writable({ ...DEFAULT });

export const settingsStore = {
	subscribe: store.subscribe,
	set: store.set,
	update: store.update,
};
