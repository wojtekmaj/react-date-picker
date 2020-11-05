export const muteConsole = () => {
  jest.spyOn(global.console, 'log').mockImplementation(() => {});
  jest.spyOn(global.console, 'error').mockImplementation(() => {});
  jest.spyOn(global.console, 'warn').mockImplementation(() => {});
};

export const restoreConsole = () => {
  global.console.log.mockRestore();
  global.console.error.mockRestore();
  global.console.warn.mockRestore();
};
