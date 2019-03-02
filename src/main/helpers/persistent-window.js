import { app, BrowserWindow, screen } from 'electron'; // eslint-disable-line

class PersistentBrowserWindow extends BrowserWindow {
  constructor(options) {
    super(options);
  }
}

export default PersistentBrowserWindow;
