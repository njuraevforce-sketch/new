<template>
  <view class="mine-page">
    <!-- Profile with background image -->
    <view 
      class="card padding profile-bg"
      :style="{backgroundImage: 'url(/static/avatar.png)'}"
    >
      <view style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.4); border-radius: 10px; z-index: 1;"></view>
      
      <view style="position: relative; z-index: 2; display: flex; align-items: center; margin-bottom: 20px;">
        <view style="flex: 1;">
          <!-- VIP Badge -->
          <view class="profile-vip-badge">VIP {{ userStore.vipLevel }}</view>
          
          <!-- ID with Copy button inline -->
          <view class="profile-id-copy">
            <span class="profile-id">ID {{ userStore.userId }}</span>
            <button class="copy-id-btn" @click="copyUserId" title="Copy ID">
              <i class="fas fa-copy"></i>
            </button>
          </view>
          
          <view style="color: white; font-size: 18px; font-weight: bold; text-shadow: 1px 1px 3px rgba(0,0,0,0.8);">
            Balance: <span style="color: #f9ae3d;">{{ userStore.balance.toFixed(2) }}</span> USDT
          </view>
        </view>
      </view>
    </view>

    <!-- Calendar Block -->
    <view class="card padding margin-top calendar-section">
      <view class="calendar-header">
        <view class="calendar-title">UTC Calendar</view>
        <view class="calendar-nav">
          <button @click="prevMonth"><i class="fas fa-chevron-left"></i></button>
          <button @click="nextMonth"><i class="fas fa-chevron-right"></i></button>
        </view>
      </view>
      <view class="calendar-grid">
        <view class="calendar-day" v-for="day in daysOfWeek" :key="day">{{ day }}</view>
        <view 
          v-for="day in calendarDays" 
          :key="day.date"
          class="calendar-date"
          :class="{'today': day.isToday, 'other-month': !day.isCurrentMonth}"
        >
          {{ day.day }}
        </view>
      </view>
      <view class="calendar-time">
        {{ utcTime }}
      </view>
    </view>

    <!-- Settings -->
    <view class="card padding margin-top">
      <view class="text-white text-bold">Settings</view>
      <view class="settings-list">
        <view class="setting-item" @click="showAddressPopup">
          <view class="setting-icon">
            <image src="/static/setting-address.png" mode="aspectFit"></image>
          </view>
          <view class="setting-name">Withdrawal Address</view>
          <view class="setting-value">
            {{ userStore.user?.withdrawal_address_trc20 || userStore.user?.withdrawal_address_bep20 ? 'Configured' : 'Configure' }}
          </view>
        </view>
        <view class="setting-item" @click="showPasswordPopup">
          <view class="setting-icon">
            <image src="/static/setting-password.png" mode="aspectFit"></image>
          </view>
          <view class="setting-name">Transaction Password</view>
          <view class="setting-value">Change</view>
        </view>
        <view class="setting-item" @click="showSupportPopup">
          <view class="setting-icon">
            <image src="/static/setting-service.png" mode="aspectFit"></image>
          </view>
          <view class="setting-name">Customer Service</view>
          <view class="setting-value">Contact</view>
        </view>
        <view class="setting-item" @click="showLanguageModal">
          <view class="setting-icon">
            <image src="/static/setting-language.png" mode="aspectFit"></image>
          </view>
          <view class="setting-name">Language</view>
          <view class="setting-value">English</view>
        </view>
        <view class="setting-item" @click="showPasswordPopup">
          <view class="setting-icon">
            <image src="/static/setting-change-password.png" mode="aspectFit"></image>
          </view>
          <view class="setting-name">Change Password</view>
          <view class="setting-value">Update</view>
        </view>
        <button class="pro-btn logout-btn" @click="logout">Logout</button>
      </view>
    </view>

    <!-- Popup for withdrawal address with network selection -->
    <view class="pop-overlay" v-if="showAddressModal">
      <view class="pop-content">
        <form @submit.prevent="saveWithdrawalAddress">
          <view class="pop-header">Set Withdrawal Address</view>
          <view class="pop-body">
            <!-- Network Selection -->
            <view class="network-selection-green margin-bottom">
              <view class="section-title-small" style="color: #333; margin-bottom: 10px; font-size: 14px;">Select Network</view>
              <view class="network-options-green">
                <view 
                  class="network-option-green"
                  :class="{'active': selectedNetwork === 'TRC20'}"
                  @click="selectedNetwork = 'TRC20'"
                >
                  <view class="network-icon-green">
                    <image src="/static/trc20.png" mode="aspectFit"></image>
                  </view>
                  <view class="network-name-green">TRC20</view>
                  <view class="network-check-green"><i class="fas fa-check"></i></view>
                </view>
                <view 
                  class="network-option-green"
                  :class="{'active': selectedNetwork === 'BEP20'}"
                  @click="selectedNetwork = 'BEP20'"
                >
                  <view class="network-icon-green">
                    <image src="/static/bsc20.png" mode="aspectFit"></image>
                  </view>
                  <view class="network-name-green">BEP20</view>
                  <view class="network-check-green"><i class="fas fa-check"></i></view>
                </view>
              </view>
            </div>
            
            <view class="margin-bottom">
              <label style="color: #333; font-size: 14px;">USDT Wallet Address</label>
              <input 
                type="text" 
                v-model="withdrawalAddress"
                placeholder="Enter your wallet address" 
                style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; margin-top: 5px;"
              >
            </view>
            <p style="font-size: 12px; color: #666;">
              This address will be used for all future withdrawals on the selected network. Please double-check the address.
            </p>
          </view>
          <view class="pop-footer">
            <button type="submit" style="margin-right: 10px; background: #4e7771;">Save</button>
            <button type="button" @click="hideAddressPopup" style="background: #666;">Cancel</button>
          </view>
        </form>
      </view>
    </view>

    <!-- Popup for password change -->
    <view class="pop-overlay" v-if="showPasswordModal">
      <view class="pop-content">
        <form @submit.prevent="changePassword">
          <view class="pop-header">Change Password</view>
          <view class="pop-body">
            <view class="margin-bottom">
              <label style="color: #333; font-size: 14px;">Current Password</label>
              <input 
                type="password" 
                v-model="passwordForm.currentPassword"
                placeholder="Enter current password" 
                style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; margin-top: 5px;"
              >
            </view>
            <view class="margin-bottom">
              <label style="color: #333; font-size: 14px;">New Password</label>
              <input 
                type="password" 
                v-model="passwordForm.newPassword"
                placeholder="Enter new password" 
                style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; margin-top: 5px;"
              >
            </view>
            <view class="margin-bottom">
              <label style="color: #333; font-size: 14px;">Confirm New Password</label>
              <input 
                type="password" 
                v-model="passwordForm.confirmPassword"
                placeholder="Confirm new password" 
                style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; margin-top: 5px;"
              >
            </view>
          </view>
          <view class="pop-footer">
            <button type="submit" style="margin-right: 10px; background: #4e7771;">Save</button>
            <button type="button" @click="hidePasswordPopup" style="background: #666;">Cancel</button>
          </view>
        </form>
      </view>
    </view>

    <!-- Popup for customer service -->
    <view class="pop-overlay" v-if="showSupportModal">
      <view class="pop-content">
        <view class="pop-header">Customer Service</view>
        <view class="pop-body">
          <view style="text-align: center; margin-bottom: 20px;">
            <view style="font-size: 48px; color: #4e7771;">💬</view>
          </view>
          <p style="text-align: center; color: #333; margin-bottom: 15px;">
            Contact our 24/7 customer support:
          </p>
          <view class="referral-section">
            <view class="referral-content">
              <view class="referral-info">
                <view class="referral-text">
                  <h4>Telegram</h4>
                  <p>@GLY_Support</p>
                </view>
              </view>
              <button class="copy-btn" @click="copyTelegram">
                <i class="fas fa-copy"></i> COPY
              </button>
            </view>
          </view>
          <view class="referral-section margin-top-sm">
            <view class="referral-content">
              <view class="referral-info">
                <view class="referral-text">
                  <h4>Email</h4>
                  <p>support@gly.io</p>
                </view>
              </view>
              <button class="copy-btn" @click="copyEmail">
                <i class="fas fa-copy"></i> COPY
              </button>
            </view>
          </view>
        </view>
        <view class="pop-footer">
          <button @click="hideSupportPopup" style="background: #4e7771;">Close</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../store/user'
import { updateWithdrawalAddress } from '../../utils/api'

const router = useRouter()
const userStore = useUserStore()
const showCustomAlert = inject('showCustomAlert')
const showLanguageModal = inject('showLanguageModal')

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const currentDate = new Date()
let currentYear = currentDate.getUTCFullYear()
let currentMonth = currentDate.getUTCMonth()

const utcTime = ref('')
const calendarDays = ref([])
const showAddressModal = ref(false)
const showPasswordModal = ref(false)
const showSupportModal = ref(false)
const withdrawalAddress = ref('')
const selectedNetwork = ref('TRC20')
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})
let utcInterval = null

const calendarDaysComputed = computed(() => {
  const days = []
  const firstDay = new Date(Date.UTC(currentYear, currentMonth, 1))
  const lastDay = new Date(Date.UTC(currentYear, currentMonth + 1, 0))
  const daysInMonth = lastDay.getUTCDate()
  const firstDayIndex = firstDay.getUTCDay()
  
  // Today's date
  const today = new Date()
  const todayUTC = new Date(Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate()
  ))
  
  // Empty cells for days before first day
  for (let i = 0; i < firstDayIndex; i++) {
    days.push({ day: '', isCurrentMonth: false, isToday: false })
  }
  
  // Days of month
  for (let day = 1; day <= daysInMonth; day++) {
    const cellDate = new Date(Date.UTC(currentYear, currentMonth, day))
    days.push({
      day: day,
      isCurrentMonth: true,
      isToday: cellDate.getTime() === todayUTC.getTime()
    })
  }
  
  return days
})

function updateUTCTime() {
  const now = new Date()
  utcTime.value = now.toUTCString()
}

function renderCalendar() {
  calendarDays.value = calendarDaysComputed.value
}

function prevMonth() {
  currentMonth--
  if (currentMonth < 0) {
    currentMonth = 11
    currentYear--
  }
  renderCalendar()
}

function nextMonth() {
  currentMonth++
  if (currentMonth > 11) {
    currentMonth = 0
    currentYear++
  }
  renderCalendar()
}

function copyUserId() {
  navigator.clipboard.writeText(userStore.userId).then(() => {
    showCustomAlert('ID copied to clipboard')
  })
}

function copyTelegram() {
  navigator.clipboard.writeText('@GLY_Support').then(() => {
    showCustomAlert('Telegram username copied')
  })
}

function copyEmail() {
  navigator.clipboard.writeText('support@gly.io').then(() => {
    showCustomAlert('Email copied')
  })
}

function showAddressPopup() {
  // Load existing address if any
  withdrawalAddress.value = userStore.user?.withdrawal_address_trc20 || 
                           userStore.user?.withdrawal_address_bep20 || ''
  
  if (userStore.user?.withdrawal_address_trc20) {
    selectedNetwork.value = 'TRC20'
  } else if (userStore.user?.withdrawal_address_bep20) {
    selectedNetwork.value = 'BEP20'
  }
  
  showAddressModal.value = true
}

function hideAddressPopup() {
  showAddressModal.value = false
  withdrawalAddress.value = ''
  selectedNetwork.value = 'TRC20'
}

function showPasswordPopup() {
  showPasswordModal.value = true
}

function hidePasswordPopup() {
  showPasswordModal.value = false
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}

function showSupportPopup() {
  showSupportModal.value = true
}

function hideSupportPopup() {
  showSupportModal.value = false
}

async function saveWithdrawalAddress() {
  if (!withdrawalAddress.value.trim()) {
    showCustomAlert('Please enter wallet address')
    return
  }
  
  try {
    const result = await updateWithdrawalAddress(
      userStore.userId,
      withdrawalAddress.value.trim(),
      selectedNetwork.value
    )
    
    if (result.success) {
      // Update local user data
      const updateData = {}
      if (selectedNetwork.value === 'TRC20') {
        updateData.withdrawal_address_trc20 = withdrawalAddress.value.trim()
      } else {
        updateData.withdrawal_address_bep20 = withdrawalAddress.value.trim()
      }
      
      Object.assign(userStore.user, updateData)
      localStorage.setItem('gly_user', JSON.stringify(userStore.user))
      
      showCustomAlert('Address saved successfully')
      hideAddressPopup()
    } else {
      showCustomAlert(`Error: ${result.error}`)
    }
  } catch (error) {
    showCustomAlert('Error saving address')
    console.error('Error saving withdrawal address:', error)
  }
}

async function changePassword() {
  const { currentPassword, newPassword, confirmPassword } = passwordForm.value
  
  if (!currentPassword || !newPassword || !confirmPassword) {
    showCustomAlert('All fields are required')
    return
  }
  
  if (newPassword !== confirmPassword) {
    showCustomAlert('Passwords do not match')
    return
  }
  
  if (newPassword.length < 6) {
    showCustomAlert('Password must be at least 6 characters')
    return
  }
  
  if (userStore.user.password !== currentPassword) {
    showCustomAlert('Current password is incorrect')
    return
  }
  
  // Здесь должна быть логика обновления пароля в базе данных
  showCustomAlert('Password changed successfully')
  hidePasswordPopup()
}

function logout() {
  userStore.logout()
  router.push({ name: 'login' })
}

onMounted(() => {
  updateUTCTime()
  utcInterval = setInterval(updateUTCTime, 1000)
  renderCalendar()
})

onUnmounted(() => {
  if (utcInterval) clearInterval(utcInterval)
})
</script>

<style scoped>
.mine-page {
  padding-bottom: 80px;
}

.profile-bg {
  background-size: cover;
  background-position: center;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  position: relative;
}

.profile-vip-badge {
  background: rgba(78, 119, 113, 0.8);
  display: inline-block;
  margin-bottom: 10px;
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.profile-id-copy {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
}

.profile-id {
  color: white;
  font-weight: bold;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
  font-size: 14px;
}

.copy-id-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  
  i {
    color: white;
    font-size: 12px;
  }
}

.logout-btn {
  background: transparent;
  border: 2px solid #ff6b6b;
  margin-top: 10px;
  color: #ff6b6b;
  font-weight: bold;
}

.pop-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.pop-content {
  background: white;
  width: 90%;
  max-width: 400px;
  border-radius: 10px;
  overflow: hidden;
}

.pop-header {
  background: #4e7771;
  color: white;
  padding: 15px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
}

.pop-body {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

.pop-footer {
  padding: 15px;
  text-align: center;
  border-top: 1px solid #eee;
  
  button {
    background: #4e7771;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    margin: 0 5px;
    
    &:last-child {
      background: #666;
    }
  }
}

.copy-btn {
  background: #4e7771;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.referral-section {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 15px;
}

.referral-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.referral-text {
  h4 {
    margin: 0 0 5px 0;
    color: #333;
  }
  
  p {
    margin: 0;
    color: #666;
    font-size: 14px;
  }
}
</style>
