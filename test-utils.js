import { vi } from 'vitest';

export function muteConsole() {
  vi.spyOn(global.console, 'log').mockImplementation(() => {
    // Intentionally empty
  });
  vi.spyOn(global.console, 'error').mockImplementation(() => {
    // Intentionally empty
  });
  vi.spyOn(global.console, 'warn').mockImplementation(() => {
    // Intentionally empty
  });
}

export function restoreConsole() {
  vi.mocked(global.console.log).mockRestore();
  vi.mocked(global.console.error).mockRestore();
  vi.mocked(global.console.warn).mockRestore();
}
