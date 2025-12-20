<template>
  <transition name="modal-fade">
    <div v-if="visible" class="custom-modal-overlay" @click.self="close">
      <div class="custom-modal" :class="modalClass" :style="modalStyle">
        <div class="modal-header">
          <h3 class="modal-title">{{ title }}</h3>
          <button v-if="showClose" class="modal-close" @click="close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div v-if="isLoading" class="modal-loading">
            <div class="spinner"></div>
            <p>Loading...</p>
          </div>
          
          <div v-else-if="type === 'alert'" class="modal-alert">
            <div class="alert-icon" :class="alertIconClass">
              <i :class="alertIcon"></i>
            </div>
            <p class="alert-message">{{ message }}</p>
          </div>
          
          <div v-else-if="type === 'confirm'" class="modal-confirm">
            <p class="confirm-message">{{ message }}</p>
          </div>
          
          <div v-else-if="type === 'custom'" class="modal-custom">
            <div v-html="content"></div>
          </div>
        </div>
        
        <div v-if="!isLoading" class="modal-footer">
          <button 
            v-if="type === 'confirm' || showCancel" 
            class="modal-btn modal-btn-cancel"
            @click="cancel"
          >
            {{ cancelText }}
          </button>
          
          <button 
            class="modal-btn modal-btn-primary"
            :class="{'modal-btn-danger': isDanger}"
            @click="confirm"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  width: {
    type: String,
    default: '90%'
  },
  maxWidth: {
    type: String,
    default: '400px'
  },
  showClose: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['confirm', 'cancel', 'close'])

const visible = ref(false)
const title = ref('')
const message = ref('')
const content = ref('')
const type = ref('alert') // alert, confirm, custom
const isLoading = ref(false)
const isDanger = ref(false)
const confirmText = ref('OK')
const cancelText = ref('Cancel')
const onConfirm = ref(null)
const onCancel = ref(null)

const modalClass = computed(() => ({
  'modal-small': props.maxWidth === '300px',
  'modal-large': props.maxWidth === '600px',
  'modal-danger': isDanger.value
}))

const modalStyle = computed(() => ({
  width: props.width,
  maxWidth: props.maxWidth
}))

const alertIcon = computed(() => {
  if (isDanger.value) return 'fas fa-exclamation-circle'
  return 'fas fa-check-circle'
})

const alertIconClass = computed(() => ({
  'icon-success': !isDanger.value,
  'icon-danger': isDanger.value
}))

const showAlert = (msg, titleText = 'Notification', options = {}) => {
  visible.value = true
  title.value = titleText
  message.value = msg
  type.value = 'alert'
  isLoading.value = false
  isDanger.value = options.danger || false
  confirmText.value = options.confirmText || 'OK'
  onConfirm.value = options.onConfirm || null
}

const showConfirm = (msg, titleText = 'Confirm', options = {}) => {
  visible.value = true
  title.value = titleText
  message.value = msg
  type.value = 'confirm'
  isLoading.value = false
  isDanger.value = options.danger || false
  confirmText.value = options.confirmText || 'Confirm'
  cancelText.value = options.cancelText || 'Cancel'
  onConfirm.value = options.onConfirm || null
  onCancel.value = options.onCancel || null
}

const showCustom = (titleText, customContent, options = {}) => {
  visible.value = true
  title.value = titleText
  content.value = customContent
  type.value = 'custom'
  isLoading.value = false
  isDanger.value = options.danger || false
  confirmText.value = options.confirmText || 'OK'
  cancelText.value = options.cancelText || 'Cancel'
  showCancel.value = options.showCancel !== undefined ? options.showCancel : true
  onConfirm.value = options.onConfirm || null
  onCancel.value = options.onCancel || null
}

const showLoading = (msg = 'Loading...') => {
  visible.value = true
  title.value = ''
  message.value = msg
  type.value = 'alert'
  isLoading.value = true
}

const hide = () => {
  visible.value = false
  reset()
}

const confirm = () => {
  if (onConfirm.value && typeof onConfirm.value === 'function') {
    onConfirm.value()
  }
  emit('confirm')
  hide()
}

const cancel = () => {
  if (onCancel.value && typeof onCancel.value === 'function') {
    onCancel.value()
  }
  emit('cancel')
  hide()
}

const close = () => {
  emit('close')
  hide()
}

const reset = () => {
  title.value = ''
  message.value = ''
  content.value = ''
  type.value = 'alert'
  isLoading.value = false
  isDanger.value = false
  confirmText.value = 'OK'
  cancelText.value = 'Cancel'
  onConfirm.value = null
  onCancel.value = null
}

// Expose methods
defineExpose({
  showAlert,
  showConfirm,
  showCustom,
  showLoading,
  hide
})
</script>

<style lang="scss" scoped>
.custom-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

.custom-modal {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  animation: slideUp 0.3s ease;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  
  &.modal-small {
    max-width: 300px;
  }
  
  &.modal-large {
    max-width: 600px;
  }
  
  &.modal-danger {
    .modal-header {
      background: linear-gradient(135deg, #ff4d4f, #cf1322);
    }
    
    .modal-btn-primary {
      background: linear-gradient(135deg, #ff4d4f, #cf1322);
      
      &:hover:not(:disabled) {
        background: linear-gradient(135deg, #ff7875, #d4380d);
      }
    }
  }
}

.modal-header {
  background: linear-gradient(135deg, #4e7771, #36454f);
  color: white;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .modal-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }
  
  .modal-close {
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    padding: 4px;
    line-height: 1;
    
    &:hover {
      opacity: 0.8;
    }
  }
}

.modal-body {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
  
  .modal-loading {
    text-align: center;
    padding: 20px 0;
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid #4e7771;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 15px;
    }
    
    p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }
  }
  
  .modal-alert {
    text-align: center;
    
    .alert-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 15px;
      font-size: 28px;
      
      &.icon-success {
        background: rgba(82, 196, 26, 0.1);
        color: #52c41a;
      }
      
      &.icon-danger {
        background: rgba(255, 77, 79, 0.1);
        color: #ff4d4f;
      }
    }
    
    .alert-message {
      margin: 0;
      color: #333;
      font-size: 14px;
      line-height: 1.5;
    }
  }
  
  .modal-confirm {
    .confirm-message {
      margin: 0;
      color: #333;
      font-size: 14px;
      line-height: 1.5;
      text-align: center;
    }
  }
  
  .modal-custom {
    color: #333;
    font-size: 14px;
    line-height: 1.5;
    
    :deep(h1),
    :deep(h2),
    :deep(h3),
    :deep(h4) {
      margin-top: 0;
      margin-bottom: 10px;
      color: #333;
    }
    
    :deep(p) {
      margin-bottom: 10px;
    }
    
    :deep(ul),
    :deep(ol) {
      margin-bottom: 10px;
      padding-left: 20px;
    }
    
    :deep(li) {
      margin-bottom: 5px;
    }
  }
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 10px;
  
  .modal-btn {
    flex: 1;
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    &.modal-btn-cancel {
      background: #f5f5f5;
      color: #666;
      
      &:hover:not(:disabled) {
        background: #e0e0e0;
      }
    }
    
    &.modal-btn-primary {
      background: linear-gradient(135deg, #4e7771, #36454f);
      color: white;
      
      &:hover:not(:disabled) {
        background: linear-gradient(135deg, #5a8a84, #455a64);
      }
    }
  }
}

// Animations
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// Responsive
@media (max-width: 576px) {
  .custom-modal-overlay {
    padding: 10px;
  }
  
  .modal-body {
    padding: 16px;
  }
  
  .modal-footer {
    padding: 12px 16px;
    flex-direction: column;
    
    .modal-btn {
      width: 100%;
    }
  }
}
</style>
