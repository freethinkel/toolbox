import type { SvelteComponent } from 'svelte';
import OverlayView from './view/Overlay.svelte';
import StatusbarView from './view/Statusbar.svelte';
import SettingsView from './view/Settings.svelte';
import { TBPlugin } from '../../models/plugin';

class WindowManagerPlugin extends TBPlugin {
	name = "Window manager"
	override renderOverlay(): typeof SvelteComponent {
		return OverlayView;
	}

	override renderStatusbar(): typeof SvelteComponent {
		return StatusbarView;
	}

	override renderSettings() {
		return SettingsView;
	}
}

export const windowManagerPlugin = new WindowManagerPlugin();
