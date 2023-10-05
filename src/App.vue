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


export default {
  name: 'App',

  components: {
    UpdateNotificationComponent,
  },
  
}
</script>