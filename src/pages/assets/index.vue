<!-- src/pages/assets/index.vue -->
<template>
  <div class="assets-page">
    <!-- Balance -->
    <div class="card padding">
      <div class="text-center">
        <div class="balance-amount text-white">{{ totalBalance }} USDT</div>
        <div class="text-gray" style="font-size: 12px;">{{ $t('total_balance') }}</div>
      </div>

      <!-- Deposit and Withdraw - compact -->
      <div class="wallet-actions-compact">
        <div class="wallet-action-compact" @click="goToDeposit">
          <img src="/static/deposit.png" alt="Deposit">
          <div class="wallet-text-compact">{{ $t('deposit_action') }}</div>
        </div>
        <div class="wallet-action-compact" @click="goToWithdraw">
          <img src="/static/withdraw.png" alt="Withdraw">
          <div class="wallet-text-compact">{{ $t('withdraw_action') }}</div>
        </div>
      </div>
    </div>

    <!-- Transaction History - compact -->
    <div class="card padding margin-top">
      <div class="text-white text-bold margin-bottom" style="font-size: 14px; text-align: center;">
        {{ $t('transaction_history') }}
      </div>
      
      <div class="transaction-categories-compact">
        <div class="transaction-category-compact">
          <div class="transaction-category-name-compact">{{ $t('total_earned') }}</div>
          <div class="transaction-category-amount-compact">{{ totalEarned.toFixed(2) }} USDT</div>
        </div>
        <div class="transaction-category-compact">
          <div class="transaction-category-name-compact">{{ $t('total_deposits') }}</div>
          <div class="transaction-category-amount-compact">{{ totalDeposits.toFixed(2) }} USDT</div>
        </div>
        <div class="transaction-category-compact">
          <div class="transaction-category-name-compact">{{ $t('total_withdrawals') }}</div>
          <div class="transaction-category-amount-compact">{{ totalWithdrawals.toFixed(2) }} USDT</div>
        </div>
        <div class="transaction-category-compact">
          <div class="transaction-category-name-compact">{{ $t('referral_income') }}</div>
          <div class="transaction-category-amount-compact">{{ referralIncome.toFixed(2) }} USDT</div>
        </div>
      </div>
      
      <div class="transaction-list-compact">
        <div v-if="loading" style="color: #ccc; text-align: center; padding: 20px; font-size: 12px;">
          {{ $t('loading') }}
        </div>
        <div v-else-if="transactions.length === 0" style="color: #ccc; text-align: center; padding: 20px; font-size: 12px;">
          {{ $t('no_transactions') }}
        </div>
        <div v-else>
          <div v-for="transaction in transactions" :key="transaction.id" class="transaction-item">
            <div class="transaction-info">
              <div class="transaction-type">{{ getTransactionType(transaction.type) }}</div>
              <div class="transaction-date">
                {{ formatDate(transaction.created_at) }} {{ formatTime(transaction.created_at) }}
              </div>
            </div>
            <div :class="['transaction-amount', transaction.amount > 0 ? 'color-up' : 'color-down']">
              {{ transaction.amount > 0 ? '+' : '' }}{{ transaction.amount.toFixed(2) }} USDT
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      totalEarned: 0,
      totalDeposits: 0,
      totalWithdrawals: 0,
      referralIncome: 0,
      transactions: [],
      loading: true
    }
  },
  
  computed: {
    user() {
      return this.$store.state.user
    },
    
    totalBalance() {
      return this.user ? this.user.balance.toFixed(2) : '0.00'
    }
  },
  
  mounted() {
    this.loadTransactionHistory()
  },
  
  methods: {
    async loadTransactionHistory() {
      if (!this.user) return
      
      this.loading = true
      
      try {
        const { data: transactions, error } = await this.$supabase
          .from('transactions')
          .select('*')
          .eq('user_id', this.user.id)
          .order('created_at', { ascending: false })
          .limit(20)
          
        if (error) throw error
        
        this.transactions = transactions || []
        
        // Calculate statistics
        this.totalEarned = 0
        this.totalDeposits = 0
        this.totalWithdrawals = 0
        this.referralIncome = 0
        
        transactions?.forEach(transaction => {
          const amount = transaction.amount
          
          if (transaction.type === 'deposit') {
            this.totalDeposits += amount
          } else if (transaction.type === 'withdrawal') {
            this.totalWithdrawals += Math.abs(amount)
          } else if (transaction.type === 'referral') {
            this.referralIncome += amount
            this.totalEarned += amount
          } else if (transaction.type === 'quantification' || transaction.type === 'registration_bonus') {
            this.totalEarned += amount
          }
        })
      } catch (error) {
        console.error('Error loading transaction history:', error)
      } finally {
        this.loading = false
      }
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
      return date.toLocaleDateString()
    },
    
    formatTime(dateString) {
      const date = new Date(dateString)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    
    goToDeposit() {
      this.$router.push('/deposit')
    },
    
    goToWithdraw() {
      this.$router.push('/withdraw')
    }
  }
}
</script>

<style scoped>
/* Add your styles here */
</style>
