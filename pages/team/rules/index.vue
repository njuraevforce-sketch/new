<template>
  <view class="rules-page">
    <!-- Rules Header -->
    <div class="rules-header">
      <h1 class="rules-title">{{ $t('platform_rules') }}</h1>
      <p class="rules-subtitle">Please read and follow our platform rules</p>
    </div>

    <!-- Rules Navigation -->
    <div class="rules-nav">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        :class="['nav-btn', { 'active': activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Rules Content -->
    <div class="rules-content">
      <!-- Quantification Rules -->
      <div v-if="activeTab === 'quantification'" class="rules-section">
        <h2 class="section-title">{{ $t('quantification_rules') }}</h2>
        
        <div class="rules-list">
          <div class="rule-item">
            <div class="rule-number">1</div>
            <div class="rule-text">
              <strong>Daily Signals:</strong> Each user receives 3 quantification signals per day
            </div>
          </div>
          
          <div class="rule-item">
            <div class="rule-number">2</div>
            <div class="rule-text">
              <strong>Signal Reset:</strong> Signals reset daily at 18:00 UTC
            </div>
          </div>
          
          <div class="rule-item">
            <div class="rule-number">3</div>
            <div class="rule-text">
              <strong>Minimum Balance:</strong> Minimum 20 USDT required for quantification
            </div>
          </div>
          
          <div class="rule-item">
            <div class="rule-number">4</div>
            <div class="rule-text">
              <strong>Profit Calculation:</strong> Daily profit = (Balance × VIP %) ÷ 3 signals
            </div>
          </div>
          
          <div class="rule-item">
            <div class="rule-number">5</div>
            <div class="rule-text">
              <strong>Auto Distribution:</strong> Profits are automatically credited to balance
            </div>
          </div>
        </div>
        
        <div class="profit-table">
          <h3>VIP Level Profit Rates</h3>
          <table>
            <thead>
              <tr>
                <th>VIP Level</th>
                <th>Daily %</th>
                <th>Min Deposit</th>
                <th>Min Refs</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="level in vipLevels" :key="level.level">
                <td>VIP {{ level.level }}</td>
                <td>{{ level.percent }}%</td>
                <td>{{ level.minDeposit }} USDT</td>
                <td>{{ level.minRefs }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Referral Rules -->
      <div v-else-if="activeTab === 'referral'" class="rules-section">
        <h2 class="section-title">{{ $t('referral_rules_title') }}</h2>
        
        <div class="commission-structure">
          <h3>Commission Structure</h3>
          <div class="commission-levels">
            <div class="commission-level">
              <div class="level-circle">1</div>
              <div class="level-info">
                <div class="level-percent">12% Commission</div>
                <div class="level-desc">Direct referrals</div>
              </div>
            </div>
            
            <div class="commission-level">
              <div class="level-circle">2</div>
              <div class="level-info">
                <div class="level-percent">5% Commission</div>
                <div class="level-desc">Second level</div>
              </div>
            </div>
            
            <div class="commission-level">
              <div class="level-circle">3</div>
              <div class="level-info">
                <div class="level-percent">3% Commission</div>
                <div class="level-desc">Third level</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="rules-list">
          <div class="rule-item">
            <i class="fas fa-check"></i>
            <div class="rule-text">
              Referrals must deposit at least 20 USDT to be considered active
            </div>
          </div>
          
          <div class="rule-item">
            <i class="fas fa-check"></i>
            <div class="rule-text">
              Commissions are paid from referral's quantification profits only
            </div>
          </div>
          
          <div class="rule-item">
            <i class="fas fa-check"></i>
            <div class="rule-text">
              Commission is credited instantly after each successful quantification
            </div>
          </div>
          
          <div class="rule-item">
            <i class="fas fa-check"></i>
            <div class="rule-text">
              No limit on number of referrals you can invite
            </div>
          </div>
          
          <div class="rule-item">
            <i class="fas fa-check"></i>
            <div class="rule-text">
              Referral rewards are available for withdrawal immediately
            </div>
          </div>
        </div>
      </div>

      <!-- Withdrawal Rules -->
      <div v-else-if="activeTab === 'withdrawal'" class="rules-section">
        <h2 class="section-title">{{ $t('withdrawal_rules') }}</h2>
        
        <div class="withdrawal-info">
          <div class="info-card">
            <i class="fas fa-money-bill-wave"></i>
            <div class="info-content">
              <h4>Minimum Withdrawal</h4>
              <p>20 USDT</p>
            </div>
          </div>
          
          <div class="info-card">
            <i class="fas fa-clock"></i>
            <div class="info-content">
              <h4>Processing Time</h4>
              <p>1-24 hours</p>
            </div>
          </div>
          
          <div class="info-card">
            <i class="fas fa-percentage"></i>
            <div class="info-content">
              <h4>Withdrawal Fee</h4>
              <p>1% (min 1 USDT)</p>
            </div>
          </div>
        </div>
        
        <div class="rules-list">
          <h3>Important Rules</h3>
          
          <div class="rule-item">
            <div class="rule-number">1</div>
            <div class="rule-text">
              Withdrawals require payment password verification
            </div>
          </div>
          
          <div class="rule-item">
            <div class="rule-number">2</div>
            <div class="rule-text">
              Withdrawal address must be set before first withdrawal
            </div>
          </div>
          
          <div class="rule-item">
            <div class="rule-number">3</div>
            <div class="rule-text">
              Maximum 3 withdrawals per day
            </div>
          </div>
          
          <div class="rule-item">
            <div class="rule-number">4</div>
            <div class="rule-text">
              Withdrawals are processed manually during business hours
            </div>
          </div>
          
          <div class="rule-item">
            <div class="rule-number">5</div>
            <div class="rule-text">
              Suspicious activity may trigger additional verification
            </div>
          </div>
        </div>
        
        <div class="network-info">
          <h3>Supported Networks</h3>
          <div class="network-list">
            <div class="network-item">
              <img src="/static/assets/trc20.png" alt="TRC20">
              <span>TRC20</span>
            </div>
            <div class="network-item">
              <img src="/static/assets/bsc20.png" alt="BEP20">
              <span>BEP20</span>
            </div>
          </div>
        </div>
      </div>

      <!-- VIP Rules -->
      <div v-else-if="activeTab === 'vip'" class="rules-section">
        <h2 class="section-title">{{ $t('vip_rules') }}</h2>
        
        <div class="vip-rules">
          <div class="vip-requirements">
            <h3>VIP Level Requirements</h3>
            
            <div class="requirements-table">
              <div class="table-header">
                <div class="table-cell">VIP Level</div>
                <div class="table-cell">Min Balance</div>
                <div class="table-cell">Active Refs</div>
                <div class="table-cell">Daily %</div>
              </div>
              
              <div 
                v-for="level in vipLevels" 
                :key="level.level"
                class="table-row"
              >
                <div class="table-cell">VIP {{ level.level }}</div>
                <div class="table-cell">{{ level.minDeposit }} USDT</div>
                <div class="table-cell">{{ level.minRefs }}</div>
                <div class="table-cell">{{ level.percent }}%</div>
              </div>
            </div>
          </div>
          
          <div class="rules-list">
            <h3>VIP Rules & Benefits</h3>
            
            <div class="rule-item">
              <i class="fas fa-star"></i>
              <div class="rule-text">
                VIP level is automatically calculated based on balance and active referrals
              </div>
            </div>
            
            <div class="rule-item">
              <i class="fas fa-star"></i>
              <div class="rule-text">
                Active referrals must have minimum 20 USDT balance
              </div>
            </div>
            
            <div class="rule-item">
              <i class="fas fa-star"></i>
              <div class="rule-text">
                VIP upgrade happens automatically when requirements are met
              </div>
            </div>
            
            <div class="rule-item">
              <i class="fas fa-star"></i>
              <div class="rule-text">
                Higher VIP levels have priority withdrawal processing
              </div>
            </div>
            
            <div class="rule-item">
              <i class="fas fa-star"></i>
              <div class="rule-text">
                VIP benefits apply immediately upon level upgrade
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Rules Footer -->
    <div class="rules-footer">
      <p class="footer-note">
        <i class="fas fa-exclamation-circle"></i>
        Violation of platform rules may result in account suspension
      </p>
    </div>
  </view>
</template>

<script setup>
import { ref } from 'vue'

// Tabs
const tabs = [
  { id: 'quantification', label: 'Quantification' },
  { id: 'referral', label: 'Referral' },
  { id: 'withdrawal', label: 'Withdrawal' },
  { id: 'vip', label: 'VIP' }
]

const activeTab = ref('quantification')

// VIP Levels
const vipLevels = ref([
  { level: 1, percent: 2.2, minDeposit: 0, minRefs: 0 },
  { level: 2, percent: 2.8, minDeposit: 300, minRefs: 2 },
  { level: 3, percent: 3.5, minDeposit: 1000, minRefs: 5 },
  { level: 4, percent: 4.0, minDeposit: 3500, minRefs: 8 },
  { level: 5, percent: 5.0, minDeposit: 6000, minRefs: 15 },
  { level: 6, percent: 6.0, minDeposit: 12000, minRefs: 25 }
])
</script>

<style scoped>
.rules-page {
  padding: 20px;
  padding-bottom: 80px;
  background: #f5f5f5;
  min-height: 100vh;
}

.rules-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.rules-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
}

.rules-subtitle {
  font-size: 14px;
  color: #666;
}

.rules-nav {
  display: flex;
  overflow-x: auto;
  gap: 10px;
  margin-bottom: 25px;
  padding-bottom: 10px;
}

.nav-btn {
  padding: 12px 20px;
  background: white;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.nav-btn:hover {
  border-color: #ddd;
}

.nav-btn.active {
  background: #4e7771;
  border-color: #4e7771;
  color: white;
}

.rules-content {
  margin-bottom: 30px;
}

.rules-section {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 25px;
  text-align: center;
}

.rules-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.rule-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 12px;
  transition: all 0.3s;
}

.rule-item:hover {
  background: #f0f0f0;
  transform: translateX(5px);
}

.rule-number {
  width: 30px;
  height: 30px;
  background: #4e7771;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.rule-item i {
  color: #52c41a;
  font-size: 18px;
  margin-top: 3px;
  flex-shrink: 0;
}

.rule-text {
  flex: 1;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.rule-text strong {
  color: #333;
}

.profit-table {
  background: #f9f9f9;
  border-radius: 12px;
  padding: 20px;
  overflow-x: auto;
}

.profit-table h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  text-align: center;
}

.profit-table table {
  width: 100%;
  border-collapse: collapse;
}

.profit-table th,
.profit-table td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #eee;
}

.profit-table th {
  background: #4e7771;
  color: white;
  font-weight: 500;
  font-size: 13px;
}

.profit-table td {
  font-size: 13px;
  color: #666;
}

.profit-table tr:hover td {
  background: rgba(78, 119, 113, 0.1);
}

.commission-structure {
  margin-bottom: 30px;
}

.com
