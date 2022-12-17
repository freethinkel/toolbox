import {
  appWindow,
  LogicalSize,
  PhysicalPosition,
} from '@tauri-apps/api/window';
import { ChannelService } from '$lib/modules/shared/services';
import type { Frame } from '$lib/modules/shared/models';
import { process } from '@tauri-apps/api';
import { SettingsController } from './settings.controller';
import { CaffeinateService } from '$lib/modules/shared/services/caffeinate.service';
import { ConfigController } from '$lib/modules/shared/controllers';

const WINDOW_SIZE = { width: 250, height: 120 };

export class StatusbarController {
  static readonly instance = new StatusbarController();

  private _rootElement: HTMLElement;

  init() {
    appWindow.setSize(new LogicalSize(WINDOW_SIZE.width, WINDOW_SIZE.height));

    ChannelService.instance.onStatusbarClick(async (position) => {
      const isVisible = await appWindow.isVisible();
      if (isVisible) {
        appWindow.hide();
      } else {
        await this.setWindowFrame({
          size: {
            ...WINDOW_SIZE,
            height: this.getComputedHeight(this._rootElement),
          },
          position,
        });
        appWindow.show();
        appWindow.setFocus();
        window.focus();
      }
    });

    appWindow.onFocusChanged((event) => {
      if (!event.payload) {
        appWindow.hide();
      }
    });

    SettingsController.instance.caffeinateEnabled.subscribe((state) => {
      if (state) {
        CaffeinateService.instance.start();
      } else {
        CaffeinateService.instance.stop();
      }
    });

    ConfigController.instance.config.subscribe((config) => {
      ChannelService.instance.setDebugMode(Boolean(config.debug));
      if (config.debug) {
        console.log(config);
      }
    });

    window.onkeydown = (event: KeyboardEvent) => {
      if (event.metaKey && event.code === 'keyQ') {
        this.exit();
      }
    };
  }

  setRootElement(el: HTMLElement) {
    this._rootElement = el;
  }

  async exit() {
    await this.onExit();
    process.exit();
  }

  private async onExit() {
    await CaffeinateService.instance.stop();
  }

  private getComputedHeight(el: HTMLElement) {
    if (!el) {
      return WINDOW_SIZE.height;
    }

    const prevHeight = el.style.height;
    el.style.height = 'auto';
    const height = el.scrollHeight;
    el.style.height = prevHeight;

    return height || WINDOW_SIZE.height;
  }

  private async setWindowFrame(frame: Frame) {
    await appWindow.setSize(
      new LogicalSize(frame.size.width, frame.size.height)
    );
    await appWindow.setPosition(
      new PhysicalPosition(frame.position.x, frame.position.y)
    );
  }
}
