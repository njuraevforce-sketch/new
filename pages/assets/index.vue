<template>
  <view class="assets-page">
    <!-- Balance Card -->
    <div class="balance-card">
      <div class="balance-amount">{{ formatBalance }} USDT</div>
      <div class="balance-label">{{ $t('total_balance') }}</div>
      
      <!-- Deposit and Withdraw buttons -->
      <div class="wallet-actions">
        <div class="wallet-action" @click="goToDeposit">
          <img src="/static/assets/deposit.png" alt="Deposit">
          <div class="wallet-text">{{ $t('deposit') }}</div>
        </div>
        <div class="wallet-action" @click="goToWithdraw">
          <img src="/static/assets/withdraw.png" alt="Withdraw">
          <div class="wallet-text">{{ $t('withdraw') }}</div>
        </div>
      </div>
    </div>

    <!-- Transaction History -->
    <div class="history-card">
      <div class="history-title">{{ $t('transaction_history') }}</div>
      
      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-label">{{ $t('total_earned') }}</div>
          <div class="stat-value">{{ formatCurrency(totalEarned) }} USDT</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">{{ $t('total_deposits') }}</div>
          <div class="stat-value">{{ formatCurrency(totalDeposits) }} USDT</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">{{ $t('total_withdrawals') }}</div>
          <div class="stat-value">{{ formatCurrency(totalWithdrawals) }} USDT</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">{{ $t('referral_income') }}</div>
          <div class="stat-value">{{ formatCurrency(referralIncome) }} USDT</div>
        </div>
      </div>
      
      <!-- Transaction List -->
      <div class="transaction-list">
        <div v-if="loading" class="loading-state">
          <i class="fas fa-spinner fa-spin"></i> {{ $t('loading') }}
        </div>
        
        <div v-else-if="transactions.length === 0" class="empty-state">
          {{ $t('no_transactions') }}
        </div>
        
        <div v-else class="transactions">
          <div 
            v-for="transaction in transactions" 
            :key="transaction.id"
            class="transaction-item"
          >
            <div class="transaction-info">
              <div class="transaction-type">{{ getTransactionType(transaction.type) }}</div>
              <div class="transaction-date">{{ formatDate(transaction.created_at) }}</div>
            </div>
            <div :class="['transaction-amount', transaction.amount > 0 ? 'positive' : 'negative']">
              {{ transaction.amount > 0 ? '+' : '' }}{{ formatCurrency(transaction.amount) }} USDT
            </div>
          </div>
        </div>
      </div>
    </div>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { supabase, transactionOperations } from '@/utils/supabase'
import { t } from '@/utils/translate'

const router = useRouter()
const userStore = useUserStore()

// Data
const transactions = ref([])
const loading = ref(true)

// Stats
const totalEarned = ref(0)
const totalDeposits = ref(0)
const totalWithdrawals = ref(0)
const referralIncome = ref(0)

const userBalance = computed(() => {
  return userStore.currentUser?.balance || 0
})

const formatBalance = computed(() => {
  return userBalance.value.toFixed(2)
})

// Helper functions
const formatCurrency = (amount) => {
  return Math.abs(amount).toFixed(2)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
}

const getTransactionType = (type) => {
  const types = {
    'deposit': t('transaction_type_deposit'),
    'withdrawal': t('transaction_type_withdrawal'),
    'quantification': t('transaction_type_quantification'),
    'referral': t('transaction_type_referral'),
    'registration_bonus': t('transaction_type_registration_bonus')
  }
  return types[type] || type
}

// Navigation
const goToDeposit = () => {
  router.push('/deposit')
}

const goToWithdraw = () => {
  router.push('/withdraw')
}

// Load transactions
const loadTransactions = async () => {
  if (!userStore.currentUser) return
  
  loading.value = true
  
  try {
    // Load transactions
    const { data, error } = await transactionOperations.getUserTransactions(
      userStore.currentUser.id,
      20
    )
    
    if (error) throw error
    
    transactions.value = data || []
    
    // Calculate stats
    let earned = 0
    let deposits = 0
    let withdrawals = 0
    let referral = 0
    
    transactions.value.forEach(transaction => {
      const amount = transaction.amount
      
      switch (transaction.type) {
        case 'deposit':
          deposits += amount
          break
        case 'withdrawal':
          withdrawals += Math.abs(amount)
          break
        case 'referral':
          referral += amount
          earned += amount
          break
        case 'quantification':
        case 'registration_bonus':
          earned += amount
          break
      }
    })
    
    totalEarned.value = earned
    totalDeposits.value = deposits
    totalWithdrawals.value = withdrawals
    referralIncome.value = referral
    
  } catch (error) {
    console.error('Error loading transactions:', error)
    window.showCustomAlert(t('error_loading_transactions'))
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTransactions()
})
</script>

<style scoped>
.assets-page {
  padding: 15px;
  padding-bottom: 80px;
}

/* Balance Card */
.balance-card {
  background: linear-gradient(135deg, #4e7771, #36454f);
  border-radius: 15px;
  padding: 25px 20px;
  color: white;
  text-align: center;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(78, 119, 113, 0.3);
}

.balance-amount {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
}

.balance-label {
  font-size: 14px;
  opacity: 0.8;
  margin-bottom: 25px;
}

.wallet-actions {
  display: flex;
  justify-content: center;
  gap: 30px;
}

.wallet-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s;
}

.wallet-action:hover {
  transform: translateY(-2px);
}

.wallet-action img {
  width: 40px;
  height: 40px;
  margin-bottom: 8px;
}

.wallet-text {
  font-size: 12px;
  font-weight: 500;
}

/* History Card */
.history-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.history-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 25px;
}

.stat-item {
  background: #f9f9f9;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

/* Transaction List */
.transaction-list {
  max-height: 400px;
  overflow-y: auto;
}

.loading-state, .empty-state {
  padding: 40px 20px;
  text-align: center;
  color: #999;
  font-size: 14px;
}

.loading-state i {
  margin-right: 8px;
  color: #4e7771;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.transaction-item:last-child {
  border-bottom: none;
}

.transaction-info {
  flex: 1;
}

.transaction-type {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.transaction-date {
  font-size: 11px;
  color: #999;
}

.transaction-amount {
  font-size: 14px;
  font-weight: 600;
}

.transaction-amount.positive {
  color: #52c41a;
}

.transaction-amount.negative {
  color: #ff4d4f;
}

@media (min-width: 768px) {
  .assets-page {
    max-width: 375px;
    margin: 0 auto;
  }
}
</style>
