// src/store/index.js
import Vue from 'vue'
import Vuex from 'vuex'
import { createClient } from '@supabase/supabase-js'

Vue.use(Vuex)

const supabaseUrl = 'https://jxyazsguwkbklavamzyj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4eWF6c2d1d2tia2xhdmFtenlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NTI4MzMsImV4cCI6MjA4MDEyODgzM30.0udmTyDCvUrhhVDfQy4enClH7Cxif7gaX_V6RTZysAI'

export default new Vuex.Store({
  state: {
    user: null,
    supabase: null,
    activeTab: 'home',
    showNavbar: true,
    showTabbar: true,
    showBackButton: false,
    navbarTitle: '',
    language: 'en'
  },
  
  mutations: {
    SET_USER(state, user) {
      state.user = user
      if (user) {
        localStorage.setItem('gly_user', JSON.stringify(user))
      } else {
        localStorage.removeItem('gly_user')
      }
    },
    
    SET_SUPABASE(state, client) {
      state.supabase = client
      window.supabase = client
    },
    
    SET_ACTIVE_TAB(state, tab) {
      state.activeTab = tab
    },
    
    SET_NAVBAR_VISIBILITY(state, visible) {
      state.showNavbar = visible
    },
    
    SET_TABBAR_VISIBILITY(state, visible) {
      state.showTabbar = visible
    },
    
    SET_BACK_BUTTON(state, visible) {
      state.showBackButton = visible
    },
    
    SET_NAVBAR_TITLE(state, title) {
      state.navbarTitle = title
    },
    
    SET_LANGUAGE(state, lang) {
      state.language = lang
      localStorage.setItem('gly_language', lang)
    }
  },
  
  actions: {
    initApp({ commit, dispatch }) {
      // Initialize Supabase
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      })
      
      commit('SET_SUPABASE', supabase)
      
      // Load user from localStorage
      const storedUser = localStorage.getItem('gly_user')
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser)
          commit('SET_USER', user)
        } catch (e) {
          console.error('Error parsing stored user:', e)
          localStorage.removeItem('gly_user')
        }
      }
      
      // Load language
      const savedLang = localStorage.getItem('gly_language') || 'en'
      commit('SET_LANGUAGE', savedLang)
      
      // Start background tasks
      dispatch('startBackgroundTasks')
    },
    
    async login({ commit, state }, { username, password }) {
      try {
        const { data, error } = await state.supabase
          .from('users')
          .select('*')
          .eq('username', username)
          .single()
          
        if (error) throw error
        if (!data) throw new Error('User not found')
        if (data.password !== password) throw new Error('Invalid password')
        
        commit('SET_USER', data)
        return { success: true, user: data }
      } catch (error) {
        return { success: false, message: error.message }
      }
    },
    
    async register({ commit, state }, userData) {
      try {
        // Check if username exists
        const { data: existingUser } = await state.supabase
          .from('users')
          .select('id')
          .eq('username', userData.username)
          .single()
          
        if (existingUser) {
          throw new Error('Username already exists')
        }
        
        // Check invitation code
        const { data: referrer } = await state.supabase
          .from('users')
          .select('id, invite_code')
          .eq('invite_code', userData.inviteCode)
          .single()
          
        if (!referrer) {
          throw new Error('Invalid invitation code')
        }
        
        // Generate user ID and invite code
        const userId = 'GLY' + Math.random().toString(36).substr(2, 9).toUpperCase()
        const userInviteCode = Math.random().toString(36).substr(2, 8).toUpperCase()
        
        const newUser = {
          id: userId,
          username: userData.username,
          email: userData.email,
          password: userData.password,
          payment_password: userData.paymentPassword,
          invite_code: userInviteCode,
          referred_by: userData.inviteCode,
          balance: 3.00,
          vip_level: 1,
          signals_available: 3,
          last_signal_update: new Date().toISOString(),
          created_at: new Date().toISOString()
        }
        
        // Save to database
        const { error } = await state.supabase
          .from('users')
          .insert([newUser])
          
        if (error) throw error
        
        // Create referral records
        await createReferralRecords(referrer.id, userId)
        
        // Create transaction for bonus
        await state.supabase
          .from('transactions')
          .insert([{
            user_id: userId,
            type: 'registration_bonus',
            amount: 3.00,
            status: 'completed',
            description: 'Registration bonus'
          }])
        
        commit('SET_USER', newUser)
        return { success: true, user: newUser }
      } catch (error) {
        return { success: false, message: error.message }
      }
    },
    
    logout({ commit }) {
      commit('SET_USER', null)
      localStorage.removeItem('gly_user')
    },
    
    async updateUserBalance({ state, commit }, { amount, type }) {
      try {
        const newBalance = state.user.balance + amount
        
        const { error } = await state.supabase
          .from('users')
          .update({ balance: newBalance })
          .eq('id', state.user.id)
          
        if (error) throw error
        
        // Update local user
        const updatedUser = { ...state.user, balance: newBalance }
        commit('SET_USER', updatedUser)
        
        // Create transaction
        await state.supabase
          .from('transactions')
          .insert([{
            user_id: state.user.id,
            type: type,
            amount: amount,
            status: 'completed',
            description: `${type.charAt(0).toUpperCase() + type.slice(1)} ${amount > 0 ? '+' : ''}${amount} USDT`
          }])
        
        return { success: true }
      } catch (error) {
        return { success: false, message: error.message }
      }
    },
    
    async performQuantification({ state, commit, dispatch }) {
      if (!state.user) {
        return { success: false, message: 'User not found' }
      }
      
      if (state.user.signals_available <= 0) {
        return { success: false, message: 'No signals available' }
      }
      
      try {
        const vipPercent = await dispatch('getVipPercent', state.user.vip_level)
        const profitPerSignal = (state.user.balance * (vipPercent / 100)) / 3
        
        // Update balance
        await dispatch('updateUserBalance', {
          amount: profitPerSignal,
          type: 'quantification'
        })
        
        // Decrease signal count
        const newSignals = state.user.signals_available - 1
        const { error } = await state.supabase
          .from('users')
          .update({ signals_available: newSignals })
          .eq('id', state.user.id)
          
        if (error) throw error
        
        // Update local user
        const updatedUser = { ...state.user, signals_available: newSignals }
        commit('SET_USER', updatedUser)
        
        // Distribute referral profits
        await dispatch('distributeReferralProfit', profitPerSignal)
        
        return {
          success: true,
          profit: profitPerSignal,
          signals_left: newSignals
        }
      } catch (error) {
        return { success: false, message: error.message }
      }
    },
    
    async getVipPercent({ state }, level) {
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
    
    async distributeReferralProfit({ state }, profit) {
      // Implementation of referral profit distribution
      // Similar to original logic
    },
    
    async checkAndUpdateSignals({ state, commit }) {
      if (!state.user) return
      
      const now = new Date()
      const utcHour = now.getUTCHours()
      const today = now.toISOString().split('T')[0]
     const lastUpdate = state.user.last_signal_update && state.user.last_signal_update.split('T')[0]
      
      if (today !== lastUpdate && utcHour >= 18) {
        try {
          const { error } = await state.supabase
            .from('users')
            .update({
              signals_available: 3,
              last_signal_update: now.toISOString()
            })
            .eq('id', state.user.id)
            
          if (!error) {
            const updatedUser = {
              ...state.user,
              signals_available: 3,
              last_signal_update: now.toISOString()
            }
            commit('SET_USER', updatedUser)
          }
        } catch (error) {
          console.error('Error updating signals:', error)
        }
      }
    },
    
    startBackgroundTasks({ dispatch }) {
      // Check signals every minute
      setInterval(() => {
        dispatch('checkAndUpdateSignals')
      }, 60000)
      
      // Check deposits every 30 seconds
      setInterval(() => {
        dispatch('checkForNewDeposits')
      }, 30000)
    },
    
    async checkForNewDeposits({ state, commit }) {
      if (!state.user) return
      
      try {
        const { data: pendingDeposits, error } = await state.supabase
          .from('deposit_transactions')
          .select('*')
          .eq('user_id', state.user.id)
          .eq('status', 'confirmed')
          
        if (error) throw error
        
        if (pendingDeposits && pendingDeposits.length > 0) {
          for (const deposit of pendingDeposits) {
            await dispatch('processAutoDeposit', deposit)
          }
        }
      } catch (error) {
        console.error('Error checking for new deposits:', error)
      }
    },
    
    async processAutoDeposit({ state, commit, dispatch }, deposit) {
      try {
        const newBalance = state.user.balance + deposit.amount
        
        const { error: updateError } = await state.supabase
          .from('users')
          .update({ balance: newBalance })
          .eq('id', deposit.user_id)
          
        if (updateError) throw updateError
        
        const { error: depositError } = await state.supabase
          .from('deposit_transactions')
          .update({ status: 'processed' })
          .eq('id', deposit.id)
          
        if (depositError) throw depositError
        
        await state.supabase
          .from('transactions')
          .insert([{
            user_id: deposit.user_id,
            type: 'deposit',
            amount: deposit.amount,
            status: 'completed',
            description: `Auto deposit ${deposit.amount} USDT (${deposit.network})`,
            network: deposit.network
          }])
        
        // Update local user
        const updatedUser = { ...state.user, balance: newBalance }
        commit('SET_USER', updatedUser)
        
      } catch (error) {
        console.error('Error processing auto deposit:', error)
      }
    },
    
    async updateVipLevel({ state, commit }) {
      if (!state.user) return
      
      try {
        // Similar logic to original updateVipLevel
        // Calculate based on balance and active referrals
        
        // This is a simplified version - implement full logic from original
        let newVipLevel = 1
        
        if (state.user.balance >= 300) {
          newVipLevel = 2
        }
        if (state.user.balance >= 1000) {
          newVipLevel = 3
        }
        // Add more conditions as in original
        
        if (newVipLevel !== state.user.vip_level) {
          const { error } = await state.supabase
            .from('users')
            .update({ vip_level: newVipLevel })
            .eq('id', state.user.id)
            
          if (!error) {
            const updatedUser = { ...state.user, vip_level: newVipLevel }
            commit('SET_USER', updatedUser)
          }
        }
      } catch (error) {
        console.error('Error updating VIP level:', error)
      }
    }
  },
  
  getters: {
    isAuthenticated: state => !!state.user,
    currentUser: state => state.user,
    currentLanguage: state => state.language
  }
})

async function createReferralRecords(referrerId, userId) {
  // Implementation of referral chain creation
  // Similar to original logic
}
