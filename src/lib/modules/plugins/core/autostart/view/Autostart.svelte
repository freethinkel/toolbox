<script lang="ts">
  import Checkbox from "@/modules/shared/components/Checkbox.svelte";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { isEnabled, enable, disable } from "tauri-plugin-autostart-api";

  const enabled = writable(false);

  onMount(async () => {
    $enabled = await isEnabled();

    enabled.subscribe((state) => {
      if (state) {
        enable();
      } else {
        disable();
      }
    });
  });
</script>

<Checkbox checked={$enabled} on:change={({ detail }) => ($enabled = detail)}>
  Enable autostart
</Checkbox>
