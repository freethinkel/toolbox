import SettingsView from './view/SettingsView.svelte';

export const init = (el: HTMLElement) => {
	new SettingsView({ target: el });
};
