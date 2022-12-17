import { ConfigController } from '$lib/modules/shared/controllers';
import { ChannelService } from '$lib/modules/shared/services';
import { FancyZonesController } from './facy-zones.controller';
import { WindowManagerController } from './window-manager.controller';

export class OverlaySettingsController {
  static readonly instance = new OverlaySettingsController();

  windowManagerController = WindowManagerController.instance;
  fancyZonesController = FancyZonesController.instance;
  private lastWindowManagerEnabledState = false;

  async init() {
    ChannelService.instance.listenBroadcast((event) => {
      if (ConfigController.instance.isDebugMode) {
        console.log(event);
      }

      const handler = {
        window_manager_enabled: () => {
          this.lastWindowManagerEnabledState = event.enabled;
          if (event.enabled) {
            this.windowManagerController.start();
          } else {
            this.windowManagerController.stop();
          }
        },
        fancy_zones_enabled: async () => {
          if (event.enabled) {
            this.windowManagerController.setDisabled(true);
            await this.windowManagerController.stop();
            await this.fancyZonesController.start();
          } else {
            this.windowManagerController.setDisabled(false);
            await this.fancyZonesController.stop();
            if (this.lastWindowManagerEnabledState) {
              this.windowManagerController.start();
            } else {
              this.windowManagerController.stop();
            }
          }
        },
      }[event.type];

      if (handler) {
        handler();
      }
    });
  }
}
