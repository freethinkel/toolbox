import type { Config } from '$lib/models/config';
import { ConfigReader, defaultConfig } from '$lib/service/config-reader';
import { writable } from 'svelte/store';

const DEFAULT: Config = { ...defaultConfig };

const store = writable({ ...DEFAULT });

export const configStore = {
  subscribe: store.subscribe,
  async init() {
    const config = await ConfigReader.instance.read();
    ConfigReader.instance.listen((config) => {
      store.set(config);
    });
    store.set(config);
  },
};
