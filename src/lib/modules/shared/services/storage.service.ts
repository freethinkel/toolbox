export class StorageService {
  static readonly instance = new StorageService();

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
