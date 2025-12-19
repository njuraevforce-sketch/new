<template>
  <view class="vip-section card padding">
    <view class="section-title">{{ $t('vip_levels') }}</view>
    
    <!-- VIP Carousel -->
    <view class="custom-vip-carousel" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
      <view 
        class="carousel-track"
        :style="{ transform: `translateY(${-currentIndex * slideHeight}px)` }"
      >
        <view 
          v-for="(level, index) in vipLevels" 
          :key="index"
          class="vip-slide"
          :class="{ 
            'active': index === currentIndex,
            'unlocked': isUnlocked(level.level)
          }"
          @click="goToSlide(index)"
        >
          <view class="vip-card" :style="{ backgroundImage: `url(${level.background})` }">
            <view class="vip-title">VIP{{ level.level }}</view>
            <view class="vip-status">
              <i 
                class="fas"
                :class="isUnlocked(level.level) ? 'fa-lock-open' : 'fa-lock'"
                :style="{ color: isUnlocked(level.level) ? '#4CAF50' : '#cccccc' }"
              ></i>
              <span>{{ isUnlocked(level.level) ? $t('unlocked') : $t('locked') }}</span>
            </view>
            <view class="vip-image">
              <image :src="level.icon" class="vip-icon" />
            </view>
            <view v-if="level.unavailableText" class="unavailable-text">
              {{ level.unavailableText }}
            </view>
          </view>
        </view>
      </view>
      
      <!-- Navigation buttons -->
      <button class="carousel-btn prev" @click="prevSlide" v-if="showNavigation">
        <i class="fas fa-chevron-up"></i>
      </button>
      <button class="carousel-btn next" @click="nextSlide" v-if="showNavigation">
        <i class="fas fa-chevron-down"></i>
      </button>
    </view>
    
    <!-- VIP Description -->
    <view class="vip-description">
      {{ currentLevel.description }}
    </view>
    
    <!-- VIP Details -->
    <view class="vip-details">
      <view class="details-content">
        <view class="detail-item">
          <span class="detail-label">{{ $t('daily_percent') }}:</span>
          <span class="detail-value">{{ currentLevel.percent }}</span>
        </view>
        <view class="detail-item">
          <span class="detail-label">{{ $t('deposit_range') }}:</span>
          <span class="detail-value">{{ currentLevel.range }}</span>
        </view>
        <view class="detail-item">
          <span class="detail-label">{{ $t('signals_count') }}:</span>
          <span class="detail-value">{{ currentLevel.signals }}</span>
        </view>
        <view class="detail-item">
          <span class="detail-label">{{ $t('referrals_required') }}:</span>
          <span class="detail-value">{{ currentLevel.refs }}</span>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'VIPCarousel',
  data() {
    return {
      currentIndex: 0,
      slideHeight: 130,
      touchStartY: 0,
      touchEndY: 0,
      showNavigation: false,
      vipLevels: [
        {
          level: 1,
          icon: '/static/vipicon1.png',
          background: '/static/vip1.png',
          description: this.$t('vip_description_1'),
          percent: '2.2%',
          range: '0-299 USDT',
          signals: '3 signals',
          refs: '0 refs'
        },
        {
          level: 2,
          icon: '/static/vipicon2.png',
          background: '/static/vip2.png',
          description: this.$t('vip_description_2'),
          percent: '2.8%',
          range: '300-1000 USDT',
          signals: '3 signals',
          refs: '2 refs'
        },
        {
          level: 3,
          icon: '/static/vipicon3.png',
          background: '/static/vip3.png',
          description: this.$t('vip_description_3'),
          percent: '3.5%',
          range: '1000-3500 USDT',
          signals: '3 signals',
          refs: '5 refs',
          unavailableText: this.$t('vip3_unavailable_until')
        },
        {
          level: 4,
          icon: '/static/vipicon4.png',
          background: '/static/vip4.png',
          description: this.$t('vip_description_4'),
          percent: '4.0%',
          range: '3500-6000 USDT',
          signals: '3 signals',
          refs: '8 refs',
          unavailableText: this.$t('vip4_unavailable_until')
        },
        {
          level: 5,
          icon: '/static/vipicon5.png',
          background: '/static/vip5.png',
          description: this.$t('vip_description_5'),
          percent: '5.0%',
          range: '6000-12000 USDT',
          signals: '3 signals',
          refs: '15 refs',
          unavailableText: this.$t('vip5_unavailable')
        },
        {
          level: 6,
          icon: '/static/vipicon6.png',
          background: '/static/vip6.png',
          description: this.$t('vip_description_6'),
          percent: '6.0%',
          range: '12000-20000 USDT',
          signals: '3 signals',
          refs: '25 refs',
          unavailableText: this.$t('vip6_unavailable')
        }
      ]
    }
  },
  computed: {
    ...mapState(['user']),
    
    currentLevel() {
      return this.vipLevels[this.currentIndex] || this.vipLevels[0]
    },
    
    userVipLevel() {
      return this.user?.vip_level || 1
    }
  },
  mounted() {
    // Set initial slide to user's VIP level
    this.goToSlide(this.userVipLevel - 1)
  },
  methods: {
    isUnlocked(level) {
      return level <= this.userVipLevel
    },
    
    goToSlide(index) {
      if (index < 0) index = 0
      if (index >= this.vipLevels.length) index = this.vipLevels.length - 1
      this.currentIndex = index
    },
    
    nextSlide() {
      if (this.currentIndex < this.vipLevels.length - 1) {
        this.currentIndex++
      }
    },
    
    prevSlide() {
      if (this.currentIndex > 0) {
        this.currentIndex--
      }
    },
    
    handleTouchStart(event) {
      this.touchStartY = event.touches[0].clientY
    },
    
    handleTouchEnd(event) {
      this.touchEndY = event.changedTouches[0].clientY
      this.handleSwipe()
    },
    
    handleSwipe() {
      const threshold = 40
      const diff = this.touchEndY - this.touchStartY
      
      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          // Swipe down - previous slide
          this.prevSlide()
        } else {
          // Swipe up - next slide
          this.nextSlide()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.vip-section {
  margin-top: 20rpx;
}

.section-title {
  color: white;
  font-size: 32rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30rpx;
}

.custom-vip-carousel {
  position: relative;
  height: 400rpx;
  overflow: hidden;
  margin-bottom: 30rpx;
}

.carousel-track {
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.vip-slide {
  height: 260rpx;
  margin-bottom: 20rpx;
  transition: all 0.3s ease;
  opacity: 0.6;
  
  &.active {
    opacity: 1;
    transform: scale(1.05);
  }
}

.vip-card {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 20rpx;
  padding: 30rpx;
  height: 100%;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 20rpx;
  }
}

.vip-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #f9ae3d;
  margin-bottom: 10rpx;
  position: relative;
  z-index: 1;
}

.vip-status {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-bottom: 20rpx;
  position: relative;
  z-index: 1;
  
  i {
    font-size: 28rpx;
  }
  
  span {
    color: white;
    font-size: 26rpx;
  }
}

.vip-image {
  position: absolute;
  right: 30rpx;
  bottom: 30rpx;
  z-index: 1;
}

.vip-icon {
  width: 80rpx;
  height: 80rpx;
}

.unavailable-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: #ff6b6b;
  padding: 20rpx;
  border-radius: 10rpx;
  font-size: 26rpx;
  text-align: center;
  z-index: 2;
  white-space: nowrap;
}

.carousel-btn {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.prev {
    top: 10rpx;
  }
  
  &.next {
    bottom: 10rpx;
  }
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
}

.vip-description {
  color: #cccccc;
  font-size: 26rpx;
  line-height: 1.5;
  margin-bottom: 30rpx;
  text-align: center;
}

.vip-details {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15rpx;
  padding: 30rpx;
}

.details-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 5rpx;
}

.detail-label {
  color: #cccccc;
  font-size: 24rpx;
}

.detail-value {
  color: white;
  font-size: 28rpx;
  font-weight: bold;
}
</style>
