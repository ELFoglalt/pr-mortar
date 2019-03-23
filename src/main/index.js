import { app, BrowserWindow, ipcMain } from 'electron';
import { startKeyboardEvent, stopKeyboardEvent } from './modules/keyboard-hook';
import importMapWithDialog from './modules/map-import';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path') // eslint-disable-line
    .join(__dirname, '/static') // eslint-disable-line
    .replace(/\\/g, '\\\\'); // eslint-disable-line
}

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (process.env.NODE_ENV !== 'production') {
  const userDataPath = app.getPath('userData');
  app.setPath('userData', `${userDataPath}-(${process.env.NODE_ENV})`);
}

let mainWindow; // Keeping a reference to the window avoids it getting garbage collected.

const winURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:9080'
    : `file://${__dirname}/index.html`;

const browserWindowDebugOptions = {
  x: -1000,
  y: 100,
  width: 1000,
  height: 800,
};

const browserWindowDefaultOptions = {
  width: 350,
  height: 200,
  show: false,
};

function createMain() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow(Object.assign(
    {},
    browserWindowDefaultOptions,
    process.env.NODE_ENV === 'development' ? browserWindowDebugOptions : {},
  ));

  mainWindow.setMenu(null);
  mainWindow.loadURL(winURL);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  ipcMain.on('prompt-map-dialog', (event) => {
    importMapWithDialog();
    event.returnValue = true;
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.once('dom-ready', () => {
      mainWindow.webContents.openDevTools();
    });
  }
}

app.on('ready', createMain);
app.on('ready', startKeyboardEvent);
app.on('window-all-closed', stopKeyboardEvent);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createMain();
  }
});
