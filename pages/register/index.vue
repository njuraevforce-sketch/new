<template>
  <view class="register-page">
    <div class="language-globe-btn" @click="showLanguageModal">
      <i class="fas fa-globe"></i>
    </div>
    
    <div class="auth-header">
      <img src="/static/assets/logo.png" alt="GLY" class="auth-logo">
      <h2 class="auth-title">{{ $t('welcome') }}</h2>
      <p class="auth-subtitle">{{ $t('welcome_to_gly') }}</p>
    </div>
    
    <div class="auth-card">
      <form @submit.prevent="handleRegister">
        <div class="input-group">
          <input 
            type="text" 
            v-model="form.username" 
            :placeholder="$t('username')" 
            class="auth-input"
            required
          >
        </div>
        
        <div class="input-group">
          <input 
            type="email" 
            v-model="form.email" 
            :placeholder="$t('email')" 
            class="auth-input"
            required
          >
        </div>
        
        <div class="input-group password-group">
          <input 
            :type="showPassword ? 'text' : 'password'" 
            v-model="form.password" 
            :placeholder="$t('password')" 
            class="auth-input"
            required
          >
          <i 
            :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" 
            class="password-toggle"
            @click="togglePassword"
          ></i>
        </div>
        
        <div class="input-group password-group">
          <input 
            :type="showConfirmPassword ? 'text' : 'password'" 
            v-model="form.confirmPassword" 
            :placeholder="$t('confirm_password')" 
            class="auth-input"
            required
          >
          <i 
            :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" 
            class="password-toggle"
            @click="toggleConfirmPassword"
          ></i>
        </div>
        
        <div class="input-group password-group">
          <input 
            :type="showPaymentPassword ? 'text' : 'password'" 
            v-model="form.paymentPassword" 
            :placeholder="$t('payment_password')" 
            class="auth-input"
            required
          >
          <i 
            :class="showPaymentPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" 
            class="password-toggle"
            @click="togglePaymentPassword"
          ></i>
        </div>
        
        <div class="input-group">
          <input 
            type="text" 
            v-model="form.inviteCode" 
            :placeholder="$t('invite_code_required')" 
            class="auth-input"
            required
          >
        </div>
        
        <button 
          type="submit" 
          class="auth-btn" 
          :disabled="loading"
        >
          <i v-if="loading" class="fas fa-spinner fa-spin"></i>
          {{ loading ? $t('loading') : $t('register') }}
        </button>
      </form>
      
      <div class="auth-links">
        <p>
          {{ $t('have_account') }}
          <a href="#" @click="goToLogin">{{ $t('login_now') }}</a>
        </p>
      </div>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { t } from '@/utils/translate'

const router = useRouter()
const userStore = useUserStore()

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  paymentPassword: '',
  inviteCode: ''
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const showPaymentPassword = ref(false)
const loading = ref(false)
const error = ref('')

onMounted(() => {
  // Load invite code from sessionStorage
  const pendingInvite = sessionStorage.getItem('pending_invite_code')
  if (pendingInvite) {
    form.value.inviteCode = pendingInvite.toUpperCase()
  }
})

const handleRegister = async () => {
  // Validation
  if (!form.value.username || !form.value.email || !form.value.password || 
      !form.value.confirmPassword || !form.value.paymentPassword || !form.value.inviteCode) {
    error.value = t('validation_required')
    return
  }
  
  if (form.value.password !== form.value.confirmPassword) {
    error.value = t('validation_password_match')
    return
  }
  
  if (form.value.password.length < 6) {
    error.value = t('validation_password_length')
    return
  }
  
  if (form.value.paymentPassword.length < 6) {
    error.value = t('validation_payment_password_length')
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    const result = await userStore.register({
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
      payment_password: form.value.paymentPassword,
      invite_code: form.value.inviteCode
    })
    
    if (result.success) {
      window.showCustomAlert(t('registration_success'))
      
      // Clear pending invite
      sessionStorage.removeItem('pending_invite_code')
      
      // Redirect to home
      setTimeout(() => {
        router.push('/home')
      }, 1500)
    } else {
      error.value = result.error
    }
  } catch (err) {
    error.value = t('server_error')
  } finally {
    loading.value = false
  }
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const togglePaymentPassword = () => {
  showPaymentPassword.value = !showPaymentPassword.value
}

const goToLogin = () => {
  router.push('/login')
}

const showLanguageModal = () => {
  window.showLanguageModal()
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #36454f 0%, #2c3e50 100%);
  padding: 40px 20px;
  position: relative;
}

.language-globe-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.3);
  z-index: 10;
}

.auth-header {
  text-align: center;
  margin-bottom: 40px;
  margin-top: 40px;
}

.auth-logo {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  margin-bottom: 20px;
}

.auth-title {
  color: white;
  font-size: 28px;
  margin-bottom: 10px;
}

.auth-subtitle {
  color: #ccc;
  font-size: 16px;
}

.auth-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 30px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.input-group {
  margin-bottom: 15px;
  position: relative;
}

.auth-input {
  width: 100%;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 16px;
  transition: all 0.3s;
}

.auth-input:focus {
  outline: none;
  border-color: #4e7771;
  background: rgba(255, 255, 255, 0.15);
}

.auth-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.password-group {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #4e7771;
  cursor: pointer;
  font-size: 18px;
}

.auth-btn {
  width: 100%;
  padding: 15px;
  background: #4e7771;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 20px;
}

.auth-btn:hover:not(:disabled) {
  background: #5a8a84;
  transform: translateY(-2px);
}

.auth-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-links {
  margin-top: 25px;
  text-align: center;
}

.auth-links p {
  color: #ccc;
  font-size: 14px;
}

.auth-links a {
  color: #4e7771;
  text-decoration: none;
  font-weight: 600;
}

.auth-links a:hover {
  text-decoration: underline;
}

.error-message {
  margin-top: 15px;
  padding: 10px;
  background: rgba(255, 77, 79, 0.2);
  border: 1px solid rgba(255, 77, 79, 0.4);
  border-radius: 6px;
  color: #ff6b6b;
  font-size: 14px;
  text-align: center;
}

@media (min-width: 768px) {
  .register-page {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .auth-card {
    width: 100%;
    max-width: 400px;
  }
}
</style>
