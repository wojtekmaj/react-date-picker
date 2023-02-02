/* eslint-env jest */

export function muteConsole() {
  jest.spyOn(global.console, 'log').mockImplementation(() => {
    // Intentionally empty
  });
  jest.spyOn(global.console, 'error').mockImplementation(() => {
    // Intentionally empty
  });
  jest.spyOn(global.console, 'warn').mockImplementation(() => {
    // Intentionally empty
  });
}

export function restoreConsole() {
  global.console.log.mockRestore();
  global.console.error.mockRestore();
  global.console.warn.mockRestore();
}
