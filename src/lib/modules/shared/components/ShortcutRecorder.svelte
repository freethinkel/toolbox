<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import { derived, writable } from "svelte/store";
  import Icon from "./Icon";

  const CONTROL_KEYS = ["Meta", "Control", "Shift", "Alt"];

  export let keys: string[] | readonly string[] = [];

  const pressedKeys = writable(new Set<string>());
  const unsubscribes: Array<() => void> = [];

  let isFocused = false;
  let element: HTMLButtonElement;

  const dispatch = createEventDispatcher();

  onMount(() => {
    window.addEventListener("blur", () => clear());
    unsubscribes.push(
      pressedKeys.subscribe((values) => {
        const newKeys = Array.from(values);
        const controlKeys = newKeys.filter((key) =>
          CONTROL_KEYS.map((key) => key.toLowerCase()).includes(
            key.toLowerCase()
          )
        );
        if (controlKeys.length > 0 && controlKeys.length < values.size) {
          dispatch("record", newKeys);
          element.blur();
        }
      })
    );
  });

  onDestroy(() => {
    unsubscribes.forEach((callback) => callback());
  });

  const clear = () => pressedKeys.set(new Set());

  const onKeyDown = (event: KeyboardEvent) => {
    pressedKeys.update((store) => store.add(event.key));
    event.preventDefault();
  };

  const onKeyUp = (event: KeyboardEvent) => {
    pressedKeys.update((codes) => {
      codes.delete(event.key);
      return codes;
    });
  };

  const onClick = (event: MouseEvent) => {
    const element = event.currentTarget as HTMLElement;
    setTimeout(() => {
      element.focus();
    });
  };

  const onBlur = () => {
    isFocused = false;
    clear();
  };

  const codes = derived(pressedKeys, (codes) => [...codes]);
</script>

<button
  class="wrapper"
  on:keydown={onKeyDown}
  on:keyup={onKeyUp}
  on:blur={onBlur}
  on:click={onClick}
  on:focus={() => (isFocused = true)}
  bind:this={element}
>
  {#if isFocused}
    {#if $codes.length}
      <div class="codes">
        {#each $codes as code}
          <kbd>{code}</kbd>
        {/each}
      </div>
    {:else}
      <span class="recording">Recording...</span>
    {/if}
  {:else if keys.length}
    <div class="codes">
      {#each keys as code}
        <kbd>{code}</kbd>
      {/each}
    </div>
    <button
      class="clear"
      on:click|stopPropagation={() => dispatch("record", [])}
    >
      <Icon name="close" size={15} />
    </button>
  {:else}
    <span class="placeholder">Record shortcurt</span>
  {/if}
</button>

<style lang="postcss">
  .wrapper {
    appearance: none;
    cursor: pointer;
    font-size: 0.9rem;
    border-radius: var(--border-radius);
    border: none;
    background: var(--color-background);
    padding: 0 8px;
    margin: 0;
    height: 32px;
    display: flex;
    align-items: center;
    outline: none;
    border: 2px solid var(--color-border);
    transition: 0.1s ease-out;
    color: var(--color-title);

    &:focus {
      border-color: var(--color-accent);
    }
  }
  .placeholder {
    opacity: 0.7;
  }
  .codes {
    display: flex;
    gap: 3px;

    & kbd {
      border: 1px solid var(--color-border);
      min-width: 19px;
      height: 19px;
      text-transform: uppercase;
      font-size: 0.8rem;
      font-weight: bold;
      border-bottom-width: 2px;
      border-radius: 2px;
      padding: 2px;
      display: block;
    }
  }

  .clear {
    appearance: none;
    padding: 0;
    height: 16px;
    width: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: calc(var(--border-radius) / 2);
    background: var(--color-red);
    border: none;
    margin-left: 6px;
    & :global(svg) {
      stroke: var(--color-title);
    }
  }
</style>
