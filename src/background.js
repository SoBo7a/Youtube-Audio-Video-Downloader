'use strict';

import { app, protocol, BrowserWindow, ipcMain, dialog } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { shell } from 'electron';
const isDevelopment = process.env.NODE_ENV !== 'production';

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);

let expressServer;

// Function to start the Express server
function startExpressServer() {
  const child_process = require('child_process');
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    expressServer = child_process.spawn('node', ['src/modules/fileHandler.js']);
  } else {
    const filePath = path.join(__dirname, '..', 'fileHandler.js');
    expressServer = child_process.spawn('node', [filePath]);
  }
}

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    // frame: false,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      webSecurity: false,
    },
  });

  // Hide default Electron Menu
  // const menu = Menu.buildFromTemplate([]);
  // Menu.setApplicationMenu(menu);

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the URL of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('app://./index.html');
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS, it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Function to get the settings file path
function getSettingsFilePath() {
  const userDataPath = path.join(os.homedir(), 'AppData', 'Local', 'YoutubeDownloader');
  return path.join(userDataPath, 'settings.json');
}

// Function to read settings from the file
function readSettings() {
  const settingsFilePath = getSettingsFilePath();
  console.log(settingsFilePath)

  try {
    if (fs.existsSync(settingsFilePath)) {
      const data = fs.readFileSync(settingsFilePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading settings:', error);
  }

  // If the settings file doesn't exist or there's an error, return default settings
  return {
    audioDownloadPath: '',
    videoDownloadPath: '',
  };
}

// Function to write settings to the file
function writeSettings(updatedSettings) {
  const settingsFilePath = getSettingsFilePath();

  try {
    fs.writeFileSync(settingsFilePath, JSON.stringify(updatedSettings, null, 2));
  } catch (error) {
    console.error('Error updating settings:', error);
  }
}

ipcMain.on('fetch-settings', (event) => {
  const settings = readSettings();
  event.reply('settings-fetched', settings);
});

ipcMain.on('update-settings', (event, updatedSettings) => {
  writeSettings(updatedSettings);

  // event.reply('settings-updated', 'Settings updated successfully');
});

ipcMain.on('open-folder-dialog', (event, target) => {
  // Show the folder dialog
  dialog
    .showOpenDialog({
      properties: ['openDirectory'],
    })
    .then((result) => {
      if (!result.canceled && result.filePaths.length > 0) {
        const folderPath = result.filePaths[0];

        console.log(folderPath)
        // Send the selected folder path back to the renderer process
        event.reply('folder-selected', { target, folderPath });
      }
    })
    .catch((err) => {
      console.error('Error opening folder dialog:', err);
    });
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS);
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }
  createWindow();
  startExpressServer();
});

// Exit cleanly on request from the parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
