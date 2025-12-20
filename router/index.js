import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../store'

const routes = [
  {
    path: '/',
    redirect: '/pages/home'
  },
  {
    path: '/pages/home',
    name: 'home',
    component: () => import('../pages/home/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/get',
    name: 'get',
    component: () => import('../pages/get/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/assets',
    name: 'assets',
    component: () => import('../pages/assets/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/mine',
    name: 'mine',
    component: () => import('../pages/mine/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pages/login',
    name: 'login',
    component: () => import('../pages/login/index.vue')
  },
  {
    path: '/pages/register',
    name: 'register',
    component: () => import('../pages/register/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = userStore.user !== null

  if (requiresAuth && !isAuthenticated) {
    next('/pages/login')
  } else {
    next()
  }
})

export default router
