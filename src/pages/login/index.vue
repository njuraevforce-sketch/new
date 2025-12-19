<!-- src/pages/login/index.vue -->
<template>
  <div class="login-page auth-page">
    <!-- Login form -->
    <div class="card padding" style="margin-top: 20px; background: transparent; box-shadow: none; position: relative;">
      <!-- Language button in top right -->
      <div class="language-globe-btn" @click="showLanguageModal">
        <i class="fas fa-globe"></i>
      </div>
      
      <div style="text-align: left; margin-bottom: 30px; display: flex; align-items: center; margin-top: 20px;">
        <img src="/static/logo.png" alt="GLY Logo" style="width: 80px; height: 80px; border-radius: 20px; margin-right: 20px;">
        <div>
          <h2 style="color: white; margin-bottom: 5px; font-size: 28px;">{{ $t('welcome') }}</h2>
          <p style="color: #ccc; font-size: 16px;">{{ $t('welcome_to_gly') }}</p>
        </div>
      </div>
      
      <form @submit.prevent="handleLogin">
        <div class="input-container">
          <input 
            type="text" 
            v-model="username" 
            :placeholder="$t('username')" 
            class="input-line"
          >
        </div>
        
        <div class="input-container" style="position: relative;">
          <input 
            :type="passwordVisible ? 'text' : 'password'" 
            v-model="password" 
            :placeholder="$t('password')" 
            class="input-line" 
            style="padding-right: 40px;"
          >
          <i 
            class="fas fa-eye password-toggle" 
            :class="{ 'fa-eye-slash': passwordVisible }"
            @click="passwordVisible = !passwordVisible"
          ></i>
        </div>
        
        <button type="submit" class="pro-btn" :disabled="loading">
          <i v-if="loading" class="fas fa-spinner fa-spin"></i>
          {{ loading ? $t('loading') : $t('login') }}
        </button>
      </form>
      
      <div style="text-align: center; margin-top: 20px;">
        <p style="color: #ccc;">
          <span>{{ $t('no_account') }}</span> 
          <a href="#" @click.prevent="goToRegister" style="color: #52c41a;">{{ $t('register_now') }}</a>
        </p>
      </div>
      
      <div v-if="error" class="error" style="display: block;">{{ error }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      passwordVisible: false,
      loading: false,
      error: ''
    }
  },
  
  mounted() {
    // Hide navbar and tabbar for auth pages
    this.$store.commit('SET_NAVBAR_VISIBILITY', false)
    this.$store.commit('SET_TABBAR_VISIBILITY', false)
  },
  
  beforeDestroy() {
    // Restore navbar and tabbar when leaving
    this.$store.commit('SET_NAVBAR_VISIBILITY', true)
    this.$store.commit('SET_TABBAR_VISIBILITY', true)
  },
  
  methods: {
    async handleLogin() {
      if (!this.username || !this.password) {
        this.error = this.$t('validation_required')
        return
      }
      
      this.loading = true
      this.error = ''
      
      const result = await this.$store.dispatch('login', {
        username: this.username,
        password: this.password
      })
      
      if (result.success) {
        window.showCustomAlert(this.$t('login_success'))
        setTimeout(() => {
          this.$router.push('/home')
          this.$store.commit('SET_ACTIVE_TAB', 'home')
        }, 500)
      } else {
        this.error = result.message
      }
      
      this.loading = false
    },
    
    goToRegister() {
      this.$router.push('/register')
    },
    
    showLanguageModal() {
      window.showLanguageModal()
    }
  }
}
</script>

<style scoped>
/* Add your styles here */
</style>
