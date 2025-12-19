// src/main.js
import Vue from 'vue'
import App from './App'
import store from './store'
import i18n from './utils/i18n'
import './utils/uni-polyfill'

Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.$t = (key, params) => i18n.t(key, params)
Vue.prototype.$supabase = store.state.supabase

App.mpType = 'app'

const app = new Vue({
  store,
  i18n,
  ...App
})

app.$mount()
