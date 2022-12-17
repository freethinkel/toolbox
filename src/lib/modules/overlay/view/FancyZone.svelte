<script lang="ts">
  import type { Frame, Position } from '$lib/modules/shared/models';
  import { createEventDispatcher } from 'svelte';

  export let modes: Frame[][] = [];
  export let point: Position | null = null;

  const gap = 2;
  const previewSize = 60;

  const computeStyle = (frame: Frame): string => {
    let width: string | number = frame.size.width * 100;
    let height: string | number = frame.size.height * 100;
    let top: string | number = frame.position.y * 100;
    let left: string | number = frame.position.x * 100;

    width =
      width < 100
        ? `calc(${width}% - ${left > 0 ? gap * 2 : gap}px)`
        : width + '%';
    height = height < 100 ? `calc(${height}% - ${gap}px)` : height + '%';
    top = top > 0 ? `calc(${top}% + ${gap}px)` : top + '%';
    left = left > 0 ? `calc(${left}% + ${gap}px)` : left + '%';

    return `width: ${width}; height: ${height}; top: ${top}; left: ${left}`;
  };

  let containerEl: HTMLElement | null = null;
  let rects: HTMLElement[] = [];

  const dispatch = createEventDispatcher();

  const compute = () => {
    let currentFrame = null;
    rects.forEach((rect) => {
      const pos = rect.getBoundingClientRect();

      if (
        point.x > pos.x &&
        point.x < pos.x + pos.width &&
        point.y > pos.y &&
        point.y < pos.y + pos.height
      ) {
        rect.classList.add('active');
        currentFrame = JSON.parse(rect.getAttribute('data-frame') || 'null');
      } else {
        rect.classList.remove('active');
      }
      dispatch('computeFrame', currentFrame);
    });
  };

  $: {
    [point];
    compute();
  }

  $: {
    [modes];
    setTimeout(() => {
      updateRects();
    });
  }

  const updateRects = () => {
    if (containerEl) {
      rects = Array.from(containerEl.querySelectorAll('.rect'));
    }
  };
</script>

<div class="wrapper">
  <div class="container" bind:this={containerEl}>
    {#each modes as mode}
      <div
        class="mode__wrapper"
        style:width={`${previewSize * 1.4}px`}
        style:height={`${previewSize}px`}
      >
        {#each mode as frame}
          <div
            class="rect"
            data-frame={JSON.stringify(frame)}
            style={computeStyle(frame)}
          />
        {/each}
      </div>
    {/each}
  </div>
</div>

<style>
  .rect {
    background: var(--color-title);
    border-radius: 5px;
    position: absolute;
    opacity: 0.9;
    transition: 0.1s background;
  }
  .rect:global(.active) {
    background-color: var(--color-accent);
  }
  .mode__wrapper {
    position: relative;
  }
  .wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    z-index: 100;
  }
  .container {
    padding: 10px;
    margin: 10px;
    border-radius: var(--border-radius);
    background-color: var(--color-panel);
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.24),
      0 8px 12px 0 rgba(0, 0, 0, 0.12);
    display: flex;
    gap: 10px;
    border: 1px solid var(--color-border);
  }
</style>
