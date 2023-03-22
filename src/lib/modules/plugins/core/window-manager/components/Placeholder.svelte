<script lang="ts">
  import Placeholder from "@/modules/shared/components/Placeholder.svelte";
  import type { Frame } from "@/modules/shared/models/frame";
  import { WindowManagerSettingsStore } from "../store/settings.store";

  export let frame: Frame;

  const mode = WindowManagerSettingsStore.$placeholderMode.$store;
</script>

<Placeholder {frame} mode={$mode} />
