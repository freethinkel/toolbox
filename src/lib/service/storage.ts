export class Storage {
  static readonly instance = new Storage();

  async read<T extends unknown>(key: string): Promise<T> {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (err) {}
  }

  async write<T extends unknown>(key: string, payload: T) {
    try {
      localStorage.setItem(key, JSON.stringify(payload));
    } catch (err) {}
  }
}
