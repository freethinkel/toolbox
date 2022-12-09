<script lang="ts">
	import { listen } from '@tauri-apps/api/event';
	import { invoke, window } from '@tauri-apps/api';
	import { onMount } from 'svelte';

	let pos = { x: 0, y: 0 };

	onMount(() => {
		// setTimeout(() => {
		// 	invoke('change_window_position', {
		// 		payload: JSON.stringify({ id: '1', x: 0, y: 0 }),
		// 	});
		// }, 2000);

		window.appWindow.maximize().then(async () => {
			const monitors = await window.availableMonitors();
			const currentMon = await window.currentMonitor();
			console.log(monitors, currentMon);
		});

		listen('window_manager', ({ payload }) => {
			const data = JSON.parse(payload as string) as any;
			pos = data.point;
			if (data.event_type === 'mouse_up') {
				console.log(data);
				const payload = {
					id: data.window_info.id,
					pid: data.window_info.pid,
					size: {
						width: 900,
						height: 900,
					},
					position: { x: 10, y: 44 + 10 },
				};
				// invoke('change_window_position', { payload: JSON.stringify(payload) });
				// window_info: {point: {x: 0, y: 44}, id: "6146", pid: 29124}
			}
		});
	});
</script>

<div class="canvas">
	<div
		class="point"
		style:transform={`translate(${pos.x}px, ${pos.y - 100}px)`}
	/>
</div>

<style>
	.canvas {
		position: fixed;
		left: 0;
		top: 0;
		border: 2px solid red;
		width: 100%;
		height: 100%;
	}
	.point {
		height: 10px;
		width: 10px;
		background-color: blue;
		position: fixed;
	}
</style>
