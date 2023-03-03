import { Frame, Position } from '@/modules/shared/models/frame';
import { invoke } from '@tauri-apps/api';

export class NSScreen {
	constructor(public frame: Frame, public visibleFrame: Frame) {}

	static async screenUnderMouse(): Promise<NSScreen> {
		const point: Position = await invoke('nsevent_mouse_location');
		const screens = await this.screens();

		return screens.find((screen) => screen.frame.includesPoint(point));
	}

	static async screens(): Promise<Array<NSScreen>> {
		const screens = await invoke('nsscreen_get_screens');

		return (screens as []).map(
			(screen: any) =>
				new NSScreen(
					new Frame(screen.frame.size, screen.frame.position),
					new Frame(screen.visible_frame.size, screen.visible_frame.position)
				)
		);
	}
}
