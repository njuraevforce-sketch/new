import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://fctwivbwjoslkejtjxhe.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjdHdpdmJ3am9zbGtlanRqeGhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNDMwMzUsImV4cCI6MjA4MTcxOTAzNX0.DiAzcqkigZPueh40idz2fIoJ-o-sKDMaRleOagH__B0'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'apikey': supabaseAnonKey,
    'Authorization': `Bearer ${supabaseAnonKey}`
  },
  db: {
    schema: 'public'
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false
  },
  global: {
    headers: {
      'x-application-name': 'gly-platform'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Test connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1)
    if (error) throw error
    return { success: true, message: 'Connected to Supabase' }
  } catch (error) {
    console.error('Supabase connection error:', error)
    return { success: false, message: error.message }
  }
}

// User operations
export const userOperations = {
  async getUserById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    return { data, error }
  },

  async getUserByUsername(username) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .maybeSingle()
    return { data, error }
  },

  async createUser(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
    return { data, error }
  },

  async updateUser(id, updateData) {
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
    return { data, error }
  }
}

// Transaction operations
export const transactionOperations = {
  async getUserTransactions(userId, limit = 20) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
    return { data, error }
  },

  async createTransaction(transactionData) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transactionData])
      .select()
    return { data, error }
  },

  async getTransactionStats(userId) {
    const { data, error } = await supabase
      .from('transactions')
      .select('type, amount')
      .eq('user_id', userId)

    if (error) return { data: null, error }

    let totalEarned = 0
    let totalDeposits = 0
    let totalWithdrawals = 0
    let referralIncome = 0

    data.forEach(transaction => {
      const amount = transaction.amount
      switch (transaction.type) {
        case 'deposit':
          totalDeposits += amount
          break
        case 'withdrawal':
          totalWithdrawals += Math.abs(amount)
          break
        case 'referral':
          referralIncome += amount
          totalEarned += amount
          break
        case 'quantification':
        case 'registration_bonus':
          totalEarned += amount
          break
      }
    })

    return {
      data: {
        totalEarned,
        totalDeposits,
        totalWithdrawals,
        referralIncome
      },
      error: null
    }
  }
}

// Deposit operations
export const depositOperations = {
  async createDeposit(depositData) {
    const { data, error } = await supabase
      .from('deposit_transactions')
      .insert([depositData])
      .select()
    return { data, error }
  },

  async getUserDeposits(userId) {
    const { data, error } = await supabase
      .from('deposit_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async getPendingDeposits(userId) {
    const { data, error } = await supabase
      .from('deposit_transactions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async updateDepositStatus(id, status) {
    const { data, error } = await supabase
      .from('deposit_transactions')
      .update({ status })
      .eq('id', id)
      .select()
    return { data, error }
  }
}

// Referral operations
export const referralOperations = {
  async getReferralsByUserId(userId) {
    const { data, error } = await supabase
      .from('referrals')
      .select(`
        *,
        referred:users!referred_id (
          username,
          balance,
          created_at
        )
      `)
      .eq('referrer_id', userId)
      .eq('level', 1)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async getReferralStats(userId) {
    const { data, error } = await supabase
      .from('referrals')
      .select('level, count')
      .eq('referrer_id', userId)
      .group('level')

    if (error) return { data: null, error }

    const stats = {
      level1: 0,
      level2: 0,
      level3: 0,
      total: 0
    }

    data.forEach(item => {
      if (item.level === 1) stats.level1 = item.count
      if (item.level === 2) stats.level2 = item.count
      if (item.level === 3) stats.level3 = item.count
    })

    stats.total = stats.level1 + stats.level2 + stats.level3

    return { data: stats, error: null }
  },

  async getReferralIncome(userId) {
    const { data, error } = await supabase
      .from('transactions')
      .select('amount')
      .eq('user_id', userId)
      .eq('type', 'referral')

    if (error) return { data: null, error }

    const totalIncome = data.reduce((sum, transaction) => sum + transaction.amount, 0)
    return { data: totalIncome, error: null }
  }
}

// Admin operations
export const adminOperations = {
  async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async getAllTransactions() {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)
    return { data, error }
  },

  async getAllDeposits() {
    const { data, error } = await supabase
      .from('deposit_transactions')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async updateUserBalance(userId, newBalance) {
    const { data, error } = await supabase
      .from('users')
      .update({ balance: newBalance })
      .eq('id', userId)
      .select()
    return { data, error }
  }
}

// Export all operations
export default {
  supabase,
  testConnection,
  userOperations,
  transactionOperations,
  depositOperations,
  referralOperations,
  adminOperations
}
