<script>
	import Button from '@/modules/shared/components/Button.svelte';
	import FormGroup from '@/modules/shared/components/FormGroup.svelte';
	import RangeSlider from '@/modules/shared/components/RangeSlider.svelte';
	import { SettingsStore } from '../store/settings.store';

	const windowGap = SettingsStore.windowGap.$store;

	$: console.log($windowGap);
</script>

<div class="settings">
	<div data-tauri-drag-region class="safearea" />
	<div class="wrapper">
		<h1>Settings</h1>
		<FormGroup>
			<span slot="label">Window gap</span>
			<RangeSlider
				on:change={({ detail }) =>
					SettingsStore.windowGap.setValue(detail * 100)}
				step={10}
				value={$windowGap / 100}
			/>
			<div slot="hint">
				<span>{$windowGap}</span>
			</div>
		</FormGroup>
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
