<!---------------------------------------------------------------------------------------------
 *  Copyright (c) SoBo7a. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------->

<template>
  <div class="backdrop" v-if="state === 'updated'" @click="closeNotification"></div>

  <div
    v-if="visible"
    class="update-notification"
    :class="{ pulsing: state === 'downloading', updated: state === 'updated' }"
  >
    <div class="update-close-button" @click="closeNotification" v-if="state === 'updated' || state === 'downloaded'">
      <font-awesome-icon :icon="['fas', 'circle-xmark']" class="fa-icon" />
    </div>
    <div class="update-icon-container">
      <font-awesome-icon :icon="['fas', 'circle-exclamation']" class="icon" :class="{ error: state === 'error' }" />
    </div>
    <span
      v-if="state === 'error'"
      class="error-message"
      v-html="errorMessage"
      @click="copyToClipboard(errorMessage)"
      title="Click to copy the error message to the clipboard"
    ></span>
    <span
      v-if="state === 'downloading'"
      class="update-message"
      v-html="downloadingMessage"
    ></span>
    <div v-if="state === 'downloading'" class="progress-bar-container">
      <div class="progress-bar" :style="{ width: downloadProgress + '%' }"></div>
      <div class="progress-label">{{ downloadProgress.toFixed(0) }}%</div>
    </div>
    <div v-if="state === 'downloaded'" class="downloaded-container">
      <span class="update-message" v-html="downloadedMessage"></span>
      <div class="update-button-container">
        <button class="later-button" @click="installLater" title="Install after closing the application.">Later</button>
        <button class="install-button" @click="installNow" title="Close the application and update now.">Install Now</button>
      </div>
    </div>
    <div v-if="state === 'updated'" class="updated-container">
      <div class="update-message">
        <h2>New Update Installed</h2>
        <strong>v{{ updatedVersion }}</strong>
        <h3>Release Notes:</h3>
        <ul v-if="Array.isArray(releaseNotes)">
          <li v-for="note in releaseNotes" :key="note.id" class="release-notes">
            {{ note }}
          </li>
        </ul>  
        <div v-else>
          <br><br>
          {{ releaseNotes }}
        </div> 
        <span>
          <a :href="changelogURL.replace('<v>', updatedVersion)" :title="changelogURL.replace('<v>', updatedVersion)" target="_blank" >
            View release notes on GitHub
          </a>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";

export default {
  name: "UpdateNotificationComponent",

  data() {
    return {
      visible: false,
      state: "",
      errorMessage: "",
      downloadingMessage: "",
      downloadedMessage: "",
      updatedVersion: "",
      releaseNotes: "",
      downloadProgress: 0,

      changelogURL: `https://github.com/SoBo7a/Youtube-Audio-Video-Downloader/blob/<v>/CHANGELOG.md`,
    };
  },

  created() {
    ipcRenderer.on("update_error", (event, error) => {
      this.showUpdateErrorNotification(error);
    });

    ipcRenderer.on("app-updated", (event, info) => {
      this.showUpdatedNotification(info);
    });

    ipcRenderer.on("update_available", () => {
      this.showDownloadingNotification();
    });

    ipcRenderer.on('download-progress', (event, downloadProgress) => {
      this.downloadProgress = downloadProgress;
    });

    ipcRenderer.on("update_downloaded", (event) => {
      this.showDownloadedNotification(event);
    });
  },

  methods: {
    showUpdateErrorNotification(error) {
      this.state = "error";
      this.visible = true;
      this.errorMessage = error.stack.replace(/\n/g, "<br>");

      // eslint-disable-next-line
      console.error(this.errorMessage)

      setTimeout(() => {
        this.visible = false;
        this.state = "";
      }, 20000);
    },

    showUpdatedNotification(info) {
      this.state = "updated";
      this.visible = true;
      this.updatedVersion = info.version;
      this.releaseNotes = this.formatReleaseNotes(info.releaseNotes);
      
      document.body.classList.add('about-modal-open');
    },

    showDownloadingNotification() {
      this.state = "downloading";
      this.visible = true;
      this.downloadingMessage = "A new update is available.<br>Downloading now...";
    },

    showDownloadedNotification() {
      this.state = "downloaded";
      this.visible = true;
      this.downloadedMessage = "New update downloaded.<br>Do you want to install it now?";
    },

    formatReleaseNotes(notes) {
      const startIndex = notes.indexOf(`## Changelog - v${this.updatedVersion}`);

      if (startIndex !== -1) {
        let endIndex = notes.indexOf('## Changelog', startIndex + 1);
        if (endIndex === -1) {
          endIndex = notes.length;
        }

        const currentReleaseNotes = notes.substring(startIndex, endIndex).trim();
        let listItems = currentReleaseNotes.split('\n').filter(item => item.trim().startsWith('-'));
        listItems = listItems.map(item => item.replace(/^-/, '').trim());
        
        return listItems;
      }
      
      return 'No release notes found...';
    },

    installNow() {
      this.visible = false;
      ipcRenderer.send("install-now");
    },

    installLater() {
      this.visible = false;
    },

    closeNotification() {
      this.visible = false;
      this.state = '';
      document.body.classList.remove('about-modal-open');
    },

    copyToClipboard(text) {
      navigator.clipboard.writeText(text)
    },
  },
};
</script>
