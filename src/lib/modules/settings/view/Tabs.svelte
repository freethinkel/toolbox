<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let value: string;
  export let tabs: Array<{ value: string; label: string }> = [];

  const dispatch = createEventDispatcher();
</script>

<div data-tauri-drag-region class="wrapper">
  {#each tabs as tab}
    <button
      class="tab"
      class:active={tab.value === value}
      on:click={() => dispatch("change", tab.value)}>{tab.label}</button
    >
  {/each}
</div>

<style lang="postcss">
  .wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
    padding: 3px;
  }
  .tab {
    appearance: none;
    border: none;
    background: transparent;
    color: inherit;
    font-size: 1rem;
    height: 100%;
    border-radius: var(--border-radius);
    padding: 0 12px;
    display: flex;
    align-items: center;
    margin: 0;
    cursor: pointer;
    transition: var(--transition);

    &:hover {
      background: var(--color-panel24);
    }
    &:active,
    &.active {
      background: var(--color-panel50);
    }
  }
</style>
