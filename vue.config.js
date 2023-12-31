/*---------------------------------------------------------------------------------------------
 *  Copyright (c) SoBo7a. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const webpack = require('webpack'); // Import webpack

module.exports = {
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      // ...other resolve options...
      fallback: {
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "stream": require.resolve("stream-browserify"),
        "querystring": require.resolve("querystring-es3"),
        "timers": require.resolve("timers-browserify"),
        "vm": require.resolve("vm-browserify"),
        "path": require.resolve("path-browserify"),
      },
    },
    plugins: [
      // Add this plugin to provide global Buffer and process objects
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      contextIsolation: true,
      
      builderOptions: {
        appId: 'youtube-audio-video-downloader',
        productName: 'Youtube Audio/Video Downloader',
        buildVersion: '0.9.4',
        "publish": [
          {
            "provider": "github",
            "owner": "SoBo7a",
            "repo": "Youtube-Audio-Video-Downloader"
          }
        ],
        releaseInfo: {
          releaseNotesFile: "CHANGELOG.md"
        },
        win: {
            "target": [
                "nsis"
            ],
          icon: 'public/icon.png',
        },
        "nsis": {
            "installerIcon": "public/icon.ico",
            "uninstallerIcon": "public/icon.ico",
            "uninstallDisplayName": "Youtube Audio/Video Downloader",
            "oneClick": false,
            "allowToChangeInstallationDirectory": true,
        },
        extraFiles: [
          {
            "from": "LICENSE.txt",
            "to": "LICENSE.txt",
            "filter": ["**/*"]
          },
          {
            "from": "README.md",
            "to": "README.md",
            "filter": ["**/*"]
          },
          {
            "from": "CHANGELOG.md",
            "to": "CHANGELOG.md",
            "filter": ["**/*"]
          },
          {
            "from": "ThirdPartyNotices.txt",
            "to": "ThirdPartyNotices.txt",
            "filter": ["**/*"]
          },
        ],
      },
    },
  },
};
