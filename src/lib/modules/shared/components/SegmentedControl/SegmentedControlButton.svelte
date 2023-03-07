<script lang="ts">
  import {getContext} from 'svelte';
  import {CONTEXT_KEY, type SegmentedControlContext} from './context';
  
  export let value: string;
  
  const context: SegmentedControlContext = getContext(CONTEXT_KEY);
  const onChange = context.onChange;
  const onControlTapDown = context.onControlTapDown;
  const onControlTapUp = context.onControlTapUp;
  
  const wrapValue = (fn: (val: typeof value) => void) => () => fn(value);
  
  const handleClick = () => {
    onChange(value);
  };
</script>

<button
  data-value={value}
  on:click={wrapValue(onChange)}
  on:mousedown={wrapValue(onControlTapDown)}
  on:mouseup={wrapValue(onControlTapUp)}
  class="segmented_control__button"
>
  <slot/>
</button>

<style lang="postcss">
  button {
    position: relative;
    z-index: 100;
    min-height: 24px;
    flex-grow: 1;
    appearance: none;
    margin: 0;
    padding: 0;
    border: none;
    background: none;
    font-size: inherit;
    color: inherit;
  }
</style>
