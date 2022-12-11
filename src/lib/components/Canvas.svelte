<script lang="ts">
	import Rect from './Rect.svelte';
	import { windowManager } from '../store/window-manager';

	$: calc = $windowManager.areaCalculator;

	$: area = calc.fromMouseEvent($windowManager.lastPosition);
	$: rect = calc.rectFromSnapArea(area);
</script>

<span>{area || 'NO'}</span>

<div class="canvas">
	{#if rect}
		<Rect
			height={rect.size.height}
			width={rect.size.width}
			x={rect.position.x}
			y={rect.position.y}
		/>
	{/if}
</div>

<style>
	.canvas {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
	}
	span {
		color: white;
		font-size: 5rem;
	}
</style>
