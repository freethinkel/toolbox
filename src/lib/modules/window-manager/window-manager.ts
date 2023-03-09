import type { NSScreen } from '../cocoa/models/nsscreen';
import { ScreensStore } from './screens';

import { Position, type Frame } from '../shared/models/frame';
import { NSWindow } from '../cocoa/models/nswindow';
import {
	attach,
	combine,
	createEffect,
	createEvent,
	createStore,
	sample,
} from 'effector';
import { NSEvent, NSEventType } from '../cocoa/models/nsevent';
import { AccessibilityElement } from '../cocoa/models/accessibility-element';
import { emit } from '@tauri-apps/api/event';

type MouseEvent<T extends 'down' | 'up' | 'dragged'> = {
	type: T;
	position: Position;
};

export const onMouseDown = createEvent<MouseEvent<'down'>>();
export const onMouseDragged = createEvent<MouseEvent<'dragged'>>();
export const onMouseUp = createEvent<MouseEvent<'up'>>();
export const onDragStarted = createEvent('onDragStarted');
export const onDragEnded = createEvent('onDragEnded');

const startWindowManagerListenFx = createEffect(() => {
	emit('accessibility_element_check_permission');
	NSEvent.addGlobalMonitor(
		[
			NSEventType.leftMouseDownMask,
			NSEventType.leftMouseDraggedMask,
			NSEventType.leftMouseUpMask,
		],
		(event) => {
			switch (event.type) {
				case NSEventType.leftMouseDownMask:
					onMouseDown({ type: 'down', position: event.position });
					break;
				case NSEventType.leftMouseUpMask:
					onMouseUp({ type: 'up', position: event.position });
					break;
				case NSEventType.leftMouseDraggedMask:
					onMouseDragged({ type: 'dragged', position: event.position });
					break;
			}
		}
	);
});

const stopWindowManagerListenFx = createEffect(async () => {
	await NSEvent.removeMonitor();
});

const getCurrentAccessibilityElementFx = createEffect(() =>
	AccessibilityElement.getUnderMouse()
);

const setAccessibilityElementFrameFx = createEffect(
	async ({
		frame,
		element,
	}: {
		element: AccessibilityElement;
		frame: Frame;
	}) => {
		element.setFrame(frame);
	}
);

const $mousePosition = createStore<Position | null>(null)
	.on(onMouseDown, (_state, event) => event.position)
	.on(onMouseDragged, (_state, event) => event.position)
	.on(onMouseUp, () => null);

const $currentScreen = createStore<NSScreen>(null, {
	updateFilter: (update, current) =>
		!(current && update?.visibleFrame?.compare(current?.visibleFrame)),
})
	.on(ScreensStore.getScreensFx.doneData, (_, screens) => screens[0])
	.on($mousePosition, (prevScreen, position) => {
		const screens = ScreensStore.$screens.getState();
		const mainScreen = screens[0];

		if (!position || !mainScreen) {
			return prevScreen;
		}
		const findedScreen = screens.find((screen) =>
			ScreensStore.screenToCgScreen(screen).frame.includesPoint(position)
		);
		return findedScreen ?? prevScreen ?? mainScreen;
	});

const $currentCGScreen = $currentScreen.map(
	(state) => state && ScreensStore.screenToCgScreen(state)
);

const $onMouseDownWindow = createStore<AccessibilityElement | null>(null);
const $currentWindow = createStore<AccessibilityElement | null>(null);

const $isDragging = createStore(false)
	.on(onDragStarted, () => true)
	.on(onDragEnded, () => false);
const $draggingPosition = createStore<Position | null>(null);
const $draggingPositionFromScreen = combine([
	$currentCGScreen,
	$draggingPosition,
]).map(([screen, offset]) => {
	if (offset != null) {
		var offsetPosition = screen?.frame.position;
		return new Position(
			offset.x - offsetPosition.x,
			offset.y - offsetPosition.y
		);
	}
	return null;
});

const setWindowFrameFx = attach({
	effect: setAccessibilityElementFrameFx,
	source: $currentWindow,
	mapParams: (frame: Frame, window) => ({ frame, element: window }),
});

sample({
	clock: onMouseDragged,
	source: [$onMouseDownWindow, $currentWindow],
	filter([prev, curr], _) {
		const isDragging = $isDragging.getState();
		if (isDragging || !prev || !curr) return false;

		return (
			prev.frame.compareSize(curr.frame.size) &&
			!prev.frame.comparePosition(curr.frame.position)
		);
	},
	target: onDragStarted,
});

sample({
	clock: getCurrentAccessibilityElementFx.doneData,
	source: $onMouseDownWindow,
	fn: (_, clockData) => clockData,
	filter: (data) => !data,
	target: $onMouseDownWindow,
});

sample({
	clock: onMouseUp,
	fn: () => null,
	target: $onMouseDownWindow,
});

sample({
	clock: onMouseUp,
	filter: $isDragging,
	fn: () => false,
	target: onDragEnded,
});

sample({
	clock: onMouseDown,
	target: [getCurrentAccessibilityElementFx, ScreensStore.getScreensFx],
});

sample({
	clock: getCurrentAccessibilityElementFx.doneData,
	target: $currentWindow,
});

sample({
	clock: onMouseDragged,
	filter: $isDragging.map((s) => !s),
	target: getCurrentAccessibilityElementFx,
});

sample({
	clock: $mousePosition,
	filter: $isDragging,
	target: $draggingPosition,
});

$currentScreen.watch((screen) => {
	if (screen) {
		NSWindow.setFrame(screen.frame);
	}
});

export const WindowManagerStore = {
	$currentScreen,
	$currentCGScreen,
	$currentWindow,
	$draggingPosition,
	$draggingPositionFromScreen,
	$isDragging,
	onDragEnded,
	onDragStarted,
	setWindowFrameFx,
	startWindowManagerListenFx,
	stopWindowManagerListenFx,
};
