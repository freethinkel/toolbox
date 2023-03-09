import type { SvelteComponent } from 'svelte';

export abstract class TBPlugin {
	abstract renderOverlay(): typeof SvelteComponent | void;

	abstract renderStatusbar(): typeof SvelteComponent | void;

	abstract renderSettings(): typeof SvelteComponent | void;
}
