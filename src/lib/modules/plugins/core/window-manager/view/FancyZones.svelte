<script lang="ts">
	import { Frame, type Size } from '@/modules/shared/models/frame';
	import { WindowManagerStore } from '@/modules/window-manager';
	import FancyZonePlaceholder from '../components/FancyZonePlaceholder.svelte';
	import FancyZoneRect from '../components/FancyZoneRect.svelte';
	import { FancyZonesStore } from '../store/fancy-zones.store';

	const zones = FancyZonesStore.$zones;
	const activeZone = FancyZonesStore.$activeZone;
	const isDraggingTop = FancyZonesStore.$isDraggingTop;
	const isDragging = WindowManagerStore.$isDragging;
	const activeTop = FancyZonesStore.$activeTop;
	const groupSize = FancyZonesStore.SETTINGS.groupSize;
	const placeholder = FancyZonesStore.$placeholder;
</script>

<FancyZonePlaceholder frame={$placeholder} />

<div
	class="wrapper"
	class:show={$isDragging}
	class:active={$isDraggingTop}
	style:--top={`${$activeTop}px`}
>
	{#each $zones as zone}
		<div
			class="zone_group"
			style:--height={`${groupSize.height}px`}
			style:--width={`${groupSize.width}px`}
		>
			{#each zone as item}
				<FancyZoneRect
					isActive={item === $activeZone}
					frame={new Frame(
						{
							width: item.size.width * groupSize.width,
							height: item.size.height * groupSize.height,
						},
						{
							x: item.position.x * groupSize.width,
							y: item.position.y * groupSize.height,
						}
					)}
				/>
			{/each}
		</div>
	{/each}
</div>

<style lang="postcss">
	.wrapper {
		position: fixed;
		top: var(--top);
		left: 50%;
		transform: translateX(-50%) translateY(-200%);
		display: flex;
		gap: 5px;
		background-color: var(--color-background);
		padding: 8px;
		border-radius: var(--border-radius);
		opacity: 0.9;
		box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.12), 0 4px 4px rgba(0, 0, 0, 0.12);
		transition: 0.2s ease-out transform;

		&.show {
			transform: translateX(-50%) translateY(-100%);
		}

		&.active {
			transform: translateX(-50%) translateY(0);
		}
	}

	.zone_group {
		height: var(--height);
		width: var(--width);
		position: relative;
	}
</style>
