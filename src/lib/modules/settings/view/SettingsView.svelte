<script>
	import Button from '@/modules/shared/components/Button.svelte';
	import FormGroup from '@/modules/shared/components/FormGroup.svelte';
	import RangeSlider from '@/modules/shared/components/RangeSlider.svelte';
</script>

<div class="settings">
	<div data-tauri-drag-region class="safearea" />
	<div class="wrapper">
		<h1>Settings</h1>
		<FormGroup>
			<span slot="label">Window gap</span>
			<RangeSlider step={10} />
		</FormGroup>
		<div class="footer">
			<Button kind="primary">Save</Button>
		</div>
	</div>
</div>

<style>
	.safearea {
		height: 30px;
		width: 100%;
	}
	.wrapper {
		padding: 12px;
	}
	.settings {
		background: var(--color-background);
		height: 100%;
		min-height: inherit;
	}
	h1 {
		margin-bottom: 12px;
	}
	.footer {
		bottom: 0;
		position: fixed;
		left: 0;
		width: 100%;
		display: flex;
		padding: 10px;
		justify-content: flex-end;
	}
</style>
