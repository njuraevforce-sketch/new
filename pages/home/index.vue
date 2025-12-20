<template>
  <view class="home-page">
    <!-- Image Carousel -->
    <div class="banner-section">
      <div class="carousel-container" id="home-carousel">
        <div class="carousel-track" ref="carouselTrack">
          <div 
            v-for="(banner, index) in banners" 
            :key="index"
            :class="['carousel-slide', { 'active': currentSlide === index }]"
          >
            <img 
              :src="banner.image" 
              :alt="banner.alt"
              @load="onImageLoad"
              @error="onImageError"
            >
          </div>
        </div>
        
        <div class="carousel-indicators">
          <span 
            v-for="(banner, index) in banners" 
            :key="index"
            :class="['indicator', { 'active': currentSlide === index }]"
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
        <div class="nav-item" @click="navigateTo('company')">
          <div class="nav-icon">
            <img src="/static/assets/company.png" alt="Company">
          </div>
          <div class="nav-text">{{ $t('company') }}</div>
        </div>
        <div class="nav-item" @click="navigateTo('deposit')">
          <div class="nav-icon">
            <img src="/static/assets/deposit.png" alt="Deposit">
          </div>
          <div class="nav-text">{{ $t('deposit') }}</div>
        </div>
        <div class="nav-item" @click="navigateTo('withdraw')">
          <div class="nav-icon">
            <img src="/static/assets/withdraw.png" alt="Withdraw">
          </div>
          <div class="nav-text">{{ $t('withdraw') }}</div>
        </div>
        <div class="nav-item" @click="navigateTo('invite')">
          <div class="nav-icon">
            <img src="/static/assets/invite.png" alt="Invite">
          </div>
          <div class="nav-text">{{ $t('invite') }}</div>
        </div>
        <div class="nav-item" @click="navigateTo('team')">
          <div class="nav-icon">
            <img src="/static/assets/team.png" alt="Team">
          </div>
          <div class="nav-text">{{ $t('team') }}</div>
        </div>
        <div class="nav-item" @click="navigateTo('rules')">
          <div class="nav-icon">
            <img src="/static/assets/rules.png" alt="Rules">
          </div>
          <div class="nav-text">{{ $t('rules') }}</div>
        </div>
      </div>
    </div>

    <!-- Crypto prices -->
    <div class="quantum-section">
      <div class="quantum-header">
        <div class="quantum-title">{{ $t('live_crypto_prices') }}</div>
        <div class="quantum-subtitle">{{ lastUpdated }}</div>
      </div>
      <div class="crypto-grid">
        <div v-for="crypto in cryptoPrices" :key="crypto.symbol" class="crypto-item">
          <div class="crypto-info">
            <div class="crypto-icon">
              <img :src="crypto.icon" :alt="crypto.name">
            </div>
            <div class="crypto-name-group">
              <span class="crypto-name">{{ crypto.name }}</span>
              <span class="crypto-pair">/USDT</span>
            </div>
          </div>
          <div class="crypto-price-group">
            <div class="crypto-price">${{ formatPrice(crypto.price) }}</div>
            <div :class="['crypto-change', crypto.change >= 0 ? 'positive' : 'negative']">
              {{ crypto.change >= 0 ? '+' : '' }}{{ crypto.change.toFixed(2) }}%
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Partners block -->
    <div class="partners-section">
      <div class="section-title">{{ $t('our_partners') }}</div>
      <img src="/static/assets/partners.png" alt="Partners" class="partners-image">
    </div>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { t } from '@/utils/translate'

const router = useRouter()

// Carousel data
const banners = ref([
  { image: '/static/assets/banner.png', alt: 'Banner 1' },
  { image: '/static/assets/banner1.png', alt: 'Banner 2' },
  { image: '/static/assets/banner2.png', alt: 'Banner 3' }
])

const currentSlide = ref(0)
const carouselInterval = ref(null)

// Crypto data
const cryptoPrices = ref([])
const lastUpdated = ref(t('updating'))

const formatPrice = (price) => {
  if (price > 1) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  } else {
    return price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
  }
}

const navigateTo = (page) => {
  router.push(`/${page}`)
}

// Carousel functions
const startCarousel = () => {
  if (carouselInterval.value) clearInterval(carouselInterval.value)
  
  carouselInterval.value = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % banners.value.length
  }, 5000)
}

const goToSlide = (index) => {
  currentSlide.value = index
  startCarousel()
}

const onImageLoad = (event) => {
  console.log('Image loaded:', event.target.src)
}

const onImageError = (event) => {
  console.error('Image failed to load:', event.target.src)
  event.target.src = '/static/assets/logo.png'
}

// Crypto price fetching
const fetchCryptoPrices = async () => {
  try {
    const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT']
    const response = await fetch(
      `https://api.binance.com/api/v3/ticker/24hr?symbols=${JSON.stringify(symbols)}`
    )
    
    if (!response.ok) throw new Error('API error')
    
    const data = await response.json()
    
    const priceMapping = {
      'BTCUSDT': { name: 'Bitcoin', symbol: 'BTC' },
      'ETHUSDT': { name: 'Ethereum', symbol: 'ETH' },
      'BNBUSDT': { name: 'Binance Coin', symbol: 'BNB' },
      'XRPUSDT': { name: 'Ripple', symbol: 'XRP' }
    }
    
    const prices = data.map(item => ({
      ...priceMapping[item.symbol],
      price: parseFloat(item.lastPrice),
      change: parseFloat(item.priceChangePercent),
      icon: `https://assets.coingecko.com/coins/images/1/small/bitcoin.png`
    }))
    
    cryptoPrices.value = prices
    lastUpdated.value = `${t('updated')} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  } catch (error) {
    console.error('Failed to fetch crypto prices:', error)
    
    // Fallback data
    cryptoPrices.value = [
      { symbol: 'BTC', name: 'Bitcoin', price: 88405.00, change: -2.74 },
      { symbol: 'ETH', name: 'Ethereum', price: 2897.01, change: -3.33 },
      { symbol: 'BNB', name: 'Binance Coin', price: 850.67, change: -2.78 },
      { symbol: 'XRP', name: 'Ripple', price: 2.11, change: -4.28 }
    ]
    
    lastUpdated.value = t('cached_data')
  }
}

onMounted(() => {
  startCarousel()
  fetchCryptoPrices()
  
  // Update prices every 30 seconds
  const priceInterval = setInterval(fetchCryptoPrices, 30000)
  
  // Show welcome banner
  setTimeout(() => {
    const user = JSON.parse(localStorage.getItem('gly_user'))
    if (user) {
      const lastShown = localStorage.getItem('welcome_banner_shown')
      const today = new Date().toDateString()
      
      if (lastShown !== today) {
        const bannerContent = `
          <div style="text-align: center; padding: 10px;">
            <h3 style="color: #4e7771; margin-bottom: 15px;">${t('welcome_bonus_title')}</h3>
            <p style="margin-bottom: 10px; color: #333;">${t('welcome_bonus_message')}</p>
          </div>
        `
        
        window.showCustomModal(t('welcome_bonus_title'), bannerContent, () => {
          localStorage.setItem('welcome_banner_shown', today)
        })
      }
    }
  }, 1000)
  
  onUnmounted(() => {
    if (carouselInterval.value) clearInterval(carouselInterval.value)
  })
})
</script>

<style scoped>
.home-page {
  padding: 15px;
  padding-bottom: 80px;
}

/* Banner Section */
.banner-section {
  margin-bottom: 15px;
}

.carousel-container {
  position: relative;
  width: 100%;
  height: 160px;
  border-radius: 12px;
  overflow: hidden;
  background: #2c3e50;
}

.carousel-track {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease;
}

.carousel-slide {
  flex: 0 0 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.carousel-slide.active {
  opacity: 1;
}

.carousel-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-indicators {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 8px;
  z-index: 2;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s;
}

.indicator.active {
  width: 20px;
  border-radius: 4px;
  background: white;
}

/* Notice Section */
.notice-section {
  margin-bottom: 20px;
}

.notice-bar {
  background: linear-gradient(135deg, #36454f, #5a6b76);
  border-radius: 10px;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.notice-icon {
  font-size: 20px;
  margin-right: 10px;
  flex-shrink: 0;
}

.notice-content {
  flex: 1;
  overflow: hidden;
}

.notice-text {
  color: white;
  font-size: 12px;
  white-space: nowrap;
  animation: marquee 20s linear infinite;
}

@keyframes marquee {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}

/* Navigation Section */
.nav-section {
  margin-bottom: 20px;
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.nav-item {
  background: white;
  border-radius: 12px;
  padding: 15px 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.nav-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.nav-icon {
  width: 40px;
  height: 40px;
  margin: 0 auto 8px;
}

.nav-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.nav-text {
  font-size: 12px;
  color: #333;
  font-weight: 500;
}

/* Crypto Section */
.quantum-section {
  margin-bottom: 20px;
}

.quantum-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.quantum-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.quantum-subtitle {
  font-size: 11px;
  color: #999;
}

.crypto-grid {
  background: white;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.crypto-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.crypto-item:last-child {
  border-bottom: none;
}

.crypto-info {
  display: flex;
  align-items: center;
}

.crypto-icon {
  width: 32px;
  height: 32px;
  margin-right: 10px;
  border-radius: 50%;
  overflow: hidden;
}

.crypto-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.crypto-name-group {
  display: flex;
  flex-direction: column;
}

.crypto-name {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.crypto-pair {
  font-size: 11px;
  color: #999;
}

.crypto-price-group {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.crypto-price {
  font-weight: 600;
  color: #333;
  font-size: 14px;
  margin-bottom: 2px;
}

.crypto-change {
  font-size: 12px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 4px;
}

.crypto-change.positive {
  color: #52c41a;
  background: rgba(82, 196, 26, 0.1);
}

.crypto-change.negative {
  color: #ff4d4f;
  background: rgba(255, 77, 79, 0.1);
}

/* Partners Section */
.partners-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.partners-image {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

@media (min-width: 768px) {
  .home-page {
    max-width: 375px;
    margin: 0 auto;
  }
}
</style>
