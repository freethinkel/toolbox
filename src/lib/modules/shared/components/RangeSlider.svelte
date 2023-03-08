<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let value = 0;
	export let step = 1;

	let wrapperRef: HTMLDivElement;
	let offsetLeft = 0;
	const size = 20;

	$: {
		offsetLeft = value;
	}

	const dispatch = createEventDispatcher();
	const clamp = (number: number, min: number, max: number) =>
		Math.min(Math.max(number, min), max);

	const onDrag = (event: MouseEvent) => {
		const wrapperRect = wrapperRef.getBoundingClientRect();
		const value =
			clamp(
				event.clientX - (wrapperRect.left + size / 2),
				0,
				wrapperRect.width - size
			) /
			(wrapperRect.width - size);

		offsetLeft = Math.round(value * (100 / step)) / (100 / step);
		dispatch('change', offsetLeft);
	};
	const listenDragging = () => {
		const onMouseUp = () => {
			unlistenDragging();
			document.removeEventListener('mouseup', onMouseUp);
		};
		document.addEventListener('mouseup', onMouseUp);
		document.addEventListener('mousemove', onDrag);
	};
	const unlistenDragging = () => {
		document.removeEventListener('mousemove', onDrag);
	};
	const onMouseDown = () => {
		listenDragging();
	};
</script>

<div
	class="wrapper"
	bind:this={wrapperRef}
	style:--size={`${size}px`}
	style:--offset-left={`${offsetLeft * 100}%`}
>
	<div class="line" />
	<div class="line__active" />
	<div class="thumb__wrapper">
		<button
			tabindex="0"
			class="thumb"
			on:mousedown={onMouseDown}
			type="button"
		/>
	</div>
</div>

<style lang="postcss">
	.wrapper {
		display: flex;
		width: 100%;
		height: var(--size);
		position: relative;
	}
	.line {
		height: 4px;
		width: 100%;
		top: 50%;
		border-radius: var(--size);
		transform: translateY(-50%);
		background-color: var(--color-panel50);
		position: absolute;
	}
	.line__active {
		height: 4px;
		width: var(--offset-left);
		top: 50%;
		border-radius: var(--size);
		transform: translateY(-50%);
		position: absolute;
		background-color: var(--color-accent);
	}
	.thumb__wrapper {
		position: absolute;
		left: 0;
		width: calc(100% - var(--size));
		transform: translateX(var(--offset-left));
	}
	.thumb {
		appearance: none;
		border: 1px solid var(--color-border);
		padding: 0;
		height: var(--size);
		width: var(--size);
		min-width: var(--size);
		border-radius: var(--size);
		background-color: var(--color-accent);
		box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.12), 0 8px 8px 0 rgba(0, 0, 0, 0.12);
		outline: none;
		transition: 0.1s ease-out transform;
		&:active {
			transform: scale(1.2);
		}
	}
</style>
