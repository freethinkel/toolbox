import YAML from 'yaml';
import { fs, path } from '@tauri-apps/api';
import { watch } from 'tauri-plugin-fs-watch-api';
import { Config } from '../models/config';

const paths = ['.config/toolbox/config.yml', '.toolbox.yml'];

type ConfigListener = (event: Config) => void;

export class ConfigReaderService {
  static readonly instance = new ConfigReaderService();
  private listeners: ConfigListener[] = [];
  private _unwatch: () => void | undefined;

  constructor() {
    this.init();
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
  }

  listen(cb: (config: Config) => void) {
    this.listeners.push(cb);
  }

  async read(): Promise<Config> {
    try {
      const configPath = await this.getFilePath();

      if (!configPath) {
        return Config.default;
      }

      const configText = await fs.readTextFile(configPath);
      const parsed = YAML.parse(configText);

      return Config.normalize(Config.fromMap(parsed));
    } catch (err) {
      console.error(err);
      return Config.default;
    }
  }

  private async init() {
    const path = await this.getFilePath();

    if (!path) {
      return;
    }

    this._unwatch = await watch(path, {}, () => {
      this.listeners.forEach((cb) => {
        this.read().then((config) => cb(config));
      });
    });
  }

  dispose() {
    this._unwatch?.();
  }
}
