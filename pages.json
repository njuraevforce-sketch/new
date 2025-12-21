import { createSSRApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { initSupabase } from './utils/supabase'
import { initTranslate } from './utils/translate'
import './uni.scss'

export function createApp() {
  const app = createSSRApp(App)
  const pinia = createPinia()
  
  app.use(pinia)
  
  // Инициализация глобальных утилит
  app.config.globalProperties.$supabase = initSupabase()
  app.config.globalProperties.$t = initTranslate().t
  app.config.globalProperties.$showAlert = (message) => {
    uni.showToast({
      title: message,
      icon: 'none',
      duration: 3000
    })
  }
  
  // Глобальные функции
  app.config.globalProperties.$copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (err) {
      console.error('Copy failed:', err)
      return false
    }
  }
  
  return {
    app
  }
}
