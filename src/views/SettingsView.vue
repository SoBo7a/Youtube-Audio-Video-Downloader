<template>
  <div class="settings-page">
    <div class="setting">
      <label for="audioPath">Audio Download Path:</label>
      <div class="input-with-button">
        <input
          type="text"
          id="audioPath"
          v-model="audioDownloadPath"
          readonly
        />
        <button @click="openFolderDialog('audioDownloadPath')">Browse</button>
      </div>
    </div>
    <div class="setting">
      <label for="videoPath">Video Download Path:</label>
      <div class="input-with-button">
        <input
          type="text"
          id="videoPath"
          v-model="videoDownloadPath"
          readonly
        />
        <button @click="openFolderDialog('videoDownloadPath')">Browse</button>
      </div>
    </div>
  </div>
</template>

<script>
const { ipcRenderer } = require('electron');

export default {
  data() {
    return {
      audioDownloadPath: '',
      videoDownloadPath: '',
    };
  },
  created() {
    ipcRenderer.on('folder-selected', (event, { target, folderPath }) => {
      if (target === 'audioDownloadPath') {
        this.audioDownloadPath = folderPath;
      } else if (target === 'videoDownloadPath') {
        this.videoDownloadPath = folderPath;
      }

      this.updateSettings();
    });

    this.fetchSettings();
  },
  methods: {
    fetchSettings() {
      // Send an IPC message to the main process to fetch settings
      ipcRenderer.send('fetch-settings');

      // Listen for the 'settings-fetched' event from the main process
      ipcRenderer.once('settings-fetched', (event, settings) => {
        this.audioDownloadPath = settings.audioDownloadPath;
        this.videoDownloadPath = settings.videoDownloadPath;
      });
    },
    updateSettings() {
      const updatedSettings = {
        audioDownloadPath: this.audioDownloadPath,
        videoDownloadPath: this.videoDownloadPath,
      };

      ipcRenderer.send('update-settings', updatedSettings);
    },
    openFolderDialog(target) {
      ipcRenderer.send('open-folder-dialog', target);
    },
  },
};
</script>
