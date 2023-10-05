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
