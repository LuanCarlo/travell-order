<template>
  <div class="spinner-overlay" v-if="show">
    <div class="loader"></div>
    <p v-if="text" class="loading-text">{{ text }}</p>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    text: {
      type: String,
      default: 'Por favor aguarde um momento...',
    }
  }
}
</script>

<style scoped>

.spinner-overlay {
  position: absolute; 
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000; 
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db; 
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #555;
  font-size: 0.9em;
}
</style>