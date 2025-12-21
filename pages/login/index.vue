<template>
  <view class="login-page auth-page">
    <view class="card padding" style="margin-top: 20px; background: transparent; box-shadow: none; position: relative;">
      <!-- Language button in top right -->
      <view class="language-globe-btn" @click="showLanguageModal">
        <i class="fas fa-globe"></i>
      </view>
      
      <view style="text-align: left; margin-bottom: 30px; display: flex; align-items: center; margin-top: 20px;">
        <image src="/static/logo.png" style="width: 80px; height: 80px; border-radius: 20px; margin-right: 20px;"></image>
        <view>
          <h2 style="color: white; margin-bottom: 5px; font-size: 28px;">Welcome</h2>
          <p style="color: #ccc; font-size: 16px;">Welcome to GLY</p>
        </view>
      </view>
      
      <form @submit.prevent="handleLogin">
        <view class="input-container">
          <input 
            type="text" 
            v-model="form.username"
            placeholder="Username"
            class="input-line"
          >
        </view>
        
        <view class="input-container" style="position: relative;">
          <input 
            :type="showPassword ? 'text' : 'password'"
            v-model="form.password"
            placeholder="Password"
            class="input-line"
            style="padding-right: 40px;"
          >
          <i 
            class="fas password-toggle"
            :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"
            style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); color: #52c41a; cursor: pointer; z-index: 10;"
            @click="showPassword = !showPassword"
          ></i>
        </view>
        
        <button 
          type="submit" 
          class="pro-btn full-width"
          :disabled="loading"
        >
          <i v-if="loading" class="fas fa-spinner fa-spin"></i>
          {{ loading ? 'Loading...' : 'Login' }}
        </button>
      </form>
      
      <view style="text-align: center; margin-top: 20px;">
        <p style="color: #ccc;">
          Don't have an account? 
          <text @click="goToRegister" style="color: #52c41a; cursor: pointer;">Register now!</text>
        </p>
      </view>
      
      <view v-if="error" class="error show">
        {{ error }}
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../store/user'

const router = useRouter()
const userStore = useUserStore()
const showCustomAlert = inject('showCustomAlert')
const showLanguageModal = inject('showLanguageModal')

const form = ref({
  username: '',
  password: ''
})
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  if (!form.value.username || !form.value.password) {
    error.value = 'All fields are required'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const result = await userStore.login(form.value.username, form.value.password)
    
    if (result.success) {
      showCustomAlert('Login successful!')
      router.push({ name: 'home' })
    } else {
      error.value = result.error
    }
  } catch (err) {
    error.value = 'Login error'
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}

function goToRegister() {
  router.push({ name: 'register' })
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.language-globe-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.3);
  
  i {
    color: white;
    font-size: 18px;
  }
}

.full-width {
  width: 100%;
}
</style>
