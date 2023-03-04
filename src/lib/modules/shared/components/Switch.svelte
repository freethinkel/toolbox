<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let checked = false;
	const dispatch = createEventDispatcher();

	const onChange = (event: Event) => {
		const input = event.target as HTMLInputElement;
		dispatch('change', input.checked);
		input.checked = checked;
	};

	const size = 20;
	$: wrapperSize = size * 1.9;
</script>

<label
	style:--size={`${size}px`}
	style:--wrapper-size={`${wrapperSize}px`}
	class:active={true}
>
	<div class="inner">
		<slot />
	</div>

	<input
		{checked}
		on:change={onChange}
		class="visually-hidden"
		type="checkbox"
	/>
	<div class="toggle">
		<div class="toggle__circle" />
	</div>
</label>

<style lang="postcss">
	label {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 8px;
		--transition: 0.1s;
	}

	.inner {
		flex-grow: 1;
	}

	.toggle {
		display: flex;
		width: var(--wrapper-size);
		border: 1px solid var(--color-border);
		border-radius: 10em;
		transition: var(--transition);

		&__circle {
			height: var(--size);
			width: var(--size);
			background: #cbcbcb;
			border: 1px solid var(--color-border);
			transition: var(--transition);
			border-radius: 10em;
		}
	}

	input:checked + .toggle .toggle__circle {
		transform: translateX(calc(var(--wrapper-size) - var(--size) - 2px));
		background: #fff;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
	}
	input:checked + .toggle {
		background-color: var(--color-accent);
	}
</style>
