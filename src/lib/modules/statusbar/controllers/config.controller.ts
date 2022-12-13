import { Config } from '$lib/modules/shared';
import { ConfigReaderService } from '$lib/modules/shared/services';
import { writable } from 'svelte/store';

export class ConfigController {
  static readonly instance = new ConfigController();

  config = writable(Config.default);

  constructor() {
    this.init();
  }

  private async init() {
    ConfigReaderService.instance.listen((config) => {
      this.config.set(config);
    });
    const config = await ConfigReaderService.instance.read();
    this.config.set(config);
  }
}
