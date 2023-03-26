import { createSharedStore } from '@/modules/shared/helpers/store';
import { createEffect, sample } from 'effector';
import { Command } from '@tauri-apps/api/shell';
import { appWindow } from '@tauri-apps/api/window';

const changeCaffeinateFx = createEffect(async (state: boolean) => {
	if (appWindow.label !== 'main') {
		return;
	}

	const start = async () => {
		await stop();
		const command = new Command('caffeinate', ['-di']);

		await command.spawn();
	};

	const stop = async () => {
		const command = new Command('killall', ['caffeinate']);
		await command.execute();
	};

	if (state) {
		await start();
	} else {
		await stop();
	}
});

const $enabled = createSharedStore('caffeinate_enabled', 'statusbar', false);

sample({
	clock: $enabled.setValue,
	target: changeCaffeinateFx,
});

export const CaffeinateStore = {
	$enabled,
	changeCaffeinateFx,
};
