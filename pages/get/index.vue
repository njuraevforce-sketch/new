<template>
  <view class="get-page">
    <!-- UTC Time -->
    <div class="utc-time-section">
      <div class="utc-time" id="utc-time">
        UTC: {{ utcTime }}
      </div>
    </div>
    
    <!-- Auto Quantification -->
    <div class="quantum-section">
      <div class="signals-container">
        <div 
          v-for="n in 3" 
          :key="n" 
          :class="['signal', { 'used': n > signalsAvailable }]"
        ></div>
      </div>
      <div class="signals-text">
        {{ signalsText }}
      </div>
      
      <button 
        class="quant-btn" 
        @click="startQuantification"
        :disabled="quantLoading || signalsAvailable <= 0"
      >
        <i v-if="quantLoading" class="fas fa-spinner fa-spin"></i>
        {{ quantLoading ? $t('processing_quantification') : $t('auto_quantification') }}
      </button>
    </div>

    <!-- Quantification process -->
    <div v-if="showProcess" class="quantum-process">
      <div 
        v-for="(step, index) in processSteps" 
        :key="index"
        :class="['process-step', { 'active': currentStep >= index }]"
      >
        {{ step }}
      </div>
      <div v-if="quantResult" class="profit-result">
        {{ $t('profit') }} +{{ quantResult.profit.toFixed(2) }} USDT
      </div>
    </div>

    <!-- VIP cards -->
    <div class="vip-section">
      <div class="section-title">{{ $t('vip_levels') }}</div>
      
      <!-- VIP Carousel -->
      <div class="vip-carousel-container">
        <div class="vip-track" :style="{ transform: `translateX(-${currentVipIndex * 100}%)` }">
          <div 
            v-for="level in 6" 
            :key="level"
            class="vip-slide"
          >
            <div class="vip-card">
              <div class="vip-title">VIP{{ level }}</div>
              <div class="vip-status">
                <i :class="level <= userVipLevel ? 'fas fa-lock-open' : 'fas fa-lock'"></i>
                <span>{{ level <= userVipLevel ? $t('unlocked') : $t('locked') }}</span>
              </div>
              <div class="vip-image">
                <img :src="`/static/assets/vipicon${level}.png`" :alt="`VIP ${level}`">
              </div>
            </div>
          </div>
        </div>
        
        <div class="vip-indicators">
          <span 
            v-for="level in 6" 
            :key="level"
            :class="['vip-indicator', { 'active': currentVipIndex === level - 1 }]"
            @click="goToVipLevel(level - 1)"
          ></span>
        </div>
      </div>
      
      <!-- VIP Description -->
      <div class="vip-description">
        {{ vipDescriptions[currentVipIndex] }}
      </div>
      
      <!-- VIP Details -->
      <div class="vip-details">
        <div class="detail-item">
          <span class="detail-label">{{ $t('daily_percent') }}:</span>
          <span class="detail-value">{{ vipDetails[currentVipIndex].percent }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">{{ $t('deposit_range') }}:</span>
          <span class="detail-value">{{ vipDetails[currentVipIndex].range }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">{{ $t('signals_count') }}:</span>
          <span class="detail-value">{{ vipDetails[currentVipIndex].signals }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">{{ $t('referrals_required') }}:</span>
          <span class="detail-value">{{ vipDetails[currentVipIndex].refs }}</span>
        </div>
      </div>
    </div>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { t } from '@/utils/translate'

const userStore = useUserStore()

// UTC Time
const utcTime = ref('')
const utcInterval = ref(null)

// Quantification
const signalsAvailable = ref(3)
const quantLoading = ref(false)
const showProcess = ref(false)
const currentStep = ref(-1)
const quantResult = ref(null)

const processSteps = ref([
  t('analyzing_market'),
  t('calculating_quantum'),
  t('executing_trades'),
  t('quantum_complete')
])

const signalsText = computed(() => {
  return `${signalsAvailable.value} ${t('quantum_signals_available')}`
})

// VIP Carousel
const currentVipIndex = ref(0)
const userVipLevel = computed(() => userStore.currentUser?.vip_level || 1)

const vipDescriptions = [
  t('vip_description_1'),
  t('vip_description_2'),
  t('vip_description_3'),
  t('vip_description_4'),
  t('vip_description_5'),
  t('vip_description_6')
]

const vipDetails = [
  { percent: '2.2%', range: '0-299 USDT', signals: '3 signals', refs: '0 refs' },
  { percent: '2.8%', range: '300-1000 USDT', signals: '3 signals', refs: '2 refs' },
  { percent: '3.5%', range: '1000-3500 USDT', signals: '3 signals', refs: '5 refs' },
  { percent: '4.0%', range: '3500-6000 USDT', signals: '3 signals', refs: '8 refs' },
  { percent: '5.0%', range: '6000-12000 USDT', signals: '3 signals', refs: '15 refs' },
  { percent: '6.0%', range: '12000-20000 USDT', signals: '3 signals', refs: '25 refs' }
]

// Update UTC Time
const updateUTCTime = () => {
  const now = new Date()
  utcTime.value = now.toUTCString().split(' ')[4]
}

// Quantification
const startQuantification = async () => {
  if (!userStore.currentUser) {
    window.showCustomAlert(t('please_login'))
    return
  }
  
  if (signalsAvailable.value <= 0) {
    window.showCustomAlert(t('no_signals'))
    return
  }
  
  quantLoading.value = true
  showProcess.value = true
  currentStep.value = -1
  quantResult.value = null
  
  // Show process steps
  for (let i = 0; i < processSteps.value.length; i++) {
    currentStep.value = i
    await new Promise(resolve => setTimeout(resolve, 1500))
  }
  
  // Perform quantification
  try {
    const result = await userStore.performQuantification()
    
    if (result.success) {
      quantResult.value = result
      signalsAvailable.value = result.signals_left
      
      // Show success message
      window.showCustomAlert(
        t('quantification_successful', null, { profit: result.profit.toFixed(2) })
      )
    } else {
      window.showCustomAlert(result.error)
    }
  } catch (error) {
    window.showCustomAlert(t('server_error'))
  } finally {
    quantLoading.value = false
    
    // Hide process after 3 seconds
    setTimeout(() => {
      showProcess.value = false
      currentStep.value = -1
      quantResult.value = null
    }, 3000)
  }
}

// VIP Carousel
const goToVipLevel = (index) => {
  currentVipIndex.value = index
}

// Load user data
const loadUserData = async () => {
  if (userStore.currentUser) {
    signalsAvailable.value = userStore.currentUser.signals_available
    await userStore.checkAndUpdateSignals()
    await userStore.updateVipLevel()
  }
}

onMounted(() => {
  // Start UTC time update
  updateUTCTime()
  utcInterval.value = setInterval(updateUTCTime, 1000)
  
  // Load user data
  loadUserData()
  
  // Auto-rotate VIP carousel
  const vipInterval = setInterval(() => {
    currentVipIndex.value = (currentVipIndex.value + 1) % 6
  }, 5000)
  
  onUnmounted(() => {
    if (utcInterval.value) clearInterval(utcInterval.value)
    if (vipInterval) clearInterval(vipInterval)
  })
})
</script>

<style scoped>
.get-page {
  padding: 15px;
  padding-bottom: 80px;
}

/* UTC Time */
.utc-time-section {
  margin-bottom: 20px;
}

.utc-time {
  background: linear-gradient(135deg, #36454f, #5a6b76);
  color: white;
  padding: 10px 15px;
  border-radius: 10px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
}

/* Quantum Section */
.quantum-section {
  background: white;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.signals-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 15px;
}

.signal {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #4e7771;
  transition: all 0.3s;
}

.signal.used {
  background: #666;
  opacity: 0.5;
}

.signals-text {
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
}

.quant-btn {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #52c41a, #389e0d);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.quant-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(82, 196, 26, 0.3);
}

.quant-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Quantum Process */
.quantum-process {
  background: white;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.process-step {
  padding: 10px;
  margin-bottom: 10px;
  border-left: 3px solid transparent;
  font-size: 14px;
  color: #666;
  opacity: 0.5;
  transition: all 0.3s;
}

.process-step.active {
  border-left-color: #4e7771;
  color: #333;
  opacity: 1;
  padding-left: 15px;
}

.profit-result {
  padding: 10px;
  background: rgba(82, 196, 26, 0.1);
  border-radius: 8px;
  color: #52c41a;
  font-weight: 600;
  font-size: 16px;
  text-align: center;
  margin-top: 10px;
  animation: fadeIn 0.5s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* VIP Section */
.vip-section {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  text-align: center;
}

.vip-carousel-container {
  position: relative;
  overflow: hidden;
  margin-bottom: 20px;
  border-radius: 12px;
  background: #f5f5f5;
}

.vip-track {
  display: flex;
  transition: transform 0.5s ease;
}

.vip-slide {
  flex: 0 0 100%;
  padding: 15px;
}

.vip-card {
  background: linear-gradient(135deg, #4e7771, #36454f);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  position: relative;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.vip-title {
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin-bottom: 10px;
}

.vip-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  color: white;
  font-size: 12px;
  margin-bottom: 15px;
}

.vip-status i {
  font-size: 14px;
}

.vip-image {
  width: 80px;
  height: 80px;
}

.vip-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.vip-indicators {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 15px;
}

.vip-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ddd;
  cursor: pointer;
  transition: all 0.3s;
}

.vip-indicator.active {
  width: 20px;
  border-radius: 4px;
  background: #4e7771;
}

.vip-description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 20px;
  text-align: center;
  padding: 0 10px;
}

.vip-details {
  background: #f9f9f9;
  border-radius: 12px;
  padding: 15px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  color: #666;
  font-size: 13px;
}

.detail-value {
  color: #333;
  font-weight: 600;
  font-size: 13px;
}

@media (min-width: 768px) {
  .get-page {
    max-width: 375px;
    margin: 0 auto;
  }
}
</style>
