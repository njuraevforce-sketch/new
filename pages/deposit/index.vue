<template>
  <view class="deposit-page">
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
            @click="selectedNetwork = 'TRC20'"
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
            @click="selectedNetwork = 'BEP20'"
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

      <!-- Amount Selection -->
      <view class="amount-selection margin-bottom">
        <view class="section-title-small" style="color: white; margin-bottom: 10px; font-size: 14px;">
          Select Amount
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
        </view>
        <view class="amount-info" style="color: #ccc; font-size: 12px; margin-top: 5px;">
          Minimum: 20 USDT, Maximum: 20000 USDT
        </view>
      </view>

      <!-- QR Code and Address -->
      <view class="qr-section margin-bottom" v-if="depositAddress">
        <view class="text-center margin-bottom">
          <view class="text-gray" style="font-size: 14px; margin-bottom: 10px;">
            Send {{ finalAmount }} USDT to this address
          </view>
          <view class="qr-code" id="qr-code">
            <canvas ref="qrCanvas"></canvas>
          </view>
          <view class="deposit-address" style="margin-top: 15px;">
            <view class="text-gray" style="font-size: 12px; margin-bottom: 5px;">Deposit Address:</view>
            <view class="address-text" style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px; font-size: 12px; word-break: break-all;">
              {{ depositAddress }}
            </view>
            <button class="copy-btn" @click="copyAddress" style="margin-top: 10px;">
              <i class="fas" :class="copiedAddress ? 'fa-check' : 'fa-copy'"></i>
              {{ copiedAddress ? 'Copied!' : 'Copy Address' }}
            </button>
          </view>
        </view>
      </view>

      <!-- Deposit Instructions -->
      <view class="instructions-section">
        <view class="section-title-small" style="color: white; margin-bottom: 10px; font-size: 14px;">
          Deposit Instructions
        </view>
        <view class="instructions-list">
          <view class="instruction-item">
            <view class="instruction-number">1</view>
            <view class="instruction-text">Copy the wallet address or scan QR code</view>
          </view>
          <view class="instruction-item">
            <view class="instruction-number">2</view>
            <view class="instruction-text">Send exact amount to the address</view>
          </view>
          <view class="instruction-item">
            <view class="instruction-number">3</view>
            <view class="instruction-text">Wait for blockchain confirmation</view>
          </view>
          <view class="instruction-item">
            <view class="instruction-number">4</view>
            <view class="instruction-text">Funds will be credited automatically</view>
          </view>
        </view>
        <view class="warning-note" style="color: #f9ae3d; font-size: 12px; margin-top: 15px; text-align: center;">
          ⚠️ Only send USDT on the selected network
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import QRCode from 'qrcode'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const selectedNetwork = ref('TRC20')
const selectedAmount = ref(100)
const customAmount = ref('')
const depositAddress = ref('')
const copiedAddress = ref(false)
const qrCanvas = ref(null)

const quickAmounts = [50, 100, 300, 500, 1000, 2000]

const finalAmount = computed(() => {
  return customAmount.value || selectedAmount.value
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

const handleCustomAmountInput = () => {
  if (customAmount.value) {
    selectedAmount.value = null
  }
}

const copyAddress = async () => {
  if (!depositAddress.value) return
  
  try {
    await navigator.clipboard.writeText(depositAddress.value)
    copiedAddress.value = true
    setTimeout(() => copiedAddress.value = false, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const generateQRCode = async () => {
  if (!depositAddress.value || !qrCanvas.value) return
  
  try {
    await QRCode.toCanvas(qrCanvas.value, depositAddress.value, {
      width: 200,
      height: 200,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
  } catch (err) {
    console.error('Failed to generate QR code:', err)
  }
}

const getDepositAddress = () => {
  // In a real app, this would come from your backend
  // For demo, we'll use a placeholder
  const addresses = {
    'TRC20': 'TQrY8w... (TRC20 address)',
    'BEP20': '0x1234... (BEP20 address)'
  }
  return addresses[selectedNetwork.value] || ''
}

watch(selectedNetwork, () => {
  depositAddress.value = getDepositAddress()
  if (depositAddress.value) {
    setTimeout(generateQRCode, 100)
  }
})

onMounted(() => {
  depositAddress.value = getDepositAddress()
  if (depositAddress.value) {
    setTimeout(generateQRCode, 100)
  }
})
</script>

<style lang="scss" scoped>
.deposit-page {
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
  .custom-input {
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

.qr-section {
  background: rgba(0,0,0,0.2);
  border-radius: 10px;
  padding: 20px;
  border: 1px solid rgba(255,255,255,0.1);
  
  .qr-code {
    display: flex;
    justify-content: center;
    
    canvas {
      width: 200px;
      height: 200px;
      background: white;
      padding: 10px;
      border-radius: 10px;
    }
  }
}

.copy-btn {
  width: 100%;
  padding: 12px;
  background: #4e7771;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:active {
    opacity: 0.7;
  }
}

.instructions-list {
  .instruction-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 12px;
    
    .instruction-number {
      width: 24px;
      height: 24px;
      background: #4e7771;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
      margin-right: 10px;
      flex-shrink: 0;
    }
    
    .instruction-text {
      color: #ccc;
      font-size: 13px;
      line-height: 1.4;
    }
  }
}
</style>
