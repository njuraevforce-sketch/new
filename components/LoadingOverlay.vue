<template>
  <transition name="fade">
    <div v-if="visible" class="loading-overlay">
      <div class="loading-content">
        <div class="spinner-container">
          <div class="spinner" :style="spinnerStyle"></div>
          <div v-if="showText" class="loading-text">{{ message }}</div>
        </div>
        
        <div v-if="progress !== null" class="loading-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
          <div class="progress-text">{{ progress }}%</div>
        </div>
        
        <button v-if="showCancel" class="loading-cancel" @click="cancel">
          Cancel
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  spinnerSize: {
    type: Number,
    default: 50
  },
  spinnerColor: {
    type: String,
    default: '#4e7771'
  },
  spinnerThickness: {
    type: Number,
    default: 4
  },
  backgroundColor: {
    type: String,
    default: 'rgba(0, 0, 0, 0.7)'
  },
  textColor: {
    type: String,
    default: '#ffffff'
  },
  showText: {
    type: Boolean,
    default: true
  },
  showCancel: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['cancel'])

const visible = ref(false)
const message = ref('Loading...')
const progress = ref(null)
const cancelCallback = ref(null)

const spinnerStyle = computed(() => ({
  width: `${props.spinnerSize}px`,
  height: `${props.spinnerSize}px`,
  borderWidth: `${props.spinnerThickness}px`,
  borderColor: `${props.spinnerColor} transparent transparent transparent`
}))

const show = (msg = 'Loading...', options = {}) => {
  visible.value = true
  message.value = msg
  progress.value = options.progress || null
  cancelCallback.value = options.onCancel || null
}

const hide = () => {
  visible.value = false
  message.value = 'Loading...'
  progress.value = null
  cancelCallback.value = null
}

const setProgress = (value) => {
  progress.value = Math.min(100, Math.max(0, value))
}

const setMessage = (msg) => {
  message.value = msg
}

const cancel = () => {
  if (cancelCallback.value && typeof cancelCallback.value === 'function') {
    cancelCallback.value()
  }
  emit('cancel')
  hide()
}

// Expose methods
defineExpose({
  show,
  hide,
  setProgress,
  setMessage,
  cancel
})
</script>

<style lang="scss" scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: v-bind('props.backgroundColor');
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
  backdrop-filter: blur(3px);
}

.loading-content {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 30px;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-width: 200px;
  max-width: 300px;
}

.spinner-container {
  margin-bottom: 20px;
}

.spinner {
  display: inline-block;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

.loading-text {
  color: v-bind('props.textColor');
  font-size: 14px;
  font-weight: 500;
  margin-top: 10px;
}

.loading-progress {
  margin-top: 20px;
  
  .progress-bar {
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 8px;
    
    .progress-fill {
      height: 100%;
      background: v-bind('props.spinnerColor');
      border-radius: 3px;
      transition: width 0.3s ease;
    }
  }
  
  .progress-text {
    color: v-bind('props.textColor');
    font-size: 12px;
    font-weight: 500;
  }
}

.loading-cancel {
  margin-top: 20px;
  padding: 8px 20px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: v-bind('props.textColor');
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  &:active {
    transform: scale(0.98);
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// Responsive
@media (max-width: 576px) {
  .loading-content {
    padding: 20px;
    margin: 20px;
  }
}
</style>
