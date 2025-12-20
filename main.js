import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import { useUserStore } from '@/stores/user'
import { initLanguageSystem } from '@/utils/translate'

// Import all pages
const modules = import.meta.glob('./pages/**/index.vue')

// Route configuration
const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/pages/home/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/get',
    name: 'get',
    component: () => import('@/pages/get/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/assets',
    name: 'assets',
    component: () => import('@/pages/assets/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mine',
    name: 'mine',
    component: () => import('@/pages/mine/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login/index.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/pages/register/index.vue')
  },
  {
    path: '/company',
    name: 'company',
    component: () => import('@/pages/company/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/invite',
    name: 'invite',
    component: () => import('@/pages/invite/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/team',
    name: 'team',
    component: () => import('@/pages/team/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/rules',
    name: 'rules',
    component: () => import('@/pages/rules/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/withdraw',
    name: 'withdraw',
    component: () => import('@/pages/withdraw/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/deposit',
    name: 'deposit',
    component: () => import('@/pages/deposit/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/pages/admin/index.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/backend',
    name: 'backend',
    component: () => import('@/pages/backend/index.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/home'
  }
]

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  
  // Check for invite code in query
  if (to.query.i && !userStore.currentUser) {
    sessionStorage.setItem('pending_invite_code', to.query.i)
    next('/register')
    return
  }
  
  // Auth check
  if (to.meta.requiresAuth && !userStore.currentUser) {
    next('/login')
    return
  }
  
  // Admin check
  if (to.meta.requiresAdmin) {
    const user = userStore.currentUser
    if (!user || user.username !== 'admin') {
      next('/backend')
      return
    }
  }
  
  next()
})

// Create app
const app = createApp(App)
const pinia = createPinia()

// Initialize language system
initLanguageSystem()

// Global properties
app.config.globalProperties.$formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

app.config.globalProperties.$copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    return true
  }
}

app.config.globalProperties.$generateId = () => {
  return 'GLY' + Math.random().toString(36).substr(2, 9).toUpperCase()
}

app.config.globalProperties.$generateInviteCode = () => {
  return Math.random().toString(36).substr(2, 8).toUpperCase()
}

// Use plugins
app.use(pinia)
app.use(router)

// Mount app
app.mount('#app')

// Log app start
console.log('GLY Platform v1.0.0 initialized')

// Handle service worker updates
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload()
  })
}
