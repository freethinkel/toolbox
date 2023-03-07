<script lang="ts">
	import type { Frame } from '@/modules/shared/models/frame';

	export let frame: Frame;
	export let gap = 3;
	export let isActive = false;

	const top = frame.position.y + gap / 2;
	const left = frame.position.x + gap / 2;
	const width = frame.size.width - gap;
	const height = frame.size.height - gap;
</script>

<div
	class="wrapper"
	class:active={isActive}
	style:--left={`${left}px`}
	style:--top={`${top}px`}
	style:--height={`${height}px`}
	style:--width={`${width}px`}
/>

<style lang="postcss">
	.wrapper {
		--border: var(--color-panel);
		--background: var(--color-panel50);
		position: absolute;
		height: var(--height);
		width: var(--width);
		left: var(--left);
		top: var(--top);
		border: 1px solid var(--border);
		background-color: var(--background);
		border-radius: 6px;
		overflow: hidden;
		transition: 0.1s ease-out;
	}
	.active {
		--border: var(--color-accent);
		--background: var(--color-accent50);
	}
</style>
