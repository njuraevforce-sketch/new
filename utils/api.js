import { supabase } from './supabase'

export async function performQuantification(userId) {
  try {
    // Получаем данные пользователя
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError || !user) throw new Error('User not found')

    if (user.signals_available <= 0) {
      return { success: false, message: 'No signals available' }
    }

    // Процент в зависимости от VIP уровня
    const vipPercents = {
      1: 2.2,
      2: 2.8,
      3: 3.5,
      4: 4.0,
      5: 5.0,
      6: 6.0
    }
    
    const dailyPercent = vipPercents[user.vip_level] || 2.2
    const profitPerSignal = (user.balance * (dailyPercent / 100)) / 3

    // Обновляем баланс
    const newBalance = user.balance + profitPerSignal
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        balance: newBalance,
        signals_available: user.signals_available - 1
      })
      .eq('id', userId)

    if (updateError) throw updateError

    // Создаем запись транзакции
    await supabase
      .from('transactions')
      .insert([{
        user_id: userId,
        type: 'quantification',
        amount: profitPerSignal,
        status: 'completed',
        description: `Quantum quantification profit: ${profitPerSignal.toFixed(2)} USDT`
      }])

    // Распределяем реферальную прибыль
    await distributeReferralProfit(userId, profitPerSignal)

    return { 
      success: true, 
      profit: profitPerSignal,
      signals_left: user.signals_available - 1
    }
  } catch (error) {
    console.error('Error performing quantification:', error)
    return { success: false, message: error.message }
  }
}

async function distributeReferralProfit(userId, profit) {
  try {
    // Находим реферальную цепочку
    const referrals = await getReferralChain(userId)
    
    // Проценты для каждого уровня
    const levelPercents = { 1: 12, 2: 5, 3: 3 }
    
    for (const [level, referrerId] of Object.entries(referrals)) {
      if (referrerId) {
        const percent = levelPercents[level]
        const referralProfit = (profit * percent) / 100
        
        // Обновляем баланс реферера
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
        
        // Создаем запись транзакции
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
}

async function getReferralChain(userId) {
  const chain = { 1: null, 2: null, 3: null }
  
  try {
    // Уровень 1
    const { data: level1 } = await supabase
      .from('referrals')
      .select('referrer_id')
      .eq('referred_id', userId)
      .eq('level', 1)
      .single()
    
    if (level1) {
      chain[1] = level1.referrer_id
      
      // Уровень 2
      const { data: level2 } = await supabase
        .from('referrals')
        .select('referrer_id')
        .eq('referred_id', level1.referrer_id)
        .eq('level', 1)
        .single()
      
      if (level2) {
        chain[2] = level2.referrer_id
        
        // Уровень 3
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
}

export async function getTransactionHistory(userId) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)
    
    if (error) throw error
    
    return { success: true, data }
  } catch (error) {
    console.error('Error getting transaction history:', error)
    return { success: false, error: error.message }
  }
}

export async function updateWithdrawalAddress(userId, address, network) {
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
      .eq('id', userId)
    
    if (error) throw error
    
    return { success: true }
  } catch (error) {
    console.error('Error updating withdrawal address:', error)
    return { success: false, error: error.message }
  }
}
