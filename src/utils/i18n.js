// src/utils/i18n.js
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en from '../locales/en'
import ru from '../locales/ru'
import zh from '../locales/zh'

Vue.use(VueI18n)

const messages = {
  en,
  ru,
  zh
}

const i18n = new VueI18n({
  locale: localStorage.getItem('gly_language') || 'en',
  fallbackLocale: 'en',
  messages
})

export default i18n
