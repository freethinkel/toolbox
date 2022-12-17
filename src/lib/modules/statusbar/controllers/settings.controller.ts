import { ChannelService, StorageService } from '$lib/modules/shared/services';
import { derived, get, writable } from 'svelte/store';

export class SettingsController {
  static readonly instance = new SettingsController();

  private _windowManagerEnabled = writable(false);
  private _caffeinateEnabled = writable(false);
  private _fancyZonesEnabled = writable(false);
  windowManagerEnabled = derived(this._windowManagerEnabled, (state) => state);
  caffeinateEnabled = derived(this._caffeinateEnabled, (state) => state);
  fancyZonesEnabled = derived(this._fancyZonesEnabled, (state) => state);

  async init() {
    this._windowManagerEnabled.set(
      Boolean(await StorageService.instance.read('windowManagerEnabled'))
    );
    this._caffeinateEnabled.set(
      Boolean(await StorageService.instance.read('caffeinateEnabled'))
    );
    this._fancyZonesEnabled.set(
      Boolean(await StorageService.instance.read('fancyZonesEnabled'))
    );

    setTimeout(() => {
      this.changeWindowManagerState(get(this.windowManagerEnabled));
      this.changeFancyZonesState(get(this.fancyZonesEnabled));
    }, 100);
  }

  private changeWindowManagerState(state: boolean) {
    ChannelService.instance.broadcastEvent({
      type: 'window_manager_enabled',
      enabled: state,
    });
  }

  private changeFancyZonesState(state: boolean) {
    ChannelService.instance.broadcastEvent({
      type: 'fancy_zones_enabled',
      enabled: state,
    });
  }

  setFancyZones(state: boolean) {
    this._fancyZonesEnabled.set(state);
    StorageService.instance.write('fancyZonesEnabled', state);
    this.changeFancyZonesState(state);
  }

  setWindowManager(state: boolean) {
    this._windowManagerEnabled.set(state);
    StorageService.instance.write('windowManagerEnabled', state);
    this.changeWindowManagerState(state);
  }

  setCaffeinate(state: boolean) {
    this._caffeinateEnabled.set(state);
    StorageService.instance.write('caffeinateEnabled', state);
  }
}
