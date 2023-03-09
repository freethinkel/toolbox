import type { SvelteComponent } from 'svelte';
import StatusbarView from './view/Statusbar.svelte';
import { TBPlugin } from '../../models/plugin';

class CaffeinatePlugin extends TBPlugin {
	override renderOverlay() {}

	override renderStatusbar(): typeof SvelteComponent {
		return StatusbarView;
	}

	override renderSettings() {}
}

export const caffeinatePlugin = new CaffeinatePlugin();
