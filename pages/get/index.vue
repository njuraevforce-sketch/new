<template>
  <view class="get-page">
    <view class="card padding">
      <!-- UTC Time -->
      <view class="utc-time">
        UTC: {{ utcTime }}
      </view>
      
      <!-- Auto Quantification -->
      <view class="quantum-action">
        <view class="signals">
          <view 
            v-for="n in 3" 
            :key="n"
            class="signal"
            :class="{'used': n > userStore.signalsAvailable}"
          ></view>
        </view>
        <view style="text-align: center; color: #ccc; font-size: 14px; margin-bottom: 15px;">
          {{ userStore.signalsAvailable }} quantum signals available
        </view>
        
        <button 
          class="quant-btn" 
          @click="startQuantification"
          :disabled="userStore.signalsAvailable <= 0 || processing"
        >
          <i v-if="processing" class="fas fa-spinner fa-spin"></i>
          {{ processing ? 'Processing...' : 'AUTO QUANTIFICATION' }}
        </button>
      </view>

      <!-- Quantification process -->
      <view class="quantum-process" v-if="showProcess">
        <view 
          v-for="(step, index) in processSteps" 
          :key="index"
          class="process-step"
          :class="{'active': currentStep === index}"
        >
          {{ step.text }}
        </view>
        <view class="process-step" v-if="profitResult" style="color: #52c41a; font-weight: bold;">
          Profit +{{ profitResult.toFixed(2) }} USDT
        </view>
      </view>

      <!-- VIP cards -->
      <view class="vip-section">
        <view class="section-title">VIP Levels</view>
        
        <!-- VIP Carousel -->
        <view class="custom-vip-carousel" @touchstart="onTouchStart" @touchend="onTouchEnd">
          <view class="carousel-track" :style="{transform: `translateY(-${currentVipIndex * 130}px)`}">
            <view 
              v-for="(vip, index) in vipLevels" 
              :key="index"
              class="vip-slide"
              :class="{'active': currentVipIndex === index}"
              :data-vip="vip.level"
            >
              <view class="vip-card" :style="{backgroundImage: `url('/static/vip${vip.level}.png')`}">
                <view class="vip-title">VIP{{ vip.level }}</view>
                <view class="vip-status">
                  <i :class="isVipUnlocked(vip.level) ? 'fas fa-lock-open' : 'fas fa-lock'" 
                     :style="{color: isVipUnlocked(vip.level) ? '#4CAF50' : '#cccccc'}"></i>
                  <span>{{ isVipUnlocked(vip.level) ? 'Unlocked' : 'Locked' }}</span>
                </view>
                <view class="vip-image">
                  <image :src="`/static/vipicon${vip.level}.png`" mode="aspectFit"></image>
                </view>
              </view>
            </view>
          </view>
        </view>
        
        <!-- Описание VIP уровня -->
        <view class="vip-description">
          {{ vipLevels[currentVipIndex]?.description }}
        </view>
        
        <!-- Детали VIP уровня -->
        <view class="vip-details">
          <view class="details-content">
            <view class="detail-item">
              <span class="detail-label">Daily Percent:</span>
              <span class="detail-value">{{ vipLevels[currentVipIndex]?.percent }}</span>
            </view>
            <view class="detail-item">
              <span class="detail-label">Deposit Range:</span>
              <span class="detail-value">{{ vipLevels[currentVipIndex]?.range }}</span>
            </view>
            <view class="detail-item">
              <span class="detail-label">Signals:</span>
              <span class="detail-value">{{ vipLevels[currentVipIndex]?.signals }}</span>
            </view>
            <view class="detail-item">
              <span class="detail-label">Referrals Required:</span>
              <span class="detail-value">{{ vipLevels[currentVipIndex]?.refs }}</span>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../store/user'
import { performQuantification } from '../../utils/api'

const router = useRouter()
const userStore = useUserStore()

const utcTime = ref('Loading...')
const currentVipIndex = ref(0)
const showProcess = ref(false)
const processing = ref(false)
const currentStep = ref(-1)
const profitResult = ref(null)
let utcInterval = null
let touchStartY = 0
let touchEndY = 0

const vipLevels = ref([
  {
    level: 1,
    description: 'VIP 1: Basic level with 2.2% daily return',
    percent: '2.2%',
    range: '0-299 USDT',
    signals: '3 signals',
    refs: '0 refs'
  },
  {
    level: 2,
    description: 'VIP 2: 2.8% daily return',
    percent: '2.8%',
    range: '300-1000 USDT',
    signals: '3 signals',
    refs: '2 refs'
  },
  {
    level: 3,
    description: 'VIP 3: 3.5% daily return',
    percent: '3.5%',
    range: '1000-3500 USDT',
    signals: '3 signals',
    refs: '5 refs'
  },
  {
    level: 4,
    description: 'VIP 4: 4.0% daily return',
    percent: '4.0%',
    range: '3500-6000 USDT',
    signals: '3 signals',
    refs: '8 refs'
  },
  {
    level: 5,
    description: 'VIP 5: 5.0% daily return',
    percent: '5.0%',
    range: '6000-12000 USDT',
    signals: '3 signals',
    refs: '15 refs'
  },
  {
    level: 6,
    description: 'VIP 6: 6.0% daily return',
    percent: '6.0%',
    range: '12000-20000 USDT',
    signals: '3 signals',
    refs: '25 refs'
  }
])

const processSteps = ref([
  { text: 'Analyzing market conditions...', duration: 2000 },
  { text: 'Calculating quantum probabilities...', duration: 2500 },
  { text: 'Executing quantum trades...', duration: 3000 },
  { text: 'Quantum quantification complete!', duration: 1500 }
])

function isVipUnlocked(level) {
  return level <= userStore.vipLevel
}

function updateUTCTime() {
  const now = new Date()
  utcTime.value = `UTC: ${now.toUTCString().split(' ')[4]}`
}

function onTouchStart(e) {
  touchStartY = e.touches[0].clientY
}

function onTouchEnd(e) {
  touchEndY = e.changedTouches[0].clientY
  const diff = touchEndY - touchStartY
  
  if (Math.abs(diff) > 40) {
    if (diff > 0) {
      // Swipe down - previous slide
      if (currentVipIndex.value > 0) {
        currentVipIndex.value--
      }
    } else {
      // Swipe up - next slide
      if (currentVipIndex.value < vipLevels.value.length - 1) {
        currentVipIndex.value++
      }
    }
  }
}

async function startQuantification() {
  if (!userStore.isLoggedIn) {
    uni.showToast({
      title: 'Please login first',
      icon: 'none'
    })
    return
  }
  
  if (userStore.signalsAvailable <= 0) {
    uni.showToast({
      title: 'No signals available',
      icon: 'none'
    })
    return
  }
  
  processing.value = true
  showProcess.value = true
  profitResult.value = null
  
  // Run process animation
  for (let i = 0; i < processSteps.value.length; i++) {
    currentStep.value = i
    await new Promise(resolve => setTimeout(resolve, processSteps.value[i].duration))
  }
  
  // Perform actual quantification
  try {
    const result = await performQuantification(userStore.userId)
    
    if (result.success) {
      profitResult.value = result.profit
      
      // Update user store
      userStore.user.balance += result.profit
      userStore.user.signals_available = result.signals_left
      
      // Update VIP level
      await userStore.updateVipLevel()
      
      // Show success message
      setTimeout(() => {
        uni.showToast({
          title: `Quantification successful! Profit: ${result.profit.toFixed(2)} USDT`,
          icon: 'success'
        })
        
        // Reset process
        showProcess.value = false
        currentStep.value = -1
        processing.value = false
      }, 2000)
    } else {
      uni.showToast({
        title: result.message,
        icon: 'none'
      })
      showProcess.value = false
      processing.value = false
    }
  } catch (error) {
    uni.showToast({
      title: 'Quantification error',
      icon: 'none'
    })
    showProcess.value = false
    processing.value = false
  }
}

onMounted(() => {
  updateUTCTime()
  utcInterval = setInterval(updateUTCTime, 1000)
  
  // Set current VIP index based on user's VIP level
  currentVipIndex.value = Math.max(0, userStore.vipLevel - 1)
})

onUnmounted(() => {
  if (utcInterval) clearInterval(utcInterval)
})
</script>

<style scoped>
.get-page {
  padding-bottom: 80px;
}

.utc-time {
  text-align: center;
  color: #ccc;
  font-size: 14px;
  margin-bottom: 20px;
}

.quantum-action {
  text-align: center;
}

.signals {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
}

.signal {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #4e7771;
  
  &.used {
    background: #666;
  }
}

.quant-btn {
  background: linear-gradient(135deg, #4e7771 0%, #52c41a 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(78, 119, 113, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.quantum-process {
  margin-top: 20px;
}

.process-step {
  padding: 10px;
  text-align: center;
  color: #ccc;
  font-size: 14px;
  opacity: 0.5;
  transition: all 0.3s ease;
  
  &.active {
    color: #52c41a;
    opacity: 1;
    font-weight: bold;
  }
}

.vip-section {
  margin-top: 30px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.custom-vip-carousel {
  position: relative;
  height: 400px;
  overflow: hidden;
  margin: 20px 0;
}

.carousel-track {
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.vip-slide {
  height: 130px;
  margin: 10px 0;
  transition: all 0.3s ease;
  
  &.active {
    transform: scale(1.05);
    z-index: 2;
  }
}

.vip-card {
  height: 100%;
  border-radius: 12px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  background-size: cover;
  background-position: center;
  
  .vip-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
    color: white;
    text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
  }
  
  .vip-status {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    margin-bottom: 10px;
    color: white;
    text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
  }
  
  .vip-image {
    width: 60px;
    height: 60px;
    
    image {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}

.vip-description {
  text-align: center;
  color: #ccc;
  font-size: 14px;
  margin: 20px 0;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.vip-details {
  .details-content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
  }
  
  .detail-label {
    font-size: 12px;
    color: #ccc;
  }
  
  .detail-value {
    font-size: 14px;
    font-weight: 600;
  }
}
</style>
