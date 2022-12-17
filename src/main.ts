import './style.css';
import { window } from '@tauri-apps/api';
import { init as initOverlayModule } from '$lib/modules/overlay';
import { init as initStatusbarModule } from '$lib/modules/statusbar';
import { ConfigController } from '$lib/modules/shared/controllers';

const appTarget = document.getElementById('app');
const windowLabel = window.getCurrent().label;

({
  statusbar: () => initStatusbarModule(appTarget),
  main: () => initOverlayModule(appTarget),
}[windowLabel]?.());

ConfigController.instance.config.subscribe((config) => {
  document.body.style.setProperty('--color-accent', config.accentColor);
  document.oncontextmenu = (event) => {
    if (!config.debug) {
      event.preventDefault();
    }
  };
});
