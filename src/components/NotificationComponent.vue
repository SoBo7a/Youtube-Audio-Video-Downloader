<template>
  <div :class="['notification', type]">
    {{ message }}
  </div>
</template>

<script>
export default {
  props: {
    message: String,
    type: String, // 'success' or 'error'
  },
  data() {
    return {
      isVisible: false,
    };
  },
  watch: {
    message: {
      handler() {
        // Automatically show the notification when a new message is received
        this.isVisible = true;

        // Automatically hide the notification after a few seconds (adjust as needed)
        setTimeout(() => {
          this.isVisible = false;
        }, 5000); // 5 seconds
      },
    },
  },
};
</script>

<style scoped>
.notification {
  position: absolute;
  top: 40%; /* Display at the bottom */
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  border-radius: 5px;
  color: white;
  text-align: center;
  opacity: 1;
  transition: opacity 0.5s;
  margin-bottom: 20px; /* Add space between notification and input */
  z-index: 1; /* Ensure the notification appears above other content */
}

.notification.success {
  background-color: #28a745; /* Green background for success */
}

.notification.error {
  background-color: #dc3545; /* Red background for error */
}
</style>
