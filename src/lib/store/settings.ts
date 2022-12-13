import { Storage } from '$lib/service/storage';
import { writable } from 'svelte/store';
import { process } from '@tauri-apps/api';
import { emit } from '@tauri-apps/api/event';
import { appWindow } from '@tauri-apps/api/window';
import { Channel } from '$lib/service/channel';

const DEFAULT = {
  windowManagerEnabled: false,
  caffeinateEnabled: false,
};

const store = writable({ ...DEFAULT });

export const settingsStore = {
  subscribe: store.subscribe,
  async init() {
    const windowManagerEnabled = Boolean(
      await Storage.instance.read('windowManagerEnabled')
    );
    const caffeinateEnabled = Boolean(
      await Storage.instance.read('caffeinateEnabled')
    );
    if (windowManagerEnabled) {
      Channel.instance.sendAllWindows({
        type: 'window_manager_enabled',
        enabled: true,
      });
    }
    store.update((state) => {
      state.windowManagerEnabled = windowManagerEnabled;
      state.caffeinateEnabled = caffeinateEnabled;

      return state;
    });
  },
  setWindowManager(enabled: boolean) {
    Channel.instance.sendAllWindows({
      type: 'window_manager_enabled',
      enabled,
    });
    Storage.instance.write('windowManagerEnabled', enabled);
    store.update((state) => {
      state.windowManagerEnabled = enabled;

      return state;
    });
  },
  setCaffeinate(enabled: boolean) {
    Storage.instance.write('caffeinateEnabled', enabled);
    store.update((state) => {
      state.caffeinateEnabled = enabled;

      return state;
    });
  },
  exit() {
    process.exit();
  },
};
