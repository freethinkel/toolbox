<script lang="ts">
  import { derived } from 'svelte/store';
  import { fade, fly } from 'svelte/transition';
  import { circInOut } from 'svelte/easing';
  import { Rect } from '$lib/modules/shared/components';
  import FancyZone from './FancyZone.svelte';
  import { WindowManagerController } from '../controllers/window-manager.controller';
  import { FancyZonesController } from '../controllers/facy-zones.controller';

  const windowManagerController = WindowManagerController.instance;
  const fancyZonesController = FancyZonesController.instance;

  const rect = derived(windowManagerController.currentArea, (area) =>
    windowManagerController.areaCalculator.rectFromSnapArea(area)
  );
  const { isDragging, lastPosition } = fancyZonesController;

  const normalizedPoint = derived(lastPosition, (state) => {
    if (!state) {
      return;
    }
    const screenPosition =
      fancyZonesController.currentScreen?.normalized?.visibleFrame?.position;

    return {
      x: state.mousePoint.x - screenPosition.x,
      y: state.mousePoint.y - screenPosition.y,
    };
  });
</script>

<div class="canvas">
  {#if $isDragging && $normalizedPoint}
    <div transition:fly={{ y: -100, duration: 200, easing: circInOut }}>
      <FancyZone
        on:computeFrame={({ detail }) =>
          fancyZonesController.setSelectedFrame(detail)}
        point={$normalizedPoint}
        modes={fancyZonesController.MODES}
      />
    </div>
  {/if}

  {#if $rect}
    <div transition:fade={{ duration: 200, easing: circInOut }}>
      <Rect
        height={$rect.size.height}
        width={$rect.size.width}
        x={$rect.position.x}
        y={$rect.position.y}
      />
    </div>
  {/if}
</div>

<style>
  .canvas {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
</style>
