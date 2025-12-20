<template>
  <view class="app-container" :class="{'auth-page': isAuthPage, 'no-tabbar': !showTabbar, 'rtl': isRTL}">
    <!-- Custom Navbar -->
    <view v-if="showNavbar" class="custom-navbar">
      <view class="navbar-content">
        <view v-if="showBackButton" class="navbar-back" @click="goBack">
          <i class="fas fa-arrow-left"></i>
        </view>
        <view class="navbar-title">{{ navbarTitle }}</view>
        <view v-if="showLanguageButton" class="navbar-language" @click="showLanguageModal">
          <i class="fas fa-globe"></i>
        </view>
      </view>
    </view>
    <view v-if="showNavbar" class="navbar-placeholder"></view>

    <!-- Main Content -->
    <view class="page-content" :style="contentStyle">
      <router-view v-slot="{ Component }">
        <transition name="fade-slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </view>

    <!-- Tabbar -->
    <view v-if="showTabbar" class="custom-tabbar">
      <view 
        v-for="item in tabItems" 
        :key="item.name"
        :class="['tab-item', { 'active': currentRoute === item.name }]"
        @click="switchTab(item)"
      >
        <view class="tab-icon">
          <image :src="item.icon" mode="aspectFit" />
        </view>
        <view class="tab-label">{{ $t(item.label) }}</view>
      </view>
    </view>

    <!-- Global Components -->
    <CustomModal ref="modal" />
    <LoadingOverlay ref="loading" />
    <LanguageModal ref="languageModal" />
  </view>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import CustomModal from '@/components/CustomModal.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import LanguageModal from '@/components/LanguageModal.vue'
import { useI18n } from '@/utils/translate'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { t } = useI18n()

const currentRoute = ref('home')
const navbarTitle = ref('')
const showBackButton = ref(false)
const showNavbar = ref(true)
const showTabbar = ref(true)
const showLanguageButton = ref(false)
const isRTL = ref(false)

const modal = ref(null)
const loading = ref(null)
const languageModal = ref(null)

const tabItems = [
  { name: 'home', label: 'home', icon: '/static/assets/home.png' },
  { name: 'get', label: 'get', icon: '/static/assets/get.png' },
  { name: 'assets', label: 'assets', icon: '/static/assets/assets.png' },
  { name: 'mine', label: 'mine', icon: '/static/assets/mine.png' }
]

const isAuthPage = computed(() => {
  return ['login', 'register', 'backend'].includes(currentRoute.value)
})

const contentStyle = computed(() => {
  const style = {}
  if (showTabbar.value) {
    style.paddingBottom = '60px'
  }
  if (showNavbar.value) {
    style.paddingTop = '44px'
  }
  return style
})

const switchTab = (item) => {
  currentRoute.value = item.name
  router.push(`/${item.name}`)
}

const goBack = () => {
  if (route.path === '/home') return
  router.back()
}

const showLanguageModal = () => {
  if (languageModal.value) {
    languageModal.value.show()
  }
}

// Update navigation based on route
watch(() => route.name, (newRoute) => {
  currentRoute.value = newRoute
  
  const protectedPages = ['home', 'get', 'assets', 'mine', 'invite', 'team', 'rules', 'withdraw', 'deposit']
  const noTabbarPages = ['login', 'register', 'company', 'invite', 'team', 'rules', 'withdraw', 'admin', 'deposit', 'backend']
  const authPages = ['login', 'register', 'backend']
  const titlePages = {
    'company': t('company'),
    'invite': t('invite'),
    'team': t('team'),
    'rules': t('rules'),
    'withdraw': t('withdraw'),
    'admin': t('admin_panel'),
    'deposit': t('deposit')
  }
  
  // Authentication check
  if (protectedPages.includes(newRoute) && !userStore.currentUser) {
    router.push('/login')
    return
  }
  
  // Navbar visibility
  showNavbar.value = !authPages.includes(newRoute)
  
  // Tabbar visibility
  showTabbar.value = !noTabbarPages.includes(newRoute)
  
  // Language button
  showLanguageButton.value = authPages.includes(newRoute)
  
  // Back button
  showBackButton.value = Object.keys(titlePages).includes(newRoute)
  
  // Navbar title
  navbarTitle.value = titlePages[newRoute] || ''
  
  // RTL check
  const lang = localStorage.getItem('gly_language') || 'en'
  isRTL.value = lang === 'ar'
  
  document.documentElement.dir = isRTL.value ? 'rtl' : 'ltr'
  
  // Scroll to top
  window.scrollTo(0, 0)
  
  // Handle invite code from URL
  if (route.query.i && !userStore.currentUser) {
    sessionStorage.setItem('pending_invite_code', route.query.i)
    router.push('/register')
  }
}, { immediate: true })

// Global methods
window.showCustomAlert = (message, title = 'Notification') => {
  if (modal.value) {
    modal.value.showAlert(message, title)
  }
}

window.showCustomModal = (title, content, onConfirm = null) => {
  if (modal.value) {
    modal.value.showModal(title, content, onConfirm)
  }
}

window.showLoading = (message = 'Loading...') => {
  if (loading.value) {
    loading.value.show(message)
  }
}

window.hideLoading = () => {
  if (loading.value) {
    loading.value.hide()
  }
}

window.getCurrentUser = () => {
  return userStore.currentUser
}

window.showSection = (section) => {
  router.push(`/${section}`)
}

window.logout = () => {
  userStore.logout()
  router.push('/login')
}

// Initialize
onMounted(() => {
  userStore.initialize()
  
  // Service worker update check
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.update()
    })
  }
})
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  height: 100vh;
  background: #f5f5f5;
  position: relative;
  overflow: hidden;
  
  &.auth-page {
    background: linear-gradient(135deg, #36454f 0%, #2c3e50 100%);
  }
  
  &.rtl {
    direction: rtl;
    text-align: right;
  }
}

/* Custom Navbar */
.custom-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  background: #36454f;
  color: white;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  
  .navbar-content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0 16px;
    position: relative;
    
    .navbar-back {
      position: absolute;
      left: 16px;
      font-size: 18px;
      cursor: pointer;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &:active {
        opacity: 0.7;
      }
    }
    
    .navbar-title {
      font-size: 16px;
      font-weight: 600;
      text-align: center;
      flex: 1;
    }
    
    .navbar-language {
      position: absolute;
      right: 16px;
      font-size: 18px;
      cursor: pointer;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &:active {
        opacity: 0.7;
      }
    }
  }
}

.navbar-placeholder {
  height: 44px;
}

/* Page Content */
.page-content {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* Custom Tabbar */
.custom-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: white;
  border-top: 1px solid #e0e0e0;
  z-index: 999;
  display: flex;
  padding-bottom: env(safe-area-inset-bottom);
  
  .tab-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    
    &.active {
      color: #4e7771;
      
      .tab-icon {
        filter: brightness(0) saturate(100%) invert(35%) sepia(20%) saturate(600%) hue-rotate(130deg) brightness(90%) contrast(90%);
      }
      
      .tab-label {
        font-weight: 600;
      }
    }
    
    &:active {
      opacity: 0.7;
    }
    
    .tab-icon {
      width: 24px;
      height: 24px;
      margin-bottom: 4px;
      
      image {
        width: 100%;
        height: 100%;
      }
    }
    
    .tab-label {
      font-size: 10px;
      color: #666;
    }
  }
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* Responsive */
@media (min-width: 768px) {
  .app-container {
    max-width: 375px;
    margin: 0 auto;
    box-shadow: 0 0 20px rgba(0,0,0,0.1);
    height: 667px;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .app-container {
    background: #121212;
    color: #ffffff;
  }
  
  .custom-tabbar {
    background: #1e1e1e;
    border-top-color: #333;
    
    .tab-item .tab-label {
      color: #999;
    }
  }
}
</style>
