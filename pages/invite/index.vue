<template>
  <view class="invite-page">
    <!-- Invite Header -->
    <div class="invite-header">
      <h1 class="invite-title">{{ $t('invite_friends') }}</h1>
      <p class="invite-subtitle">Earn up to 12% commission on every referral</p>
    </div>

    <!-- Your Invite Code -->
    <div class="invite-card">
      <div class="invite-code-section">
        <div class="section-label">{{ $t('your_invite_code') }}</div>
        <div class="invite-code-display">
          <span class="invite-code">{{ userInviteCode }}</span>
          <button class="copy-invite-btn" @click="copyInviteCode">
            <i class="fas fa-copy"></i>
          </button>
        </div>
        <button class="share-invite-btn" @click="shareInvite">
          <i class="fas fa-share-alt"></i> {{ $t('share_link') }}
        </button>
      </div>
    </div>

    <!-- Referral Link -->
    <div class="link-card">
      <div class="section-label">{{ $t('referral_link') }}</div>
      <div class="referral-link-display">
        <input 
          type="text" 
          :value="referralLink" 
          readonly
          class="referral-link-input"
        >
        <button class="copy-link-btn" @click="copyReferralLink">
          <i class="fas fa-copy"></i> {{ $t('copy') }}
        </button>
      </div>
    </div>

    <!-- Referral Rules -->
    <div class="rules-card">
      <h2 class="rules-title">{{ $t('referral_rules') }}</h2>
      
      <div class="commission-structure">
        <div class="commission-level">
          <div class="level-badge">1</div>
          <div class="level-info">
            <div class="level-name">{{ $t('level_1_commission') }}</div>
            <div class="level-desc">Direct referrals</div>
          </div>
        </div>
        
        <div class="commission-level">
          <div class="level-badge">2</div>
          <div class="level-info">
            <div class="level-name">{{ $t('level_2_commission') }}</div>
            <div class="level-desc">Second level referrals</div>
          </div>
        </div>
        
        <div class="commission-level">
          <div class="level-badge">3</div>
          <div class="level-info">
            <div class="level-name">{{ $t('level_3_commission') }}</div>
            <div class="level-desc">Third level referrals</div>
          </div>
        </div>
      </div>
      
      <div class="rules-list">
        <div class="rule-item">
          <i class="fas fa-check-circle"></i>
          <span>Referral must deposit at least 20 USDT to be considered active</span>
        </div>
        <div class="rule-item">
          <i class="fas fa-check-circle"></i>
          <span>Commissions are paid from referral's quantification profits</span>
        </div>
        <div class="rule-item">
          <i class="fas fa-check-circle"></i>
          <span>Commissions are credited instantly after each quantification</span>
        </div>
      </div>
    </div>

    <!-- Referral Stats -->
    <div class="stats-card">
      <h2 class="stats-title">{{ $t('referral_stats') }}</h2>
      
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value">{{ totalReferrals }}</div>
          <div class="stat-label">{{ $t('total_referrals') }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ activeReferrals }}</div>
          <div class="stat-label">{{ $t('active_referrals') }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ formatCurrency(referralIncome) }}</div>
          <div class="stat-label">{{ $t('referral_income_total') }}</div>
        </div>
      </div>
    </div>

    <!-- QR Code -->
    <div class="qr-card" v-if="showQRCode">
      <div class="section-label">Scan QR Code</div>
      <div class="qr-container">
        <canvas ref="qrCanvas"></canvas>
      </div>
      <p class="qr-note">Scan this QR code to share your referral link</p>
    </div>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { t } from '@/utils/translate'

const userStore = useUserStore()

// Data
const userInviteCode = ref('')
const referralLink = ref('')
const showQRCode = ref(false)
const qrCanvas = ref(null)

// Stats
const totalReferrals = ref(0)
const activeReferrals = ref(0)
const referralIncome = ref(0)

const formatCurrency = (amount) => {
  return amount.toFixed(2)
}

// Copy functions
const copyInviteCode = async () => {
  try {
    await navigator.clipboard.writeText(userInviteCode.value)
    window.showCustomAlert('Invite code copied to clipboard')
  } catch (error) {
    console.error('Copy failed:', error)
  }
}

const copyReferralLink = async () => {
  try {
    await navigator.clipboard.writeText(referralLink.value)
    window.showCustomAlert('Referral link copied to clipboard')
  } catch (error) {
    console.error('Copy failed:', error)
  }
}

// Share function
const shareInvite = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Join GLY Platform',
        text: `Use my invite code ${userInviteCode.value} to join GLY Platform`,
        url: referralLink.value
      })
    } catch (error) {
      console.log('Sharing cancelled:', error)
    }
  } else {
    // Fallback to copying
    copyReferralLink()
  }
}

// Load user data
const loadUserData = () => {
  const user = userStore.currentUser
  if (user) {
    userInviteCode.value = user.invite_code || 'N/A'
    referralLink.value = `${window.location.origin}/#/register?i=${user.invite_code}`
    
    // In real app, load these from API
    totalReferrals.value = 0
    activeReferrals.value = 0
    referralIncome.value = 0
  }
}

// Generate QR code
const generateQRCode = async () => {
  if (!qrCanvas.value || !referralLink.value) return
  
  try {
    const QRCode = await import('qrcode')
    QRCode.toCanvas(qrCanvas.value, referralLink.value, {
      width: 200,
      height: 200,
      margin: 2,
      color: {
        dark: '#4e7771',
        light: '#ffffff'
      }
    })
    
    showQRCode.value = true
  } catch (error) {
    console.error('Failed to generate QR code:', error)
  }
}

onMounted(() => {
  loadUserData()
  setTimeout(generateQRCode, 500)
})

onUnmounted(() => {
  // Cleanup
})
</script>

<style scoped>
.invite-page {
  padding: 20px;
  padding-bottom: 80px;
  background: #f5f5f5;
  min-height: 100vh;
}

.invite-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.invite-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
}

.invite-subtitle {
  font-size: 14px;
  color: #666;
}

.invite-card,
.link-card,
.rules-card,
.stats-card,
.qr-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.section-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
  font-weight: 500;
}

.invite-code-display {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.invite-code {
  flex: 1;
  font-size: 20px;
  font-weight: 700;
  color: #4e7771;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 10px;
  text-align: center;
  letter-spacing: 2px;
}

.copy-invite-btn {
  padding: 12px 15px;
  background: #4e7771;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.copy-invite-btn:hover {
  background: #5a8a84;
}

.share-invite-btn {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #4e7771, #36454f);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.share-invite-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(78, 119, 113, 0.3);
}

.referral-link-display {
  display: flex;
  gap: 10px;
}

.referral-link-input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 14px;
  color: #333;
  background: #f9f9f9;
}

.copy-link-btn {
  padding: 12px 20px;
  background: #4e7771;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.copy-link-btn:hover {
  background: #5a8a84;
}

.rules-title,
.stats-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.commission-structure {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 25px;
}

.commission-level {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 12px;
  transition: all 0.3s;
}

.commission-level:hover {
  background: #f0f0f0;
  transform: translateX(5px);
}

.level-badge {
  width: 40px;
  height: 40px;
  background: #4e7771;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
}

.level-info {
  flex: 1;
}

.level-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.level-desc {
  font-size: 13px;
  color: #666;
}

.rules-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rule-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px;
}

.rule-item i {
  color: #52c41a;
  font-size: 16px;
  margin-top: 2px;
}

.rule-item span {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.stat-item {
  text-align: center;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 12px;
  transition: all 0.3s;
}

.stat-item:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #4e7771;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.qr-container {
  text-align: center;
  margin: 20px 0;
}

.qr-note {
  text-align: center;
  font-size: 13px;
  color: #666;
  margin-top: 10px;
}

@media (min-width: 768px) {
  .invite-page {
    max-width: 375px;
    margin: 0 auto;
  }
}
</style>
