import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../utils/supabase'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const isLoggedIn = computed(() => !!user.value)
  const userId = computed(() => user.value?.id)
  const username = computed(() => user.value?.username)
  const balance = computed(() => user.value?.balance || 0)
  const vipLevel = computed(() => user.value?.vip_level || 1)
  const signalsAvailable = computed(() => user.value?.signals_available || 0)

  async function login(username, password) {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single()

      if (supabaseError) throw supabaseError
      if (!data) throw new Error('User not found')
      if (data.password !== password) throw new Error('Invalid password')

      user.value = data
      localStorage.setItem('gly_user', JSON.stringify(data))
      return { success: true, data }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function register(userData) {
    loading.value = true
    error.value = null
    
    try {
      // Генерация ID и кода приглашения
      const userId = 'GLY' + Math.random().toString(36).substr(2, 9).toUpperCase()
      const inviteCode = Math.random().toString(36).substr(2, 8).toUpperCase()

      const newUser = {
        id: userId,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        payment_password: userData.paymentPassword,
        invite_code: inviteCode,
        referred_by: userData.inviteCode,
        balance: 3.00,
        vip_level: 1,
        signals_available: 3,
        last_signal_update: new Date().toISOString(),
        created_at: new Date().toISOString()
      }

      const { data, error: supabaseError } = await supabase
        .from('users')
        .insert([newUser])
        .select()
        .single()

      if (supabaseError) throw supabaseError

      user.value = data
      localStorage.setItem('gly_user', JSON.stringify(data))
      
      // Создаем реферальные записи
      await createReferralRecords(userData.inviteCode, userId)
      
      // Создаем транзакцию для бонуса
      await supabase
        .from('transactions')
        .insert([{
          user_id: userId,
          type: 'registration_bonus',
          amount: 3.00,
          status: 'completed',
          description: 'Registration bonus'
        }])

      return { success: true, data }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    user.value = null
    localStorage.removeItem('gly_user')
  }

  async function updateBalance(amount, type = 'deposit') {
    if (!user.value) return false
    
    try {
      const newBalance = user.value.balance + amount
      
      const { error: updateError } = await supabase
        .from('users')
        .update({ balance: newBalance })
        .eq('id', user.value.id)

      if (updateError) throw updateError

      user.value.balance = newBalance
      localStorage.setItem('gly_user', JSON.stringify(user.value))

      // Создаем запись транзакции
      await supabase
        .from('transactions')
        .insert([{
          user_id: user.value.id,
          type: type,
          amount: amount,
          status: 'completed',
          description: `${type} ${amount} USDT`
        }])

      return true
    } catch (err) {
      console.error('Error updating balance:', err)
      return false
    }
  }

  async function updateVipLevel() {
    if (!user.value) return
    
    try {
      // Получаем активные рефералы (баланс ≥ 20 USDT)
      const { data: referrals, error: refError } = await supabase
        .from('referrals')
        .select(`
          id,
          referred_id,
          referred:users!referred_id (
            balance
          )
        `)
        .eq('referrer_id', user.value.id)
        .eq('level', 1)

      if (refError) throw refError

      const activeReferrals = referrals?.filter(ref => 
        ref.referred && ref.referred.balance >= 20
      ) || []

      const activeRefs = activeReferrals.length
      const userBalance = user.value.balance
      let newVipLevel = 1

      // Логика обновления VIP уровня
      if (userBalance >= 12000 && activeRefs >= 25) {
        newVipLevel = 6
      } else if (userBalance >= 6000 && activeRefs >= 15) {
        newVipLevel = 5
      } else if (userBalance >= 3500 && activeRefs >= 8) {
        newVipLevel = 4
      } else if (userBalance >= 1000 && activeRefs >= 5) {
        newVipLevel = 3
      } else if (userBalance >= 300 && activeRefs >= 2) {
        newVipLevel = 2
      }

      if (newVipLevel !== user.value.vip_level) {
        const { error: updateError } = await supabase
          .from('users')
          .update({ vip_level: newVipLevel })
          .eq('id', user.value.id)

        if (!updateError) {
          user.value.vip_level = newVipLevel
          localStorage.setItem('gly_user', JSON.stringify(user.value))
        }
      }
    } catch (err) {
      console.error('Error updating VIP level:', err)
    }
  }

  async function createReferralRecords(inviteCode, userId) {
    try {
      // Находим реферера
      const { data: referrer, error: refError } = await supabase
        .from('users')
        .select('id')
        .eq('invite_code', inviteCode)
        .single()

      if (refError || !referrer) return

      // Уровень 1
      await supabase
        .from('referrals')
        .insert([{
          referrer_id: referrer.id,
          referred_id: userId,
          level: 1
        }])

      // Находим реферера 2 уровня
      const { data: level2Referrer } = await supabase
        .from('referrals')
        .select('referrer_id')
        .eq('referred_id', referrer.id)
        .eq('level', 1)
        .single()

      if (level2Referrer) {
        // Уровень 2
        await supabase
          .from('referrals')
          .insert([{
            referrer_id: level2Referrer.referrer_id,
            referred_id: userId,
            level: 2
          }])

        // Находим реферера 3 уровня
        const { data: level3Referrer } = await supabase
          .from('referrals')
          .select('referrer_id')
          .eq('referred_id', level2Referrer.referrer_id)
          .eq('level', 1)
          .single()

        if (level3Referrer) {
          // Уровень 3
          await supabase
            .from('referrals')
            .insert([{
              referrer_id: level3Referrer.referrer_id,
              referred_id: userId,
              level: 3
            }])
        }
      }
    } catch (err) {
      console.error('Error creating referral records:', err)
    }
  }

  // Загрузка пользователя из localStorage
  function loadFromStorage() {
    const storedUser = localStorage.getItem('gly_user')
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch (err) {
        console.error('Error parsing stored user:', err)
        localStorage.removeItem('gly_user')
      }
    }
  }

  // Инициализация
  loadFromStorage()

  return {
    user,
    loading,
    error,
    isLoggedIn,
    userId,
    username,
    balance,
    vipLevel,
    signalsAvailable,
    login,
    register,
    logout,
    updateBalance,
    updateVipLevel
  }
})
