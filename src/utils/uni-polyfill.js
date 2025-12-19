// src/utils/uni-polyfill.js
// Polyfills for Uni-app compatibility
if (typeof window !== 'undefined') {
  // Make $router available globally like in original app
  window.showSection = function(section) {
    if (this.$router) {
      this.$router.push(`/${section}`)
    }
  }
  
  window.setNavbarTitle = function(title, showBackButton = false) {
    if (this.$store) {
      this.$store.commit('SET_NAVBAR_TITLE', title)
      this.$store.commit('SET_BACK_BUTTON', showBackButton)
    }
  }
  
  window.showBackButton = function(show = true) {
    if (this.$store) {
      this.$store.commit('SET_BACK_BUTTON', show)
    }
  }
  
  window.getCurrentUser = function() {
    if (this.$store) {
      return this.$store.state.user
    }
    return null
  }
  
  window.updateUserBalance = async function(amount, type = 'deposit') {
    if (this.$store) {
      return await this.$store.dispatch('updateUserBalance', { amount, type })
    }
    return { success: false }
  }
  
  window.performQuantification = async function() {
    if (this.$store) {
      return await this.$store.dispatch('performQuantification')
    }
    return { success: false, message: 'Store not available' }
  }
  
  window.logout = function() {
    if (this.$store) {
      this.$store.dispatch('logout')
      if (this.$router) {
        this.$router.push('/login')
      }
    }
  }
  
  window.showLanguageModal = function() {
    // Implementation for language modal
  }
  
  window.getCurrentLanguage = function() {
    if (this.$store) {
      return this.$store.state.language
    }
    return 'en'
  }
  
  window.setLanguage = function(lang) {
    if (this.$store) {
      this.$store.commit('SET_LANGUAGE', lang)
      location.reload()
    }
  }
  
  window.GLY = {
    formatCurrency: (amount) => {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount)
    },
    
    copyToClipboard: async (text) => {
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
    },
    
    generateUserId: () => {
      return 'GLY' + Math.random().toString(36).substr(2, 9).toUpperCase()
    },
    
    generateInviteCode: () => {
      return Math.random().toString(36).substr(2, 8).toUpperCase()
    }
  }
}
