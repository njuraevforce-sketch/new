import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
  {
    path: '/',
    redirect: '/pages/home/index'
  },
  {
    path: '/pages/home/index',
    name: 'home',
    component: () => import('@/pages/home/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/get/index',
    name: 'get',
    component: () => import('@/pages/get/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/assets/index',
    name: 'assets',
    component: () => import('@/pages/assets/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/mine/index',
    name: 'mine',
    component: () => import('@/pages/mine/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/login/index',
    name: 'login',
    component: () => import('@/pages/login/index.vue'),
    meta: { guest: true }
  },
  {
    path: '/pages/register/index',
    name: 'register',
    component: () => import('@/pages/register/index.vue'),
    meta: { guest: true }
  },
  {
    path: '/pages/company/index',
    name: 'company',
    component: () => import('@/pages/company/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/invite/index',
    name: 'invite',
    component: () => import('@/pages/invite/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/team/index',
    name: 'team',
    component: () => import('@/pages/team/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/rules/index',
    name: 'rules',
    component: () => import('@/pages/rules/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/withdraw/index',
    name: 'withdraw',
    component: () => import('@/pages/withdraw/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/deposit/index',
    name: 'deposit',
    component: () => import('@/pages/deposit/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/admin/index',
    name: 'admin',
    component: () => import('@/pages/admin/index.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/pages/backend/index',
    name: 'backend',
    component: () => import('@/pages/backend/index.vue')
  }
]

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// Навигационные хуки
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('gly_user'))
  
  // Проверка авторизации
  if (to.meta.requiresAuth && !user) {
    next('/pages/login/index')
    return
  }
  
  // Проверка для гостевых страниц
  if (to.meta.guest && user) {
    next('/pages/home/index')
    return
  }
  
  // Проверка администратора
  if (to.meta.requiresAdmin) {
    const adminSession = localStorage.getItem('gly_admin_session')
    if (!adminSession && (!user || user.username !== 'admin')) {
      next('/pages/backend/index')
      return
    }
  }
  
  next()
})

export default router
