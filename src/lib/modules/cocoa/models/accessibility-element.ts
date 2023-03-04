import { Frame } from '@/modules/shared/models/frame';
import { invoke } from '@tauri-apps/api';

export class AccessibilityElement {
	windowId: number;
	pid: number;
	frame: Frame;

	static async getUnderMouse(): Promise<AccessibilityElement | null> {
		const result: any = await invoke('accessibility_element_under_cursor');
		const accessibilityElement = new AccessibilityElement();

		accessibilityElement.frame = new Frame(
			result.frame.size,
			result.frame.position
		);
		accessibilityElement.windowId = (result as any).window_id;
		accessibilityElement.pid = (result as any).pid;
		return accessibilityElement;
	}

	async setFrame(frame: Frame): Promise<void> {
		await invoke('accessibility_element_set_frame', {
			windowInfo: {
				window_id: this.windowId,
				pid: this.pid,
				frame: frame,
			},
		});
	}
}
