<script lang="ts">
	import { WindowManagerStatusbarStore } from '../store/statusbar.store';
	import FancyZones from './FancyZones.svelte';
	import Snapping from './Snapping.svelte';

	const mode = WindowManagerStatusbarStore.$mode.$store;
	const enabled = WindowManagerStatusbarStore.$enabled.$store;
</script>

{#if $enabled}
	{#if $mode === 'fancy_zones'}
		<FancyZones />
	{:else if $mode === 'snapping'}
		<Snapping />
	{/if}
{/if}
