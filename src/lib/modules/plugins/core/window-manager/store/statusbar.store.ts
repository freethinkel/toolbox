import { createSharedStore } from '@/modules/shared/helpers/store';
import { WindowManagerStore } from '@/modules/window-manager';
import { sample } from 'effector';

const $enabled = createSharedStore(
	'window_manager_enabled',
	'statusbar',
	false
);

const $mode = createSharedStore<'snapping' | 'fancy_zones'>(
	'window_manager_mode',
	'statusbar',
	'snapping'
);

sample({
	clock: $enabled.$store,
	filter: $enabled.$store,
	target: WindowManagerStore.startWindowManagerListenFx,
});

sample({
	clock: $enabled.$store,
	filter: $enabled.$store.map((e) => !e),
	target: WindowManagerStore.stopWindowManagerListenFx,
});

export const WindowManagerStatusbarStore = {
	$enabled,
	$mode,
};
