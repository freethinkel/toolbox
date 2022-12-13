import {
  appWindow,
  LogicalSize,
  PhysicalPosition,
} from '@tauri-apps/api/window';
import { ChannelService } from '$lib/modules/shared/services';
import type { Frame } from '$lib/modules/shared/models';
import { process } from '@tauri-apps/api';

const WINDOW_SIZE = { width: 250, height: 120 };

export class StatusbarController {
  static readonly instance = new StatusbarController();

  init() {
    appWindow.setSize(new LogicalSize(WINDOW_SIZE.width, WINDOW_SIZE.height));
    // appWindow.show();

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
  }

  exit() {
    process.exit();
  }

  private setWindowFrame(frame: Frame) {
    appWindow.setSize(new LogicalSize(frame.size.width, frame.size.height));
    appWindow.setPosition(
      new PhysicalPosition(frame.position.x, frame.position.y)
    );
  }
}
