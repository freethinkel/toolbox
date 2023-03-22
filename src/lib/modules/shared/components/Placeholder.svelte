<script lang="ts">
  import type { Frame } from "@/modules/shared/models/frame";
  import { fade } from "svelte/transition";

  export let frame: Frame;
  export let mode: "blurred" | "bordered" = "bordered";
</script>

{#if frame}
  <div
    transition:fade={{ duration: 150 }}
    class="rect"
    class:blurred={mode === "blurred"}
    class:bordered={mode === "bordered"}
    style:--width={`${frame.size.width}px`}
    style:--height={`${frame.size.height}px`}
    style:--x={`${frame.position.x}px`}
    style:--y={`${frame.position.y}px`}
  />
{/if}

<style lang="postcss">
  .rect {
    width: var(--width);
    height: var(--height);
    position: fixed;
    top: 0;
    left: 0;
    transform: translate(var(--x), var(--y));
    transition: 0.1s ease-out transform, 0.1s ease-out height,
      0.1s ease-out width;
    border-radius: var(--border-radius);
  }

  .bordered {
    background-color: var(--color-accent12);
    border: 2px solid var(--color-accent);
  }

  .blurred {
    background-color: var(--color-accent12);
    backdrop-filter: blur(20px);
    animation: 10s fixBlur infinite alternate;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.24);
  }

  /* fix rerender blur */
  @keyframes fixBlur {
    0% {
      opacity: 0.99999;
    }
    100% {
      opacity: 1;
    }
  }
</style>
