import type { ChannelMouseEvent } from '../models/channel';
import type { Frame, Screen } from '../models/window';

export enum SnapArea {
	left = 'left',
	right = 'right',
	full = 'full',
	topLeft = 'topLeft',
	topRight = 'topRight',
	bottomLeft = 'bottomLeft',
	bottomRight = 'bottomRight',
}

export class AreaCalculator {
	private screens: Screen[];

	constructor(screens: Screen[]) {
		this.screens = screens;
	}

	setScreens(screens: Screen[]) {
		this.screens = screens;
	}

	private getCurrentScreen(): Screen {
		return this.screens[0];
	}

	getActivatedSize() {
		const screen = this.getCurrentScreen();
		const sensitive = 0.1;
		if (screen.visibleFrame.size.width > screen.visibleFrame.size.height) {
			return sensitive * screen.visibleFrame.size.height;
		}
		return sensitive * screen.visibleFrame.size.width;
	}

	rectFromSnapArea(area?: SnapArea): Frame | undefined {
		if (!area) {
			return;
		}

		const screen = this.getCurrentScreen();
		const map: Record<SnapArea, Frame> = {
			[SnapArea.bottomRight]: {
				position: {
					x: screen.visibleFrame.size.width / 2,
					y: screen.visibleFrame.size.height / 2,
				},
				size: {
					width: screen.visibleFrame.size.width / 2,
					height: screen.visibleFrame.size.height / 2,
				},
			},
			[SnapArea.left]: {
				size: {
					width: 0,
					height: 0,
				},
				position: {
					x: 0,
					y: 0,
				},
			},
			[SnapArea.right]: {
				size: {
					width: 0,
					height: 0,
				},
				position: {
					x: 0,
					y: 0,
				},
			},
			[SnapArea.full]: {
				size: {
					width: 0,
					height: 0,
				},
				position: {
					x: 0,
					y: 0,
				},
			},
			[SnapArea.topLeft]: {
				size: {
					width: 0,
					height: 0,
				},
				position: {
					x: 0,
					y: 0,
				},
			},
			[SnapArea.topRight]: {
				size: {
					width: 0,
					height: 0,
				},
				position: {
					x: 0,
					y: 0,
				},
			},
			[SnapArea.bottomLeft]: {
				size: {
					width: 0,
					height: 0,
				},
				position: {
					x: 0,
					y: 0,
				},
			},
		};

		return map[area];
	}

	fromMouseEvent(event: ChannelMouseEvent): SnapArea | undefined {
		if (!event) {
			return;
		}
		const screen = this.getCurrentScreen();
		const sensitive = this.getActivatedSize();

		if (
			event.point.x >
				screen.visibleFrame.position.x +
					(screen.visibleFrame.size.width - sensitive) &&
			event.point.y >
				screen.visibleFrame.position.y +
					(screen.visibleFrame.size.height - sensitive)
		) {
			return SnapArea.bottomRight;
		}
	}
}
