<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let checked = false;

	const dispatch = createEventDispatcher();

	const handleChange = (event: Event) => {
		const input = event.target as HTMLInputElement;
		dispatch('change', input.checked);
		input.checked = checked;
	};
</script>

<label>
	<input type="checkbox" {checked} on:change={handleChange} />

	<slot />
</label>

<style lang="postcss">
	label {
		display: flex;
		align-items: center;
		cursor: pointer;
	}
	input {
		margin: 0 8px 0px 0px;
	}
</style>
