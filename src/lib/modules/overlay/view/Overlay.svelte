<script lang="ts">
	import type { TBPlugin } from '@/modules/plugins/models/plugin';
	import type { Store } from 'effector';
	import type { SvelteComponent } from 'svelte';

	export let plugins: Store<TBPlugin[]>;

	$: components = (($plugins ?? []) as TBPlugin[])
		.map((plugin) => plugin.renderOverlay())
		.filter(Boolean) as typeof SvelteComponent[];
</script>

{#each components as component}
	<svelte:component this={component} />
{/each}
