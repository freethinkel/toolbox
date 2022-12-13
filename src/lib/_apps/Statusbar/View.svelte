<script lang="ts">
  import { onMount } from 'svelte';
  // import { Channel } from '$lib/service/channel';
  import { Toggle, Footer } from '$lib/modules/shared/';
  // import { settingsStore } from '$lib/store/settings';
  import {
    appWindow,
    LogicalSize,
    PhysicalPosition,
  } from '@tauri-apps/api/window';

  appWindow.setSize(new LogicalSize(250, 120));

  onMount(async () => {
  //   Channel.instance.onStatusbarClick(async (position) => {
  //     const isVisible = await appWindow.isVisible();
  //     if (isVisible) {
  //       appWindow.hide();
  //     } else {
  //       const pos = new PhysicalPosition(position.x, position.y);
  //       appWindow.setSize(new LogicalSize(250, 120));
  //       appWindow.setPosition(pos);
  //       appWindow.show();
  //       appWindow.setFocus();
  //     }
  //   });
  //
  //   appWindow.onFocusChanged((event) => {
  //     if (!event.payload) {
  //       appWindow.hide();
  //     }
  //   });
  // });
  //
  // settingsStore.init();
</script>

<!-- <div class="wrapper"> -->
<!--   <div class="controls"> -->
<!--     <Toggle -->
<!--       checked={$settingsStore.windowManagerEnabled} -->
<!--       on:change={({ detail }) => settingsStore.setWindowManager(detail)} -->
<!--       >Window manager</Toggle -->
<!--     > -->
<!--     <Toggle -->
<!--       checked={$settingsStore.caffeinateEnabled} -->
<!--       on:change={({ detail }) => settingsStore.setCaffeinate(detail)} -->
<!--       >Caffeinate</Toggle -->
<!--     > -->
<!--   </div> -->
<!---->
<!--   <div class="footer"> -->
<!--     <Footer on:exit={() => settingsStore.exit()} /> -->
<!--   </div> -->

<!-- </div> -->
<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .controls {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px 12px;
  }

  .footer {
    position: relative;
    border-top: 1px solid var(--color-border);
    padding: 2px 12px 4px;
  }

  .footer::before {
    content: '';
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--color-panel);
    opacity: 0.04;
  }
</style>
