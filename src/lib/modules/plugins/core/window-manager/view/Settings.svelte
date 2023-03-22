<script>
  import Checkbox from "@/modules/shared/components/Checkbox.svelte";
  import { WindowManagerSettingsStore } from "../store/settings.store";
  import { SegmentedControl } from "@/modules/shared/components/SegmentedControl";

  const showFancyZonesPlaceholder =
    WindowManagerSettingsStore.$showFancyZonesPlaceholder.$store;
  const setShowFancyZonesPlaceholder =
    WindowManagerSettingsStore.$showFancyZonesPlaceholder.setValue;

  const placeholderMode = WindowManagerSettingsStore.$placeholderMode.$store;
  const setPlaceholderMode =
    WindowManagerSettingsStore.$placeholderMode.setValue;
</script>

<div class="wrapper">
  <Checkbox
    checked={$showFancyZonesPlaceholder}
    on:change={({ detail }) => setShowFancyZonesPlaceholder(detail)}
    >Enable fancy zones placeholder</Checkbox
  >

  <div class="label">Placeholder mode</div>
  <SegmentedControl
    value={$placeholderMode}
    on:change={({ detail }) => setPlaceholderMode(detail)}
  >
    <SegmentedControl.SegmentedButton value="blurred"
      >Blurred</SegmentedControl.SegmentedButton
    >
    <SegmentedControl.SegmentedButton value="bordered"
      >Bordered</SegmentedControl.SegmentedButton
    >
  </SegmentedControl>
</div>

<style lang="postcss">
  .label {
    font-size: 0.9rem;
    margin-top: 8px;
    font-weight: 600;
  }
</style>
