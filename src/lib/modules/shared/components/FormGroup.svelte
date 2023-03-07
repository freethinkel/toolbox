<div class="label">
	<div class="label">
		<slot name="label" />
	</div>
	<slot />
	<div class="hint">
		<slot name="hint" />
	</div>
</div>

<style lang="postcss">
	.label {
		font-size: 0.8rem;
		color: var(--color-text);
	}
</style>
