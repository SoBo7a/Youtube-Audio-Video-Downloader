const express = require('express');
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');
const os = require('os');
const sanitize = require('sanitize-filename');
const app = express();
const port = 3000;

app.use(express.json());

function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

app.post('/downloadVideo', async (req, res) => {
  try {
    const { videoUrl, quality, audioOnly } = req.body;
    const videoInfo = await ytdl.getInfo(videoUrl);
    const videoTitle = videoInfo.videoDetails.title;

    // Sanitize the video title to remove special characters
    const sanitizedVideoTitle = sanitize(videoTitle);

    const downloadsFolder = path.join(os.homedir(), 'Downloads');
    let videoPath = path.join(downloadsFolder, `${sanitizedVideoTitle}.mp4`);
    
    let downloadMode = 'audioandvideo'

    if (audioOnly) {
      downloadMode = 'audioonly'
      videoPath = path.join(downloadsFolder, `${sanitizedVideoTitle}.mp3`);
    }

    console.log(downloadMode);
    
    const stream = ytdl(videoUrl, {
      filter: downloadMode,
      quality: quality, 
    });

    stream.pipe(fs.createWriteStream(videoPath));

    stream.on('end', () => {
      console.log('Video downloaded and saved:', videoPath);
      res.status(200).send('Video downloaded successfully.');
    });

    stream.on('error', (error) => {
      console.error('Error during download:', error);
      res.status(500).send('Error saving video.');
    });
  } catch (error) {
    console.error('Error downloading video:', error);
    res.status(500).send('Error saving video.');
  }
});


app.get('/api/settings', (req, res) => {
  const userDataPath = path.join(os.homedir(), 'AppData', 'Local', 'YoutubeDownloader');
  const settingsFilePath = path.join(userDataPath, 'settings.json');

  console.log(settingsFilePath)

  try {
    // Check if the file exists
    if (!fs.existsSync(settingsFilePath)) {
      // If it doesn't exist, create it with default values
      ensureDirectoryExists(userDataPath);

      const defaultSettings = {
        audioDownloadPath: '', // Default audio download path
        videoDownloadPath: '', // Default video download path
      };

      fs.writeFileSync(settingsFilePath, JSON.stringify(defaultSettings, null, 2));
    }

    // Read the settings file
    const data = fs.readFileSync(settingsFilePath, 'utf8');
    const settings = JSON.parse(data);
    res.json(settings);
  } catch (error) {
    console.error('Error reading settings:', error);
    res.status(500).json({ error: 'Failed to read settings.' });
  }
});


app.post('/api/settings', (req, res) => {
  const userDataPath = path.join(os.homedir(), 'AppData', 'Local', 'YoutubeDownloader');
  const settingsFilePath = path.join(userDataPath, 'settings.json');
  const updatedSettings = req.body; // Assuming the request body contains the updated settings

  console.log(updatedSettings)

  try {
    fs.writeFileSync(settingsFilePath, JSON.stringify(updatedSettings, null, 2));
    res.json({ message: 'Settings updated successfully.' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
