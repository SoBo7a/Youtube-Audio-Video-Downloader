<template>
  <div>
    <h1>YouTube Audio/Video Downloader</h1>
    <div class="input-container">
      <!-- Input field for entering URLs -->
      <input v-model="videoUrl" placeholder="Enter YouTube Video URL" />
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

      <!-- List of URLs to download -->
      <div class="url-list">
        <div v-for="(url, index) in urlList" :key="index" class="url-item">
          {{ url.title }}
          <font-awesome-icon :icon="['fas', 'times']" @click="removeUrlFromList(index)" class="remove-icon" />
        </div>
      </div>
    </div>

    <!-- Notification component -->
    <NotificationComponent :message="notificationMessage" :type="notificationType" />
  </div>
</template>

<script>
import axios from 'axios'; // Import Axios for making HTTP requests
import NotificationComponent from '../components/NotificationComponent.vue'; // Import the Notification component
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
  components: {
    'font-awesome-icon': FontAwesomeIcon,
    NotificationComponent,
  },
  data() {
    return {
      videoUrl: '',
      videoQuality: 'highest', // Default to highest quality
      notificationMessage: '',
      notificationType: '',
      downloadAudioOnly: false, // Initialize as downloading video
      downloading: false, // Track the download state
      urlList: [], // List of URLs to download
    };
  },
  methods: {
    async addUrlToList() {
      if (this.videoUrl) {
        try {
          // Make an HTTP GET request to the video URL to fetch the HTML content
          const response = await axios.get(this.videoUrl);

          // Extract the video title from the HTML source using a regular expression
          const titleMatch = response.data.match(/<title[^>]*>([^<]+)<\/title>/i);
          const videoTitle = titleMatch ? titleMatch[1] : 'Unknown Title';

          this.urlList.push({ url: this.videoUrl, title: videoTitle });
          this.videoUrl = ''; // Clear the input field
        } catch (error) {
          console.error('Error fetching video details:', error);
          this.showNotification('Error fetching video details.', 'error');
        }
      }
    },
    removeUrlFromList(index) {
      this.urlList.splice(index, 1);
    },
    async downloadVideos() {
      if (this.urlList.length === 0) {
        this.showNotification('Please add at least one URL to download.', 'error');
        return;
      }

      // Set downloading to true to show the loading indicator
      this.downloading = true;

      for (const urlObject of this.urlList) {
        const url = urlObject.url;
        try {
          // Make a POST request to your Express server to trigger the video download
          // eslint-disable-next-line
          const response = await axios.post('http://localhost:3000/downloadVideo', {
            videoUrl: url,
            quality: this.videoQuality, // Pass the selected quality to the server
            audioOnly: this.downloadAudioOnly, // Pass the download mode to the server
          });

          // Handle the response from the server
          this.showNotification(`Video from ${urlObject.title} downloaded successfully.`, 'success');
        } catch (error) {
          console.error(`Error downloading video from ${urlObject.title}:`, error);
          this.showNotification(`Error downloading video from ${urlObject.title}.`, 'error');
        }
      }

      // Clear the list of URLs and reset the download state
      this.urlList = [];
      this.downloading = false;
    },
    toggleDownloadMode() {
      this.downloadAudioOnly = !this.downloadAudioOnly;
    },
    showNotification(message, type) {
      this.notificationMessage = message;
      this.notificationType = type;
      setTimeout(() => {
        this.notificationMessage = '';
        this.notificationType = '';
      }, 5000); // Hide the notification after 5 seconds
    },
  },
};
</script>
