<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let checked = false;
  export let disabled = false;

  const dispatch = createEventDispatcher();
  const size = 20;

  const onChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    dispatch('change', input.checked);
    input.checked = checked;
  };
</script>

<label class:disabled>
  <div class="content">
    <slot />
  </div>
  <input type="checkbox" {checked} on:change={onChange} {disabled} />
  <div class="toggle__wrapper" style:--size={`${size}px`}>
    <div class="toggle__circle" />
  </div>
</label>

<style>
  input {
    display: none;
  }
  label {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 5px;
    color: var(--color-title);
  }
  label.disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  .toggle__wrapper {
    --gap: 0px;
    --width-scale: 1.9;
    width: calc(var(--size) * var(--width-scale));
    padding: var(--gap);
    border: 1px solid var(--color-border);
    border-radius: 10em;
    transition: 0.1s;
    cursor: pointer;
  }
  .toggle__circle {
    background-color: #fff;
    width: var(--size);
    height: var(--size);
    border-radius: 10em;
    transform: translateX(0);
    transition: 0.1s transform;
  }
  input:checked + .toggle__wrapper {
    background-color: var(--color-accent);
  }
  input:checked + .toggle__wrapper .toggle__circle {
    transform: translateX(
      calc(
        var(--size) * var(--width-scale) - var(--size) - var(--gap) * 2 - 2px
      )
    );
  }
</style>
