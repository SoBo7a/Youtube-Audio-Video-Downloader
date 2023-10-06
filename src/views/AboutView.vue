<!---------------------------------------------------------------------------------------------
 *  Copyright (c) SoBo7a. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------->

<template>
  <div class="about">
    <div class="about-header">
      <h2>About</h2>
    </div>
    <div class="about-content">
      <p>
        YouTube Audio/Video Downloader is a application that allows you to download both
        audio and video content from YouTube. Save your favorite videos and music for
        offline enjoyment.
      </p>
      <p>
        <strong>Author: </strong>
        <a href="https://github.com/SoBo7a" target="_blank">SoBo7a</a>
      </p>
      <p>
        <strong>License: </strong>
        <a href="https://opensource.org/licenses/MIT" target="_blank">MIT License</a>
      </p>
      <p>
        <strong>Version: </strong>
        <a href="https://github.com/SoBo7a/Youtube-Audio-Video-Downloader/releases" target="_blank">
          {{ appVersion }} 
        </a> 
        <font-awesome-icon
            :icon="['fa', 'arrows-rotate']"
            @click="checkForUpdates"
            class="fa-icon update-icon"
            :class="{ 'rotate': isUpdating }"
        />
      </p>
      <div v-if="showNoUpdateMsg" class="update-not-found pulsing" style="color: green;"><strong>You already use the latest version...</strong></div>
      <div v-if="showErrorMsg" class="error-msg pulsing" style="color: red;"><strong>Failed to check for updates...</strong></div>
      <p>
        This application is open-source and hosted on GitHub. You can find the source code
        and contribute to the project by visiting the GitHub repository:
        <a
          href="https://github.com/SoBo7a/Youtube-Audio-Video-Downloader"
          target="_blank"
        >
          GitHub Repository
        </a>
      </p>
      <p class="disclaimer">
        Disclaimer: YouTube Downloader is an independent project and is not affiliated
        with, endorsed by, or connected to YouTube in any way. YouTube is a registered
        trademark of Google LLC.
      </p>
      <a href="https://www.flaticon.com/free-icons/video" title="video icons" style="font-size: small;">Application icon created by Freepik - Flaticon</a>
    </div>
  </div>
</template>

<script>
import packageJson from "../../package.json";
import { ipcRenderer } from "electron";

export default {
  data() {
    return {
      appVersion: packageJson.version,
      showNoUpdateMsg: false,
      isUpdating: false,
      showErrorMsg: false,

      timeToUpdateTimeout: 15000,
      timeToShowMsg: 10000,
    }
  },
  methods: {
    checkForUpdates() {
      if (this.isUpdating) {
        return;
      }

      this.isUpdating = true;
      ipcRenderer.send("check-for-updates");

      const updateTimeout = setTimeout(() => {
        this.handleUpdateTimeout();
      }, this.timeToUpdateTimeout);

      ipcRenderer.on("update_error", () => {
        clearTimeout(updateTimeout);
        this.handleUpdateError();
      });

      ipcRenderer.on("update_not_found", () => {
        clearTimeout(updateTimeout);
        this.handleUpdateNotFound();
      });

      ipcRenderer.on("update_available", () => {
        clearTimeout(updateTimeout);
        this.handleUpdateAvailable();
      });
    },
    handleUpdateTimeout() {
      this.showNoUpdateMsg = false;
      this.showErrorMsg = true;
      this.isUpdating = false;

      setTimeout(() => {
        this.showErrorMsg = false;
      }, this.timeToShowMsg);
    },

    handleUpdateError() {
      this.showNoUpdateMsg = false;
      this.showErrorMsg = true;
      this.isUpdating = false;

      setTimeout(() => {
        this.showErrorMsg = false;
      }, this.timeToShowMsg);
    },

    handleUpdateNotFound() {
      this.showNoUpdateMsg = true;
      this.showErrorMsg = false;
      this.isUpdating = false;

      setTimeout(() => {
        this.showNoUpdateMsg = false;
      }, this.timeToShowMsg);
    },

    handleUpdateAvailable() {
      this.isUpdating = false;
      this.showNoUpdateMsg = false;
      this.showErrorMsg = false;
    },
  },
};
</script>
