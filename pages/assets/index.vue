<template>
  <view class="assets-page">
    <!-- Balance -->
    <view class="card padding">
      <view class="text-center">
        <view class="balance-amount text-white">{{ userStore.balance.toFixed(2) }} USDT</view>
        <view class="text-gray" style="font-size: 12px;">Total Balance</view>
      </view>

      <!-- Deposit and Withdraw - compact -->
      <view class="wallet-actions-compact">
        <view class="wallet-action-compact" @click="navigateTo('deposit')">
          <image src="/static/deposit.png" mode="aspectFit"></image>
          <view class="wallet-text-compact">Deposit</view>
        </view>
        <view class="wallet-action-compact" @click="navigateTo('withdraw')">
          <image src="/static/withdraw.png" mode="aspectFit"></image>
          <view class="wallet-text-compact">Withdraw</view>
        </view>
      </view>
    </view>

    <!-- Transaction History - compact -->
    <view class="card padding margin-top">
      <view class="text-white text-bold margin-bottom" style="font-size: 14px; text-align: center;">Transaction History</view>
      
      <view class="transaction-categories-compact">
        <view class="transaction-category-compact">
          <view class="transaction-category-name-compact">Total Earned</view>
          <view class="transaction-category-amount-compact">{{ statistics.totalEarned.toFixed(2) }} USDT</view>
        </view>
        <view class="transaction-category-compact">
          <view class="transaction-category-name-compact">Total Deposits</view>
          <view class="transaction-category-amount-compact">{{ statistics.totalDeposits.toFixed(2) }} USDT</view>
        </view>
        <view class="transaction-category-compact">
          <view class="transaction-category-name-compact">Total Withdrawals</view>
          <view class="transaction-category-amount-compact">{{ statistics.totalWithdrawals.toFixed(2) }} USDT</view>
        </view>
        <view class="transaction-category-compact">
          <view class="transaction-category-name-compact">Referral Income</view>
          <view class="transaction-category-amount-compact">{{ statistics.referralIncome.toFixed(2) }} USDT</view>
        </view>
      </view>
      
      <view class="transaction-list-compact">
        <view v-if="loadingTransactions" class="text-center" style="padding: 20px; color: #ccc;">
          <i class="fas fa-spinner fa-spin"></i> Loading transactions...
        </view>
        <view v-else-if="transactions.length === 0" class="text-center" style="padding: 20px; color: #ccc;">
          No transactions yet
        </view>
        <view v-else>
          <view 
            v-for="transaction in transactions" 
            :key="transaction.id"
            class="transaction-item"
          >
            <view class="transaction-info">
              <view class="transaction-type">{{ getTransactionType(transaction.type) }}</view>
              <view class="transaction-date">{{ formatDate(transaction.created_at) }}</view>
            </view>
            <view class="transaction-amount" :class="transaction.amount > 0 ? 'color-up' : 'color-down'">
              {{ transaction.amount > 0 ? '+' : '' }}{{ transaction.amount.toFixed(2) }} USDT
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../store/user'
import { getTransactionHistory } from '../../utils/api'

const router = useRouter()
const userStore = useUserStore()

const transactions = ref([])
const loadingTransactions = ref(false)
const statistics = ref({
  totalEarned: 0,
  totalDeposits: 0,
  totalWithdrawals: 0,
  referralIncome: 0
})

onMounted(() => {
  loadTransactionHistory()
})

async function loadTransactionHistory() {
  if (!userStore.isLoggedIn) return
  
  loadingTransactions.value = true
  
  try {
    const result = await getTransactionHistory(userStore.userId)
    
    if (result.success) {
      transactions.value = result.data || []
      calculateStatistics()
    }
  } catch (error) {
    console.error('Error loading transaction history:', error)
  } finally {
    loadingTransactions.value = false
  }
}

function calculateStatistics() {
  const stats = {
    totalEarned: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    referralIncome: 0
  }
  
  transactions.value.forEach(transaction => {
    if (transaction.type === 'deposit') {
      stats.totalDeposits += transaction.amount
    } else if (transaction.type === 'withdrawal') {
      stats.totalWithdrawals += Math.abs(transaction.amount)
    } else if (transaction.type === 'referral') {
      stats.referralIncome += transaction.amount
      stats.totalEarned += transaction.amount
    } else if (transaction.type === 'quantification' || transaction.type === 'registration_bonus') {
      stats.totalEarned += transaction.amount
    }
  })
  
  statistics.value = stats
}

function getTransactionType(type) {
  const types = {
    'deposit': 'Deposit',
    'withdrawal': 'Withdrawal',
    'quantification': 'Quantification',
    'referral': 'Referral',
    'registration_bonus': 'Registration Bonus'
  }
  return types[type] || type
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
}

function navigateTo(page) {
  uni.showToast({
    title: `${page} page coming soon`,
    icon: 'none'
  })
}
</script>

<style scoped>
.assets-page {
  padding-bottom: 80px;
}

.balance-amount {
  font-size: 36px;
  font-weight: bold;
  margin: 20px 0;
}
</style>
