<script lang="ts">
	import Rect from './Rect.svelte';
	import { windowManager } from '../store/window-manager';

	$: point = $windowManager.lastPosition?.point;
</script>

<div class="canvas">
	<Rect x={point?.x} y={point?.y - 200} />
</div>

<style>
	.canvas {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
	}
</style>
