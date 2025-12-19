import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import '@/utils/supabase'

Vue.config.productionTip = false

// Глобальные методы
import * as GLY from '@/utils/gly'
Vue.prototype.$gly = GLY

// Глобальные утилиты
import { t } from '@/utils/translate'
Vue.prototype.$t = t

// Глобальные функции модальных окон
Vue.prototype.$showModal = function(title, content, onConfirm = null) {
  store.commit('SHOW_MODAL', { title, content, onConfirm })
}

Vue.prototype.$showAlert = function(message) {
  store.commit('SHOW_MODAL', {
    title: t('notification'),
    content: `<p style="text-align: center;">${message}</p>`
  })
}

Vue.prototype.$showLoading = function(text = 'Loading...') {
  store.commit('SHOW_LOADING', text)
}

Vue.prototype.$hideLoading = function() {
  store.commit('HIDE_LOADING')
}

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
