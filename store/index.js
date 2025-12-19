import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import supabase from '@/utils/supabase'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState({
    key: 'gly-app',
    paths: ['user', 'language', 'appVersion']
  })],
  
  state: {
    user: null,
    language: 'en',
    appVersion: '1.0.0',
    showModal: false,
    modalTitle: '',
    modalContent: '',
    modalOnConfirm: null,
    loading: false,
    loadingText: 'Loading...',
    currentSection: 'home',
    cryptoPrices: [],
    network: 'TRC20'
  },
  
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    
    SET_LANGUAGE(state, lang) {
      state.language = lang
      localStorage.setItem('gly_language', lang)
    },
    
    SHOW_MODAL(state, { title, content, onConfirm = null }) {
      state.showModal = true
      state.modalTitle = title
      state.modalContent = content
      state.modalOnConfirm = onConfirm
    },
    
    HIDE_MODAL(state) {
      state.showModal = false
      state.modalTitle = ''
      state.modalContent = ''
      state.modalOnConfirm = null
    },
    
    SHOW_LOADING(state, text = 'Loading...') {
      state.loading = true
      state.loadingText = text
    },
    
    HIDE_LOADING(state) {
      state.loading = false
      state.loadingText = 'Loading...'
    },
    
    SET_CRYPTO_PRICES(state, prices) {
      state.cryptoPrices = prices
    },
    
    SET_NETWORK(state, network) {
      state.network = network
    },
    
    SET_CURRENT_SECTION(state, section) {
      state.currentSection = section
    },
    
    UPDATE_USER_BALANCE(state, amount) {
      if (state.user) {
        state.user.balance += amount
      }
    },
    
    UPDATE_SIGNALS(state, signals) {
      if (state.user) {
        state.user.signals_available = signals
      }
    },
    
    UPDATE_VIP_LEVEL(state, level) {
      if (state.user) {
        state.user.vip_level = level
      }
    }
  },
  
  actions: {
    async initApp({ commit, state }) {
      // Загрузка языка
      const savedLang = localStorage.getItem('gly_language') || 'en'
      commit('SET_LANGUAGE', savedLang)
      
      // Проверка авторизации
      const userData = localStorage.getItem('gly_user')
      if (userData) {
        try {
          const user = JSON.parse(userData)
          commit('SET_USER', user)
          
          // Обновление данных пользователя из базы
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single()
            
          if (!error && data) {
            commit('SET_USER', data)
            localStorage.setItem('gly_user', JSON.stringify(data))
          }
        } catch (error) {
          console.error('Error loading user:', error)
        }
      }
      
      // Начальная загрузка крипто цен
      await this.dispatch('loadCryptoPrices')
    },
    
    async login({ commit }, { username, password }) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('username', username)
          .single()
          
        if (error) throw new Error('User not found')
        if (data.password !== password) throw new Error('Invalid password')
        
        commit('SET_USER', data)
        localStorage.setItem('gly_user', JSON.stringify(data))
        
        return { success: true, user: data }
      } catch (error) {
        return { success: false, message: error.message }
      }
    },
    
    async register({ commit, dispatch }, userData) {
      try {
        // Проверка существующего пользователя
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('username', userData.username)
          .single()
          
        if (existingUser) {
          throw new Error('Username already exists')
        }
        
        // Проверка инвайт кода
        const { data: referrer } = await supabase
          .from('users')
          .select('id, invite_code')
          .eq('invite_code', userData.invite_code)
          .single()
          
        if (!referrer) {
          throw new Error('Invalid invitation code')
        }
        
        // Создание пользователя
        const userId = window.GLY.generateUserId()
        const userInviteCode = window.GLY.generateInviteCode()
        
        const newUser = {
          id: userId,
          username: userData.username,
          email: userData.email,
          password: userData.password,
          payment_password: userData.payment_password,
          invite_code: userInviteCode,
          referred_by: userData.invite_code,
          balance: 3.00,
          vip_level: 1,
          signals_available: 3,
          last_signal_update: new Date().toISOString(),
          created_at: new Date().toISOString()
        }
        
        const { error: insertError } = await supabase
          .from('users')
          .insert([newUser])
          
        if (insertError) throw insertError
        
        // Создание реферальных записей
        await dispatch('createReferralRecords', {
          referrerId: referrer.id,
          userId: userId
        })
        
        // Бонус за регистрацию
        await supabase
          .from('transactions')
          .insert([{
            user_id: userId,
            type: 'registration_bonus',
            amount: 3.00,
            status: 'completed',
            description: 'Registration bonus'
          }])
        
        commit('SET_USER', newUser)
        localStorage.setItem('gly_user', JSON.stringify(newUser))
        
        return { success: true, user: newUser }
      } catch (error) {
        return { success: false, message: error.message }
      }
    },
    
    async createReferralRecords({ state }, { referrerId, userId }) {
      try {
        // Level 1
        await supabase
          .from('referrals')
          .insert([{
            referrer_id: referrerId,
            referred_id: userId,
            level: 1
          }])
        
        // Level 2
        const { data: level2Referrer } = await supabase
          .from('referrals')
          .select('referrer_id')
          .eq('referred_id', referrerId)
          .eq('level', 1)
          .single()
          
        if (level2Referrer) {
          await supabase
            .from('referrals')
            .insert([{
              referrer_id: level2Referrer.referrer_id,
              referred_id: userId,
              level: 2
            }])
          
          // Level 3
          const { data: level3Referrer } = await supabase
            .from('referrals')
            .select('referrer_id')
            .eq('referred_id', level2Referrer.referrer_id)
            .eq('level', 1)
            .single()
            
          if (level3Referrer) {
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
    
    async performQuantification({ commit, state }) {
      if (!state.user) {
        return { success: false, message: 'User not found' }
      }
      
      if (state.user.signals_available <= 0) {
        return { success: false, message: 'No signals available' }
      }
      
      try {
        const vipLevel = state.user.vip_level
        const vipPercents = {
          1: 2.2,
          2: 2.8,
          3: 3.5,
          4: 4.0,
          5: 5.0,
          6: 6.0
        }
        
        const dailyPercent = vipPercents[vipLevel] || 2.2
        const profitPerSignal = (state.user.balance * (dailyPercent / 100)) / 3
        
        // Обновление баланса
        const newBalance = state.user.balance + profitPerSignal
        const { error: updateError } = await supabase
          .from('users')
          .update({ balance: newBalance })
          .eq('id', state.user.id)
          
        if (updateError) throw updateError
        
        // Уменьшение сигналов
        const newSignals = state.user.signals_available - 1
        const { error: signalError } = await supabase
          .from('users')
          .update({ signals_available: newSignals })
          .eq('id', state.user.id)
          
        if (signalError) throw signalError
        
        // Обновление состояния
        commit('UPDATE_USER_BALANCE', profitPerSignal)
        commit('UPDATE_SIGNALS', newSignals)
        
        // Транзакция
        await supabase
          .from('transactions')
          .insert([{
            user_id: state.user.id,
            type: 'quantification',
            amount: profitPerSignal,
            status: 'completed',
            description: `Quantification profit +${profitPerSignal.toFixed(2)} USDT`
          }])
        
        // Распределение реферального дохода
        await this.dispatch('distributeReferralProfit', profitPerSignal)
        
        return {
          success: true,
          profit: profitPerSignal,
          signals_left: newSignals
        }
      } catch (error) {
        return { success: false, message: error.message }
      }
    },
    
    async distributeReferralProfit({ state }, profit) {
      try {
        const referrals = await this.dispatch('getReferralChain', state.user.id)
        const levelPercents = { 1: 12, 2: 5, 3: 3 }
        
        for (const [level, referrerId] of Object.entries(referrals)) {
          if (referrerId) {
            const percent = levelPercents[level]
            const referralProfit = (profit * percent) / 100
            
            // Обновление баланса реферера
            const { data: referrer } = await supabase
              .from('users')
              .select('balance')
              .eq('id', referrerId)
              .single()
              
            if (referrer) {
              const newBalance = referrer.balance + referralProfit
              await supabase
                .from('users')
                .update({ balance: newBalance })
                .eq('id', referrerId)
            }
            
            // Транзакция
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
    
    async getReferralChain({ state }, userId) {
      const chain = { 1: null, 2: null, 3: null }
      
      try {
        // Level 1
        const { data: level1 } = await supabase
          .from('referrals')
          .select('referrer_id')
          .eq('referred_id', userId)
          .eq('level', 1)
          .single()
          
        if (level1) {
          chain[1] = level1.referrer_id
          
          // Level 2
          const { data: level2 } = await supabase
            .from('referrals')
            .select('referrer_id')
            .eq('referred_id', level1.referrer_id)
            .eq('level', 1)
            .single()
            
          if (level2) {
            chain[2] = level2.referrer_id
            
            // Level 3
            const { data: level3 } = await supabase
              .from('referrals')
              .select('referrer_id')
              .eq('referred_id', level2.referrer_id)
              .eq('level', 1)
              .single()
              
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
    
    async updateVipLevel({ commit, state }) {
      if (!state.user) return
      
      try {
        const { data: referrals, error: refError } = await supabase
          .from('referrals')
          .select(`
            id,
            referred_id,
            referred:users!referred_id (
              id,
              username,
              balance
            )
          `)
          .eq('referrer_id', state.user.id)
          .eq('level', 1)
          
        if (refError) throw refError
        
        const activeReferrals = referrals?.filter(ref => 
          ref.referred && ref.referred.balance >= 20
        ) || []
        
        const activeRefs = activeReferrals.length
        let newVipLevel = 1
        
        if (state.user.balance >= 12000 && activeRefs >= 25) {
          newVipLevel = 6
        } else if (state.user.balance >= 6000 && activeRefs >= 15) {
          newVipLevel = 5
        } else if (state.user.balance >= 3500 && activeRefs >= 8) {
          newVipLevel = 4
        } else if (state.user.balance >= 1000 && activeRefs >= 5) {
          newVipLevel = 3
        } else if (state.user.balance >= 300 && activeRefs >= 2) {
          newVipLevel = 2
        }
        
        if (newVipLevel !== state.user.vip_level) {
          const { error } = await supabase
            .from('users')
            .update({ vip_level: newVipLevel })
            .eq('id', state.user.id)
            
          if (!error) {
            commit('UPDATE_VIP_LEVEL', newVipLevel)
            
            // Обновление localStorage
            const updatedUser = { ...state.user, vip_level: newVipLevel }
            localStorage.setItem('gly_user', JSON.stringify(updatedUser))
          }
        }
      } catch (error) {
        console.error('Error updating VIP level:', error)
      }
    },
    
    async loadCryptoPrices({ commit }) {
      try {
        const symbols = 'BTCUSDT,ETHUSDT,BNBUSDT,XRPUSDT,ADAUSDT,SOLUSDT,DOTUSDT,DOGEUSDT'
        const response = await fetch(
          `https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(JSON.stringify(symbols.split(',')))}`
        )
        
        if (!response.ok) throw new Error('API error')
        
        const data = await response.json()
        
        const cryptoMapping = {
          'BTCUSDT': { symbol: 'BTC', name: 'Bitcoin', icon: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' },
          'ETHUSDT': { symbol: 'ETH', name: 'Ethereum', icon: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
          'BNBUSDT': { symbol: 'BNB', name: 'Binance Coin', icon: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png' },
          'XRPUSDT': { symbol: 'XRP', name: 'Ripple', icon: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png' },
          'ADAUSDT': { symbol: 'ADA', name: 'Cardano', icon: 'https://assets.coingecko.com/coins/images/975/small/cardano.png' },
          'SOLUSDT': { symbol: 'SOL', name: 'Solana', icon: 'https://assets.coingecko.com/coins/images/4128/small/solana.png' },
          'DOTUSDT': { symbol: 'DOT', name: 'Polkadot', icon: 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png' },
          'DOGEUSDT': { symbol: 'DOGE', name: 'Dogecoin', icon: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png' }
        }
        
        const formattedPrices = data.map(item => {
          const mapping = cryptoMapping[item.symbol]
          return {
            ...mapping,
            price: parseFloat(item.lastPrice),
            change: parseFloat(item.priceChangePercent)
          }
        })
        
        commit('SET_CRYPTO_PRICES', formattedPrices)
      } catch (error) {
        console.error('Error loading crypto prices:', error)
      }
    },
    
    logout({ commit }) {
      commit('SET_USER', null)
      localStorage.removeItem('gly_user')
      localStorage.removeItem('gly_admin_session')
    }
  },
  
  getters: {
    isAuthenticated: state => !!state.user,
    currentUser: state => state.user,
    cryptoPrices: state => state.cryptoPrices,
    currentLanguage: state => state.language,
    currentNetwork: state => state.network,
    formattedBalance: state => state.user ? state.user.balance.toFixed(2) : '0.00'
  }
})
