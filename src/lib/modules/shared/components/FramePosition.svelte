<script lang="ts">
  import type { Frame } from "../models/frame";

  export let frame: Frame;
</script>

<div
  class="screen"
  style:--frame-width={frame.size.width}
  style:--frame-height={frame.size.height}
  style:--frame-x={frame.position.x}
  style:--frame-y={frame.position.y}
>
  <div class="frame" />
</div>

<style>
  .screen {
    --size: 30px;
    height: var(--size);
    width: calc(var(--size) * 1.5);
    background: none;
    position: relative;
    border: 2px solid var(--color-panel50);
    border-radius: var(--border-radius);
  }
  .frame {
    position: absolute;
    border-radius: calc(var(--border-radius) * 0.5);
    top: calc(var(--frame-y) * 100%);
    left: calc(var(--frame-x) * 100%);
    background: var(--color-accent);
    width: calc(var(--frame-width) * 100%);
    height: calc(var(--frame-height) * 100%);
    transform: scale(0.9);
  }
</style>
