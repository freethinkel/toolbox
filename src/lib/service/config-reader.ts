import type { Config } from '$lib/models/config';
import YAML from 'yaml';
import { fs, path } from '@tauri-apps/api';
import { watch } from 'tauri-plugin-fs-watch-api';

const paths = ['.config/toolbox/config.yml', '.toolbox.yml'];

export const defaultConfig: Config = {
  windowGap: 10,
  windowPadding: 10,
  borderRadius: 10,
  borderWidth: 2,
  accentColor: 'blue',
};

export class ConfigReader {
  static readonly instance = new ConfigReader();
  private listeners: ((config: Config) => void)[] = [];

  constructor() {
    this.getFilePath().then(async (path) => {
      if (path) {
        const unwatch = await watch(path, {}, () => {
          this.listeners.forEach((cb) => {
            this.read().then((config) => cb(config));
          });
        });
      }
    });
  }

  private async getFilePath(): Promise<string | undefined> {
    const homeDir = await path.homeDir();

    const existFile = (
      await Promise.all(
        paths.map(async (file) => {
          const filePath = await path.resolve(homeDir, file);
          const exist = fs.exists(filePath);
          return {
            path: filePath,
            exist,
          };
        })
      )
    ).find(({ exist }) => exist);

    return existFile?.path;
    // watch
  }

  listen(cb: (config: Config) => void) {
    this.listeners.push(cb);
  }

  async read(): Promise<Config> {
    try {
      const configPath = await this.getFilePath();
      if (!configPath) {
        return defaultConfig;
      }

      const configText = await fs.readTextFile(configPath);
      const parsed = YAML.parse(configText);

      const config: Config = {
        windowPadding: Number(
          parsed.window_padding ?? defaultConfig.windowPadding
        ),
        windowGap: Number(parsed.window_gap ?? defaultConfig.windowGap),
        accentColor: parsed.accent_color ?? defaultConfig.accentColor,
        borderWidth: Number(parsed.border_width ?? defaultConfig.borderWidth),
        borderRadius: Number(
          parsed.border_radius ?? defaultConfig.borderRadius
        ),
      };

      console.log('CONFIG', config);

      return config;
    } catch (err) {
      console.error(err);
      return defaultConfig;
    }
  }
}
