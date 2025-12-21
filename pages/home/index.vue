<template>
  <view class="home-page">
    <!-- Image Carousel -->
    <view class="banner-section">
      <view class="home-carousel-container">
        <view class="home-carousel-track" :style="{transform: `translateX(-${currentSlide * 100}%)`}">
          <view class="home-carousel-slide" v-for="(slide, index) in slides" :key="index">
            <image :src="slide.image" :alt="slide.alt" mode="aspectFill"></image>
          </view>
        </view>
        <view class="home-carousel-indicators">
          <view 
            v-for="(indicator, index) in slides" 
            :key="index"
            class="home-indicator"
            :class="{'active': currentSlide === index}"
            @click="goToSlide(index)"
          ></view>
        </view>
      </view>
    </view>
    
    <!-- Running line -->
    <view class="notice-section">
      <view class="notice-bar">
        <view class="notice-icon">🚀</view>
        <view class="notice-content">
          <view class="notice-text">
            GLY - Quantum Investment Platform │ Advanced AI Algorithms │ Daily Returns 2.2%-6% │ 6 VIP Levels │ Multi-Level Referral System │ Secure & Transparent
          </view>
        </view>
      </view>
    </view>

    <!-- Navigation icons -->
    <view class="nav-section">
      <view class="nav-grid">
        <view class="nav-item" @click="navigateTo('company')">
          <view class="nav-icon">
            <image src="/static/company.png" mode="aspectFit"></image>
          </view>
          <view class="nav-text">Company</view>
        </view>
        <view class="nav-item" @click="navigateTo('deposit')">
          <view class="nav-icon">
            <image src="/static/deposit.png" mode="aspectFit"></image>
          </view>
          <view class="nav-text">Deposit</view>
        </view>
        <view class="nav-item" @click="navigateTo('withdraw')">
          <view class="nav-icon">
            <image src="/static/withdraw.png" mode="aspectFit"></image>
          </view>
          <view class="nav-text">Withdraw</view>
        </view>
        <view class="nav-item" @click="navigateTo('invite')">
          <view class="nav-icon">
            <image src="/static/invite.png" mode="aspectFit"></image>
          </view>
          <view class="nav-text">Invite</view>
        </view>
        <view class="nav-item" @click="navigateTo('team')">
          <view class="nav-icon">
            <image src="/static/team.png" mode="aspectFit"></image>
          </view>
          <view class="nav-text">Team</view>
        </view>
        <view class="nav-item" @click="navigateTo('rules')">
          <view class="nav-icon">
            <image src="/static/rules.png" mode="aspectFit"></image>
          </view>
          <view class="nav-text">Rules</view>
        </view>
      </view>
    </view>

    <!-- Crypto prices -->
    <view class="quantum-section">
      <view class="quantum-header">
        <view class="quantum-title">Live Crypto Prices</view>
        <view class="text-gray" style="font-size: 12px; font-weight: normal;">{{ lastUpdated }}</view>
      </view>
      <view class="crypto-grid">
        <view v-if="loadingPrices" class="text-center" style="padding: 20px; color: #ccc;">
          <i class="fas fa-spinner fa-spin"></i> Loading live prices...
        </view>
        <view v-else-if="cryptoPrices.length === 0" class="text-center" style="padding: 20px; color: #ccc;">
          No data available
        </view>
        <view v-else>
          <view class="crypto-item" v-for="crypto in cryptoPrices" :key="crypto.symbol">
            <view class="crypto-info">
              <view class="crypto-icon">
                <image :src="crypto.icon" mode="aspectFit"></image>
              </view>
              <view>
                <text class="crypto-name">{{ crypto.name }}</text>
                <text class="crypto-pair">/USDT</text>
              </view>
            </view>
            <view class="flex align-center">
              <text class="crypto-price">${{ formatPrice(crypto.price) }}</text>
              <text class="crypto-change" :class="crypto.change >= 0 ? 'change-positive' : 'change-negative'">
                {{ crypto.change >= 0 ? '+' : '' }}{{ crypto.change.toFixed(2) }}%
              </text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- Partners block -->
    <view class="partners-section" style="margin-bottom: 80px;">
      <view class="section-title">Our Partners</view>
      <image src="/static/partners.png" mode="widthFix" style="width: 100%; border-radius: 10px;"></image>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../store/user'

const router = useRouter()
const userStore = useUserStore()

const currentSlide = ref(0)
const slides = ref([
  { image: '/static/banner.png', alt: 'GLY Quantum Investment' },
  { image: '/static/banner1.png', alt: 'High Returns' },
  { image: '/static/banner2.png', alt: 'Secure Platform' }
])
const cryptoPrices = ref([])
const loadingPrices = ref(false)
const lastUpdated = ref('Updating...')
let slideInterval = null
let priceInterval = null

onMounted(() => {
  startCarousel()
  loadCryptoPrices()
  
  // Загружаем цены каждые 30 секунд
  priceInterval = setInterval(loadCryptoPrices, 30000)
})

onUnmounted(() => {
  if (slideInterval) clearInterval(slideInterval)
  if (priceInterval) clearInterval(priceInterval)
})

function startCarousel() {
  slideInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.value.length
  }, 5000)
}

function goToSlide(index) {
  currentSlide.value = index
  if (slideInterval) {
    clearInterval(slideInterval)
    startCarousel()
  }
}

async function loadCryptoPrices() {
  loadingPrices.value = true
  
  try {
    // Используем Binance API
    const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'ADAUSDT', 'SOLUSDT', 'DOTUSDT', 'DOGEUSDT']
    const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbols=${JSON.stringify(symbols)}`)
    
    if (!response.ok) throw new Error('API error')
    
    const data = await response.json()
    
    // Маппинг данных
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
    
    cryptoPrices.value = data.map(item => {
      const mapping = cryptoMapping[item.symbol]
      return {
        symbol: mapping?.symbol || item.symbol,
        name: mapping?.name || item.symbol,
        icon: mapping?.icon || '',
        price: parseFloat(item.lastPrice),
        change: parseFloat(item.priceChangePercent)
      }
    }).filter(item => item.name)
    
    const now = new Date()
    lastUpdated.value = `Updated ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  } catch (error) {
    console.error('Error loading crypto prices:', error)
    
    // Fallback данные
    cryptoPrices.value = [
      { symbol: 'BTC', name: 'Bitcoin', price: 88405.00, change: -2.74 },
      { symbol: 'ETH', name: 'Ethereum', price: 2897.01, change: -3.33 },
      { symbol: 'BNB', name: 'Binance Coin', price: 850.67, change: -2.78 },
      { symbol: 'XRP', name: 'Ripple', price: 2.11, change: -4.28 },
      { symbol: 'ADA', name: 'Cardano', price: 0.40, change: -4.21 },
      { symbol: 'SOL', name: 'Solana', price: 130.18, change: -4.43 },
      { symbol: 'DOT', name: 'Polkadot', price: 2.12, change: -6.50 },
      { symbol: 'DOGE', name: 'Dogecoin', price: 0.15, change: -3.21 }
    ]
    
    lastUpdated.value = 'Cached data'
  } finally {
    loadingPrices.value = false
  }
}

function formatPrice(price) {
  if (price > 1) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  } else {
    return price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
  }
}

function navigateTo(page) {
  // Для демо - показываем алерт
  uni.showToast({
    title: `${page} page coming soon`,
    icon: 'none'
  })
}
</script>

<style scoped>
.home-page {
  padding-bottom: 80px;
}
</style>
