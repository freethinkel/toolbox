<script lang="ts">
	import { createEventDispatcher, setContext } from 'svelte';
	import { CONTEXT_KEY, type SegmentedControlContext } from './context';
	import { writable } from 'svelte/store';

	export let value: string;

	let slotsEl: HTMLElement;
	const dispatch = createEventDispatcher();

	const size = writable({ height: 0, width: 0 });
	const leftOffset = writable(0);
	const scale = writable(1);

	const computeHighlight = (element: HTMLElement) => {
		size.set({
			width: element.clientWidth,
			height: element.clientHeight,
		});
		leftOffset.set(element.offsetLeft);
	};

	const changeScale = (isTapDown: boolean) => scale.set(isTapDown ? 0.9 : 1);

	const onControlTapDown = (newValue: string) => {
		changeScale(true);
	};
	const onControlTapUp = (newValue: string) => {
		changeScale(false);
		if (newValue !== value) {
			dispatch('change', newValue);
		}
	};
	const onChange = (newValue: string) => {
		if (newValue !== value) {
			dispatch('change', newValue);
		}
	};

	setContext(CONTEXT_KEY, {
		onChange,
		onControlTapDown,
		onControlTapUp,
	} satisfies SegmentedControlContext);

	$: {
		if (!value) {
			throw new Error('value is not set');
		}
		if (slotsEl) {
			const children = Array.from(slotsEl.children);
			const currentActive = children.find(
				(node) => node.getAttribute('data-value') === value
			) as HTMLElement | undefined;

			if (currentActive) {
				computeHighlight(currentActive);
			}
		}
	}
</script>

<svelte:body on:mouseup={() => changeScale(false)} />

<div class="wrapper">
	{#if $size.width > 0}
		<div
			class="highlight"
			style:transform={`translateX(${$leftOffset}px) scale(${$scale})`}
			style:width={`${$size.width}px`}
			style:height={`${$size.height}px`}
		/>
	{/if}
	<div class="slots" bind:this={slotsEl}>
		<slot />
	</div>
</div>

<style lang="postcss">
	.wrapper {
		position: relative;
	}

	.slots {
		background-color: var(--color-panel24);
		border-radius: var(--border-radius);
		display: flex;
		padding: 3px;
	}

	.highlight {
		position: absolute;
		top: 3px;
		left: 0;
		width: 100px;
		height: 100%;
		background-color: var(--color-border);
		border-radius: var(--border-radius);
		transition: 0.22s cubic-bezier(0.65, 0, 0.35, 1);
	}
</style>
