<script lang="ts">
	import type { Store } from 'effector';
	import type { TBPlugin } from '@/modules/plugins/models/plugin';

	export let plugins: Store<Array<TBPlugin>>;

	$: components = (($plugins ?? []) as TBPlugin[]).map((plugin) =>
		plugin.renderStatusbar()
	);
	$: console.log(components);
</script>

<div class="wrapper">
	{#each components as component}
		<svelte:component this={component} />
	{/each}
</div>

<style>
	.wrapper {
		padding: 8px;
	}
</style>
