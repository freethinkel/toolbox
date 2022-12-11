<script lang="ts">
	import { Channel } from '../lib/service/channel';
	import { onMount } from 'svelte';
	import {
		appWindow,
		LogicalSize,
		PhysicalPosition,
	} from '@tauri-apps/api/window';

	appWindow.setSize(new LogicalSize(250, 150));

	onMount(async () => {
		Channel.instance.onStatusbarClick(async (position) => {
			const isVisible = await appWindow.isVisible();
			if (isVisible) {
				appWindow.hide();
			} else {
				const pos = new PhysicalPosition(position.x, position.y);
				appWindow.setPosition(pos);
				appWindow.show();
				appWindow.setFocus();
			}
		});

		appWindow.onFocusChanged((event) => {
			console.log(event);
			if (!event.payload) {
				appWindow.hide();
			}
		});
	});
</script>

<h1>Statusbar</h1>

<style>
	* {
		color: white;
	}
</style>
