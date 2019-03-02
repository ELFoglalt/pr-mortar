// This helper remembers the size and position of your windows (and restores
// them in that place after app relaunch).
// Can be used for more than one window, just construct many
// instances of it and give each different name.

import { app, BrowserWindow, screen } from 'electron'; // eslint-disable-line
import jetpack from 'fs-jetpack';

export default (name, constructorOptions, otherOptions = {}) => {
  const userDataJetpack = jetpack.cwd(app.getPath('userData'));
  const stateFile = `window-${name}-state.json`;

  let win;
  let state;

  const restoreState = () => {
    let state = {};
    try {
      state = userDataJetpack.read(stateFile, 'json');
    } catch (err) {
      // For some reason json can't be read (might be corrupted).
      // No worries, we have defaults.
    }
    return Object.assign({}, { otherOptions }, state);
  };

  const getCurrentState = () => {
    const position = win.getPosition();
    const size = win.getSize();
    const maximized = win.isMaximized();

    return {
      constructorOptions: {
        x: position[0],
        y: position[1],
        width: size[0],
        height: size[1],
      },
      otherOptions: {
        maximized,
      },
    };
  };

  const updateState = () => {
    const newState = getCurrentState();

    Object.assign(state.otherOptions, newState.otherOptions);

    if (!win.isMinimized() && !win.isMaximized()) {
      Object.assign(state.constructorOptions, newState.constructorOptions);
    }

    userDataJetpack.write(stateFile, state, { atomic: true });
  };


  state = restoreState();
  const options = Object.assign({}, constructorOptions, state.constructorOptions);

  win = new BrowserWindow(options);
  win.once('ready-to-show', () => {
    if (state.otherOptions.maximized) win.maximize();
    updateState();
  });
  win.on('maximize', updateState);
  win.on('unmaximize', updateState);
  win.on('close', updateState);

  return win;
};
