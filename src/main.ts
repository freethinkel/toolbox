import './style.css';
import { window } from '@tauri-apps/api';
import { init as initOverlayModule } from '$lib/modules/overlay';
import { init as initStatusbarModule } from '$lib/modules/statusbar';

const appTarget = document.getElementById('app');
const windowLabel = window.getCurrent().label;

({
  statusbar: () => initStatusbarModule(appTarget),
  main: () => initOverlayModule(appTarget),
}[windowLabel]?.());

// configStore.init();
