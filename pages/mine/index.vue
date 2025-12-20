<template>
  <view class="mine-page">
    <!-- Profile Card -->
    <div class="profile-card">
      <div class="profile-overlay"></div>
      
      <div class="profile-content">
        <!-- VIP Badge -->
        <div class="vip-badge">
          VIP {{ userVipLevel }}
        </div>
        
        <!-- ID with Copy -->
        <div class="profile-id-group">
          <span class="profile-id">ID: {{ userId }}</span>
          <button class="copy-btn" @click="copyUserId">
            <i class="fas fa-copy"></i>
          </button>
        </div>
        
        <!-- Balance -->
        <div class="profile-balance">
          {{ $t('balance') }}: <span class="balance-amount">{{ formatCurrency(userBalance) }}</span> USDT
        </div>
      </div>
    </div>

    <!-- Calendar Block -->
    <div class="calendar-card">
      <div class="calendar-header">
        <div class="calendar-title">{{ $t('utc_calendar') }}</div>
        <div class="calendar-nav">
          <button @click="prevMonth"><i class="fas fa-chevron-left"></i></button>
          <button @click="nextMonth"><i class="fas fa-chevron-right"></i></button>
        </div>
      </div>
      
      <div class="calendar-grid">
        <!-- Days of week -->
        <div v-for="day in daysOfWeek" :key="day" class="calendar-day">
          {{ day }}
        </div>
        
        <!-- Dates -->
        <div 
          v-for="date in calendarDates" 
          :key="date.id"
          :class="['calendar-date', { 
            'today': date.isToday,
            'other-month': !date.isCurrentMonth
          }]"
        >
          {{ date.day }}
        </div>
      </div>
      
      <div class="calendar-time">
        {{ utcTime }}
      </div>
    </div>

    <!-- Settings -->
    <div class="settings-card">
      <div class="settings-title">{{ $t('settings') }}</div>
      
      <div class="settings-list">
        <!-- Withdrawal Address -->
        <div class="setting-item" @click="showAddressPopup">
          <div class="setting-icon">
            <img src="/static/assets/setting-address.png" alt="Address">
          </div>
          <div class="setting-name">{{ $t('withdrawal_address') }}</div>
          <div class="setting-value">
            {{ withdrawalAddressSet ? $t('configured') : $t('configure') }}
          </div>
        </div>
        
        <!-- Transaction Password -->
        <div class="setting-item" @click="showPasswordPopup">
          <div class="setting-icon">
            <img src="/static/assets/setting-password.png" alt="Password">
          </div>
          <div class="setting-name">{{ $t('transaction_password') }}</div>
          <div class="setting-value">{{ $t('change') }}</div>
        </div>
        
        <!-- Customer Service -->
        <div class="setting-item" @click="showSupportPopup">
          <div class="setting-icon">
            <img src="/static/assets/setting-service.png" alt="Service">
          </div>
          <div class="setting-name">{{ $t('customer_service') }}</div>
          <div class="setting-value">{{ $t('contact') }}</div>
        </div>
        
        <!-- Language -->
        <div class="setting-item" @click="showLanguageModal">
          <div class="setting-icon">
            <img src="/static/assets/setting-language.png" alt="Language">
          </div>
          <div class="setting-name">{{ $t('language') }}</div>
          <div class="setting-value">{{ currentLanguage }}</div>
        </div>
        
        <!-- Change Password -->
        <div class="setting-item" @click="showPasswordPopup">
          <div class="setting-icon">
            <img src="/static/assets/setting-change-password.png" alt="Change Password">
          </div>
          <div class="setting-name">{{ $t('change_password') }}</div>
          <div class="setting-value">{{ $t('update') }}</div>
        </div>
        
        <!-- Logout Button -->
        <button class="logout-btn" @click="logout">
          {{ $t('logout') }}
        </button>
      </div>
    </div>

    <!-- Address Popup -->
    <div v-if="showAddressModal" class="popup-overlay">
      <div class="popup-content">
        <div class="popup-header">{{ $t('set_withdrawal_address') }}</div>
        
        <form @submit.prevent="saveAddress">
          <!-- Network Selection -->
          <div class="network-section">
            <div class="section-label">{{ $t('select_network') }}</div>
            <div class="network-options">
              <div 
                :class="['network-option', { 'active': selectedNetwork === 'TRC20' }]"
                @click="selectedNetwork = 'TRC20'"
              >
                <div class="network-icon">
                  <img src="/static/assets/trc20.png" alt="TRC20">
                </div>
                <div class="network-name">TRC20</div>
                <div v-if="selectedNetwork === 'TRC20'" class="network-check">
                  <i class="fas fa-check"></i>
                </div>
              </div>
              
              <div 
                :class="['network-option', { 'active': selectedNetwork === 'BEP20' }]"
                @click="selectedNetwork = 'BEP20'"
              >
                <div class="network-icon">
                  <img src="/static/assets/bsc20.png" alt="BEP20">
                </div>
                <div class="network-name">BEP20</div>
                <div v-if="selectedNetwork === 'BEP20'" class="network-check">
                  <i class="fas fa-check"></i>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Address Input -->
          <div class="input-section">
            <label>{{ $t('usdt_wallet_address') }}</label>
            <input 
              type="text" 
              v-model="addressInput" 
              :placeholder="$t('enter_wallet_address')"
              class="address-input"
              required
            >
          </div>
          
          <div class="popup-footer">
            <button type="button" class="popup-btn cancel" @click="closeAddressModal">
              {{ $t('cancel') }}
            </button>
            <button type="submit" class="popup-btn save">
              {{ $t('save') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Password Popup -->
    <div v-if="showPasswordModal" class="popup-overlay">
      <div class="popup-content">
        <div class="popup-header">{{ $t('change_password') }}</div>
        
        <form @submit.prevent="changePassword">
          <div class="input-section">
            <label>{{ $t('current_password') }}</label>
            <input 
              type="password" 
              v-model="currentPassword" 
              :placeholder="$t('enter_current_password')"
              required
            >
          </div>
          
          <div class="input-section">
            <label>{{ $t('new_password') }}</label>
            <input 
              type="password" 
              v-model="newPassword" 
              :placeholder="$t('enter_new_password')"
              required
            >
          </div>
          
          <div class="input-section">
            <label>{{ $t('confirm_new_password') }}</label>
            <input 
              type="password" 
              v-model="confirmPassword" 
              :placeholder="$t('confirm_new_password_placeholder')"
              required
            >
          </div>
          
          <div class="popup-footer">
            <button type="button" class="popup-btn cancel" @click="closePasswordModal">
              {{ $t('cancel') }}
            </button>
            <button type="submit" class="popup-btn save">
              {{ $t('save') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Support Popup -->
    <div v-if="showSupportModal" class="popup-overlay">
      <div class="popup-content">
        <div class="popup-header">{{ $t('customer_service') }}</div>
        
        <div class="support-content">
          <div class="support-icon">💬</div>
          <p>{{ $t('contact_24_7') }}</p>
          
          <!-- Telegram -->
          <div class="contact-item">
            <div class="contact-info">
              <h4>{{ $t('telegram') }}</h4>
              <p>@GLY_Support</p>
            </div>
            <button class="copy-contact-btn" @click="copyTelegram">
              <i class="fas fa-copy"></i> {{ $t('copy') }}
            </button>
          </div>
          
          <!-- Email -->
          <div class="contact-item">
            <div class="contact-info">
              <h4>{{ $t('email') }}</h4>
              <p>support@gly.io</p>
            </div>
            <button class="copy-contact-btn" @click="copyEmail">
              <i class="fas fa-copy"></i> {{ $t('copy') }}
            </button>
          </div>
        </div>
        
        <div class="popup-footer">
          <button class="popup-btn close" @click="closeSupportModal">
            {{ $t('close') }}
          </button>
        </div>
      </div>
    </div>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { t, getLanguage } from '@/utils/translate'

const router = useRouter()
const userStore = useUserStore()

// User data
const userId = computed(() => userStore.currentUser?.id || 'N/A')
const userVipLevel = computed(() => userStore.currentUser?.vip_level || 1)
const userBalance = computed(() => userStore.currentUser?.balance || 0)
const currentLanguage = computed(() => {
  const lang = getLanguage()
  return t(`language_${lang}`)
})

// Calendar
const currentDate = ref(new Date())
const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())
const utcTime = ref('')
const utcInterval = ref(null)

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const calendarDates = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
  const firstDayIndex = firstDay.getDay()
  const daysInMonth = lastDay.getDate()
  
  const today = new Date()
  const todayUTC = new Date(Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate()
  ))
  
  const dates = []
  
  // Add empty cells for days before first day
  for (let i = 0; i < firstDayIndex; i++) {
    dates.push({
      id: `empty-${i}`,
      day: '',
      isCurrentMonth: false,
      isToday: false
    })
  }
  
  // Add days of month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(Date.UTC(currentYear.value, currentMonth.value, day))
    const isToday = date.getTime() === todayUTC.getTime()
    
    dates.push({
      id: `${currentYear.value}-${currentMonth.value}-${day}`,
      day,
      isCurrentMonth: true,
      isToday
    })
  }
  
  return dates
})

// Modals
const showAddressModal = ref(false)
const showPasswordModal = ref(false)
const showSupportModal = ref(false)

// Address form
const selectedNetwork = ref('TRC20')
const addressInput = ref('')
const withdrawalAddressSet = ref(false)

// Password form
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// Helper functions
const formatCurrency = (amount) => {
  return amount.toFixed(2)
}

const updateUTCTime = () => {
  const now = new Date()
  utcTime.value = now.toUTCString()
}

// Calendar navigation
const prevMonth = () => {
  currentMonth.value--
  if (currentMonth.value < 0) {
    currentMonth.value = 11
    currentYear.value--
  }
}

const nextMonth = () => {
  currentMonth.value++
  if (currentMonth.value > 11) {
    currentMonth.value = 0
    currentYear.value++
  }
}

// Copy functions
const copyUserId = async () => {
  try {
    await navigator.clipboard.writeText(userId.value)
    window.showCustomAlert('ID copied to clipboard')
  } catch (error) {
    console.error('Copy failed:', error)
  }
}

const copyTelegram = async () => {
  try {
    await navigator.clipboard.writeText('@GLY_Support')
    window.showCustomAlert('Telegram copied to clipboard')
  } catch (error) {
    console.error('Copy failed:', error)
  }
}

const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText('support@gly.io')
    window.showCustomAlert('Email copied to clipboard')
  } catch (error) {
    console.error('Copy failed:', error)
  }
}

// Modal functions
const showAddressPopup = () => {
  selectedNetwork.value = 'TRC20'
  addressInput.value = ''
  showAddressModal.value = true
}

const closeAddressModal = () => {
  showAddressModal.value = false
  addressInput.value = ''
}

const showPasswordPopup = () => {
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  showPasswordModal.value = true
}

const closePasswordModal = () => {
  showPasswordModal.value = false
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
}

const showSupportPopup = () => {
  showSupportModal.value = true
}

const closeSupportModal = () => {
  showSupportModal.value = false
}

const showLanguageModal = () => {
  window.showLanguageModal()
}

// Save address
const saveAddress = async () => {
  if (!addressInput.value.trim()) {
    window.showCustomAlert(t('validation_required'))
    return
  }
  
  try {
    const result = await userStore.setWithdrawalAddress(
      selectedNetwork.value,
      addressInput.value.trim()
    )
    
    if (result.success) {
      window.showCustomAlert(t('address_saved'))
      withdrawalAddressSet.value = true
      closeAddressModal()
    } else {
      window.showCustomAlert(result.error)
    }
  } catch (error) {
    window.showCustomAlert(t('server_error'))
  }
}

// Change password
const changePassword = async () => {
  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    window.showCustomAlert(t('validation_required'))
    return
  }
  
  if (newPassword.value !== confirmPassword.value) {
    window.showCustomAlert(t('validation_password_match'))
    return
  }
  
  if (newPassword.value.length < 6) {
    window.showCustomAlert(t('validation_password_length'))
    return
  }
  
  try {
    const result = await userStore.changePassword(
      currentPassword.value,
      newPassword.value
    )
    
    if (result.success) {
      window.showCustomAlert(t('password_changed'))
      closePasswordModal()
    } else {
      window.showCustomAlert(result.error)
    }
  } catch (error) {
    window.showCustomAlert(t('server_error'))
  }
}

// Logout
const logout = () => {
  window.showCustomModal(
    t('confirm_logout'),
    t('logout_message'),
    () => {
      userStore.logout()
      router.push('/login')
    }
  )
}

onMounted(() => {
  // Start UTC time update
  updateUTCTime()
  utcInterval.value = setInterval(updateUTCTime, 1000)
  
  // Check if withdrawal address is set
  const user = userStore.currentUser
  if (user) {
    withdrawalAddressSet.value = !!(user.withdrawal_address_trc20 || user.withdrawal_address_bep20)
  }
})

onUnmounted(() => {
  if (utcInterval.value) clearInterval(utcInterval.value)
})
</script>

<style scoped>
.mine-page {
  padding: 15px;
  padding-bottom: 80px;
}

/* Profile Card */
.profile-card {
  position: relative;
  background: linear-gradient(135deg, #4e7771, #36454f);
  border-radius: 15px;
  padding: 25px 20px;
  margin-bottom: 20px;
  overflow: hidden;
  min-height: 180px;
}

.profile-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6));
  z-index: 1;
}

.profile-content {
  position: relative;
  z-index: 2;
  color: white;
}

.vip-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 15px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.profile-id-group {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.profile-id {
  font-size: 14px;
  font-weight: 500;
}

.copy-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  padding: 5px 10px;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.copy-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.profile-balance {
  font-size: 18px;
  font-weight: 600;
}

.balance-amount {
  color: #f9ae3d;
  font-size: 24px;
}

/* Calendar Card */
.calendar-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.calendar-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.calendar-nav {
  display: flex;
  gap: 10px;
}

.calendar-nav button {
  background: #f5f5f5;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  transition: all 0.3s;
}

.calendar-nav button:hover {
  background: #e0e0e0;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-bottom: 20px;
}

.calendar-day {
  text-align: center;
  font-size: 12px;
  color: #999;
  padding: 5px;
}

.calendar-date {
  text-align: center;
  padding: 10px 5px;
  font-size: 14px;
  color: #333;
  border-radius: 8px;
  transition: all 0.3s;
}

.calendar-date.today {
  background: #4e7771;
  color: white;
  font-weight: 600;
}

.calendar-date.other-month {
  color: #ccc;
}

.calendar-time {
  text-align: center;
  font-size: 12px;
  color: #666;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 8px;
}

/* Settings Card */
.settings-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.settings-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.setting-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.setting-item:hover {
  background: #f0f0f0;
  transform: translateX(5px);
}

.setting-icon {
  width: 30px;
  height: 30px;
  margin-right: 15px;
}

.setting-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.setting-name {
  flex: 1;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.setting-value {
  font-size: 12px;
  color: #999;
}

.logout-btn {
  width: 100%;
  padding: 15px;
  background: transparent;
  border: 2px solid #ff6b6b;
  border-radius: 12px;
  color: #ff6b6b;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
}

.logout-btn:hover {
  background: #ff6b6b;
  color: white;
}

/* Popup Styles */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.popup-content {
  background: white;
  border-radius: 15px;
  width: 100%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  animation: popupSlide 0.3s ease;
}

@keyframes popupSlide {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.popup-header {
  background: linear-gradient(135deg, #4e7771, #36454f);
  color: white;
  padding: 20px;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  border-radius: 15px 15px 0 0;
}

.network-section {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.section-label {
  font-size: 14px;
  color: #333;
  margin-bottom: 15px;
  font-weight: 500;
}

.network-options {
  display: flex;
  gap: 15px;
}

.network-option {
  flex: 1;
  padding: 15px;
  background: #f9f9f9;
  border: 2px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}

.network-option.active {
  border-color: #4e7771;
  background: rgba(78, 119, 113, 0.1);
}

.network-icon {
  width: 40px;
  height: 40px;
  margin: 0 auto 10px;
}

.network-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.network-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
}

.network-check {
  color: #4e7771;
  font-size: 12px;
}

.input-section {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.input-section label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
  font-weight: 500;
}

.input-section input,
.address-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
}

.input-section input:focus,
.address-input:focus {
  outline: none;
  border-color: #4e7771;
}

.support-content {
  padding: 20px;
  text-align: center;
}

.support-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.support-content p {
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
  line-height: 1.5;
}

.contact-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 10px;
  margin-bottom: 10px;
}

.contact-info h4 {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
}

.contact-info p {
  font-size: 13px;
  color: #666;
  margin: 0;
}

.copy-contact-btn {
  padding: 8px 15px;
  background: #4e7771;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.copy-contact-btn:hover {
  background: #5a8a84;
}

.popup-footer {
  padding: 20px;
  display: flex;
  gap: 10px;
}

.popup-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.popup-btn.cancel {
  background: #f5f5f5;
  color: #666;
}

.popup-btn.cancel:hover {
  background: #e0e0e0;
}

.popup-btn.save {
  background: #4e7771;
  color: white;
}

.popup-btn.save:hover {
  background: #5a8a84;
}

.popup-btn.close {
  background: #4e7771;
  color: white;
  width: 100%;
}

.popup-btn.close:hover {
  background: #5a8a84;
}

@media (min-width: 768px) {
  .mine-page {
    max-width: 375px;
    margin: 0 auto;
  }
}
</style>
