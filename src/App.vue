<!---------------------------------------------------------------------------------------------
 *  Copyright (c) SoBo7a. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------->

<template>
  <UpdateNotificationComponent />

  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/settings">Settings</router-link> |
    <router-link to="/about">About</router-link>
  </nav>
  <router-view/>
</template>

<script>
import UpdateNotificationComponent from './components/UpdateNotificationComponent.vue'
import { ipcRenderer } from 'electron';

export default {
  name: 'App',

  components: {
    UpdateNotificationComponent,
  },

  data() {
    return {
      theme: 'light',
    };
  },

  created() {
    this.fetchSettings();

    // Listen for theme changes from the main process
    ipcRenderer.on('theme-changed', (event, newTheme) => {
      this.theme = newTheme;

      // Add or remove the 'dark-mode' class based on the received theme
      if (newTheme === 'dark') {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    });
  },

  methods: {
    fetchSettings() {
      ipcRenderer.on('settings-fetched', (event, settings) => {
        this.theme = settings.theme || 'light';

        // Add the dark-mode class to the body if the theme is 'dark'
        if (this.theme === 'dark') {
          document.body.classList.add('dark-mode');
        } else {
          document.body.classList.remove('dark-mode');
        }
      });

      ipcRenderer.send('fetch-settings');
    },
  },
}
</script>
