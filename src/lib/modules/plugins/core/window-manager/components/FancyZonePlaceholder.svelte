<script lang="ts">
	import type { Frame } from '@/modules/shared/models/frame';
	import { fade } from 'svelte/transition';

	export let frame: Frame;
</script>

{#if frame}
	<div
		transition:fade={{ duration: 150 }}
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
		top: 0;
		left: 0;
		transform: translate(var(--x), var(--y));
		transition: 0.1s ease-out transform, 0.1s ease-out height,
			0.1s ease-out width;
		border-radius: var(--border-radius);
		backdrop-filter: blur(20px);
		background-color: var(--color-accent12);
		animation: 10s fixBlur infinite alternate;
	}

	/* fix rerender blur */
	@keyframes fixBlur {
		0% {
			opacity: 0.99999;
		}
		100% {
			opacity: 1;
		}
	}
</style>
