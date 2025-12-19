<!-- src/pages/mine/index.vue -->
<template>
  <div class="mine-page">
    <!-- Profile with background image -->
    <div class="card padding profile-bg" style="background-image: url('/static/avatar.png');">
      <!-- Dark overlay for better text readability -->
      <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.4); border-radius: 10px; z-index: 1;"></div>
      
      <div style="position: relative; z-index: 2; display: flex; align-items: center; margin-bottom: 20px;">
        <div style="flex: 1;">
          <!-- VIP Badge -->
          <div class="profile-vip-badge" style="background: rgba(78, 119, 113, 0.8); display: inline-block; margin-bottom: 10px;">
            VIP {{ user ? user.vip_level : 1 }}
          </div>
          
          <!-- ID with Copy button inline -->
          <div class="profile-id-copy" style="display: flex; align-items: center; gap: 8px; margin-bottom: 15px;">
            <span class="profile-id" style="color: white; font-weight: bold; text-shadow: 1px 1px 3px rgba(0,0,0,0.8); font-size: 14px;">
              {{ $t('id') }} {{ user ? user.id : 'Loading...' }}
            </span>
            <button class="copy-id-btn" @click="copyUserId" title="Copy ID">
              <i class="fas fa-copy" style="color: white; font-size: 12px;"></i>
            </button>
          </div>
          
          <div style="color: white; font-size: 18px; font-weight: bold; text-shadow: 1px 1px 3px rgba(0,0,0,0.8);">
            <span>{{ $t('balance') }}:</span> 
            <span style="color: #f9ae3d;">{{ user ? user.balance.toFixed(2) : '0.00' }}</span> USDT
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar Block -->
    <div class="card padding margin-top calendar-section">
      <div class="calendar-header">
        <div class="calendar-title">{{ $t('utc_calendar') }}</div>
        <div class="calendar-nav">
          <button @click="prevMonth"><i class="fas fa-chevron-left"></i></button>
          <button @click="nextMonth"><i class="fas fa-chevron-right"></i></button>
        </div>
      </div>
      <div class="calendar-grid">
        <!-- Days of week -->
        <div class="calendar-day" v-for="day in daysOfWeek" :key="day">{{ day }}</div>
        <!-- Dates -->
        <div 
          v-for="date in calendarDates" 
          :key="date.key"
          :class="['calendar-date', date.isToday ? 'today' : '', date.isOtherMonth ? 'other-month' : '']"
        >
          {{ date.day }}
        </div>
      </div>
      <div class="calendar-time">
        {{ utcTime }}
      </div>
    </div>

    <!-- Settings -->
    <div class="card padding margin-top">
      <div class="text-white text-bold">{{ $t('settings') }}</div>
      <div class="settings-list">
        <div class="setting-item" @click="showAddressPopup">
          <div class="setting-icon">
            <img src="/static/setting-address.png" :alt="$t('withdrawal_address')">
          </div>
          <div class="setting-name">{{ $t('withdrawal_address') }}</div>
          <div class="setting-value">
            {{ withdrawalAddressConfigured ? $t('configured') : $t('configure') }}
          </div>
        </div>
        <div class="setting-item" @click="showPasswordPopup">
          <div class="setting-icon">
            <img src="/static/setting-password.png" :alt="$t('transaction_password')">
          </div>
          <div class="setting-name">{{ $t('transaction_password') }}</div>
          <div class="setting-value">{{ $t('change') }}</div>
        </div>
        <div class="setting-item" @click="showSupportPopup">
          <div class="setting-icon">
            <img src="/static/setting-service.png" :alt="$t('customer_service')">
          </div>
          <div class="setting-name">{{ $t('customer_service') }}</div>
          <div class="setting-value">{{ $t('contact') }}</div>
        </div>
        <div class="setting-item" @click="showLanguageModal">
          <div class="setting-icon">
            <img src="/static/setting-language.png" :alt="$t('language')">
          </div>
          <div class="setting-name">{{ $t('language') }}</div>
          <div class="setting-value">{{ currentLanguageText }}</div>
        </div>
        <div class="setting-item" @click="showPasswordPopup">
          <div class="setting-icon">
            <img src="/static/setting-change-password.png" :alt="$t('change_password')">
          </div>
          <div class="setting-name">{{ $t('change_password') }}</div>
          <div class="setting-value">{{ $t('update') }}</div>
        </div>
        <div class="pro-btn" @click="logout" style="background: transparent; border: 2px solid #ff6b6b; margin-top: 10px; color: #ff6b6b; font-weight: bold;">
          {{ $t('logout') }}
        </div>
      </div>
    </div>

    <!-- Popups -->
    <div class="pop-overlay" v-if="showAddressPopupFlag" @click.self="hideAddressPopup">
      <div class="pop-content">
        <form @submit.prevent="saveWithdrawalAddress">
          <div class="pop-header">{{ $t('set_withdrawal_address') }}</div>
          <div class="pop-body">
            <!-- Network Selection -->
            <div class="network-selection-green margin-bottom">
              <div class="section-title-small" style="color: #333; margin-bottom: 10px; font-size: 14px;">
                {{ $t('select_network') }}
              </div>
              <div class="network-options-green">
                <div 
                  class="network-option-green" 
                  :class="{ active: selectedNetwork === 'TRC20' }"
                  @click="selectedNetwork = 'TRC20'"
                >
                  <div class="network-icon-green">
                    <img src="/static/trc20.png" alt="TRC20">
                  </div>
                  <div class="network-name-green">TRC20</div>
                  <div class="network-check-green"><i class="fas fa-check"></i></div>
                </div>
                <div 
                  class="network-option-green" 
                  :class="{ active: selectedNetwork === 'BEP20' }"
                  @click="selectedNetwork = 'BEP20'"
                >
                  <div class="network-icon-green">
                    <img src="/static/bsc20.png" alt="BEP20">
                  </div>
                  <div class="network-name-green">BEP20</div>
                  <div class="network-check-green"><i class="fas fa-check"></i></div>
                </div>
              </div>
            </div>
            
            <div class="margin-bottom">
              <label style="color: #333; font-size: 14px;">{{ $t('usdt_wallet_address') }}</label>
              <input 
                type="text" 
                v-model="withdrawalAddress" 
                :placeholder="$t('enter_wallet_address')"
                style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; margin-top: 5px;"
              >
            </div>
            <p style="font-size: 12px; color: #666;">
              This address will be used for all future withdrawals on the selected network. Please double-check the address.
            </p>
          </div>
          <div class="pop-footer">
            <button type="submit" style="margin-right: 10px; background: #4e7771;">{{ $t('save') }}</button>
            <button type="button" @click="hideAddressPopup" style="background: #666;">{{ $t('cancel') }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Password Popup -->
    <div class="pop-overlay" v-if="showPasswordPopupFlag" @click.self="hidePasswordPopup">
      <div class="pop-content">
        <form @submit.prevent="changePassword">
          <div class="pop-header">{{ $t('change_password') }}</div>
          <div class="pop-body">
            <div class="margin-bottom">
              <label style="color: #333; font-size: 14px;">{{ $t('current_password') }}</label>
              <input 
                type="password" 
                v-model="currentPassword" 
                :placeholder="$t('enter_current_password')"
                style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; margin-top: 5px;"
              >
            </div>
            <div class="margin-bottom">
              <label style="color: #333; font-size: 14px;">{{ $t('new_password') }}</label>
              <input 
                type="password" 
                v-model="newPassword" 
                :placeholder="$t('enter_new_password')"
                style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; margin-top: 5px;"
              >
            </div>
            <div class="margin-bottom">
              <label style="color: #333; font-size: 14px;">{{ $t('confirm_new_password') }}</label>
              <input 
                type="password" 
                v-model="confirmPassword" 
                :placeholder="$t('confirm_new_password_placeholder')"
                style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; margin-top: 5px;"
              >
            </div>
          </div>
          <div class="pop-footer">
            <button type="submit" style="margin-right: 10px; background: #4e7771;">{{ $t('save') }}</button>
            <button type="button" @click="hidePasswordPopup" style="background: #666;">{{ $t('cancel') }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Support Popup -->
    <div class="pop-overlay" v-if="showSupportPopupFlag" @click.self="hideSupportPopup">
      <div class="pop-content">
        <div class="pop-header">{{ $t('customer_service') }}</div>
        <div class="pop-body">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 48px; color: #4e7771;">💬</div>
          </div>
          <p style="text-align: center; color: #333; margin-bottom: 15px;">
            {{ $t('contact_24_7') }}
          </p>
          <div class="referral-section">
            <div class="referral-content">
              <div class="referral-info">
                <div class="referral-text">
                  <h4>{{ $t('telegram') }}</h4>
                  <p>@GLY_Support</p>
                </div>
              </div>
              <button class="copy-btn" @click="copyTelegram">
                <i class="fas fa-copy"></i> {{ $t('copy') }}
              </button>
            </div>
          </div>
          <div class="referral-section margin-top-sm">
            <div class="referral-content">
              <div class="referral-info">
                <div class="referral-text">
                  <h4>{{ $t('email') }}</h4>
                  <p>support@gly.io</p>
                </div>
              </div>
              <button class="copy-btn" @click="copyEmail">
                <i class="fas fa-copy"></i> {{ $t('copy') }}
              </button>
            </div>
          </div>
        </div>
        <div class="pop-footer">
          <button @click="hideSupportPopup" style="background: #4e7771;">{{ $t('close') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const currentDate = new Date()
    return {
      currentYear: currentDate.getUTCFullYear(),
      currentMonth: currentDate.getUTCMonth(),
      daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      utcTime: 'Loading UTC time...',
      utcInterval: null,
      
      // Popups
      showAddressPopupFlag: false,
      showPasswordPopupFlag: false,
      showSupportPopupFlag: false,
      
      // Form data
      selectedNetwork: 'TRC20',
      withdrawalAddress: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      
      // Calendar
      calendarDates: []
    }
  },
  
  computed: {
    user() {
      return this.$store.state.user
    },
    
    withdrawalAddressConfigured() {
      if (!this.user) return false
      return !!(this.user.withdrawal_address_trc20 || this.user.withdrawal_address_bep20)
    },
    
    currentLanguageText() {
      const lang = this.$store.state.language || 'en'
      return this.$t(`language_${lang}`)
    },
    
    monthNames() {
      return [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ]
    },
    
    currentMonthName() {
      return this.monthNames[this.currentMonth]
    }
  },
  
  mounted() {
    this.updateUTCTime()
    this.utcInterval = setInterval(this.updateUTCTime, 1000)
    
    this.renderCalendar()
  },
  
  beforeDestroy() {
    if (this.utcInterval) {
      clearInterval(this.utcInterval)
    }
  },
  
  watch: {
    currentYear: 'renderCalendar',
    currentMonth: 'renderCalendar'
  },
  
  methods: {
    updateUTCTime() {
      const now = new Date()
      this.utcTime = now.toUTCString()
    },
    
    renderCalendar() {
      const firstDay = new Date(Date.UTC(this.currentYear, this.currentMonth, 1))
      const firstDayIndex = firstDay.getUTCDay()
      
      const lastDay = new Date(Date.UTC(this.currentYear, this.currentMonth + 1, 0))
      const daysInMonth = lastDay.getUTCDate()
      
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
          key: `empty-${i}`,
          day: '',
          isOtherMonth: true,
          isToday: false
        })
      }
      
      // Add days of month
      for (let day = 1; day <= daysInMonth; day++) {
        const cellDate = new Date(Date.UTC(this.currentYear, this.currentMonth, day))
        const isToday = cellDate.getTime() === todayUTC.getTime()
        
        dates.push({
          key: `day-${day}`,
          day: day,
          isOtherMonth: false,
          isToday: isToday
        })
      }
      
      this.calendarDates = dates
    },
    
    prevMonth() {
      this.currentMonth--
      if (this.currentMonth < 0) {
        this.currentMonth = 11
        this.currentYear--
      }
    },
    
    nextMonth() {
      this.currentMonth++
      if (this.currentMonth > 11) {
        this.currentMonth = 0
        this.currentYear++
      }
    },
    
    // Popup methods
    showAddressPopup() {
      if (!this.user) return
      
      this.selectedNetwork = 'TRC20'
      this.withdrawalAddress = ''
      
      if (this.user.withdrawal_address_trc20) {
        this.selectedNetwork = 'TRC20'
        this.withdrawalAddress = this.user.withdrawal_address_trc20
      } else if (this.user.withdrawal_address_bep20) {
        this.selectedNetwork = 'BEP20'
        this.withdrawalAddress = this.user.withdrawal_address_bep20
      }
      
      this.showAddressPopupFlag = true
    },
    
    hideAddressPopup() {
      this.showAddressPopupFlag = false
      this.withdrawalAddress = ''
    },
    
    showPasswordPopup() {
      this.showPasswordPopupFlag = true
    },
    
    hidePasswordPopup() {
      this.showPasswordPopupFlag = false
      this.currentPassword = ''
      this.newPassword = ''
      this.confirmPassword = ''
    },
    
    showSupportPopup() {
      this.showSupportPopupFlag = true
    },
    
    hideSupportPopup() {
      this.showSupportPopupFlag = false
    },
    
    showLanguageModal() {
      window.showLanguageModal()
    },
    
    async saveWithdrawalAddress() {
      if (!this.withdrawalAddress.trim()) {
        window.showCustomAlert(this.$t('validation_required'))
        return
      }
      
      if (!this.user) {
        window.showCustomAlert(this.$t('user_not_found'))
        return
      }
      
      try {
        const updateData = {}
        if (this.selectedNetwork === 'TRC20') {
          updateData.withdrawal_address_trc20 = this.withdrawalAddress
        } else {
          updateData.withdrawal_address_bep20 = this.withdrawalAddress
        }
        
        const { error } = await this.$supabase
          .from('users')
          .update(updateData)
          .eq('id', this.user.id)
          
        if (error) throw error
        
        // Update user in store
        const updatedUser = { ...this.user, ...updateData }
        this.$store.commit('SET_USER', updatedUser)
        
        window.showCustomAlert(this.$t('address_saved'))
        this.hideAddressPopup()
        
      } catch (error) {
        window.showCustomAlert(`${this.$t('error')}: ${error.message}`)
      }
    },
    
    async changePassword() {
      if (!this.user) {
        window.showCustomAlert(this.$t('user_not_found'))
        return
      }
      
      if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
        window.showCustomAlert(this.$t('validation_required'))
        return
      }
      
      if (this.newPassword !== this.confirmPassword) {
        window.showCustomAlert(this.$t('validation_password_match'))
        return
      }
      
      if (this.newPassword.length < 6) {
        window.showCustomAlert(this.$t('validation_password_length'))
        return
      }
      
      // Check current password
      if (this.user.password !== this.currentPassword) {
        window.showCustomAlert(this.$t('current_password_incorrect'))
        return
      }
      
      try {
        const { error } = await this.$supabase
          .from('users')
          .update({ password: this.newPassword })
          .eq('id', this.user.id)
          
        if (error) throw error
        
        // Update user in store
        const updatedUser = { ...this.user, password: this.newPassword }
        this.$store.commit('SET_USER', updatedUser)
        
        window.showCustomAlert(this.$t('password_changed'))
        this.hidePasswordPopup()
      } catch (error) {
        window.showCustomAlert(`${this.$t('error')}: ${error.message}`)
      }
    },
    
    copyUserId() {
      const userId = this.user ? this.user.id : ''
      window.GLY.copyToClipboard(userId).then(() => {
        window.showCustomAlert('User ID copied to clipboard')
      })
    },
    
    copyTelegram() {
      window.GLY.copyToClipboard('@GLY_Support').then(() => {
        window.showCustomAlert('Telegram username copied to clipboard')
      })
    },
    
    copyEmail() {
      window.GLY.copyToClipboard('support@gly.io').then(() => {
        window.showCustomAlert('Email address copied to clipboard')
      })
    },
    
    logout() {
      window.showCustomModal(
        this.$t('confirm_logout'),
        this.$t('logout_message'),
        () => {
          this.$store.dispatch('logout')
          this.$router.push('/login')
        }
      )
    }
  }
}
</script>

<style scoped>
/* Add your styles here */
</style>
