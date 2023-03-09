<script>
	import Checkbox from '@/modules/shared/components/Checkbox.svelte';
	import { WindowManagerSettingsStore } from '../store/settings.store';

	const showFancyZonesPlaceholder =
		WindowManagerSettingsStore.$showFancyZonesPlaceholder.$store;
	const setShowFancyZonesPlaceholder =
		WindowManagerSettingsStore.$showFancyZonesPlaceholder.setValue;
</script>

<div class="wrapper">
	<Checkbox
		checked={$showFancyZonesPlaceholder}
		on:change={({ detail }) => setShowFancyZonesPlaceholder(detail)}
		>Enable fancy zones placeholder</Checkbox
	>
</div>
