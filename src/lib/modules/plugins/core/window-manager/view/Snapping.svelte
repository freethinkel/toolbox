<script>
	import SnapPlaceholder from '../components/SnapPlaceholder.svelte';
	import { SnappingStore } from '../store/snapping.store';

	const frame = SnappingStore.$placeholder;
</script>

<SnapPlaceholder frame={$frame} />
