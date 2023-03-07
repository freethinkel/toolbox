<script lang="ts">
	import type { Store } from 'effector';
	import type { TBPlugin } from '@/modules/plugins/models/plugin';
	import Footer from '../components/Footer.svelte';
	import Button from '@/modules/shared/components/Button.svelte';
	import { StatusbarStore } from '../store';

	export let plugins: Store<Array<TBPlugin>>;

	$: components = (($plugins ?? []) as TBPlugin[]).map((plugin) =>
		plugin.renderStatusbar()
	);
	$: console.log(components);
</script>

<div class="wrapper">
	<div class="plugins">
		{#each components as component}
			<svelte:component this={component} />
		{/each}
	</div>

	<div class="footer">
		<Footer>
			<div slot="left">
				<Button on:click={() => StatusbarStore.onSettingsClick()}
					>Settings</Button
				>
			</div>
			<div slot="right">
				<Button>⌘ Q</Button>
			</div>
		</Footer>
	</div>
</div>

<style>
	.wrapper {
		height: 100%;
		min-height: inherit;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.plugins {
		padding: 8px;
	}
</style>
