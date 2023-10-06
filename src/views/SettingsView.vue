<!---------------------------------------------------------------------------------------------
 *  Copyright (c) SoBo7a. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------->

<template>
  <div class="settings-page">
    <div class="setting">
      <label>Theme:</label>
      <div class="theme-radio">
        <label>
          <input
            type="radio"
            v-model="theme"
            value="light"
            @change="updateSettings"
          />
          Light
        </label>
      </div>
      <div class="theme-radio">
        <label>
          <input
            type="radio"
            v-model="theme"
            value="dark"
            @change="updateSettings"
          />
          Dark
        </label>
      </div>
    </div>

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
      theme: 'light',
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
      ipcRenderer.send('fetch-settings');
      ipcRenderer.once('settings-fetched', (event, settings) => {
        this.audioDownloadPath = settings.audioDownloadPath;
        this.videoDownloadPath = settings.videoDownloadPath;
        this.theme = settings.theme || 'light';
      });
    },
    updateSettings() {
      const updatedSettings = {
        audioDownloadPath: this.audioDownloadPath,
        videoDownloadPath: this.videoDownloadPath,
        theme: this.theme,
      };

      ipcRenderer.send('update-settings', updatedSettings);

      // Emit a custom event to notify the main process of theme change
      ipcRenderer.send('theme-changed', this.theme);
    },
  },
};
</script>
