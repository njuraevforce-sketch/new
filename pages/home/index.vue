<template>
  <view class="home-page">
    <!-- Карусель баннеров -->
    <swiper class="banner-swiper" :autoplay="true" :interval="5000" circular indicator-dots>
      <swiper-item v-for="(banner, index) in banners" :key="index">
        <image class="banner-image" :src="banner" mode="aspectFill" @error="handleImageError(index)" />
      </swiper-item>
    </swiper>
    
    <!-- Бегущая строка -->
    <view class="notice-bar">
      <view class="notice-content" :style="{ animationDuration: animationDuration }">
        <text class="notice-text">
          GLY - Quantum Investment Platform │ Advanced AI Algorithms │ Daily Returns 2.2%-6% │ 6 VIP Levels │ Multi-Level Referral System │ Secure & Transparent
        </text>
      </view>
    </view>
    
    <!-- Навигационные иконки -->
    <view class="nav-grid">
      <view class="nav-item" v-for="item in navItems" :key="item.name" @click="navigateTo(item.page)">
        <image class="nav-icon" :src="item.icon" mode="aspectFit" />
        <text class="nav-text">{{ $t(item.name) }}</text>
      </view>
    </view>
    
    <!-- Крипто цены -->
    <CryptoPrices />
    
    <!-- Партнеры -->
    <view class="partners-section card">
      <text class="section-title">{{ $t('our_partners') }}</text>
      <image class="partners-image" src="/static/partners.png" mode="widthFix" />
    </view>
  </view>
</template>

<script>
import CryptoPrices from '@/components/CryptoPrices.vue'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'HomePage',
  components: {
    CryptoPrices
  },
  data() {
    return {
      banners: [
        '/static/banner.png',
        '/static/banner1.png',
        '/static/banner2.png'
      ],
      navItems: [
        { name: 'company', page: 'company', icon: '/static/company.png' },
        { name: 'deposit', page: 'deposit', icon: '/static/deposit.png' },
        { name: 'withdraw', page: 'withdraw', icon: '/static/withdraw.png' },
        { name: 'invite', page: 'invite', icon: '/static/invite.png' },
        { name: 'team', page: 'team', icon: '/static/team.png' },
        { name: 'rules', page: 'rules', icon: '/static/rules.png' }
      ],
      animationDuration: '20s'
    }
  },
  computed: {
    ...mapState(['user', 'cryptoPrices'])
  },
  mounted() {
    // Загрузка крипто цен при монтировании
    this.loadCryptoPrices()
    
    // Показать приветственный баннер при первом посещении
    this.showWelcomeBanner()
  },
  methods: {
    ...mapActions(['loadCryptoPrices']),
    
    navigateTo(page) {
      this.$router.push(`/pages/${page}/index`)
    },
    
    handleImageError(index) {
      console.error(`Failed to load banner image: ${this.banners[index]}`)
    },
    
    showWelcomeBanner() {
      const user = this.user
      if (!user) return
      
      const lastShown = localStorage.getItem('welcome_banner_shown')
      const today = new Date().toDateString()
      
      if (lastShown !== today) {
        setTimeout(() => {
          const content = `
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
          `
          
          this.$showModal(this.$t('welcome_bonus_title'), content, () => {
            localStorage.setItem('welcome_banner_shown', today)
          })
        }, 1500)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.home-page {
  padding-bottom: 100rpx;
}

.banner-swiper {
  height: 300rpx;
  border-radius: 10rpx;
  margin: 20rpx;
  overflow: hidden;
  
  .banner-image {
    width: 100%;
    height: 100%;
  }
}

.notice-bar {
  background: linear-gradient(90deg, #36454f, #4e7771);
  padding: 20rpx;
  margin: 0 20rpx 20rpx;
  border-radius: 10rpx;
  overflow: hidden;
  position: relative;
  
  .notice-content {
    display: flex;
    animation: noticeScroll 20s linear infinite;
    white-space: nowrap;
  }
  
  .notice-text {
    color: #f9ae3d;
    font-size: 24rpx;
    font-weight: bold;
    padding-right: 50rpx;
  }
}

@keyframes noticeScroll {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  
  .nav-item {
    background: #2a2a2a;
    border-radius: 10rpx;
    padding: 30rpx 10rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    
    &:active {
      transform: scale(0.95);
      background: #3a3a3a;
    }
  }
  
  .nav-icon {
    width: 60rpx;
    height: 60rpx;
    margin-bottom: 10rpx;
  }
  
  .nav-text {
    color: white;
    font-size: 24rpx;
    text-align: center;
  }
}

.partners-section {
  margin: 20rpx;
  
  .section-title {
    color: white;
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
    display: block;
  }
  
  .partners-image {
    width: 100%;
    border-radius: 10rpx;
  }
}
</style>
