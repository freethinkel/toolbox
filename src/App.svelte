<script lang="ts">
	import { invoke, window } from '@tauri-apps/api';
	import { onMount } from 'svelte';
	import Canvas from './lib/components/Canvas.svelte';
	import { Channel } from './lib/service/channel';
	import { windowManager } from './lib/store/window-manager';

	windowManager.start();

	onMount(() => {
		setTimeout(() => {
			invoke('get_screens').then((data) => {
				console.log(data);
			});
		}, 1000);
		Channel.instance.setCurrentWindowFrame({
			size: { height: 600, width: 600 },
			position: { x: 0, y: 0 },
		});
		// window.availableMonitors().then(console.log);
		// window
		// 	.primaryMonitor()
		// 	.then((d) => d.position.toLogical(d.scaleFactor))
		// 	.then(console.log);
		// window.currentMonitor().then(console.log);
		// window.appWindow.maximize();
		// window.appWindow.maximize().then(async () => {
		// 	const monitors = await window.availableMonitors();
		// 	const currentMon = await window.currentMonitor();
		// 	console.log(monitors, currentMon);
		// });
		// listen('window_manager', ({ payload }) => {
		// 	const data = JSON.parse(payload as string) as any;
		// 	console.log(data);
		// 	pos = data.point;
		// 	if (data.event_type === 'mouse_up') {
		// 		console.log(data);
		// 		const payload = {
		// 			id: data.window_info.id,
		// 			pid: data.window_info.pid,
		// 			size: {
		// 				width: 900,
		// 				height: 900,
		// 			},
		// 			position: { x: 10, y: 44 + 10 },
		// 		};
		// 		// invoke('change_window_position', { payload: JSON.stringify(payload) });
		// 		// window_info: {point: {x: 0, y: 44}, id: "6146", pid: 29124}
		// 	}
		// });
	});
</script>

<Canvas />

<style>
	.canvas {
		position: fixed;
		left: 0;
		top: 0;
		border: 2px solid red;
		width: 100%;
		height: 100%;
	}
</style>
