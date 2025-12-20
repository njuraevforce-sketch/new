import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
    isLoading: false,
    error: null,
    signalsLastUpdate: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.currentUser,
    userId: (state) => state.currentUser?.id,
    userBalance: (state) => state.currentUser?.balance || 0,
    vipLevel: (state) => state.currentUser?.vip_level || 1,
    signalsAvailable: (state) => state.currentUser?.signals_available || 0,
    inviteCode: (state) => state.currentUser?.invite_code || ''
  },

  actions: {
    async initialize() {
      try {
        const storedUser = localStorage.getItem('gly_user')
        if (storedUser) {
          this.currentUser = JSON.parse(storedUser)
          await this.checkAndUpdateSignals()
          await this.updateVipLevel()
        }
      } catch (error) {
        console.error('Error initializing user:', error)
        localStorage.removeItem('gly_user')
        this.currentUser = null
      }
    },

    async login(username, password) {
      this.isLoading = true
      this.error = null

      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('username', username)
          .maybeSingle()

        if (error) throw new Error('Database error: ' + error.message)
        if (!data) throw new Error('User not found')
        if (data.password !== password) throw new Error('Invalid password')

        this.currentUser = data
        localStorage.setItem('gly_user', JSON.stringify(data))

        await this.checkAndUpdateSignals()
        await this.updateVipLevel()

        return { success: true, user: data }
      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.isLoading = false
      }
    },

    async register(userData) {
      this.isLoading = true
      this.error = null

      try {
        // Check if username exists
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('username', userData.username)
          .maybeSingle()

        if (existingUser) {
          throw new Error('Username already exists')
        }

        // Check invitation code
        const { data: referrer } = await supabase
          .from('users')
          .select('id, invite_code')
          .eq('invite_code', userData.invite_code.toUpperCase())
          .maybeSingle()

        if (!referrer) {
          throw new Error('Invalid invitation code')
        }

        // Generate user data
        const userId = 'GLY' + Math.random().toString(36).substr(2, 9).toUpperCase()
        const userInviteCode = Math.random().toString(36).substr(2, 8).toUpperCase()

        const newUser = {
          id: userId,
          username: userData.username,
          email: userData.email,
          password: userData.password,
          payment_password: userData.payment_password,
          invite_code: userInviteCode,
          referred_by: userData.invite_code.toUpperCase(),
          balance: 3.00,
          vip_level: 1,
          signals_available: 3,
          last_signal_update: new Date().toISOString(),
          created_at: new Date().toISOString()
        }

        // Save to database
        const { error: userError } = await supabase
          .from('users')
          .insert([newUser])

        if (userError) throw new Error('Database error: ' + userError.message)

        // Create referral records
        await this.createReferralRecords(referrer.id, userId)

        // Create registration bonus transaction
        await supabase
          .from('transactions')
          .insert([{
            user_id: userId,
            type: 'registration_bonus',
            amount: 3.00,
            status: 'completed',
            description: 'Registration bonus'
          }])

        this.currentUser = newUser
        localStorage.setItem('gly_user', JSON.stringify(newUser))

        // Clear pending invite code
        sessionStorage.removeItem('pending_invite_code')

        return { success: true, user: newUser }
      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.isLoading = false
      }
    },

    async createReferralRecords(referrerId, userId) {
      try {
        // Level 1
        await supabase
          .from('referrals')
          .insert([{
            referrer_id: referrerId,
            referred_id: userId,
            level: 1
          }])

        // Find level 2 referrer
        const { data: level2Referrer } = await supabase
          .from('referrals')
          .select('referrer_id')
          .eq('referred_id', referrerId)
          .eq('level', 1)
          .maybeSingle()

        if (level2Referrer) {
          // Level 2
          await supabase
            .from('referrals')
            .insert([{
              referrer_id: level2Referrer.referrer_id,
              referred_id: userId,
              level: 2
            }])

          // Find level 3 referrer
          const { data: level3Referrer } = await supabase
            .from('referrals')
            .select('referrer_id')
            .eq('referred_id', level2Referrer.referrer_id)
            .eq('level', 1)
            .maybeSingle()

          if (level3Referrer) {
            // Level 3
            await supabase
              .from('referrals')
              .insert([{
                referrer_id: level3Referrer.referrer_id,
                referred_id: userId,
                level: 3
              }])
          }
        }
      } catch (error) {
        console.error('Error creating referral records:', error)
      }
    },

    async updateBalance(amount, type = 'deposit') {
      if (!this.currentUser) return { success: false, error: 'User not found' }

      try {
        const newBalance = this.currentUser.balance + amount

        const { error } = await supabase
          .from('users')
          .update({ balance: newBalance })
          .eq('id', this.currentUser.id)

        if (error) throw error

        // Update local user
        this.currentUser.balance = newBalance
        localStorage.setItem('gly_user', JSON.stringify(this.currentUser))

        // Create transaction
        await supabase
          .from('transactions')
          .insert([{
            user_id: this.currentUser.id,
            type: type,
            amount: amount,
            status: 'completed',
            description: `${type.charAt(0).toUpperCase() + type.slice(1)} ${amount > 0 ? '+' : ''}${amount.toFixed(2)} USDT`
          }])

        // Update VIP level if needed
        await this.updateVipLevel()

        return { success: true, newBalance }
      } catch (error) {
        console.error('Error updating balance:', error)
        return { success: false, error: error.message }
      }
    },

    async performQuantification() {
      if (!this.currentUser) return { success: false, error: 'User not found' }

      if (this.currentUser.signals_available <= 0) {
        return { success: false, error: 'No signals available' }
      }

      try {
        const vipLevel = this.currentUser.vip_level
        const dailyPercent = await this.getVipPercent(vipLevel)
        const profitPerSignal = (this.currentUser.balance * (dailyPercent / 100)) / 3

        // Update balance
        const balanceResult = await this.updateBalance(profitPerSignal, 'quantification')
        if (!balanceResult.success) throw new Error(balanceResult.error)

        // Decrease signals
        const newSignals = this.currentUser.signals_available - 1
        const { error } = await supabase
          .from('users')
          .update({ signals_available: newSignals })
          .eq('id', this.currentUser.id)

        if (error) throw error

        this.currentUser.signals_available = newSignals
        localStorage.setItem('gly_user', JSON.stringify(this.currentUser))

        // Distribute referral profits
        await this.distributeReferralProfit(profitPerSignal)

        return {
          success: true,
          profit: profitPerSignal,
          signals_left: newSignals
        }
      } catch (error) {
        console.error('Error performing quantification:', error)
        return { success: false, error: error.message }
      }
    },

    async getVipPercent(level) {
      const vipPercents = {
        1: 2.2,
        2: 2.8,
        3: 3.5,
        4: 4.0,
        5: 5.0,
        6: 6.0
      }
      return vipPercents[level] || 2.2
    },

    async distributeReferralProfit(profit) {
      if (!this.currentUser) return

      try {
        const referrals = await this.getReferralChain(this.currentUser.id)
        const levelPercents = { 1: 12, 2: 5, 3: 3 }

        for (const [level, referrerId] of Object.entries(referrals)) {
          if (referrerId) {
            const percent = levelPercents[level]
            const referralProfit = (profit * percent) / 100

            // Update referrer's balance
            const { data: userData } = await supabase
              .from('users')
              .select('balance')
              .eq('id', referrerId)
              .maybeSingle()

            if (userData) {
              const newBalance = userData.balance + referralProfit
              await supabase
                .from('users')
                .update({ balance: newBalance })
                .eq('id', referrerId)

              // Update referrer's VIP level
              await this.updateVipLevelForUser(referrerId)
            }

            // Create transaction for referrer
            await supabase
              .from('transactions')
              .insert([{
                user_id: referrerId,
                type: 'referral',
                amount: referralProfit,
                status: 'completed',
                description: `Referral bonus level ${level}`
              }])
          }
        }
      } catch (error) {
        console.error('Error distributing referral profit:', error)
      }
    },

    async getReferralChain(userId) {
      const chain = { 1: null, 2: null, 3: null }

      try {
        const { data: level1 } = await supabase
          .from('referrals')
          .select('referrer_id')
          .eq('referred_id', userId)
          .eq('level', 1)
          .maybeSingle()

        if (level1) {
          chain[1] = level1.referrer_id

          const { data: level2 } = await supabase
            .from('referrals')
            .select('referrer_id')
            .eq('referred_id', level1.referrer_id)
            .eq('level', 1)
            .maybeSingle()

          if (level2) {
            chain[2] = level2.referrer_id

            const { data: level3 } = await supabase
              .from('referrals')
              .select('referrer_id')
              .eq('referred_id', level2.referrer_id)
              .eq('level', 1)
              .maybeSingle()

            if (level3) {
              chain[3] = level3.referrer_id
            }
          }
        }
      } catch (error) {
        console.error('Error getting referral chain:', error)
      }

      return chain
    },

    async checkAndUpdateSignals() {
      if (!this.currentUser) return

      const now = new Date()
      const utcHour = now.getUTCHours()
      const utcMinute = now.getUTCMinutes()
      const today = now.toISOString().split('T')[0]
      const lastUpdate = this.currentUser.last_signal_update?.split('T')[0]

      if (today !== lastUpdate && (utcHour > 18 || (utcHour === 18 && utcMinute >= 0))) {
        try {
          const { error } = await supabase
            .from('users')
            .update({
              signals_available: 3,
              last_signal_update: now.toISOString()
            })
            .eq('id', this.currentUser.id)

          if (!error) {
            this.currentUser.signals_available = 3
            this.currentUser.last_signal_update = now.toISOString()
            localStorage.setItem('gly_user', JSON.stringify(this.currentUser))

            await this.updateVipLevel()
          }
        } catch (error) {
          console.error('Error updating signals:', error)
        }
      }
    },

    async updateVipLevel() {
      if (!this.currentUser) return

      try {
        const { data: referrals, error: refError } = await supabase
          .from('referrals')
          .select(`
            id,
            referred_id,
            referred:users!referred_id (
              balance
            )
          `)
          .eq('referrer_id', this.currentUser.id)
          .eq('level', 1)

        if (refError) throw refError

        const activeReferrals = referrals?.filter(ref =>
          ref.referred && ref.referred.balance >= 20
        ) || []

        const activeRefs = activeReferrals.length
        let newVipLevel = 1

        if (this.currentUser.balance >= 12000 && activeRefs >= 25) {
          newVipLevel = 6
        } else if (this.currentUser.balance >= 6000 && activeRefs >= 15) {
          newVipLevel = 5
        } else if (this.currentUser.balance >= 3500 && activeRefs >= 8) {
          newVipLevel = 4
        } else if (this.currentUser.balance >= 1000 && activeRefs >= 5) {
          newVipLevel = 3
        } else if (this.currentUser.balance >= 300 && activeRefs >= 2) {
          newVipLevel = 2
        }

        if (newVipLevel !== this.currentUser.vip_level) {
          const { error } = await supabase
            .from('users')
            .update({ vip_level: newVipLevel })
            .eq('id', this.currentUser.id)

          if (!error) {
            this.currentUser.vip_level = newVipLevel
            localStorage.setItem('gly_user', JSON.stringify(this.currentUser))
            return true
          }
        }
        return false
      } catch (error) {
        console.error('Error updating VIP level:', error)
        return false
      }
    },

    async updateVipLevelForUser(userId) {
      try {
        const { data: referrals, error: refError } = await supabase
          .from('referrals')
          .select(`
            id,
            referred_id,
            referred:users!referred_id (
              balance
            )
          `)
          .eq('referrer_id', userId)
          .eq('level', 1)

        if (refError) throw refError

        const activeReferrals = referrals?.filter(ref =>
          ref.referred && ref.referred.balance >= 20
        ) || []

        const activeRefs = activeReferrals.length

        const { data: user, error: userError } = await supabase
          .from('users')
          .select('balance, vip_level')
          .eq('id', userId)
          .maybeSingle()

        if (userError) throw userError

        let newVipLevel = 1

        if (user.balance >= 12000 && activeRefs >= 25) {
          newVipLevel = 6
        } else if (user.balance >= 6000 && activeRefs >= 15) {
          newVipLevel = 5
        } else if (user.balance >= 3500 && activeRefs >= 8) {
          newVipLevel = 4
        } else if (user.balance >= 1000 && activeRefs >= 5) {
          newVipLevel = 3
        } else if (user.balance >= 300 && activeRefs >= 2) {
          newVipLevel = 2
        }

        if (newVipLevel !== user.vip_level) {
          const { error } = await supabase
            .from('users')
            .update({ vip_level: newVipLevel })
            .eq('id', userId)

          if (!error) {
            // Update current user if it's the same user
            if (this.currentUser && this.currentUser.id === userId) {
              this.currentUser.vip_level = newVipLevel
              localStorage.setItem('gly_user', JSON.stringify(this.currentUser))
            }
            return true
          }
        }
        return false
      } catch (error) {
        console.error('Error updating VIP level for user:', error)
        return false
      }
    },

    async getActiveReferralsCount(userId) {
      try {
        const { data: referrals, error } = await supabase
          .from('referrals')
          .select(`
            id,
            referred_id,
            referred:users!referred_id (
              balance
            )
          `)
          .eq('referrer_id', userId)
          .eq('level', 1)

        if (error) throw error

        const activeReferrals = referrals?.filter(ref =>
          ref.referred && ref.referred.balance >= 20
        ) || []

        return activeReferrals.length
      } catch (error) {
        console.error('Error getting active referrals count:', error)
        return 0
      }
    },

    async updateUserData() {
      if (!this.currentUser) return

      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', this.currentUser.id)
          .maybeSingle()

        if (error) throw error

        if (data) {
          this.currentUser = data
          localStorage.setItem('gly_user', JSON.stringify(data))
          return true
        }
        return false
      } catch (error) {
        console.error('Error updating user data:', error)
        return false
      }
    },

    async changePassword(currentPassword, newPassword) {
      if (!this.currentUser) return { success: false, error: 'User not found' }

      if (this.currentUser.password !== currentPassword) {
        return { success: false, error: 'Current password is incorrect' }
      }

      try {
        const { error } = await supabase
          .from('users')
          .update({ password: newPassword })
          .eq('id', this.currentUser.id)

        if (error) throw error

        this.currentUser.password = newPassword
        localStorage.setItem('gly_user', JSON.stringify(this.currentUser))

        return { success: true }
      } catch (error) {
        console.error('Error changing password:', error)
        return { success: false, error: error.message }
      }
    },

    async setWithdrawalAddress(network, address) {
      if (!this.currentUser) return { success: false, error: 'User not found' }

      try {
        const updateData = {}
        if (network === 'TRC20') {
          updateData.withdrawal_address_trc20 = address
        } else if (network === 'BEP20') {
          updateData.withdrawal_address_bep20 = address
        }

        const { error } = await supabase
          .from('users')
          .update(updateData)
          .eq('id', this.currentUser.id)

        if (error) throw error

        Object.assign(this.currentUser, updateData)
        localStorage.setItem('gly_user', JSON.stringify(this.currentUser))

        return { success: true }
      } catch (error) {
        console.error('Error setting withdrawal address:', error)
        return { success: false, error: error.message }
      }
    },

    logout() {
      this.currentUser = null
      localStorage.removeItem('gly_user')
      localStorage.removeItem('gly_admin_session')
      this.error = null
    }
  }
})
