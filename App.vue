<template>
  <view id="app" :class="{'auth-page': isAuthPage}">
    <!-- Кастомный навбар -->
    <view class="u-navbar" v-if="showNavbar">
      <view class="u-navbar__placeholder" v-if="showNavbarPlaceholder"></view>
      <view class="u-navbar__content">
        <view class="u-navbar__content__back" v-if="showBackButton" @click="goBack">
          <i class="fas fa-arrow-left"></i>
        </view>
        <view class="u-navbar__content__logo" v-else>
          <image src="/static/logo.png" mode="aspectFit" style="width: 40px; height: 40px; border-radius: 10px;"></image>
        </view>
        <view class="u-navbar__content__title">{{ navbarTitle }}</view>
      </view>
    </view>
    
    <!-- Основной контент -->
    <view class="page-container" :style="{paddingTop: showNavbarPlaceholder ? 'var(--status-bar-height, 0) + 44px' : '0'}">
      <router-view />
    </view>
    
    <!-- Таббар -->
    <view class="uni-tabbar" v-if="showTabbar">
      <view 
        v-for="tab in tabbarList" 
        :key="tab.pagePath"
        class="uni-tabbar__item"
        :class="{'uni-tabbar__item--active': currentRoute === tab.pagePath}"
        @click="switchTab(tab)"
      >
        <view class="uni-tabbar__icon">
          <image 
            :src="currentRoute === tab.pagePath ? tab.selectedIconPath : tab.iconPath" 
            mode="aspectFit"
          ></image>
        </view>
        <view class="uni-tabbar__label">{{ tab.text }}</view>
      </view>
    </view>
    
    <!-- Language Modal -->
    <LanguageModal ref="languageModal" />
    
    <!-- Loading Overlay -->
    <view class="loading-overlay" v-if="loading">
      <view class="loading-content">
        <i class="fas fa-spinner fa-spin fa-2x"></i>
        <text class="loading-text">{{ loadingText }}</text>
      </view>
    </view>
    
    <!-- Custom Modal -->
    <view class="modal-overlay" v-if="showModal">
      <view class="modal-content">
        <view class="modal-header">{{ modalTitle }}</view>
        <view class="modal-body" v-html="modalContent"></view>
        <view class="modal-footer">
          <button class="modal-btn" @click="closeModal">OK</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, provide } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import LanguageModal from './components/LanguageModal.vue'
import { useUserStore } from './store/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loading = ref(false)
const loadingText = ref('Loading...')
const showModal = ref(false)
const modalTitle = ref('')
const modalContent = ref('')
const showNavbar = ref(true)
const showTabbar = ref(true)
const showNavbarPlaceholder = ref(true)
const showBackButton = ref(false)
const navbarTitle = ref('')
const languageModal = ref(null)

const isAuthPage = computed(() => ['login', 'register'].includes(route.name))
const currentRoute = computed(() => route.name)
const tabbarList = ref([
  { pagePath: 'home', text: 'Home', iconPath: '/static/tabbar/home.png', selectedIconPath: '/static/tabbar/home-active.png' },
  { pagePath: 'get', text: 'Get', iconPath: '/static/tabbar/get.png', selectedIconPath: '/static/tabbar/get-active.png' },
  { pagePath: 'assets', text: 'Assets', iconPath: '/static/tabbar/assets.png', selectedIconPath: '/static/tabbar/assets-active.png' },
  { pagePath: 'mine', text: 'Mine', iconPath: '/static/tabbar/mine.png', selectedIconPath: '/static/tabbar/mine-active.png' }
])

// Обновляем UI при изменении маршрута
watch(() => route.name, (newRoute) => {
  updateUIForRoute(newRoute)
})

function updateUIForRoute(routeName) {
  const authRoutes = ['login', 'register']
  const noTabbarRoutes = ['login', 'register']
  
  showTabbar.value = !noTabbarRoutes.includes(routeName)
  showNavbar.value = !authRoutes.includes(routeName)
  showNavbarPlaceholder.value = showNavbar.value
  
  // Устанавливаем заголовок навбара
  switch(routeName) {
    case 'home':
      navbarTitle.value = 'GLY'
      showBackButton.value = false
      break
    case 'get':
      navbarTitle.value = 'Get'
      showBackButton.value = false
      break
    case 'assets':
      navbarTitle.value = 'Assets'
      showBackButton.value = false
      break
    case 'mine':
      navbarTitle.value = 'Mine'
      showBackButton.value = false
      break
    default:
      navbarTitle.value = ''
      showBackButton.value = false
  }
}

function switchTab(tab) {
  if (tab.pagePath !== currentRoute.value) {
    router.push({ name: tab.pagePath })
  }
}

function goBack() {
  router.back()
}

function showLoading(text = 'Loading...') {
  loadingText.value = text
  loading.value = true
}

function hideLoading() {
  loading.value = false
}

function showCustomAlert(message, title = 'Notification') {
  modalTitle.value = title
  modalContent.value = `<p style="text-align: center;">${message}</p>`
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function showLanguageModal() {
  languageModal.value?.show()
}

// Предоставляем глобальные функции дочерним компонентам
provide('showLoading', showLoading)
provide('hideLoading', hideLoading)
provide('showCustomAlert', showCustomAlert)
provide('showLanguageModal', showLanguageModal)

onMounted(() => {
  // Проверяем авторизацию при загрузке
  if (!userStore.isLoggedIn && !isAuthPage.value) {
    router.push({ name: 'login' })
  }
  
  updateUIForRoute(route.name)
})
</script>

<style lang="scss">
@import './uni.scss';

#app {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: white;
  
  &.auth-page {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    
    .uni-tabbar,
    .u-navbar {
      display: none !important;
    }
  }
}

.page-container {
  padding-bottom: 60px;
  min-height: calc(100vh - 60px);
}

.u-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &__placeholder {
    height: calc(var(--status-bar-height, 0) + 44px);
  }
  
  &__content {
    height: 44px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    
    &__back {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 18px;
      cursor: pointer;
    }
    
    &__logo {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      overflow: hidden;
    }
    
    &__title {
      flex: 1;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      color: white;
      margin-left: -40px;
    }
  }
}

.uni-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  z-index: 1000;
  
  &__item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #999;
    font-size: 10px;
    cursor: pointer;
    
    &--active {
      color: #4e7771;
    }
    
    &__icon {
      width: 24px;
      height: 24px;
      margin-bottom: 4px;
      
      image {
        width: 100%;
        height: 100%;
      }
    }
    
    &__label {
      font-size: 10px;
    }
  }
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  
  .loading-content {
    background: rgba(26, 26, 46, 0.9);
    padding: 30px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .loading-text {
      margin-top: 15px;
      color: white;
      font-size: 14px;
    }
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  
  .modal-content {
    background: white;
    width: 80%;
    max-width: 400px;
    border-radius: 10px;
    overflow: hidden;
    
    .modal-header {
      background: #4e7771;
      color: white;
      padding: 15px;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
    }
    
    .modal-body {
      padding: 20px;
      color: #333;
      font-size: 14px;
    }
    
    .modal-footer {
      padding: 15px;
      text-align: center;
      
      .modal-btn {
        background: #4e7771;
        color: white;
        border: none;
        padding: 10px 30px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
      }
    }
  }
}
</style>
