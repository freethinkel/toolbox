<script lang="ts">
	import type { TBPlugin } from '@/modules/plugins/models/plugin';
	import type { Store } from 'effector';

	export let plugins: Store<TBPlugin[]>;

	$: components = (($plugins ?? []) as TBPlugin[]).map((plugin) =>
		plugin.renderOverlay()
	);
</script>

{#each components as component}
	<svelte:component this={component} />
{/each}
