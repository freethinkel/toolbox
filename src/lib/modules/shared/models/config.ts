export class Config {
  windowPadding: number;
  windowGap: number;
  accentColor: string;
  borderWidth: number;
  borderRadius: number;

  constructor(self: Config) {
    this.windowPadding = self.windowPadding;
    this.windowGap = self.windowGap;
    this.accentColor = self.accentColor;
    this.borderWidth = self.borderWidth;
    this.borderRadius = self.borderRadius;
  }

  static default: Config = {
    windowPadding: 10.0,
    windowGap: 10.0,
    accentColor: '#0a84ff',
    borderWidth: 2.0,
    borderRadius: 10.0,
  };

  static normalize(config: Partial<Config>): Config {
    const merged = Object.fromEntries(
      Object.entries({
        windowPadding: Number(config.windowPadding),
        windowGap: Number(config.windowGap),
        accentColor: config.accentColor ?? this.default.accentColor,
        borderWidth: Number(config.borderWidth),
        borderRadius: Number(config.borderRadius),
      }).map(([key, value]) => [
        key,
        typeof value === 'number' && isNaN(value) ? this.default[key] : value,
      ])
    ) as Config;

    return merged;
  }

  static fromMap(map: any): Config {
    return new Config({
      windowGap: map.window_gap,
      windowPadding: map.window_padding,
      accentColor: map.accent_color,
      borderWidth: map.borderWidth,
      borderRadius: map.borderRadius,
    });
  }
}
