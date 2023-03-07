import type { SvelteComponent } from 'svelte';
import SnappingView from './view/Snapping.svelte';
import FancyZonesView from './view/FancyZones.svelte';
import StatusbarView from './view/Statusbar.svelte';
import { TBPlugin } from '../../models/plugin';
import { FancyZonesStore } from './store/fancy-zones.store';

class WindowManagerPlugin extends TBPlugin {
	override renderOverlay(): typeof SvelteComponent {
		return FancyZonesView;
	}

	override renderStatusbar(): typeof SvelteComponent {
		return StatusbarView;
	}
}

export const windowManagerPlugin = new WindowManagerPlugin();
