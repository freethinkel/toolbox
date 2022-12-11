import './style.css';
import { window } from '@tauri-apps/api';
import Overlay from './apps/Overlay.svelte';
import Statusbar from './apps/Statusbar.svelte';

const appTarget = document.getElementById('app');

const windowLabel = window.getCurrent().label;
console.log(windowLabel);

({
	statusbar: () => new Statusbar({ target: appTarget }),
	main: () => new Overlay({ target: appTarget }),
}[windowLabel]?.());
