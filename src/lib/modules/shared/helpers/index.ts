import { emit, listen } from '@tauri-apps/api/event';

export const wait = (ms: number) => new Promise((rslv) => setTimeout(rslv, ms));

export const emitAll = <T>(key: string, payload: T) => {
	emit(key, payload);
};

export const listenAll = <T>(key: string, handler: (payload: T) => void) => {
	// listen(key, () =)
};
