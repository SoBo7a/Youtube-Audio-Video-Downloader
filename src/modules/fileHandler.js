const express = require('express');
const ytdl = require('ytdl-core');
const fs = require('fs');
const os = require('os')
const path = require('path');
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
