<script>
	import { SegmentedControl } from '@/modules/shared/components/SegmentedControl';
	import Switch from '@/modules/shared/components/Switch.svelte';
	import { emit, listen } from '@tauri-apps/api/event';
	import { writable } from 'svelte/store';
	import { slide } from 'svelte/transition';
	import { WindowManagerStatusbarStore } from '../store/statusbar.store';

	const enabled = WindowManagerStatusbarStore.$enabled.$store;
	const setEnabled = WindowManagerStatusbarStore.$enabled.setValue;
	const mode = WindowManagerStatusbarStore.$mode.$store;
	const setMode = WindowManagerStatusbarStore.$mode.setValue;
</script>

<div>
	<Switch checked={$enabled} on:change={({ detail }) => setEnabled(detail)}
		>Window manager</Switch
	>
	{#if $enabled}
		<div class="segmented-control" transition:slide>
			<SegmentedControl
				value={$mode}
				on:change={({ detail }) => setMode(detail)}
			>
				<SegmentedControl.SegmentedButton value="snapping">
					Snapping
				</SegmentedControl.SegmentedButton>
				<SegmentedControl.SegmentedButton value="fancy_zones">
					Fancy zones
				</SegmentedControl.SegmentedButton>
			</SegmentedControl>
		</div>
	{/if}
</div>

<style>
	.segmented-control {
		padding-top: 10px;
	}
</style>
