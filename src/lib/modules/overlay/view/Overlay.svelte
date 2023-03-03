<script lang="ts">
  import type { TBPlugin } from "@/modules/plugins/models/plugin";
  import type { Store } from "effector";

  export let plugins: Store<TBPlugin[]>;

  $: components = (($plugins ?? []) as TBPlugin[]).map((plugin) =>
    plugin.renderOverlay()
  );
</script>

<h1>Overlay</h1>

{#each components as component}
  <svelte:component this={component} />
{/each}
