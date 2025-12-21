<template>
  <view class="register-page auth-page">
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
      
      <form @submit.prevent="handleRegister">
        <view class="input-container">
          <input 
            type="text" 
            v-model="form.username"
            placeholder="Username"
            class="input-line"
          >
        </view>

        <view class="input-container">
          <input 
            type="email" 
            v-model="form.email"
            placeholder="Email"
            class="input-line"
          >
        </view>
        
        <view class="input-container" style="position: relative;">
          <input 
            :type="showRegPassword ? 'text' : 'password'"
            v-model="form.password"
            placeholder="Password"
            class="input-line"
            style="padding-right: 40px;"
          >
          <i 
            class="fas password-toggle"
            :class="showRegPassword ? 'fa-eye-slash' : 'fa-eye'"
            style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); color: #52c41a; cursor: pointer; z-index: 10;"
            @click="showRegPassword = !showRegPassword"
          ></i>
        </view>
        
        <view class="input-container" style="position: relative;">
          <input 
            :type="showConfirmPassword ? 'text' : 'password'"
            v-model="form.confirmPassword"
            placeholder="Confirm Password"
            class="input-line"
            style="padding-right: 40px;"
          >
          <i 
            class="fas password-toggle"
            :class="showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'"
            style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); color: #52c41a; cursor: pointer; z-index: 10;"
            @click="showConfirmPassword = !showConfirmPassword"
          ></i>
        </view>
        
        <view class="input-container" style="position: relative;">
          <input 
            :type="showPaymentPassword ? 'text' : 'password'"
            v-model="form.paymentPassword"
            placeholder="Payment Password"
            class="input-line"
            style="padding-right: 40px;"
          >
          <i 
            class="fas password-toggle"
            :class="showPaymentPassword ? 'fa-eye-slash' : 'fa-eye'"
            style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); color: #52c41a; cursor: pointer; z-index: 10;"
            @click="showPaymentPassword = !showPaymentPassword"
          ></i>
        </view>
        
        <view class="input-container">
          <input 
            type="text" 
            v-model="form.inviteCode"
            placeholder="Invitation Code (required)"
            class="input-line"
          >
        </view>
        
        <button 
          type="submit" 
          class="pro-btn full-width"
          :disabled="loading"
        >
          <i v-if="loading" class="fas fa-spinner fa-spin"></i>
          {{ loading ? 'Registering...' : 'Register' }}
        </button>
      </form>
      
      <view style="text-align: center; margin-top: 20px;">
        <p style="color: #ccc;">
          Already have an account? 
          <text @click="goToLogin" style="color: #52c41a; cursor: pointer;">Login now!</text>
        </p>
      </view>
      
      <view v-if="error" class="error show">
        {{ error }}
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../store/user'

const router = useRouter()
const userStore = useUserStore()
const showCustomAlert = inject('showCustomAlert')
const showLanguageModal = inject('showLanguageModal')

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  paymentPassword: '',
  inviteCode: ''
})
const showRegPassword = ref(false)
const showConfirmPassword = ref(false)
const showPaymentPassword = ref(false)
const loading = ref(false)
const error = ref('')

onMounted(() => {
  // Проверяем invite code из URL
  const urlParams = new URLSearchParams(window.location.hash.split('?')[1])
  const inviteCode = urlParams.get('i') || urlParams.get('ref')
  
  if (inviteCode) {
    form.value.inviteCode = inviteCode.toUpperCase()
    sessionStorage.setItem('pending_invite_code', inviteCode)
  } else {
    // Проверяем sessionStorage
    const pendingCode = sessionStorage.getItem('pending_invite_code')
    if (pendingCode) {
      form.value.inviteCode = pendingCode.toUpperCase()
    }
  }
})

async function handleRegister() {
  // Валидация
  if (!form.value.username || !form.value.email || !form.value.password || 
      !form.value.confirmPassword || !form.value.paymentPassword || !form.value.inviteCode) {
    error.value = 'All fields are required'
    return
  }
  
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }
  
  if (form.value.password.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return
  }
  
  if (form.value.paymentPassword.length < 6) {
    error.value = 'Payment password must be at least 6 characters'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const result = await userStore.register({
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
      paymentPassword: form.value.paymentPassword,
      inviteCode: form.value.inviteCode.toUpperCase()
    })
    
    if (result.success) {
      // Очищаем sessionStorage после успешной регистрации
      sessionStorage.removeItem('pending_invite_code')
      
      showCustomAlert('Registration successful! $3 bonus added to your account.')
      setTimeout(() => {
        router.push({ name: 'home' })
      }, 2000)
    } else {
      error.value = result.error
    }
  } catch (err) {
    error.value = 'Registration error'
    console.error('Registration error:', err)
  } finally {
    loading.value = false
  }
}

function goToLogin() {
  router.push({ name: 'login' })
}
</script>

<style scoped>
.register-page {
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
