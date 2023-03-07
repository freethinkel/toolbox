<footer>
	<slot name="left" />
	<slot name="right" />
</footer>

<style>
	footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: var(--color-panel24);
		border-top: 1px solid var(--color-border);
		padding: 2px 10px 4px;
	}
</style>
