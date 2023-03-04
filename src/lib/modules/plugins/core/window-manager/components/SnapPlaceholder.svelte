<script lang="ts">
	import type { Frame } from '@/modules/shared/models/frame';
	import { fade } from 'svelte/transition';

	export let frame: Frame;
</script>

{#if frame}
	<div
		transition:fade
		class="rect"
		style:--width={`${frame.size.width}px`}
		style:--height={`${frame.size.height}px`}
		style:--x={`${frame.position.x}px`}
		style:--y={`${frame.position.y}px`}
	/>
{/if}

<style lang="postcss">
	.rect {
		width: var(--width);
		height: var(--height);
		position: fixed;
		left: var(--x);
		top: var(--y);
		border-radius: var(--border-radius);
		border: 2px solid var(--color-accent);
		&::before {
			content: '';
			position: absolute;
			width: 100%;
			height: 100%;
			background-color: var(--color-accent);
			opacity: 0.12;
		}
	}
</style>
