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
          const response = await axios.post('http://localhost:3000/downloadVideo', {
            videoUrl: url,
            quality: this.videoQuality, // Pass the selected quality to the server
            audioOnly: this.downloadAudioOnly, // Pass the download mode to the server
          });

          // Handle the response from the server
          console.log(response.data);
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

<style lang="scss" scoped>
/* Add your component-specific styles here */

.input-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap; /* Allow items to wrap to the next line */
}

.download-mode-selector,
.add-url-button {
  padding: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 5px;
  background-color: #fff;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f0f0f0;
  }
  &:active {
    background-color: #ccc;
  }
}

input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
  margin-bottom: 10px; /* Add space between input and list */
}

select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
  margin-bottom: 10px; /* Add space between select and list */
}

button {
  padding: 12px 20px;
  margin-bottom: 10px;
  background-color: #158600;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #1cb901;
}

/* Loading indicator styles */
button[disabled] {
  background-color: #ccc;
  cursor: not-allowed;
}

/* URL list styles */
.url-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}

.url-item {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remove-icon {
  margin-left: 5px;
  cursor: pointer;
  font-size: 18px;
  color: #dc3545; /* Red color */
}

.remove-icon:hover {
  color: #a52a2a; /* Darker red on hover */
}
</style>