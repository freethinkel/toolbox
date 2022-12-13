<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
</script>

<div class="wrapper">
  <span class="description"> Quit toolbox </span>

  <button on:click={() => dispatch('exit')}> ⌘ Q </button>
</div>

<style>
  .wrapper {
    display: flex;
    justify-content: space-between;
    color: var(--color-text);
  }
  .description {
    font-size: 0.95rem;
  }
  button {
    background: none;
    padding: 0;
    margin: 0;
    border: none;
    font-size: 0.9rem;
    appearance: none;
    outline: none;
    color: inherit;
    transition: 0.1s;
    cursor: pointer;
  }
  button:hover {
    opacity: 0.6;
  }
</style>
