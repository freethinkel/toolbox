import { createStore, createEffect } from 'effector';
import { NSScreen } from '@/modules/cocoa/models/nsscreen';
import { Frame, Position } from '../shared/models/frame';

const frameToCgFrame = (frame: Frame): Frame => {
	const screens = $screens.getState();
	const mainScreen = screens[0];

	const mainScreenFrame = mainScreen?.frame;
	const point: Position = {
		x: frame.position.x,
		y:
			mainScreenFrame.position.y -
			frame.position.y -
			frame.size.height +
			mainScreenFrame.size.height,
	};

	return new Frame(frame.size, point);
};

const screenToCgScreen = (screen: NSScreen): NSScreen => {
	return new NSScreen(
		frameToCgFrame(screen.frame),
		frameToCgFrame(screen.visibleFrame)
	);
};

const getScreensFx = createEffect(async () => {
	return await NSScreen.screens();
});

const $screens = createStore<NSScreen[]>([]).on(
	getScreensFx.doneData,
	(_store, screens) => screens
);

export const ScreensStore = {
	screenToCgScreen,
	$screens,
	getScreensFx,
};
