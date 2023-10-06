# Youtube Audio/Video Downloader

YouTube Video Downloader is an independent desktop application developed using Vue 3 and compiled with "vue-electron-builder." It provides a convenient way to download audio and video content from YouTube videos.

Please note that YouTube Video Downloader is not affiliated with or endorsed by YouTube or its parent company.

This program comes with ABSOLUTELY NO WARRANTY.

<br>

## Features

- Download both audio and video from YouTube videos.
- Supports downloading multiple URLs simultaneously.
- Automatic application updates.
- Dark mode for a comfortable viewing experience.
- And more features to come...

<br>

## Installation

To use the app, please follow the steps below:

- Go to the [releases section](https://github.com/SoBo7a/Youtube-Audio-Video-Downloader/releases) of this GitHub repository.
- Download the latest version of the app for your operating system.
- When downloading the app, your web browser and operating system may display warnings about the installer. You can safely disregard these warnings.
- Once the download is complete, locate the downloaded file and run the installer.
- Follow the installation prompts to complete the installation process.
- After the installation is finished, you can launch the app from your desktop or applications menu.

Please note that if you encounter any warnings during the installation process, they can be safely ignored as the app is open-source and doesn't contain any malicious code. If you prefer, you can also build the application yourself by following the instructions below.

<br>

## Updates

The app automatically checks for new versions every time it is launched. Additionally, you can manually trigger a check for updates from the "About" page. 

If a new version is available, you have two options:
1. **Install Now:** If you choose to update the app instantly, it will download and install the update immediately. Once the update is installed, the app will automatically restart itself, ensuring you have the latest version.

2. **Install Later:** If you prefer to install the update at a later time, the app will remember the pending update. On the next app launch, it will automatically install the update before starting. This allows you to continue using the app without interruptions and update it at your convenience.

To manually update the app, you can follow these steps:
- Uninstall the old version of the app from your system.
- Visit the [releases section](https://github.com/SoBo7a/Youtube-Audio-Video-Downloader/releases) on GitHub.
- Download the latest version of the app.
- Install the downloaded version on your system.

<br>

## Development Setup

### Prerequisites

- Node.js (version 16.15.1^)
- npm (version 8.11.0^)

<br>

### Clone the Repository

```shell
git clone https://github.com/SoBo7a/Youtube-Audio-Video-Downloader.git
cd youtube-downloader
```

<br>

### Install Dependencies

```shell
npm install
```

<br>

### Compiles and hot-reloads for development

```shell
npm run electron:serve
```

<br>

### Compiles and minifies for production

```shell
npm run electron:build
```

<br>

### Compiling, Minifying, and Creating a New GitHub Release

- First, you'll need to create a [GitHub Access-Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) if you haven't already. This token will be used to authenticate your app and enable the release creation process.
- Once you have your GitHub Access Token, create a new file named .env in the root directory of your project.
- Open the .env file and add the following line, replacing <YOUR_ACCESS_TOKEN> with your actual GitHub Access Token:
```javascript
GH_TOKEN=<YOUR_ACCESS_TOKEN>
```
- Save the .env file.

- Run the following command in your terminal or command prompt:

```shell
npm run electron:deploy
```
This command will compile and minify your app for production and automatically create a new GitHub release.

- Once the release process is complete, your new release will be available on the GitHub repository's releases page.

<br>

### Customize Configuration

For customizing the Vue configuration, refer to the [Configuration Reference Vue](https://cli.vuejs.org/config/).

For customizing the Electron configuration, refer to the [Configuration Reference Electron](https://nklayman.github.io/vue-cli-plugin-electron-builder/).

<br>

## Contributing

Contributions are very welcome!

<br>

## Warranty 

This program comes with ABSOLUTELY NO WARRANTY.

<br>

## Support

For any questions or issues, please reach out to the project maintainers or open an issue in the [issue tracker](https://github.com/SoBo7a/Youtube-Audio-Video-Downloader/issues).

<br>

## License

This project as a whole is licensed under the [MIT License](https://github.com/SoBo7a/Youtube-Audio-Video-Downloader/blob/main/LICENSE.txt). Individual files may have a different, but compatible license.