<script lang="ts">
  import { Footer, Toggle } from '$lib/modules/shared/components';
  import { onMount } from 'svelte';
  import { SettingsController } from '../controllers/settings.controller';
  import { StatusbarController } from '../controllers/statusbar.controller';

  let wrapperEl: HTMLElement;

  const statusbarController = StatusbarController.instance;
  const settingsContoller = SettingsController.instance;

  const { windowManagerEnabled, caffeinateEnabled, fancyZonesEnabled } =
    settingsContoller;

  onMount(() => {
    statusbarController.init();
    settingsContoller.init();
    statusbarController.setRootElement(wrapperEl);
  });
</script>

<div class="wrapper" bind:this={wrapperEl}>
  <div class="controls">
    <div class="toggle__wrapper">
      <Toggle
        checked={$windowManagerEnabled}
        disabled={$fancyZonesEnabled}
        on:change={({ detail }) => settingsContoller.setWindowManager(detail)}
        >Window Manager</Toggle
      >
    </div>
    <div class="toggle__wrapper">
      <Toggle
        checked={$fancyZonesEnabled}
        on:change={({ detail }) => settingsContoller.setFancyZones(detail)}
        >Fancy zones</Toggle
      >
    </div>
    <div class="toggle__wrapper">
      <Toggle
        checked={$caffeinateEnabled}
        on:change={({ detail }) => settingsContoller.setCaffeinate(detail)}
        >Caffeinate</Toggle
      >
    </div>
  </div>

  <div class="footer">
    <Footer on:exit={() => statusbarController.exit()} />
  </div>
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .controls {
    flex-grow: 1;
    padding: 16px 12px;
  }

  .toggle__wrapper + .toggle__wrapper {
    margin-top: 8px;
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
