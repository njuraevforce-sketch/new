import { defineStore } from 'pinia'
import { supabase } from '../utils/supabase'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(JSON.parse(localStorage.getItem('gly_user')) || null)
  const balance = ref(0)
  const signals = ref(0)
  const vipLevel = ref(1)

  const isAuthenticated = computed(() => user.value !== null)

  function setUser(userData) {
    user.value = userData
    localStorage.setItem('gly_user', JSON.stringify(userData))
  }

  function logout() {
    user.value = null
    localStorage.removeItem('gly_user')
  }

  async function updateBalance(amount, type = 'deposit') {
    if (!user.value) return false
    
    try {
      const newBalance = user.value.balance + amount
      
      const { error } = await supabase
        .from('users')
        .update({ balance: newBalance })
        .eq('id', user.value.id)
        
      if (error) throw error
      
      user.value.balance = newBalance
      localStorage.setItem('gly_user', JSON.stringify(user.value))
      
      // Create transaction
      await supabase.from('transactions').insert([{
        user_id: user.value.id,
        type: type,
        amount: amount,
        status: 'completed',
        description: `${type} ${amount > 0 ? '+' : ''}${amount} USDT`
      }])
      
      return true
    } catch (error) {
      console.error('Error updating balance:', error)
      return false
    }
  }

  return {
    user,
    balance,
    signals,
    vipLevel,
    isAuthenticated,
    setUser,
    logout,
    updateBalance
  }
})
