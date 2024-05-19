import { vi } from 'vitest';

export function muteConsole() {
  vi.spyOn(globalThis.console, 'log').mockImplementation(() => {
    // Intentionally empty
  });
  vi.spyOn(globalThis.console, 'error').mockImplementation(() => {
    // Intentionally empty
  });
  vi.spyOn(globalThis.console, 'warn').mockImplementation(() => {
    // Intentionally empty
  });
}

export function restoreConsole() {
  vi.mocked(globalThis.console.log).mockRestore();
  vi.mocked(globalThis.console.error).mockRestore();
  vi.mocked(globalThis.console.warn).mockRestore();
}
