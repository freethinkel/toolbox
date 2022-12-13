import { invoke } from '@tauri-apps/api';
import { listen, type UnlistenFn } from '@tauri-apps/api/event';
import {
  type Frame,
  type GlobalMouseEvent,
  Screen,
  type Position,
  type WindowInfo,
} from '$lib/modules/shared/models';

type GlobalMouseEventCallback = (event: GlobalMouseEvent) => void;
type BroadcastListener = (event: any) => void;
type StatusbarClickListener = (event: Position) => void;

export class ChannelService {
  static instance = new ChannelService();

  private _windowManagerListeners: GlobalMouseEventCallback[] = [];
  private _broadcastListeners: BroadcastListener[] = [];
  private _statusbarClickListeners: StatusbarClickListener[] = [];

  private _unlisteners: UnlistenFn[] = [];

  constructor() {
    this.init();
  }

  listenBroadcast(cb: BroadcastListener) {
    this._broadcastListeners.push(cb);

    return () => {
      this._broadcastListeners = this._broadcastListeners.filter(
        (callback) => callback !== cb
      );
    };
  }

  subscribeWindowManager(cb: GlobalMouseEventCallback) {
    this._windowManagerListeners.push(cb);

    return () => {
      this._windowManagerListeners = this._windowManagerListeners.filter(
        (callback) => callback !== cb
      );
    };
  }

  onStatusbarClick(cb: StatusbarClickListener) {
    this._statusbarClickListeners.push(cb);

    return () => {
      this._statusbarClickListeners = this._statusbarClickListeners.filter(
        (callback) => callback !== cb
      );
    };
  }

  async setWindowPosition(frame: WindowInfo) {
    await invoke('change_window_position', { payload: JSON.stringify(frame) });
  }

  async broadcastEvent<T extends any>(payload: T) {
    await invoke('send_message', { payload: JSON.stringify(payload) });
  }

  async setCurrentWindowFrame(frame: Frame) {
    invoke('set_current_window_position', { payload: JSON.stringify(frame) });
  }

  async getScreens(): Promise<Screen[]> {
    return invoke('get_screens').then((rawScreens: any[]) =>
      rawScreens.map((rawScreen) => Screen.fromMap(rawScreen))
    );
  }

  async startWindowManager() {
    await invoke('start_window_manager');
  }

  async stopWindowManager() {
    await invoke('stop_window_manager');
  }

  private async init() {
    this._unlisteners.push(
      await listen('broadcast', (event: any) => {
        try {
          const payload = JSON.parse(event.payload);
          this._broadcastListeners.forEach((cb) => cb(payload));
        } catch (err) {}
      })
    );
    this._unlisteners.push(
      await listen('window_manager', (event) => {
        const payload = event.payload as any;
        for (let cb of this._windowManagerListeners) {
          cb(payload);
        }
      })
    );
    this._unlisteners.push(
      await listen('on_statusbar_click', (event) => {
        this._statusbarClickListeners.forEach((cb) =>
          cb(event.payload as Position)
        );
      })
    );
  }

  dispose() {
    this._unlisteners.forEach((unlisten) => unlisten());
  }
}
