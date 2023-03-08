import { createSharedStore } from '@/modules/shared/helpers/store';

const windowGap = createSharedStore<number>('window_gap', 'settings', 10);

export const SettingsStore = {
	windowGap,
};
