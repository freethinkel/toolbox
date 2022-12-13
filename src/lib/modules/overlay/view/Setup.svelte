<script lang="ts">
  import { WindowManagerController } from '../controllers/window-manager.controller';
  import Canvas from './Canvas.svelte';

  const windowManagerController = WindowManagerController.instance;

  windowManagerController.init();
</script>

<Canvas />
