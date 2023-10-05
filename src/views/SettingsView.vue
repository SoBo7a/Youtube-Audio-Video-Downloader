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
export default {
  data() {
    return {
      audioDownloadPath: '', // Data property for audio download path
      videoDownloadPath: '', // Data property for video download path
    };
  },
  created() {
    // Fetch settings data when the component is created
    this.fetchSettings();
  },
  methods: {
    // Method to fetch settings data from the API endpoint
    fetchSettings() {
      fetch('http://localhost:3000/api/settings')
        .then((response) => response.json())
        .then((data) => {
          // Update the component data properties with the fetched settings
          this.audioDownloadPath = data.audioDownloadPath;
          this.videoDownloadPath = data.videoDownloadPath;
        })
        .catch((error) => {
          console.error('Error fetching settings:', error);
        });
    },
    updateSettings() {
      // Create an object with the updated settings data
      const updatedSettings = {
        audioDownloadPath: this.audioDownloadPath,
        videoDownloadPath: this.videoDownloadPath,
        // Add other settings properties as needed
      };

      // Send an HTTP POST request to update the settings
      fetch('http://localhost:3000/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSettings),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Settings updated:', data);
        })
        .catch((error) => {
          console.error('Error updating settings:', error);
        });
    },
    updateAudioPath() {
      // Handle the update of audio download path
      // You can save this path to your application state or a configuration file
      console.log('Updated audio download path:', this.audioDownloadPath);
    },
    updateVideoPath() {
      // Handle the update of video download path
      // You can save this path to your application state or a configuration file
      console.log('Updated video download path:', this.videoDownloadPath);
    },
    openFolderDialog(target) {
      const inputField = document.createElement('input');
      inputField.type = 'file';
      inputField.setAttribute('webkitdirectory', ''); // Add the webkitdirectory attribute
      inputField.addEventListener('change', (event) => {
        if (event.target.files && event.target.files.length > 0) {
          const selectedPath = event.target.files[0].path.split('\\');
          selectedPath.pop(); // Remove the last item (the filename)
          const folderPath = selectedPath.join('/');
          if (target === 'audioDownloadPath') {
            this.audioDownloadPath = folderPath;
          } else if (target === 'videoDownloadPath') {
            this.videoDownloadPath = folderPath;
          }

          this.updateSettings()
        }
      });
      inputField.click();
    },
  },
};
</script>

<style scoped>
/* Add your component-specific styles here */
.settings-page {
  padding: 20px;
}

.setting {
  margin-bottom: 20px;
}

.input-with-button {
  display: flex;
  align-items: center;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

input {
  flex: 1;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
