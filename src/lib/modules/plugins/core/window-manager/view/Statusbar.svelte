<script>
	import { SegmentedControl } from '@/modules/shared/components/SegmentedControl';
	import Switch from '@/modules/shared/components/Switch.svelte';
	import { writable } from 'svelte/store';
	import { slide } from 'svelte/transition';

	const windowManagerEnabled = writable(false);
	let zone = writable('fancy_zones');
</script>

<div>
	<Switch
		checked={$windowManagerEnabled}
		on:change={({ detail }) => ($windowManagerEnabled = detail)}
		>Window manager</Switch
	>
	{#if $windowManagerEnabled}
		<div class="segmented-control" transition:slide>
			<SegmentedControl
				value={$zone}
				on:change={({ detail }) => ($zone = detail)}
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
