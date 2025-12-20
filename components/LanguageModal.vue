<template>
  <CustomModal ref="modal">
    <div class="language-modal">
      <h3>Select Language</h3>
      <div class="language-list">
        <div 
          v-for="lang in languages" 
          :key="lang.code"
          class="language-item"
          :class="{ 'selected': currentLang === lang.code }"
          @click="selectLanguage(lang.code)"
        >
          {{ lang.name }}
        </div>
      </div>
    </div>
  </CustomModal>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CustomModal from './CustomModal.vue'
import { getAvailableLanguages, setLanguage, getLanguage } from '@/utils/translate'

const modal = ref(null)
const languages = ref([])
const currentLang = ref('en')

const show = () => {
  modal.value.showModal('Select Language', '', {
    confirmText: 'Close',
    showCancel: false
  })
}

const selectLanguage = (langCode) => {
  setLanguage(langCode)
  currentLang.value = langCode
  modal.value.hide()
}

onMounted(() => {
  languages.value = getAvailableLanguages()
  currentLang.value = getLanguage()
})

defineExpose({ show })
</script>

<style scoped>
.language-list {
  max-height: 300px;
  overflow-y: auto;
}

.language-item {
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.language-item:hover {
  background-color: #f5f5f5;
}

.language-item.selected {
  background-color: #e8f5e9;
  color: #2e7d32;
  font-weight: 500;
}
</style>
