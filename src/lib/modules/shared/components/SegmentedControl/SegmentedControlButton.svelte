<script lang="ts">
	import { getContext } from 'svelte';
	import { CONTEXT_KEY, type SegmentedControlContext } from './context';

	export let value: string;

	const context: SegmentedControlContext = getContext(CONTEXT_KEY);
	const onChange = context.onChange;
	const onControlTapDown = context.onControlTapDown;
	const onControlTapUp = context.onControlTapUp;

	const handleClick = () => {
		onChange(value);
	};
</script>

<button
	data-value={value}
	on:click={handleClick}
	on:mousedown={onControlTapDown}
	on:mouseup={onControlTapUp}
	class="segmented_control__button"
>
	<slot />
</button>

<style>
	button {
		position: relative;
		z-index: 100;
		min-height: 24px;
		flex-grow: 1;
		appearance: none;
		margin: 0;
		padding: 0;
		border: none;
		background: none;
		font-size: inherit;
		color: inherit;
	}
</style>
