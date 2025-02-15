import { app, shell, BrowserWindow } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import windowStateKeeper from 'electron-window-state';

// Bloquea la aplicación para que solo una instancia pueda ejecutarse
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    const mainWindow = BrowserWindow.getAllWindows()[0];
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  function createWindow() {
    const mainWindowState = windowStateKeeper({
      defaultWidth: 900,
      defaultHeight: 600,
    });

    // Crear la ventana principal
    const mainWindow = new BrowserWindow({
      width: mainWindowState.width,
      height: mainWindowState.height,
      x: mainWindowState.x,
      y: mainWindowState.y,
      show: false, // No mostrar hasta que esté lista
      resizable: true,
      fullscreenable: true,
      fullscreen: false,
      autoHideMenuBar: true,
      icon: join(__dirname, '../renderer/src/assets/icon.ico'),
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,
      },
    });

    mainWindowState.manage(mainWindow);

    mainWindow.on('ready-to-show', () => {
      mainWindow.show(); // Muestra la ventana principal
      if (is.dev) {
        mainWindow.webContents.openDevTools(); // Abre las DevTools si es en modo desarrollo
      }
    });

    // Maneja los enlaces externos
    mainWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url);
      return { action: 'deny' };
    });

    // Cargar la URL o archivo de la aplicación
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
    } else {
      mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
    }
  }

  app.whenReady().then(() => {
    electronApp.setAppUserModelId('com.electron');
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window);
    });

    createWindow();

    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}
