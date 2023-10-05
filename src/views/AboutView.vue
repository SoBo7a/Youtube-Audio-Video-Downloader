<template>
  <div class="about">
    <div class="about-header">
      <h2>About YouTube Audio/Video Downloader</h2>
    </div>
    <div class="about-content">
      <p>
        YouTube Downloader is a powerful application that allows you to download both
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
      <p><strong>Version: </strong> {{ appVersion }}</p>
      <p>
        This application is open-source and hosted on GitHub. You can find the source code
        and contribute to the project by visiting the GitHub repository:
        <a href="https://github.com/SoBo7a/Youtube-Audio-Video-Downloader" target="_blank"
          >GitHub Repository</a
        >
      </p>
      <p class="disclaimer">
        Disclaimer: YouTube Downloader is an independent project and is not affiliated
        with, endorsed by, or connected to YouTube in any way. YouTube is a registered
        trademark of Google LLC.
      </p>
    </div>
  </div>
</template>

<script>
import packageJson from "../../package.json";

export default {
  data() {
    return {
      appVersion: packageJson.version,
    };
  },
};
</script>
