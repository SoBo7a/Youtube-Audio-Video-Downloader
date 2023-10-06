'use strict';

import { app, protocol, BrowserWindow, ipcMain, dialog, nativeTheme } from 'electron';
import { autoUpdater } from 'electron-updater';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { shell } from 'electron';
import ytdl from 'ytdl-core';
import sanitize from 'sanitize-filename';
const isDevelopment = process.env.NODE_ENV !== 'production';

const tempDir = app.getPath('temp');
const versionFilePath = path.join(tempDir, 'youtube-video-audio-downloader-version.txt');

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);

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

  ipcMain.on('theme-changed', (event, theme) => {
    // Set the app's theme based on the received theme or the system preference
    if (theme === 'dark') {
      win.webContents.executeJavaScript('document.body.classList.add("dark-mode");');
    } else {
      win.webContents.executeJavaScript('document.body.classList.remove("dark-mode");');
    }
  });

  ipcMain.on('download-video', async (event, { videoUrl, quality, audioOnly }) => {
    try {
      const videoInfo = await ytdl.getInfo(videoUrl);
      const videoTitle = videoInfo.videoDetails.title;
      const sanitizedVideoTitle = sanitize(videoTitle);
  
      const userDataPath = path.join(os.homedir(), 'AppData', 'Local', 'YoutubeDownloader');
      const settingsFilePath = path.join(userDataPath, 'settings.json');
  
      // Read the settings file
      const data = fs.readFileSync(settingsFilePath, 'utf8');
      const settings = JSON.parse(data);
  
      let downloadMode = 'audioandvideo';
      let downloadPath;
  
      if (audioOnly) {
        downloadMode = 'audioonly';
        downloadPath = settings.audioDownloadPath || path.join(__dirname, 'audio');
      } else {
        downloadPath = settings.videoDownloadPath || path.join(__dirname, 'video');
      }
  
      const videoPath = path.join(downloadPath, `${sanitizedVideoTitle}.${audioOnly ? 'mp3' : 'mp4'}`);
  
      const stream = ytdl(videoUrl, {
        filter: downloadMode,
        quality: quality,
      });
  
      stream.pipe(fs.createWriteStream(videoPath));
  
      stream.on('end', () => {
        console.log('Video downloaded and saved:', videoPath);
        event.sender.send('download-video-success', 'Video downloaded successfully.');
      });
  
      stream.on('error', (error) => {
        console.error('Error during download:', error);
        event.sender.send('download-video-error', 'Error saving video.');
      });
    } catch (error) {
      console.error('Error downloading video:', error);
      event.sender.send('download-video-error', 'Error saving video.');
    }
  });

  autoUpdater.on('error', (error) => {
    win.webContents.send('update_error', error);
  })

  win.once('ready-to-show', () => {
    // Check if update was installed
    if (fs.existsSync(versionFilePath)) {
      if (fs.readFileSync(versionFilePath, 'utf8') !== app.getVersion()) {
        let changelogPath
        if (process.env.WEBPACK_DEV_SERVER_URL) {
          changelogPath = path.join(__dirname, '..', 'CHANGELOG.md');
        } else {
          changelogPath = path.join(__dirname, '..', '..', 'CHANGELOG.md');
        }
        const releaseNotes = fs.readFileSync(changelogPath, 'utf8');
        const version = app.getVersion();
        win.webContents.send('app-updated', {
          version: version,
          releaseNotes: releaseNotes,
        });
      }
      fs.unlinkSync(versionFilePath);
    }

    autoUpdater.checkForUpdates();
  });

  ipcMain.on("check-for-updates", () => {
    autoUpdater.on("update-not-available", () => {
      win.webContents.send("update_not_found");
  });
  
    autoUpdater.checkForUpdates();
  });

  autoUpdater.on('update-available', () => {
    win.webContents.send('update_available');
  });

  autoUpdater.on('download-progress', (progressObj) => {
    const downloadProgress = progressObj.percent;
    win.webContents.send('download-progress', downloadProgress);
  });
  
  let updateDownloaded = false;
  autoUpdater.on('update-downloaded', () => {
    win.webContents.send('update_downloaded');
    updateDownloaded = true;

    // Create Text file with current version to use for check, if update was installed
    fs.writeFileSync(versionFilePath, app.getVersion());
  });
  
  ipcMain.on('install-now', () => {
    setImmediate(() => {
      autoUpdater.quitAndInstall(true, true);
    })
  });

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

function readSettings() {
  const settingsFilePath = getSettingsFilePath();

  try {
    if (fs.existsSync(settingsFilePath)) {
      const data = fs.readFileSync(settingsFilePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading settings:', error);
  }

  return {
    audioDownloadPath: '',
    videoDownloadPath: '',
    theme: 'light',
  }
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
