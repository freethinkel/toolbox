<script lang="ts">
  import Canvas from './Canvas.svelte';
  import { appWindow } from '@tauri-apps/api/window';
  import { windowManager } from '../../store/window-manager';
  import { Channel } from '../../service/channel';

  windowManager.init();
  appWindow.listen('from_statusbar', console.log);

  Channel.instance.getScreens().then(console.log);
</script>

<Canvas />
