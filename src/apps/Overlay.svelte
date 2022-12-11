<script lang="ts">
	import Canvas from '../lib/components/Canvas.svelte';
	import { windowManager } from '../lib/store/window-manager';

	windowManager.start();
</script>

<Canvas />
