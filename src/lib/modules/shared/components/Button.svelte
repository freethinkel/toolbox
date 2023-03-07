<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let type: 'button' | 'submit' = 'button';
	export let kind: 'text' | 'primary' | 'outline' = 'text';
	export let disabled = false;

	const dispatch = createEventDispatcher();
</script>

<button
	{type}
	{disabled}
	on:click={(event) => dispatch('click', event)}
	class:kind__outline={kind === 'outline'}
	class:kind__primary={kind === 'primary'}
>
	<slot />
</button>

<style lang="postcss">
	button {
		appearance: none;
		cursor: pointer;
		font-size: 1rem;
		border: none;
		background: none;
		padding: 0;
		margin: 0;
		color: inherit;
		transition: var(--transition);
		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}
	.kind {
		&__text {
			&:hover {
				opacity: 0.8;
			}
		}
		&__primary {
			background-color: var(--color-accent);
			padding: 0 12px;
			height: 28px;
			display: flex;
			align-items: center;
			font-weight: 600;
			color: var(--color-title);
			border-radius: var(--border-radius);
			&:hover {
				transform: scale(0.97);
			}
			&:active {
				transform: scale(0.9);
			}
		}
	}
</style>
