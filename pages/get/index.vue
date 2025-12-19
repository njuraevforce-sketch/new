<template>
  <view class="get-page">
    <!-- UTC Time -->
    <view class="card padding text-center">
      <view class="utc-time text-white text-bold">
        UTC: {{ utcTime }}
      </view>
    </view>

    <!-- Auto Quantification -->
    <view class="card padding">
      <view class="quantum-action">
        <!-- Signal visualization -->
        <view class="signals" id="signals-container">
          <view 
            v-for="i in 3" 
            :key="i" 
            class="signal"
            :class="{ 'used': i > userSignals }"
            :style="{ background: i <= userSignals ? '#4e7771' : '#666' }"
          ></view>
        </view>
        
        <view class="text-center text-gray margin-bottom" style="font-size: 14px;">
          {{ userSignals }} {{ $t('quantum_signals_available') }}
        </view>
        
        <button 
          class="pro-btn" 
          @click="startQuantification"
          :disabled="isQuantifying || userSignals <= 0"
        >
          <view v-if="isQuantifying">
            <i class="fas fa-spinner fa-spin"></i> {{ $t('processing_quantification') }}
          </view>
          <view v-else>
            {{ $t('auto_quantification') }}
          </view>
        </button>
      </view>

      <!-- Quantification process -->
      <view class="quantum-process" v-if="showProcess">
        <view 
          v-for="(step, index) in processSteps" 
          :key="index"
          class="process-step"
          :class="{ 'active': activeStep === index }"
        >
          {{ $t(step.key) }}
        </view>
        
        <view class="process-step" v-if="quantificationResult" style="color: #52c41a; font-weight: bold;">
          {{ $t('profit') }} +{{ quantificationResult.profit.toFixed(2) }} USDT
        </view>
      </view>
    </view>

    <!-- VIP Carousel -->
    <VIPCarousel />
  </view>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import VIPCarousel from '@/components/VIPCarousel.vue'

export default {
  name: 'GetPage',
  components: {
    VIPCarousel
  },
  data() {
    return {
      utcTime: 'Loading...',
      isQuantifying: false,
      showProcess: false,
      activeStep: -1,
      processSteps: [
        { key: 'analyzing_market', duration: 2000 },
        { key: 'calculating_quantum', duration: 2500 },
        { key: 'executing_trades', duration: 3000 },
        { key: 'quantum_complete', duration: 1500 }
      ],
      quantificationResult: null
    }
  },
  computed: {
    ...mapState(['user']),
    ...mapGetters(['isAuthenticated']),
    
    userSignals() {
      return this.user?.signals_available || 0
    }
  },
  mounted() {
    this.updateUTCTime()
    this.utcInterval = setInterval(this.updateUTCTime, 1000)
    
    // Check for signal reset
    this.checkSignalReset()
  },
  beforeDestroy() {
    if (this.utcInterval) {
      clearInterval(this.utcInterval)
    }
  },
  methods: {
    ...mapActions(['performQuantification', 'updateVipLevel']),
    
    updateUTCTime() {
      const now = new Date()
      this.utcTime = now.toUTCString().split(' ')[4]
    },
    
    async startQuantification() {
      if (!this.isAuthenticated) {
        this.$showAlert(this.$t('please_login'))
        return
      }
      
      if (this.userSignals <= 0) {
        this.$showAlert(this.$t('no_signals'))
        return
      }
      
      this.isQuantifying = true
      this.showProcess = true
      this.activeStep = -1
      this.quantificationResult = null
      
      try {
        // Run process animation
        await this.runProcessAnimation()
        
        // Perform actual quantification
        const result = await this.performQuantification()
        
        if (result.success) {
          this.quantificationResult = result
          
          // Update VIP level
          await this.updateVipLevel()
          
          // Hide process after delay
          setTimeout(() => {
            this.showProcess = false
            this.isQuantifying = false
            this.activeStep = -1
            this.quantificationResult = null
            
            this.$showAlert(this.$t('quantification_successful', { profit: result.profit.toFixed(2) }))
          }, 3000)
        } else {
          this.$showAlert(result.message)
          this.showProcess = false
          this.isQuantifying = false
        }
      } catch (error) {
        console.error('Quantification error:', error)
        this.$showAlert(this.$t('server_error'))
        this.showProcess = false
        this.isQuantifying = false
      }
    },
    
    runProcessAnimation() {
      return new Promise((resolve) => {
        let currentStep = 0
        
        const runStep = () => {
          if (currentStep < this.processSteps.length) {
            this.activeStep = currentStep
            setTimeout(runStep, this.processSteps[currentStep].duration)
            currentStep++
          } else {
            resolve()
          }
        }
        
        runStep()
      })
    },
    
    async checkSignalReset() {
      if (!this.user) return
      
      const now = new Date()
      const utcHour = now.getUTCHours()
      const utcMinute = now.getUTCMinutes()
      const today = now.toISOString().split('T')[0]
      const lastUpdate = this.user.last_signal_update?.split('T')[0]
      
      if (today !== lastUpdate && (utcHour > 18 || (utcHour === 18 && utcMinute >= 0))) {
        try {
          const { data, error } = await window.supabase
            .from('users')
            .update({
              signals_available: 3,
              last_signal_update: now.toISOString()
            })
            .eq('id', this.user.id)
            .select()
            
          if (!error && data) {
            // Update store
            this.$store.commit('SET_USER', data[0])
            localStorage.setItem('gly_user', JSON.stringify(data[0]))
            
            this.$showAlert(this.$t('signals_reset_alert'))
          }
        } catch (error) {
          console.error('Signal reset error:', error)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.get-page {
  padding-bottom: 100rpx;
}

.utc-time {
  font-size: 28rpx;
  color: #f9ae3d;
}

.quantum-action {
  text-align: center;
}

.signals {
  display: flex;
  justify-content: center;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.signal {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: #4e7771;
  transition: all 0.3s ease;
}

.signal.used {
  background: #666;
  opacity: 0.5;
}

.quantum-process {
  margin-top: 30rpx;
  padding: 20rpx;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10rpx;
}

.process-step {
  padding: 15rpx;
  color: #cccccc;
  font-size: 26rpx;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.process-step.active {
  opacity: 1;
  color: #52c41a;
  font-weight: bold;
}
</style>
