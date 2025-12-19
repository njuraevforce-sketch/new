<!-- src/pages/quantification/index.vue -->
<template>
  <div class="quantification-page">
    <div class="card padding">
      <!-- UTC Time -->
      <div class="utc-time">
        UTC: {{ utcTime }}
      </div>
      
      <!-- Auto Quantification -->
      <div class="quantum-action">
        <div class="signals">
          <div 
            v-for="i in 3" 
            :key="i" 
            class="signal"
            :class="{ used: i > (user ? user.signals_available : 0) }"
          ></div>
        </div>
        <div style="text-align: center; color: #ccc; font-size: 14px; margin-bottom: 15px;">
          {{ signalsText }}
        </div>
        
        <button class="quant-btn" @click="startQuantification" :disabled="quantifying || !user || user.signals_available <= 0">
          <i v-if="quantifying" class="fas fa-spinner fa-spin"></i>
          {{ quantifying ? $t('processing_quantification') : $t('auto_quantification') }}
        </button>
      </div>

      <!-- Quantification process -->
      <div class="quantum-process" v-if="showProcess">
        <div class="process-step" :class="{ active: step >= 1 }">{{ $t('analyzing_market') }}</div>
        <div class="process-step" :class="{ active: step >= 2 }">{{ $t('calculating_quantum') }}</div>
        <div class="process-step" :class="{ active: step >= 3 }">{{ $t('executing_trades') }}</div>
        <div class="process-step" :class="{ active: step >= 4 }">{{ $t('quantum_complete') }}</div>
        <div class="process-step" v-if="profitResult" style="color: #52c41a; font-weight: bold;">
          {{ profitResult }}
        </div>
      </div>

      <!-- VIP cards -->
      <div class="vip-section">
        <div class="section-title">{{ $t('vip_levels') }}</div>
        
        <div class="custom-vip-carousel">
          <div class="carousel-track" :style="{ transform: `translateY(-${vipIndex * 130}px)` }">
            <div 
              v-for="(vip, index) in vipLevels" 
              :key="vip.level"
              :class="['vip-slide', { active: vipIndex === index }]"
              :data-vip="vip.level"
            >
              <div class="vip-card">
                <div class="vip-title">VIP{{ vip.level }}</div>
                <div class="vip-status">
                  <i :class="vip.unlocked ? 'fas fa-lock-open' : 'fas fa-lock'" 
                     :style="{ color: vip.unlocked ? '#4CAF50' : '#cccccc' }"></i>
                  <span>{{ vip.unlocked ? $t('unlocked') : $t('locked') }}</span>
                </div>
                <div class="vip-image">
                  <img :src="`/static/vipicon${vip.level}.png`" :alt="`VIP ${vip.level}`">
                </div>
              </div>
            </div>
          </div>
          
          <div class="carousel-indicators">
            <span 
              v-for="(vip, index) in vipLevels" 
              :key="vip.level"
              :class="['indicator', { active: vipIndex === index }]"
              @click="vipIndex = index"
            ></span>
          </div>
        </div>
        
        <!-- Описание VIP уровня -->
        <div class="vip-description">
          {{ currentVipDescription }}
        </div>
        
        <!-- Детали VIP уровня -->
        <div class="vip-details">
          <div class="details-content">
            <div class="detail-item">
              <span class="detail-label">{{ $t('daily_percent') }}:</span>
              <span class="detail-value">{{ currentVipDetails.percent }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ $t('deposit_range') }}:</span>
              <span class="detail-value">{{ currentVipDetails.range }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ $t('signals_count') }}:</span>
              <span class="detail-value">{{ currentVipDetails.signals }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ $t('referrals_required') }}:</span>
              <span class="detail-value">{{ currentVipDetails.refs }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      utcTime: 'Loading...',
      quantifying: false,
      showProcess: false,
      step: 0,
      profitResult: '',
      vipIndex: 0,
      utcInterval: null,
      vipLevels: [
        { level: 1, unlocked: true },
        { level: 2, unlocked: false },
        { level: 3, unlocked: false },
        { level: 4, unlocked: false },
        { level: 5, unlocked: false },
        { level: 6, unlocked: false }
      ]
    }
  },
  
  computed: {
    user() {
      return this.$store.state.user
    },
    
    signalsText() {
      if (!this.user) return this.$t('loading')
      return `${this.user.signals_available} ${this.$t('quantum_signals_available')}`
    },
    
    currentVipDescription() {
      const descriptions = [
        this.$t('vip_description_1'),
        this.$t('vip_description_2'),
        this.$t('vip_description_3'),
        this.$t('vip_description_4'),
        this.$t('vip_description_5'),
        this.$t('vip_description_6')
      ]
      return descriptions[this.vipIndex] || ''
    },
    
    currentVipDetails() {
      const details = [
        { percent: '2.2%', range: '0-299 USDT', signals: '3 signals', refs: '0 refs' },
        { percent: '2.8%', range: '300-1000 USDT', signals: '3 signals', refs: '2 refs' },
        { percent: '3.5%', range: '1000-3500 USDT', signals: '3 signals', refs: '5 refs' },
        { percent: '4.0%', range: '3500-6000 USDT', signals: '3 signals', refs: '8 refs' },
        { percent: '5.0%', range: '6000-12000 USDT', signals: '3 signals', refs: '15 refs' },
        { percent: '6.0%', range: '12000-20000 USDT', signals: '3 signals', refs: '25 refs' }
      ]
      return details[this.vipIndex] || details[0]
    }
  },
  
  mounted() {
    this.updateUTCTime()
    this.utcInterval = setInterval(this.updateUTCTime, 1000)
    
    // Update VIP unlocked status
    this.updateVipStatus()
  },
  
  beforeDestroy() {
    if (this.utcInterval) {
      clearInterval(this.utcInterval)
    }
  },
  
  watch: {
    user: {
      immediate: true,
      handler(user) {
        if (user) {
          this.updateVipStatus()
        }
      }
    }
  },
  
  methods: {
    updateUTCTime() {
      const now = new Date()
      const utcTime = now.toUTCString().split(' ')[4]
      this.utcTime = utcTime
    },
    
    updateVipStatus() {
      if (!this.user) return
      
      this.vipLevels = this.vipLevels.map(vip => ({
        ...vip,
        unlocked: vip.level <= this.user.vip_level
      }))
      
      this.vipIndex = this.user.vip_level - 1
    },
    
    async startQuantification() {
      if (!this.user) {
        window.showCustomAlert(this.$t('please_login'))
        return
      }
      
      if (this.user.signals_available <= 0) {
        window.showCustomAlert(this.$t('no_signals'))
        return
      }
      
      this.quantifying = true
      this.showProcess = true
      this.step = 0
      this.profitResult = ''
      
      // Run process animation
      await this.runQuantificationProcess()
      
      // Perform quantification
      const result = await window.performQuantification()
      
      if (result.success) {
        this.profitResult = `${this.$t('profit')} +${result.profit.toFixed(2)} USDT`
        
        // Hide process after 3 seconds
        setTimeout(() => {
          this.showProcess = false
          this.step = 0
          this.profitResult = ''
          this.quantifying = false
          
          window.showCustomAlert(this.$t('quantification_successful', { profit: result.profit.toFixed(2) }))
        }, 3000)
      } else {
        window.showCustomAlert(result.message)
        this.showProcess = false
        this.quantifying = false
      }
    },
    
    async runQuantificationProcess() {
      return new Promise((resolve) => {
        const steps = [2000, 2500, 3000, 1500]
        let currentStep = 0
        
        const runStep = () => {
          if (currentStep < steps.length) {
            this.step = currentStep + 1
            setTimeout(runStep, steps[currentStep])
            currentStep++
          } else {
            resolve()
          }
        }
        
        runStep()
      })
    }
  }
}
</script>

<style scoped>
/* Add your styles here */
</style>
