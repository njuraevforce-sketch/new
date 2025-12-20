<template>
  <view class="team-page">
    <!-- Team Header -->
    <div class="team-header">
      <h1 class="team-title">{{ $t('team_structure') }}</h1>
      <p class="team-subtitle">Your referral network and earnings</p>
    </div>

    <!-- Team Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-users"></i>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ totalTeam }}</div>
          <div class="stat-label">{{ $t('total_team') }}</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-user-plus"></i>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ directReferrals }}</div>
          <div class="stat-label">{{ $t('direct_referrals') }}</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-coins"></i>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ formatCurrency(teamEarnings) }}</div>
          <div class="stat-label">{{ $t('team_earnings') }}</div>
        </div>
      </div>
    </div>

    <!-- Team Levels -->
    <div class="levels-section">
      <h2 class="section-title">Team Levels</h2>
      
      <div class="levels-list">
        <div 
          v-for="level in teamLevels" 
          :key="level.level"
          class="level-item"
          :class="{ 'active': level.active }"
        >
          <div class="level-header">
            <div class="level-badge">Level {{ level.level }}</div>
            <div class="level-count">{{ level.count }} members</div>
          </div>
          <div class="level-earnings">
            <span class="earnings-label">Earnings:</span>
            <span class="earnings-value">{{ formatCurrency(level.earnings) }} USDT</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Team Members -->
    <div class="members-section">
      <div class="section-header">
        <h2 class="section-title">{{ $t('direct_referrals') }}</h2>
        <div class="members-count">{{ teamMembers.length }} {{ $t('member') }}</div>
      </div>
      
      <div v-if="loading" class="loading-state">
        <i class="fas fa-spinner fa-spin"></i> {{ $t('loading') }}
      </div>
      
      <div v-else-if="teamMembers.length === 0" class="empty-state">
        <i class="fas fa-users"></i>
        <p>{{ $t('no_team_members') }}</p>
        <p class="empty-subtext">Start inviting friends to build your team</p>
      </div>
      
      <div v-else class="members-list">
        <div 
          v-for="member in teamMembers" 
          :key="member.id"
          class="member-item"
        >
          <div class="member-info">
            <div class="member-avatar">
              {{ getInitials(member.username) }}
            </div>
            <div class="member-details">
              <div class="member-name">{{ member.username }}</div>
              <div class="member-date">{{ formatDate(member.joined) }}</div>
            </div>
          </div>
          
          <div class="member-status" :class="member.status">
            {{ member.status === 'active' ? $t('status_active') : $t('status_inactive') }}
          </div>
        </div>
      </div>
    </div>

    <!-- Team Earnings Chart -->
    <div class="earnings-section">
      <h2 class="section-title">{{ $t('team_earnings') }}</h2>
      
      <div class="earnings-chart">
        <div 
          v-for="(earning, index) in monthlyEarnings" 
          :key="index"
          class="chart-bar"
          :style="{ height: getBarHeight(earning.amount) + '%' }"
          :title="`${earning.month}: ${formatCurrency(earning.amount)} USDT`"
        >
          <div class="bar-amount">{{ formatCurrency(earning.amount) }}</div>
          <div class="bar-month">{{ earning.month }}</div>
        </div>
      </div>
      
      <div class="earnings-summary">
        <div class="summary-item">
          <div class="summary-label">This Month</div>
          <div class="summary-value">{{ formatCurrency(currentMonthEarnings) }} USDT</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Total</div>
          <div class="summary-value">{{ formatCurrency(totalEarnings) }} USDT</div>
        </div>
      </div>
    </div>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { t } from '@/utils/translate'

// Data
const totalTeam = ref(0)
const directReferrals = ref(0)
const teamEarnings = ref(0)
const loading = ref(true)

// Team levels
const teamLevels = ref([
  { level: 1, count: 0, earnings: 0, active: true },
  { level: 2, count: 0, earnings: 0, active: true },
  { level: 3, count: 0, earnings: 0, active: false }
])

// Team members
const teamMembers = ref([
  // Sample data - in real app, load from API
  { id: 1, username: 'john_doe', joined: '2024-01-15', status: 'active' },
  { id: 2, username: 'jane_smith', joined: '2024-01-20', status: 'active' },
  { id: 3, username: 'bob_wilson', joined: '2024-01-25', status: 'inactive' }
])

// Earnings data
const monthlyEarnings = ref([
  { month: 'Jan', amount: 125.50 },
  { month: 'Feb', amount: 180.75 },
  { month: 'Mar', amount: 210.25 },
  { month: 'Apr', amount: 165.80 },
  { month: 'May', amount: 195.40 },
  { month: 'Jun', amount: 230.90 }
])

const currentMonthEarnings = ref(230.90)
const totalEarnings = ref(1108.60)

// Helper functions
const formatCurrency = (amount) => {
  return amount.toFixed(2)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const getInitials = (username) => {
  return username.substring(0, 2).toUpperCase()
}

const getBarHeight = (amount) => {
  const maxAmount = Math.max(...monthlyEarnings.value.map(e => e.amount))
  return (amount / maxAmount) * 100
}

// Load team data
const loadTeamData = () => {
  // In real app, load from API
  setTimeout(() => {
    totalTeam.value = 12
    directReferrals.value = 5
    teamEarnings.value = 856.75
    
    // Update team levels
    teamLevels.value[0].count = 5
    teamLevels.value[0].earnings = 325.50
    teamLevels.value[1].count = 4
    teamLevels.value[1].earnings = 285.25
    teamLevels.value[2].count = 3
    teamLevels.value[2].earnings = 246.00
    
    loading.value = false
  }, 1000)
}

onMounted(() => {
  loadTeamData()
})
</script>

<style scoped>
.team-page {
  padding: 20px;
  padding-bottom: 80px;
  background: #f5f5f5;
  min-height: 100vh;
}

.team-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.team-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
}

.team-subtitle {
  font-size: 14px;
  color: #666;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 25px;
}

.stat-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.stat-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #4e7771, #36454f);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.levels-section,
.members-section,
.earnings-section {
  background: white;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.levels-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.level-item {
  padding: 15px;
  background: #f9f9f9;
  border-radius: 12px;
  border: 2px solid transparent;
  transition: all 0.3s;
}

.level-item.active {
  border-color: #4e7771;
  background: rgba(78, 119, 113, 0.1);
}

.level-item:hover {
  transform: translateX(5px);
}

.level-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.level-badge {
  padding: 6px 12px;
  background: #4e7771;
  color: white;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.level-count {
  font-size: 13px;
  color: #666;
}

.level-earnings {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.earnings-label {
  font-size: 13px;
  color: #666;
}

.earnings-value {
  font-size: 16px;
  font-weight: 600;
  color: #4e7771;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.members-count {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.loading-state {
  padding: 40px;
  text-align: center;
  color: #666;
  font-size: 14px;
}

.loading-state i {
  margin-right: 10px;
  color: #4e7771;
}

.empty-state {
  padding: 40px 20px;
  text-align: center;
}

.empty-state i {
  font-size: 48px;
  color: #ddd;
  margin-bottom: 15px;
}

.empty-state p {
  color: #999;
  margin-bottom: 10px;
}

.empty-subtext {
  font-size: 13px;
  color: #ccc;
}

.members-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.member-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 12px;
  transition: all 0.3s;
}

.member-item:hover {
  background: #f0f0f0;
  transform: translateX(5px);
}

.member-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.member-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #4e7771, #36454f);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
}

.member-details {
  flex: 1;
}

.member-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.member-date {
  font-size: 12px;
  color: #999;
}

.member-status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.member-status.active {
  background: rgba(82, 196, 26, 0.1);
  color: #52c41a;
}

.member-status.inactive {
  background: rgba(255, 77, 79, 0.1);
  color: #ff4d4f;
}

.earnings-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 200px;
  margin-bottom: 20px;
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;
}

.chart-bar {
  flex: 1;
  margin: 0 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  position: relative;
}

.chart-bar::before {
  content: '';
  width: 30px;
  background: linear-gradient(to top, #4e7771, #5a8a84);
  border-radius: 6px 6px 0 0;
  transition: all 0.3s;
}

.chart-bar:hover::before {
  background: linear-gradient(to top, #5a8a84, #6a9a94);
}

.bar-amount {
  position: absolute;
  top: -25px;
  font-size: 11px;
  color: #666;
  font-weight: 500;
  white-space: nowrap;
}

.bar-month {
  margin-top: 10px;
  font-size: 12px;
  color: #666;
}

.earnings-summary {
  display: flex;
  gap: 20px;
}

.summary-item {
  flex: 1;
  text-align: center;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 12px;
}

.summary-label {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}

.summary-value {
  font-size: 20px;
  font-weight: 700;
  color: #4e7771;
}

@media (min-width: 768px) {
  .team-page {
    max-width: 375px;
    margin: 0 auto;
  }
}
</style>
