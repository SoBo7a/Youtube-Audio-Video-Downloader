/*---------------------------------------------------------------------------------------------
 *  Copyright (c) SoBo7a. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

import "./assets/scss/styles.scss";

library.add(fas);

// Use app.component instead of Vue.component
const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);

app.use(router).mount('#app');
