import { createStore } from 'effector';
import { caffeinatePlugin } from './core/caffeinate';
import { windowManagerPlugin } from './core/window-manager';
import type { TBPlugin } from './models/plugin';

const __CORE_PLUGINS__ = [windowManagerPlugin, caffeinatePlugin];

const $plugins = createStore<Array<TBPlugin>>([...__CORE_PLUGINS__]);

export const PluginsStore = {
	$plugins,
};
