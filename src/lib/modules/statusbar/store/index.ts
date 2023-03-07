import { createEffect, createEvent, sample } from 'effector';
import { listen } from '@tauri-apps/api/event';
import type { Position } from '@/modules/shared/models/frame';
import {
	appWindow,
	getAll,
	PhysicalPosition,
	WebviewWindow,
} from '@tauri-apps/api/window';
import { NSWindow } from '@/modules/cocoa/models/nswindow';
import { wait } from '@/modules/shared/helpers';

const onSystemTrayButtonClick = createEvent<Position>();
const onSettingsClick = createEvent();

const startStatusbarFx = createEffect(() => {
	listen('on_statusbar_click', ({ payload }) => {
		onSystemTrayButtonClick(payload as Position);
	});
	appWindow.onFocusChanged((event) => {
		if (!event.payload) {
			appWindow.hide();
		}
	});
});

const openSettingsWindowFx = createEffect(async () => {
	const existWindow = getAll().find((window) => window.label === 'settings');
	if (existWindow) {
		await existWindow.setFocus();
		return;
	}
	const settings = new WebviewWindow('settings', {
		titleBarStyle: 'transparent',
		title: '',
		transparent: true,
		resizable: false,
		fullscreen: false,
		maximized: false,
		width: 450,
		height: 300,
	});
	// console.log(settings);
	await wait(100);
	await NSWindow.setDecorations(settings.label);
});

onSystemTrayButtonClick.watch(async (position) => {
	const isVisible = await appWindow.isVisible();
	if (isVisible) {
		appWindow.hide();
	} else {
		const newPosition = new PhysicalPosition(position.x, position.y);
		await appWindow.setPosition(newPosition);
		appWindow.show();
		appWindow.setFocus();
	}
});

sample({
	clock: onSettingsClick,
	target: openSettingsWindowFx,
});

export const StatusbarStore = {
	startStatusbarFx,
	onSettingsClick,
};
