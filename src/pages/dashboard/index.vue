<!-- src/pages/dashboard/index.vue -->
<template>
  <div class="dashboard-page">
    <!-- Image Carousel -->
    <div class="banner-section">
      <div class="home-carousel-container">
        <div class="home-carousel-track" ref="carouselTrack">
          <div class="home-carousel-slide">
            <img src="/static/banner.png" alt="Banner 1">
          </div>
          <div class="home-carousel-slide">
            <img src="/static/banner1.png" alt="Banner 2">
          </div>
          <div class="home-carousel-slide">
            <img src="/static/banner2.png" alt="Banner 3">
          </div>
        </div>
        <div class="home-carousel-indicators">
          <span 
            v-for="(_, index) in 3" 
            :key="index"
            :class="['home-indicator', { active: currentSlide === index }]"
            @click="goToSlide(index)"
          ></span>
        </div>
      </div>
    </div>
    
    <!-- Running line -->
    <div class="notice-section">
      <div class="notice-bar">
        <div class="notice-icon">🚀</div>
        <div class="notice-content">
          <div class="notice-text">
            GLY - Quantum Investment Platform │ Advanced AI Algorithms │ Daily Returns 2.2%-6% │ 6 VIP Levels │ Multi-Level Referral System │ Secure & Transparent
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation icons -->
    <div class="nav-section">
      <div class="nav-grid">
        <div class="nav-item" @click="goTo('company')">
          <div class="nav-icon">
            <img src="/static/company.png" alt="Company">
          </div>
          <div class="nav-text">{{ $t('company') }}</div>
        </div>
        <div class="nav-item" @click="goTo('deposit')">
          <div class="nav-icon">
            <img src="/static/deposit.png" alt="Deposit">
          </div>
          <div class="nav-text">{{ $t('deposit') }}</div>
        </div>
        <div class="nav-item" @click="goTo('withdraw')">
          <div class="nav-icon">
            <img src="/static/withdraw.png" alt="Withdraw">
          </div>
          <div class="nav-text">{{ $t('withdraw') }}</div>
        </div>
        <div class="nav-item" @click="goTo('invite')">
          <div class="nav-icon">
            <img src="/static/invite.png" alt="Invite">
          </div>
          <div class="nav-text">{{ $t('invite') }}</div>
        </div>
        <div class="nav-item" @click="goTo('team')">
          <div class="nav-icon">
            <img src="/static/team.png" alt="Team">
          </div>
          <div class="nav-text">{{ $t('team') }}</div>
        </div>
        <div class="nav-item" @click="goTo('rules')">
          <div class="nav-icon">
            <img src="/static/rules.png" alt="Rules">
          </div>
          <div class="nav-text">{{ $t('rules') }}</div>
        </div>
      </div>
    </div>

    <!-- Crypto prices -->
    <div class="quantum-section">
      <div class="quantum-header">
        <div class="quantum-title">{{ $t('live_crypto_prices') }}</div>
        <div class="text-gray" style="font-size: 12px; font-weight: normal;">
          {{ lastUpdated }}
        </div>
      </div>
      <div class="crypto-grid" id="crypto-prices">
        <div v-if="loadingCrypto" style="color: #ccc; text-align: center; padding: 20px;">
          {{ $t('loading_data') }}
        </div>
        <div v-else-if="cryptoError" style="color: #ccc; text-align: center; padding: 20px;">
          {{ cryptoError }}
        </div>
        <template v-else>
          <div class="crypto-item" v-for="crypto in cryptoPrices" :key="crypto.symbol">
            <div class="crypto-info">
              <div class="crypto-icon">
                <img :src="crypto.icon" :alt="crypto.name">
              </div>
              <div>
                <span class="crypto-name">{{ crypto.name }}</span>
                <span class="crypto-pair">/USDT</span>
              </div>
            </div>
            <div class="flex align-center">
              <div class="crypto-price">${{ formatPrice(crypto.price) }}</div>
              <div :class="['crypto-change', crypto.change >= 0 ? 'change-positive' : 'change-negative']">
                {{ crypto.change >= 0 ? '+' : '' }}{{ crypto.change.toFixed(2) }}%
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Partners block -->
    <div class="partners-section" style="margin-bottom: 80px;">
      <div class="section-title">{{ $t('our_partners') }}</div>
      <img src="/static/partners.png" alt="Partners" style="width: 100%; border-radius: 10px;">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentSlide: 0,
      carouselInterval: null,
      cryptoPrices: [],
      loadingCrypto: true,
      cryptoError: null,
      lastUpdated: this.$t('updating')
    }
  },
  
  mounted() {
    this.initCarousel()
    this.loadCryptoPrices()
    
    // Update crypto prices every 30 seconds
    setInterval(() => {
      this.loadCryptoPrices()
    }, 30000)
    
    // Show welcome banner on first visit
    setTimeout(() => {
      this.showWelcomeBanner()
    }, 1000)
    
    // Setup navbar
    this.$store.commit('SET_NAVBAR_TITLE', '')
    this.$store.commit('SET_BACK_BUTTON', false)
  },
  
  beforeDestroy() {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval)
    }
  },
  
  methods: {
    initCarousel() {
      this.carouselInterval = setInterval(() => {
        this.currentSlide = (this.currentSlide + 1) % 3
      }, 5000)
    },
    
    goToSlide(index) {
      this.currentSlide = index
      if (this.carouselInterval) {
        clearInterval(this.carouselInterval)
        this.carouselInterval = setInterval(() => {
          this.currentSlide = (this.currentSlide + 1) % 3
        }, 5000)
      }
    },
    
    goTo(page) {
      this.$router.push(`/${page}`)
    },
    
    async loadCryptoPrices() {
      this.loadingCrypto = true
      this.cryptoError = null
      
      try {
        const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'ADAUSDT', 'SOLUSDT', 'DOTUSDT', 'DOGEUSDT']
        const response = await fetch(
          `https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(JSON.stringify(symbols))}`
        )
        
        if (!response.ok) throw new Error('Failed to fetch crypto prices')
        
        const data = await response.json()
        
        const cryptoMapping = {
          'BTCUSDT': { symbol: 'BTC', name: 'Bitcoin', icon: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' },
          'ETHUSDT': { symbol: 'ETH', name: 'Ethereum', icon: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
          'BNBUSDT': { symbol: 'BNB', name: 'Binance Coin', icon: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png' },
          'XRPUSDT': { symbol: 'XRP', name: 'Ripple', icon: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png' },
          'ADAUSDT': { symbol: 'ADA', name: 'Cardano', icon: 'https://assets.coingecko.com/coins/images/975/small/cardano.png' },
          'SOLUSDT': { symbol: 'SOL', name: 'Solana', icon: 'https://assets.coingecko.com/coins/images/4128/small/solana.png' },
          'DOTUSDT': { symbol: 'DOT', name: 'Polkadot', icon: 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png' },
          'DOGEUSDT': { symbol: 'DOGE', name: 'Dogecoin', icon: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png' }
        }
        
        this.cryptoPrices = data.map(item => {
          const mapping = cryptoMapping[item.symbol]
          return {
            symbol: mapping.symbol,
            name: mapping.name,
            icon: mapping.icon,
            price: parseFloat(item.lastPrice),
            change: parseFloat(item.priceChangePercent)
          }
        })
        
        const now = new Date()
        this.lastUpdated = `${this.$t('updated')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      } catch (error) {
        console.error('Error loading crypto prices:', error)
        this.cryptoError = error.message
      } finally {
        this.loadingCrypto = false
      }
    },
    
    formatPrice(price) {
      return price > 1 ? 
        price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) :
        price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
    },
    
    showWelcomeBanner() {
      const user = this.$store.state.user
      if (!user) return
      
      const lastShown = localStorage.getItem('welcome_banner_shown')
      const today = new Date().toDateString()
      
      if (lastShown !== today) {
        setTimeout(() => {
          this.$emit('show-modal', this.$t('welcome_bonus_title'), `
            <div style="text-align: center; padding: 10px;">
              <h3 style="color: #4e7771; margin-bottom: 15px;">${this.$t('welcome_bonus_title')}</h3>
              <p style="margin-bottom: 10px; color: #333;">${this.$t('welcome_bonus_message')}</p>
              
              <div style="background: #f5f5f5; padding: 10px; border-radius: 8px; margin-bottom: 10px;">
                <p style="margin: 5px 0; color: #333;">First deposit $50: $2 USDT (referral bonus $5 USDT)</p>
                <p style="margin: 5px 0; color: #333;">First deposit $100: $5 USDT (referral bonus $10 USDT)</p>
                <p style="margin: 5px 0; color: #333;">First deposit $300: $10 USDT (referral bonus $15 USDT)</p>
                <p style="margin: 5px 0; color: #333;">First deposit $500: $20 USDT (referral bonus $30 USDT)</p>
                <p style="margin: 5px 0; color: #333;">First deposit $800: $30 USDT (referral bonus $50 USDT)</p>
              </div>
            </div>
          `)
          localStorage.setItem('welcome_banner_shown', today)
        }, 1500)
      }
    }
  }
}
</script>

<style scoped>
/* Add your styles here */
</style>
