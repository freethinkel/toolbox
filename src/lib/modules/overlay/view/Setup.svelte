<script lang="ts">
  import { ChannelService } from '$lib/modules/shared/services';
  import { WindowManagerController } from '../controllers/window-manager.controller';
  import Canvas from './Canvas.svelte';

  const windowManagerController = WindowManagerController.instance;

  windowManagerController.init();
</script>

<Canvas />
