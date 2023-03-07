import { PlatformView } from '@/modules/shared/models/platform-view';
import { init as initOverlay } from '@/modules/overlay';
import { init as initStatusbar } from '@/modules/statusbar';
import { init as initSettings } from '@/modules/settings';
import './style.css';
import { ThemeStore } from '@/modules/settings/store/theme.store';

const key = PlatformView.getKey();

const handler = {
	main: initOverlay,
	statusbar: initStatusbar,
	settings: initSettings,
}[key];

if (handler) {
	const el = document.getElementById('root');

	handler(el);
}

ThemeStore.initListenFx();
