<!---------------------------------------------------------------------------------------------
 *  Copyright (c) SoBo7a. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------->

<template>
  <div>
    <h1>YouTube Audio/Video Downloader</h1>
    <div class="input-container">
      <input
        v-model="videoUrl"
        placeholder="Enter YouTube Video URL"
        @keyup.enter="addUrlToList"
        @contextmenu.prevent="pasteFromClipboard"
      />
      <div class="add-url-button" @click="addUrlToList" title="Add another URL">+</div>

      <select v-model="videoQuality" title="Select Quality">
        <option value="highest">Highest Quality</option>
        <option value="lowest">Lowest Quality</option>
      </select>

      <div class="download-mode-selector" @click="toggleDownloadMode" :title="downloadAudioOnly ? 'Audio only' : 'Audio and Video' ">
        <font-awesome-icon :icon="downloadAudioOnly ? 'volume-up' : 'video'" />
      </div>

      <button @click="downloadVideos" :disabled="downloading" title="Start downloading">
        {{ downloading ? 'Downloading...' : 'Download' }}
      </button>

      <br>
      <div class="url-list-container">
        <div class="url-list">
          <div v-for="(url, index) in urlList" :key="index" class="url-item">
            <a :href="url.url" target="_blank">{{ url.title }}</a>
            <font-awesome-icon :icon="['fas', 'times']" @click="removeUrlFromList(index)" class="remove-icon" title="Remove from List" />
          </div>
        </div>
      </div>
    </div>

    <NotificationComponent :message="notificationMessage" :type="notificationType" />
  </div>
</template>

<script>
import axios from 'axios'; 
import NotificationComponent from '../components/NotificationComponent.vue'; 
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ipcRenderer } from 'electron';

export default {
  components: {
    'font-awesome-icon': FontAwesomeIcon,
    NotificationComponent,
  },
  data() {
    return {
      videoUrl: '',
      videoQuality: 'highest',
      notificationMessage: '',
      notificationType: '',
      downloadAudioOnly: false,
      downloading: false,
      urlList: [],
      validUrlPattern: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//,
    };
  },
  methods: {
    pasteFromClipboard() {
      navigator.clipboard.readText().then((text) => {
        this.videoUrl = text; // Paste the clipboard content into the input field
      });
    },
    validateUrl() {
      if (this.validUrlPattern.test(this.videoUrl)) {
        return true
      }
      this.showNotification('This is not a valid YouTube URL.', 'error')
      return false
    },
    async addUrlToList() {
      if (this.videoUrl && this.validateUrl(this.videoUrl)) {
        try {
          const response = await axios.get(this.videoUrl);

          // Extract the video title from the HTML source using a regular expression
          const titleMatch = response.data.match(/<title[^>]*>([^<]+)<\/title>/i)
          const videoTitle = titleMatch ? titleMatch[1] : 'Unknown Title'

          this.urlList.push({ url: this.videoUrl, title: videoTitle })
          this.videoUrl = ''
        } catch (error) {
          console.error('Error fetching video details:', error)
          this.showNotification('Error fetching video details.', 'error')
        }
      } else if (this.videoUrl.length === 0) {
        this.showNotification('Nothing to add.', 'error')
      }
    },
    removeUrlFromList(index) {
      this.urlList.splice(index, 1)
    },
    async downloadVideos() {
      if (this.videoUrl.length !== 0) {
        await this.addUrlToList()
      } else if (this.videoUrl.length === 0 && this.urlList.length === 0) {
        this.showNotification('Please add at least one URL to download.', 'error')
        return
      }

      // Set downloading to true to show the loading indicator
      this.downloading = true

      for (const urlObject of this.urlList) {
        const url = urlObject.url
        try {
          // Use IPC to trigger video download in the main process
          ipcRenderer.send('download-video', {
            videoUrl: url,
            quality: this.videoQuality, // Pass the selected quality
            audioOnly: this.downloadAudioOnly, // Pass the download mode
          });

          this.showNotification(`${urlObject.title} downloaded successfully.`, 'success')
        } catch (error) {
          console.error(`Error downloading ${urlObject.title}:`, error)
          this.showNotification(`Error downloading ${urlObject.title}.`, 'error')
        }
      }

      // Clear the list of URLs and reset the download state
      this.urlList = []
      this.downloading = false
    },
    toggleDownloadMode() {
      this.downloadAudioOnly = !this.downloadAudioOnly
    },
    showNotification(message, type) {
      this.notificationMessage = message
      this.notificationType = type
      setTimeout(() => {
        this.notificationMessage = ''
        this.notificationType = ''
      }, 5000); // Hide the notification after 5 seconds
    },
  },
};
</script>
