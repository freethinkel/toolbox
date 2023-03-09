import { createSharedStore } from '@/modules/shared/helpers/store';

const $showFancyZonesPlaceholder = createSharedStore(
	'show_fancy_zones_placeholder',
	'settings',
	true
);

export const WindowManagerSettingsStore = {
	$showFancyZonesPlaceholder,
};
