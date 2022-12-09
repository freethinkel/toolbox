<script lang="ts">
	export let x = 0;
	export let y = 0;
	export let height = 100;
	export let width = 100;
</script>

<div
	style:transform={`translate3d(${x}px, ${y}px, 0)`}
	style:width={width + 'px'}
	style:height={height + 'px'}
	class="wrapper"
/>

<style>
	.wrapper {
		position: fixed;
		top: 0;
		left: 0;
		border: var(--border-width) solid var(--color-accent);
		border-radius: var(--border-radius);
		overflow: hidden;
	}
	.wrapper::before {
		content: '';
		position: absolute;
		opacity: 0.1;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: var(--color-accent);
	}
</style>
