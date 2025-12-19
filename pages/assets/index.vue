<template>
  <view class="assets-page">
    <!-- Balance Card -->
    <view class="card padding">
      <view class="text-center">
        <view class="balance-amount text-white">
          {{ formattedBalance }} USDT
        </view>
        <view class="text-gray" style="font-size: 12px;">
          {{ $t('total_balance') }}
        </view>
      </view>

      <!-- Deposit and Withdraw Buttons -->
      <view class="wallet-actions-compact">
        <view class="wallet-action-compact" @click="navigateTo('deposit')">
          <image src="/static/deposit.png" class="wallet-icon" />
          <view class="wallet-text-compact">{{ $t('deposit_action') }}</view>
        </view>
        <view class="wallet-action-compact" @click="navigateTo('withdraw')">
          <image src="/static/withdraw.png" class="wallet-icon" />
          <view class="wallet-text-compact">{{ $t('withdraw_action') }}</view>
        </view>
      </view>
    </view>

    <!-- Transaction History -->
    <view class="card padding margin-top">
      <view class="text-white text-bold margin-bottom" style="font-size: 14px; text-align: center;">
        {{ $t('transaction_history') }}
      </view>
      
      <!-- Statistics -->
      <view class="transaction-categories-compact">
        <view class="transaction-category-compact">
          <view class="transaction-category-name-compact">{{ $t('total_earned') }}</view>
          <view class="transaction-category-amount-compact">{{ stats.totalEarned.toFixed(2) }} USDT</view>
        </view>
        <view class="transaction-category-compact">
          <view class="transaction-category-name-compact">{{ $t('total_deposits') }}</view>
          <view class="transaction-category-amount-compact">{{ stats.totalDeposits.toFixed(2) }} USDT</view>
        </view>
        <view class="transaction-category-compact">
          <view class="transaction-category-name-compact">{{ $t('total_withdrawals') }}</view>
          <view class="transaction-category-amount-compact">{{ stats.totalWithdrawals.toFixed(2) }} USDT</view>
        </view>
        <view class="transaction-category-compact">
          <view class="transaction-category-name-compact">{{ $t('referral_income') }}</view>
          <view class="transaction-category-amount-compact">{{ stats.referralIncome.toFixed(2) }} USDT</view>
        </view>
      </view>
      
      <!-- Transaction List -->
      <view class="transaction-list-compact">
        <view v-if="loading" class="text-center padding">
          <i class="fas fa-spinner fa-spin"></i> {{ $t('loading') }}
        </view>
        
        <view v-else-if="transactions.length === 0" class="text-center padding text-gray">
          {{ $t('no_transactions') }}
        </view>
        
        <view v-else>
          <view 
            v-for="transaction in transactions" 
            :key="transaction.id"
            class="transaction-item"
          >
            <view class="transaction-info">
              <view class="transaction-type">{{ getTransactionType(transaction.type) }}</view>
              <view class="transaction-date">
                {{ formatDate(transaction.created_at) }}
              </view>
            </view>
            <view 
              class="transaction-amount"
              :class="transaction.amount > 0 ? 'color-up' : 'color-down'"
            >
              {{ transaction.amount > 0 ? '+' : '' }}{{ transaction.amount.toFixed(2) }} USDT
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'AssetsPage',
  data() {
    return {
      loading: true,
      transactions: [],
      stats: {
        totalEarned: 0,
        totalDeposits: 0,
        totalWithdrawals: 0,
        referralIncome: 0
      }
    }
  },
  computed: {
    ...mapState(['user']),
    ...mapGetters(['formattedBalance', 'isAuthenticated'])
  },
  mounted() {
    this.loadTransactions()
  },
  methods: {
    navigateTo(page) {
      uni.navigateTo({
        url: `/pages/${page}/index`
      })
    },
    
    async loadTransactions() {
      if (!this.user) return
      
      this.loading = true
      
      try {
        const { data, error } = await window.supabase
          .from('transactions')
          .select('*')
          .eq('user_id', this.user.id)
          .order('created_at', { ascending: false })
          .limit(20)
          
        if (error) throw error
        
        this.transactions = data || []
        this.calculateStats(data || [])
      } catch (error) {
        console.error('Error loading transactions:', error)
        this.$showAlert(this.$t('error_loading'))
      } finally {
        this.loading = false
      }
    },
    
    calculateStats(transactions) {
      const stats = {
        totalEarned: 0,
        totalDeposits: 0,
        totalWithdrawals: 0,
        referralIncome: 0
      }
      
      transactions.forEach(transaction => {
        const amount = transaction.amount
        
        switch (transaction.type) {
          case 'deposit':
            stats.totalDeposits += amount
            break
          case 'withdrawal':
            stats.totalWithdrawals += Math.abs(amount)
            break
          case 'referral':
            stats.referralIncome += amount
            stats.totalEarned += amount
            break
          case 'quantification':
          case 'registration_bonus':
            stats.totalEarned += amount
            break
        }
      })
      
      this.stats = stats
    },
    
    getTransactionType(type) {
      const types = {
        'deposit': this.$t('transaction_type_deposit'),
        'withdrawal': this.$t('transaction_type_withdrawal'),
        'quantification': this.$t('transaction_type_quantification'),
        'referral': this.$t('transaction_type_referral'),
        'registration_bonus': this.$t('transaction_type_registration_bonus')
      }
      return types[type] || type
    },
    
    formatDate(dateString) {
      const date = new Date(dateString)
      const formattedDate = date.toLocaleDateString()
      const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      return `${formattedDate} ${formattedTime}`
    }
  }
}
</script>

<style lang="scss" scoped>
.assets-page {
  padding-bottom: 100rpx;
}

.balance-amount {
  font-size: 40rpx;
  font-weight: bold;
  color: #f9ae3d;
  margin: 20rpx 0;
}

.wallet-actions-compact {
  display: flex;
  justify-content: center;
  gap: 40rpx;
  margin-top: 30rpx;
}

.wallet-action-compact {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.95);
  }
}

.wallet-icon {
  width: 60rpx;
  height: 60rpx;
  margin-bottom: 10rpx;
}

.wallet-text-compact {
  color: white;
  font-size: 24rpx;
  font-weight: bold;
}

.transaction-categories-compact {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15rpx;
  margin-bottom: 30rpx;
}

.transaction-category-compact {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8rpx;
  padding: 20rpx;
  text-align: center;
}

.transaction-category-name-compact {
  color: #cccccc;
  font-size: 22rpx;
  margin-bottom: 10rpx;
}

.transaction-category-amount-compact {
  color: white;
  font-size: 24rpx;
  font-weight: bold;
}

.transaction-list-compact {
  max-height: 500rpx;
  overflow-y: auto;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8rpx;
  margin-bottom: 10rpx;
  border-left: 5rpx solid;
}

.transaction-info {
  flex: 1;
}

.transaction-type {
  font-weight: bold;
  font-size: 26rpx;
  margin-bottom: 5rpx;
}

.transaction-date {
  color: #cccccc;
  font-size: 22rpx;
}

.transaction-amount {
  font-weight: bold;
  font-size: 28rpx;
}
</style>
