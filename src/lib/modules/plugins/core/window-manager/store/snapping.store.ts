import type { NSScreen } from '@/modules/cocoa/models/nsscreen';
import { SettingsStore } from '@/modules/settings/store/settings.store';
import { Frame, Position, Size } from '@/modules/shared/models/frame';
import { Alignment } from '@/modules/shared/models/geometry';
import { WindowManagerStore } from '@/modules/window-manager';
import { combine, createStore, sample } from 'effector';
import { ActiveSnapSide } from '../models/active-snap-side';
import { WindowManagerStatusbarStore } from './statusbar.store';

const _snapSides = [
	new ActiveSnapSide({
		alignment: Alignment.topCenter,
		frame: new Frame({ width: 1, height: 1 }, { x: 0, y: 0 }),
	}),
	new ActiveSnapSide({
		alignment: Alignment.centerLeft,
		frame: new Frame({ width: 0.5, height: 1 }, { x: 0, y: 0 }),
	}),
	new ActiveSnapSide({
		alignment: Alignment.centerRight,
		frame: new Frame({ width: 0.5, height: 1 }, { x: 0.5, y: 0 }),
	}),
	new ActiveSnapSide({
		alignment: Alignment.topLeft,
		frame: new Frame({ width: 0.5, height: 0.5 }, { x: 0, y: 0 }),
	}),
	new ActiveSnapSide({
		alignment: Alignment.bottomLeft,
		frame: new Frame({ width: 0.5, height: 0.5 }, { x: 0, y: 0.5 }),
	}),
	new ActiveSnapSide({
		alignment: Alignment.topRight,
		frame: new Frame({ width: 0.5, height: 0.5 }, { x: 0.5, y: 0 }),
	}),
	new ActiveSnapSide({
		alignment: Alignment.bottomRight,
		frame: new Frame({ width: 0.5, height: 0.5 }, { x: 0.5, y: 0.5 }),
	}),
];

const computeAreaFromScreen = ({
	frame,
	gap,
	screen,
}: {
	frame?: Frame;
	screen: NSScreen;
	gap: number;
}): Frame | undefined => {
	if (frame == null || screen == null) {
		return null;
	}
	var gap = gap / 2;
	var screenVisibleFrame = screen.visibleFrame;
	const relativeTop =
		(screen?.visibleFrame.position.y ?? 0) - (screen?.frame.position.y ?? 0);
	const relativeLeft =
		(screen.visibleFrame.position.x ?? 0) - (screen?.frame.position.x ?? 0);

	var newFrame = new Frame(
		{
			width: screenVisibleFrame.size.width - gap * 2,
			height: screenVisibleFrame.size.height - gap * 2,
		},
		{
			x: screenVisibleFrame.position.x - gap,
			y: screenVisibleFrame.position.y - gap,
		}
	);

	return new Frame(
		new Size(
			newFrame.size.width * frame.size.width - gap * 2,
			newFrame.size.height * frame.size.height - gap * 2
		),
		new Position(
			relativeLeft + newFrame.size.width * frame.position.x + gap * 2,
			relativeTop + newFrame.size.height * frame.position.y + gap * 2
		)
	);
};

const $gap = SettingsStore.windowGap.$store;
const $enabled = combine(
	[
		WindowManagerStatusbarStore.$enabled.$store,
		WindowManagerStatusbarStore.$mode.$store,
	],
	([enabled, mode]) => enabled && mode === 'snapping'
);
const $sensitive = createStore(100);
export const $placeholder = createStore<Frame>(null);

sample({
	clock: WindowManagerStore.$draggingPosition,
	filter: $enabled,
	source: {
		currentScreen: WindowManagerStore.$currentCGScreen,
		gap: $gap,
		sensitive: $sensitive,
	},
	fn: ({ currentScreen, gap, sensitive }, point) => {
		if (!point || !currentScreen) {
			return null;
		}

		const area = _snapSides.find((area) => {
			const frame = computeAreaFromScreen({
				frame: area.frame,
				screen: currentScreen,
				gap: gap,
			});
			if (!frame) {
				return false;
			}
			const areaFromScreen = new ActiveSnapSide({
				frame: frame,
				alignment: area.alignment,
			});
			return areaFromScreen.checkDetection({
				screen: currentScreen,
				point: point,
				crop: sensitive,
			});
		});

		return computeAreaFromScreen({
			frame: area?.frame,
			screen: currentScreen,
			gap,
		});
	},
	target: $placeholder,
});

sample({
	clock: WindowManagerStore.setWindowFrameFx,
	filter: $enabled,
	fn: () => null,
	target: $placeholder,
});

sample({
	clock: WindowManagerStore.onDragEnded,
	filter: combine($enabled, $placeholder).map(([enabled, placeholder]) =>
		Boolean(enabled && placeholder)
	),
	source: $placeholder,
	fn: (source, _) => source,
	target: WindowManagerStore.setWindowFrameFx,
});

export const SnappingStore = {
	$placeholder,
};
