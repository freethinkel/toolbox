import { Child, Command } from '@tauri-apps/api/shell';

export class CaffeinateService {
  static readonly instance = new CaffeinateService();

  private process: Child | null = null;

  async start() {
    this.stop();
    const command = new Command('caffeinate', ['-di']);
    this.process = await command.spawn();
  }

  async stop() {
    if (this.process) {
      await this.process.kill();
    }
  }
}
