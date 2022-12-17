<script lang="ts">
  import { ChannelService } from '$lib/modules/shared/services';
  import { FancyZonesController } from '../controllers/facy-zones.controller';

  import { OverlaySettingsController } from '../controllers/overlay-settings.controller';
  import { WindowManagerController } from '../controllers/window-manager.controller';
  import Canvas from './Canvas.svelte';

  const windowManagerController = WindowManagerController.instance;
  const fancyZonesController = FancyZonesController.instance;
  const overlayController = OverlaySettingsController.instance;

  windowManagerController.init();
  overlayController.init();
  fancyZonesController.init();

  window['WindowManagerController'] = WindowManagerController;
  window['ChannelService'] = ChannelService;
  window['FancyZonesController'] = FancyZonesController;
</script>

<Canvas />
