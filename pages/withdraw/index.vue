<template>
  <view class="withdraw-page">
    <view class="card padding">
      <view class="text-center margin-bottom">
        <view class="text-gray" style="font-size: 14px;">Available Balance</view>
        <view class="balance-amount" style="font-size: 32px; font-weight: bold; color: #f9ae3d;">
          {{ formatCurrency(userStore.userBalance) }} USDT
        </view>
      </view>

      <!-- Network Selection -->
      <view class="network-selection margin-bottom">
        <view class="section-title-small" style="color: white; margin-bottom: 10px; font-size: 14px;">
          Select Network
        </view>
        <view class="network-options">
          <view 
            class="network-option" 
            :class="{ active: selectedNetwork === 'TRC20' }"
            @click="selectNetwork('TRC20')"
          >
            <view class="network-icon">
              <image src="/static/assets/trc20.png" mode="aspectFit" />
            </view>
            <view class="network-name">TRC20</view>
            <view class="network-check" v-if="selectedNetwork === 'TRC20'">
              <i class="fas fa-check"></i>
            </view>
          </view>
          <view 
            class="network-option" 
            :class="{ active: selectedNetwork === 'BEP20' }"
            @click="selectNetwork('BEP20')"
          >
            <view class="network-icon">
              <image src="/static/assets/bsc20.png" mode="aspectFit" />
            </view>
            <view class="network-name">BEP20</view>
            <view class="network-check" v-if="selectedNetwork === 'BEP20'">
              <i class="fas fa-check"></i>
            </view>
          </view>
        </view>
      </view>

      <!-- Withdrawal Address -->
      <view class="address-section margin-bottom" v-if="withdrawalAddress">
        <view class="section-title-small" style="color: white; margin-bottom: 10px; font-size: 14px;">
          Withdrawal Address
        </view>
        <view class="address-display">
          <view class="address-text">
            {{ withdrawalAddress }}
          </view>
          <button class="change-btn" @click="changeAddress">
            Change
          </button>
        </view>
      </view>

      <view class="address-section margin-bottom" v-else>
        <view class="section-title-small" style="color: white; margin-bottom: 10px; font-size: 14px;">
          Withdrawal Address
        </view>
        <view class="no-address">
          <view class="text-gray" style="font-size: 14px; margin-bottom: 15px;">
            No withdrawal address set for {{ selectedNetwork }}
          </view>
          <button class="set-btn" @click="setAddress">
            Set Address
          </button>
        </view>
      </view>

      <!-- Amount Selection -->
      <view class="amount-selection margin-bottom">
        <view class="section-title-small" style="color: white; margin-bottom: 10px; font-size: 14px;">
          Withdraw Amount
        </view>
        <view class="quick-amounts">
          <button 
            v-for="amount in quickAmounts" 
            :key="amount"
            class="amount-btn" 
            :class="{ active: selectedAmount === amount }"
            @click="selectedAmount = amount"
          >
            {{ amount }} USDT
          </button>
        </view>
        <view class="custom-amount">
          <input 
            type="number" 
            v-model="customAmount"
            placeholder="Custom amount"
            class="custom-input"
            @input="handleCustomAmountInput"
          />
          <button class="withdraw-all-btn" @click="withdrawAll">
            All
          </button>
        </view>
        <view class="amount-info" style="color: #ccc; font-size: 12px; margin-top: 5px;">
          Minimum: 20 USDT, Maximum: {{ formatCurrency(maxWithdrawal) }} USDT
        </view>
      </view>

      <!-- Withdrawal Details -->
      <view class="details-section margin-bottom" v-if="withdrawalAddress">
        <view class="detail-row">
          <span class="detail-label">Withdrawal Amount:</span>
          <span class="detail-value">{{ formatCurrency(finalAmount) }} USDT</span>
        </view>
        <view class="detail-row">
          <span class="detail-label">Network Fee:</span>
          <span class="detail-value">{{ formatCurrency(networkFee) }} USDT</span>
        </view>
        <view class="detail-row">
          <span class="detail-label">You Will Receive:</span>
          <span class="detail-value receive-amount">{{ formatCurrency(receiveAmount) }} USDT</span>
        </view>
      </view>

      <!-- Payment Password -->
      <view class="password-section margin-bottom" v-if="withdrawalAddress">
        <view class="section-title-small" style="color: white; margin-bottom: 10px; font-size: 14px;">
          Payment Password
        </view>
        <input 
          type="password" 
          v-model="paymentPassword"
          placeholder="Enter payment password"
          class="password-input"
        />
      </view>

      <!-- Submit Button -->
      <button 
        class="withdraw-btn" 
        :disabled="!canWithdraw || processing"
        @click="submitWithdrawal"
      >
        <view v-if="processing">
          <i class="fas fa-spinner fa-spin"></i> Processing...
        </view>
        <view v-else>
          WITHDRAW NOW
        </view>
      </button>

      <!-- Warning Note -->
      <view class="warning-note" style="color: #f9ae3d; font-size: 12px; margin-top: 15px; text-align: center;">
        ⚠️ Withdrawals are processed within 24 hours
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const selectedNetwork = ref('TRC20')
const selectedAmount = ref(100)
const customAmount = ref('')
const paymentPassword = ref('')
const processing = ref(false)

const quickAmounts = [50, 100, 300, 500, 1000]
const networkFee = 1.0 // Example fee

const finalAmount = computed(() => {
  return customAmount.value || selectedAmount.value
})

const maxWithdrawal = computed(() => {
  return userStore.userBalance
})

const receiveAmount = computed(() => {
  return Math.max(0, finalAmount.value - networkFee)
})

const withdrawalAddress = computed(() => {
  const user = userStore.currentUser
  if (!user) return null
  
  if (selectedNetwork.value === 'TRC20') {
    return user.withdrawal_address_trc20
  } else if (selectedNetwork.value === 'BEP20') {
    return user.withdrawal_address_bep20
  }
  return null
})

const canWithdraw = computed(() => {
  if (!withdrawalAddress.value) return false
  if (!paymentPassword.value) return false
  if (finalAmount.value < 20) return false
  if (finalAmount.value > maxWithdrawal.value) return false
  if (receiveAmount.value <= 0) return false
  return true
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

const selectNetwork = (network) => {
  selectedNetwork.value = network
  // Reset amount when switching networks
  selectedAmount.value = 100
  customAmount.value = ''
}

const handleCustomAmountInput = () => {
  if (customAmount.value) {
    selectedAmount.value = null
  }
}

const withdrawAll = () => {
  customAmount.value = maxWithdrawal.value
  selectedAmount.value = null
}

const setAddress = () => {
  router.push('/mine')
  // The mine page has the address setting functionality
}

const changeAddress = () => {
  router.push('/mine')
}

const submitWithdrawal = async () => {
  if (!canWithdraw.value) return

  // Check payment password
  if (userStore.currentUser.payment_password !== paymentPassword.value) {
    window.showCustomAlert('Incorrect payment password')
    return
  }

  processing.value = true

  try {
    // In a real app, this would call an API to process the withdrawal
    // For now, we'll simulate it
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Update balance
    const result = await userStore.updateBalance(-finalAmount.value, 'withdrawal')
    
    if (result.success) {
      window.showCustomAlert('Withdrawal request submitted successfully!')
      // Reset form
      selectedAmount.value = 100
      customAmount.value = ''
      paymentPassword.value = ''
    } else {
      window.showCustomAlert(result.error || 'Withdrawal failed')
    }
  } catch (error) {
    window.showCustomAlert(error.message || 'Withdrawal failed')
  } finally {
    processing.value = false
  }
}

onMounted(() => {
  if (!userStore.currentUser) {
    router.push('/login')
  }
})
</script>

<style lang="scss" scoped>
.withdraw-page {
  padding-bottom: 20px;
}

.text-center {
  text-align: center;
}

.margin-bottom {
  margin-bottom: 20px;
}

.balance-amount {
  color: #f9ae3d;
}

.network-selection {
  background: rgba(0,0,0,0.2);
  border-radius: 10px;
  padding: 15px;
  border: 1px solid rgba(255,255,255,0.1);
}

.network-options {
  display: flex;
  gap: 10px;
}

.network-option {
  flex: 1;
  padding: 12px;
  background: rgba(0,0,0,0.3);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid transparent;
  
  &.active {
    background: rgba(78, 119, 113, 0.3);
    border-color: #4e7771;
  }
  
  &:active {
    opacity: 0.7;
  }
}

.network-icon {
  text-align: center;
  margin-bottom: 8px;
  
  image {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
}

.network-name {
  text-align: center;
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.network-check {
  text-align: center;
  color: #52c41a;
  font-size: 12px;
  margin-top: 5px;
}

.address-section {
  background: rgba(0,0,0,0.2);
  border-radius: 10px;
  padding: 15px;
  border: 1px solid rgba(255,255,255,0.1);
  
  .address-display {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    
    .address-text {
      flex: 1;
      background: rgba(0,0,0,0.3);
      padding: 10px;
      border-radius: 8px;
      color: white;
      font-size: 12px;
      word-break: break-all;
    }
    
    .change-btn {
      background: #4e7771;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 8px 12px;
      font-size: 12px;
      cursor: pointer;
      white-space: nowrap;
      
      &:active {
        opacity: 0.7;
      }
    }
  }
  
  .no-address {
    text-align: center;
    
    .set-btn {
      background: #4e7771;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 12px 24px;
      font-size: 14px;
      cursor: pointer;
      
      &:active {
        opacity: 0.7;
      }
    }
  }
}

.amount-selection {
  background: rgba(0,0,0,0.2);
  border-radius: 10px;
  padding: 15px;
  border: 1px solid rgba(255,255,255,0.1);
}

.quick-amounts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 15px;
}

.amount-btn {
  padding: 10px;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  color: white;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
  
  &.active {
    background: #4e7771;
    border-color: #4e7771;
  }
  
  &:active {
    opacity: 0.7;
  }
}

.custom-amount {
  display: flex;
  gap: 10px;
  
  .custom-input {
    flex: 1;
    padding: 12px;
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    color: white;
    font-size: 14px;
    
    &::placeholder {
      color: rgba(255,255,255,0.5);
    }
    
    &:focus {
      outline: none;
      border-color: #4e7771;
    }
  }
  
  .withdraw-all-btn {
    background: rgba(78, 119, 113, 0.3);
    color: white;
    border: 1px solid #4e7771;
    border-radius: 8px;
    padding: 0 20px;
    font-size: 14px;
    cursor: pointer;
    
    &:active {
      opacity: 0.7;
    }
  }
}

.details-section {
  background: rgba(0,0,0,0.2);
  border-radius: 10px;
  padding: 15px;
  border: 1px solid rgba(255,255,255,0.1);
  
  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    
    &:last-child {
      border-bottom: none;
    }
    
    .detail-label {
      color: #ccc;
      font-size: 13px;
    }
    
    .detail-value {
      color: white;
      font-size: 13px;
      font-weight: 500;
      
      &.receive-amount {
        color: #52c41a;
        font-weight: bold;
      }
    }
  }
}

.password-section {
  .password-input {
    width: 100%;
    padding: 12px;
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    color: white;
    font-size: 14px;
    
    &::placeholder {
      color: rgba(255,255,255,0.5);
    }
    
    &:focus {
      outline: none;
      border-color: #4e7771;
    }
  }
}

.withdraw-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #52c41a, #389e0d);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:active:not(:disabled) {
    opacity: 0.7;
  }
}
</style>
