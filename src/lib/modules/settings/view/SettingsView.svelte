<script lang="ts">
  import type { TBPlugin } from "@/modules/plugins/models/plugin";
  import type { Store } from "effector";
  import { writable } from "svelte/store";
  import Tabs from "./Tabs.svelte";
  import General from "./General.svelte";
  import Mappings from "./Mappings.svelte";

  export let plugins: Store<Array<TBPlugin>>;

  const activeTab = writable("general");
</script>

<div class="settings">
  <div data-tauri-drag-region class="safearea">
    <Tabs
      value={$activeTab}
      on:change={({ detail }) => ($activeTab = detail)}
      tabs={[
        { value: "general", label: "General" },
        { value: "mappings", label: "Mappings" },
      ]}
    />
  </div>

  {#if $activeTab === "general"}
    <General {plugins} />
  {:else if $activeTab === "mappings"}
    <Mappings />
  {/if}
</div>

<style lang="postcss">
  .safearea {
    height: 30px;
    width: 100%;
    padding: 0 70px;
  }
  .settings {
    background: var(--color-background);
    height: 100%;
    min-height: inherit;
    display: flex;
    flex-direction: column;
  }
</style>
