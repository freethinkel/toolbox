<script lang="ts">
	import type { TBPlugin } from '@/modules/plugins/models/plugin';
	import FormGroup from '@/modules/shared/components/FormGroup.svelte';
	import RangeSlider from '@/modules/shared/components/RangeSlider.svelte';
	import type { Store } from 'effector';
	import type { SvelteComponent } from 'svelte';
	import { SettingsStore } from '../store/settings.store';

	export let plugins: Store<Array<TBPlugin>>;

	const windowGap = SettingsStore.windowGap.$store;

	$: components = (($plugins ?? []) as TBPlugin[])
		.map((plugin) => plugin.renderSettings())
		.filter(Boolean) as typeof SvelteComponent[];
</script>

<div class="settings">
	<div data-tauri-drag-region class="safearea" />
	<div class="group">
		<h1>Settings</h1>
		<div class="group__label">General</div>
		<div class="group__inner">
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

	<div class="plugins">
		{#each components as plugin}
			<div class="group">
				<div class="group__label">Window manager</div>
				<div class="group__inner">
					<svelte:component this={plugin} />
				</div>
			</div>
		{/each}
	</div>
</div>

<style lang="postcss">
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
		margin-bottom: 24px;
	}
	.group {
		padding: 12px;
		&__inner {
			background-color: var(--color-panel24);
			border-radius: var(--border-radius);
			padding: 4px;
		}
		&__label {
			font-size: 0.9rem;
			margin-bottom: 6px;
		}
	}
</style>
