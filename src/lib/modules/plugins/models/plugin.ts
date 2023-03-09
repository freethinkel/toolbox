import type { SvelteComponent } from 'svelte';

export abstract class TBPlugin {
	abstract renderOverlay(): typeof SvelteComponent;

	abstract renderStatusbar(): typeof SvelteComponent;

	abstract renderSettings(): typeof SvelteComponent | void;
}
