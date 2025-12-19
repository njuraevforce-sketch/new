<!-- src/App.vue -->
<template>
  <div id="app">
    <div class="u-navbar" v-if="showNavbar">
      <div class="u-navbar__placeholder"></div>
      <div class="u-navbar__content">
        <div class="u-navbar__content__back" v-if="showBackButton" @click="goBack">
          <i class="fas fa-arrow-left"></i>
        </div>
        <div class="u-navbar__content__logo" v-if="!showBackButton">
          <img src="/static/logo.png" alt="Logo">
        </div>
        <div class="u-navbar__content__title">{{ navbarTitle }}</div>
      </div>
    </div>
    
    <div class="page-container" :class="{ 'with-navbar': showNavbar, 'with-tabbar': showTabbar }">
      <router-view />
    </div>
    
    <div class="uni-tabbar" v-if="showTabbar">
      <div 
        class="uni-tabbar__item" 
        v-for="tab in tabs" 
        :key="tab.name"
        :class="{ 'uni-tabbar__item--active': activeTab === tab.name }"
        @click="switchTab(tab.name)"
      >
        <div class="uni-tabbar__icon">
          <i :class="tab.icon"></i>
        </div>
        <div class="uni-tabbar__label">{{ $t(tab.label) }}</div>
      </div>
    </div>
    
    <!-- Loading Overlay -->
    <div class="loading-overlay" v-if="loading">
      <div class="loading-content">
        <i class="fas fa-spinner fa-spin fa-3x"></i>
        <div class="loading-text">{{ loadingText }}</div>
      </div>
    </div>
    
    <!-- Custom Modal -->
    <div class="modal-overlay" v-if="modal.visible">
      <div class="modal-content">
        <div class="modal-header">
          {{ modal.title }}
        </div>
        <div class="modal-body">
          {{ modal.message }}
        </div>
        <div class="modal-footer">
          <button class="modal-button" @click="hideModal">{{ $t('ok') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabs: [
        { name: 'home', icon: 'fas fa-home', label: 'home' },
        { name: 'get', icon: 'fas fa-bolt', label: 'quantification' },
        { name: 'assets', icon: 'fas fa-wallet', label: 'assets' },
        { name: 'mine', icon: 'fas fa-user', label: 'mine' }
      ],
      modal: {
        visible: false,
        title: '',
        message: ''
      },
      loading: false,
      loadingText: ''
    }
  },
  
  computed: {
    activeTab() {
      return this.$store.state.activeTab
    },
    showNavbar() {
      return this.$store.state.showNavbar
    },
    showTabbar() {
      return this.$store.state.showTabbar
    },
    showBackButton() {
      return this.$store.state.showBackButton
    },
    navbarTitle() {
      return this.$store.state.navbarTitle
    }
  },
  
  methods: {
    switchTab(tab) {
      this.$store.commit('SET_ACTIVE_TAB', tab)
      this.$router.push(`/${tab}`)
    },
    
    goBack() {
      this.$router.back()
    },
    
    showModal(title, message) {
      this.modal = {
        visible: true,
        title,
        message
      }
    },
    
    hideModal() {
      this.modal.visible = false
    },
    
    showLoading(text) {
      this.loading = true
      this.loadingText = text || this.$t('loading')
    },
    
    hideLoading() {
      this.loading = false
    }
  },
  
  mounted() {
    // Setup global methods
    window.showCustomAlert = (message) => {
      this.showModal(this.$t('notification'), message)
    }
    
    window.showLoading = (text) => {
      this.showLoading(text)
    }
    
    window.hideLoading = () => {
      this.hideLoading()
    }
    
    window.showCustomModal = (title, content, onConfirm) => {
      this.showModal(title, content)
      if (onConfirm) {
        this.$once('modal-confirmed', onConfirm)
      }
    }
    
    // Initialize app
    this.$store.dispatch('initApp')
  }
}
</script>

<style>
/* Add your global styles here */
</style>
