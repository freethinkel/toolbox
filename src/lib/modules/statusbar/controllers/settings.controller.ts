import { ChannelService, StorageService } from '$lib/modules/shared/services';
import { derived, get, writable } from 'svelte/store';

export class SettingsController {
  static readonly instance = new SettingsController();

  private _windowManagerEnabled = writable(false);
  private _caffeinateEnabled = writable(false);
  windowManagerEnabled = derived(this._windowManagerEnabled, (state) => state);
  caffeinateEnabled = derived(this._caffeinateEnabled, (state) => state);

  async init() {
    this._windowManagerEnabled.set(
      Boolean(await StorageService.instance.read('windowManagerEnabled'))
    );
    this._caffeinateEnabled.set(
      Boolean(await StorageService.instance.read('caffeinateEnabled'))
    );

    this.changeWindowManagerState(get(this.windowManagerEnabled));
  }

  private changeWindowManagerState(state: boolean) {
    ChannelService.instance.broadcastEvent({
      type: 'window_manager_enabled',
      enabled: state,
    });
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
