<script>
	import { SegmentedControl } from '@/modules/shared/components/SegmentedControl';
	import Switch from '@/modules/shared/components/Switch.svelte';
	import { writable } from 'svelte/store';

	let zone = writable('fancy_zones');
</script>

<div>
	<Switch checked>Window manager</Switch>
	<SegmentedControl value={$zone} on:change={({ detail }) => ($zone = detail)}>
		<SegmentedControl.SegmentedButton value="snapping">
			Snapping
		</SegmentedControl.SegmentedButton>
		<SegmentedControl.SegmentedButton value="fancy_zones">
			Fancy zones
		</SegmentedControl.SegmentedButton>
	</SegmentedControl>
</div>
