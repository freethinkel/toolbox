import type { SvelteComponent } from 'svelte';
import OverlayView from './view/Overlay.svelte';
import StatusbarView from './view/Statusbar.svelte';
import { TBPlugin } from '../../models/plugin';

class WindowManagerPlugin extends TBPlugin {
	override renderOverlay(): typeof SvelteComponent {
		return OverlayView;
	}

	override renderStatusbar(): typeof SvelteComponent {
		return StatusbarView;
	}
}

export const windowManagerPlugin = new WindowManagerPlugin();