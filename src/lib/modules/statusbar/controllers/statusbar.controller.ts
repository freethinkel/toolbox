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

  init() {
    appWindow.setSize(new LogicalSize(WINDOW_SIZE.width, WINDOW_SIZE.height));

    ChannelService.instance.onStatusbarClick(async (position) => {
      const isVisible = await appWindow.isVisible();
      if (isVisible) {
        appWindow.hide();
      } else {
        this.setWindowFrame({
          size: WINDOW_SIZE,
          position,
        });
        appWindow.show();
        appWindow.setFocus();
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
      console.log(config);
    });

    window.onclose = async () => {
      await this.onExit();
    };

    window.onkeydown = (event: KeyboardEvent) => {
      if (event.metaKey && event.code === 'keyQ') {
        this.exit();
      }
    };

    appWindow.onCloseRequested(async () => {
      await this.onExit();
    });
  }

  async exit() {
    await this.onExit();
    process.exit();
  }

  private async onExit() {
    await CaffeinateService.instance.stop();
  }

  private setWindowFrame(frame: Frame) {
    appWindow.setSize(new LogicalSize(frame.size.width, frame.size.height));
    appWindow.setPosition(
      new PhysicalPosition(frame.position.x, frame.position.y)
    );
  }
}
