<script lang="ts">
  import { derived } from 'svelte/store';
  import { fade } from 'svelte/transition';
  import { circInOut } from 'svelte/easing';
  import { Rect } from '$lib/modules/shared/components';
  import { WindowManagerController } from '../controllers/window-manager.controller';

  const windowManagerController = WindowManagerController.instance;

  const rect = derived(windowManagerController.currentArea, (area) =>
    windowManagerController.areaCalculator.rectFromSnapArea(area)
  );
</script>

<div class="canvas">
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
