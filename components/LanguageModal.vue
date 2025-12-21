<template>
  <view class="language-modal-overlay" v-if="visible" @click="close">
    <view class="language-modal" @click.stop>
      <view class="modal-header">
        <text>Select Language</text>
        <i class="fas fa-times close-btn" @click="close"></i>
      </view>
      <view class="modal-body">
        <view 
          v-for="language in languages" 
          :key="language.code"
          class="language-option"
          :class="{'active': language.code === currentLang}"
          @click="selectLanguage(language.code)"
        >
          <image v-if="language.flag" :src="language.flag" class="language-flag"></image>
          <text class="language-name">{{ language.name }}</text>
          <i v-if="language.code === currentLang" class="fas fa-check check-icon"></i>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getCurrentLanguage, setLanguage } from '../utils/translate'

const visible = ref(false)
const currentLang = ref(getCurrentLanguage())

const languages = ref([
  { code: 'en', name: 'English', flag: '' },
  { code: 'ru', name: 'Русский', flag: '' },
  { code: 'zh', name: '中文', flag: '' }
])

function show() {
  currentLang.value = getCurrentLanguage()
  visible.value = true
}

function close() {
  visible.value = false
}

function selectLanguage(lang) {
  setLanguage(lang)
  currentLang.value = lang
  close()
  
  // Обновляем страницу
  setTimeout(() => {
    window.location.reload()
  }, 300)
}

defineExpose({
  show,
  close
})
</script>

<style scoped>
.language-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
}

.language-modal {
  background: white;
  width: 90%;
  max-width: 400px;
  border-radius: 12px;
  overflow: hidden;
}

.modal-header {
  background: #4e7771;
  color: white;
  padding: 15px;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .close-btn {
    cursor: pointer;
    font-size: 18px;
  }
}

.modal-body {
  padding: 0;
}

.language-option {
  padding: 15px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f5f5f5;
  }
  
  &.active {
    background: rgba(78, 119, 113, 0.1);
  }
  
  &:last-child {
    border-bottom: none;
  }
}

.language-flag {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 15px;
}

.language-name {
  flex: 1;
  color: #333;
  font-size: 14px;
}

.check-icon {
  color: #4e7771;
}
</style>
