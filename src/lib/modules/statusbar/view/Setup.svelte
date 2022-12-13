<script lang="ts">
  import { Footer, Toggle } from '$lib/modules/shared/components';
  import { SettingsController } from '../controllers/settings.controller';
  import { StatusbarController } from '../controllers/statusbar.controller';

  const statusbarController = StatusbarController.instance;
  const settingsContoller = SettingsController.instance;

  const { windowManagerEnabled, caffeinateEnabled } = settingsContoller;

  statusbarController.init();
  settingsContoller.init();
</script>

<div class="wrapper">
  <div class="controls">
    <Toggle
      checked={$windowManagerEnabled}
      on:change={({ detail }) => settingsContoller.setWindowManager(detail)}
      >Window manager</Toggle
    >
    <Toggle
      checked={$caffeinateEnabled}
      on:change={({ detail }) => settingsContoller.setCaffeinate(detail)}
      >Caffeinate</Toggle
    >
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
