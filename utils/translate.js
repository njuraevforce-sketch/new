// Translation system for GLY Platform

const translations = {
  en: {
    // Common
    app_name: 'GLY Platform',
    welcome: 'Welcome',
    welcome_to_gly: 'Welcome to GLY',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    close: 'Close',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    update: 'Update',
    copy: 'Copy',
    copied: 'Copied',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    refresh: 'Refresh',
    share: 'Share',
    download: 'Download',
    upload: 'Upload',
    select: 'Select',
    selected: 'Selected',
    all: 'All',
    none: 'None',
    apply: 'Apply',
    reset: 'Reset',
    submit: 'Submit',
    send: 'Send',
    receive: 'Receive',
    buy: 'Buy',
    sell: 'Sell',
    deposit: 'Deposit',
    withdraw: 'Withdraw',
    balance: 'Balance',
    amount: 'Amount',
    currency: 'Currency',
    price: 'Price',
    total: 'Total',
    fee: 'Fee',
    net: 'Net',
    status: 'Status',
    date: 'Date',
    time: 'Time',
    description: 'Description',
    details: 'Details',
    history: 'History',
    settings: 'Settings',
    profile: 'Profile',
    logout: 'Logout',
    login: 'Login',
    register: 'Register',
    username: 'Username',
    password: 'Password',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    city: 'City',
    country: 'Country',
    zip_code: 'Zip Code',
    save_changes: 'Save Changes',
    changes_saved: 'Changes saved',
    save_success: 'Save successful',
    save_error: 'Save failed',
    delete_confirm: 'Confirm deletion',
    delete_success: 'Delete successful',
    delete_error: 'Delete failed',
    
    // Navigation
    home: 'Home',
    get: 'Get',
    assets: 'Assets',
    mine: 'Mine',
    company: 'Company',
    invite: 'Invite',
    team: 'Team',
    rules: 'Rules',
    admin_panel: 'Admin Panel',
    
    // Authentication
    welcome_back: 'Welcome back',
    login_to_account: 'Login to your account',
    remember_me: 'Remember me',
    forgot_password: 'Forgot password?',
    no_account: "Don't have an account?",
    register_now: 'Register now',
    have_account: 'Already have an account?',
    login_now: 'Login now',
    registration_success: 'Registration successful',
    login_success: 'Login successful',
    logout_success: 'Logout successful',
    invalid_credentials: 'Invalid username or password',
    username_required: 'Username is required',
    password_required: 'Password is required',
    email_required: 'Email is required',
    email_invalid: 'Invalid email format',
    password_min_length: 'Password must be at least 6 characters',
    password_mismatch: 'Passwords do not match',
    terms_agree: 'I agree to the terms and conditions',
    terms_required: 'You must agree to the terms',
    
    // Home Page
    live_crypto_prices: 'Live Crypto Prices',
    updating: 'Updating...',
    updated: 'Updated',
    cached_data: 'Cached data',
    offline: 'Offline',
    our_partners: 'Our Partners',
    welcome_bonus_title: 'Welcome Bonus',
    welcome_bonus_message: 'Get bonus on your first deposit:',
    
    // Get Page
    auto_quantification: 'AUTO QUANTIFICATION',
    quantum_signals_available: 'Quantum signals available',
    no_signals: 'No signals available',
    processing_quantification: 'Processing quantification...',
    analyzing_market: 'Analyzing market conditions...',
    calculating_quantum: 'Calculating quantum probabilities...',
    executing_trades: 'Executing quantum trades...',
    quantum_complete: 'Quantum quantification complete!',
    profit: 'Profit',
    quantification_successful: 'Quantification successful! Profit: +{profit} USDT',
    please_login: 'Please login first',
    user_not_found: 'User not found',
    server_error: 'Server error',
    
    // VIP Levels
    vip_levels: 'VIP Levels',
    vip_description_1: 'Basic VIP level with minimum requirements',
    vip_description_2: 'Increased returns for active users',
    vip_description_3: 'Premium level for serious investors',
    vip_description_4: 'Advanced level with higher returns',
    vip_description_5: 'Elite level for professional investors',
    vip_description_6: 'Maximum VIP level with highest returns',
    unlocked: 'Unlocked',
    locked: 'Locked',
    daily_percent: 'Daily Percent',
    deposit_range: 'Deposit Range',
    signals_count: 'Signals',
    referrals_required: 'Referrals Required',
    
    // Assets Page
    total_balance: 'Total Balance',
    transaction_history: 'Transaction History',
    total_earned: 'Total Earned',
    total_deposits: 'Total Deposits',
    total_withdrawals: 'Total Withdrawals',
    referral_income: 'Referral Income',
    no_transactions: 'No transactions yet',
    error_loading: 'Error loading data',
    
    // Transaction Types
    transaction_type_deposit: 'Deposit',
    transaction_type_withdrawal: 'Withdrawal',
    transaction_type_quantification: 'Quantification',
    transaction_type_referral: 'Referral Bonus',
    transaction_type_registration_bonus: 'Registration Bonus',
    
    // Mine Page
    id: 'ID',
    copy_id: 'Copy ID',
    utc_calendar: 'UTC Calendar',
    loading_utc: 'Loading UTC time...',
    withdrawal_address: 'Withdrawal Address',
    transaction_password: 'Transaction Password',
    customer_service: 'Customer Service',
    language: 'Language',
    change_password: 'Change Password',
    contact_24_7: 'Contact our 24/7 customer support:',
    telegram: 'Telegram',
    confirm_logout: 'Confirm Logout',
    logout_message: 'Are you sure you want to logout?',
    set_withdrawal_address: 'Set Withdrawal Address',
    select_network: 'Select Network',
    usdt_wallet_address: 'USDT Wallet Address',
    enter_wallet_address: 'Enter your wallet address',
    current_password: 'Current Password',
    new_password: 'New Password',
    confirm_new_password: 'Confirm New Password',
    enter_current_password: 'Enter current password',
    enter_new_password: 'Enter new password',
    confirm_new_password_placeholder: 'Confirm new password',
    current_password_incorrect: 'Current password is incorrect',
    password_changed: 'Password changed successfully',
    address_saved: 'Address saved successfully',
    configured: 'Configured',
    set_address: 'Set Address',
    
    // Language
    language_english: 'English',
    language_russian: 'Russian',
    language_chinese: 'Chinese',
    language_spanish: 'Spanish',
    language_arabic: 'Arabic',
    
    // Invite Page
    invite_code: 'Invite Code',
    invite_code_required: 'Invite Code (required)',
    your_invite_code: 'Your Invite Code',
    invite_friends: 'Invite Friends',
    referral_link: 'Referral Link',
    copy_link: 'Copy Link',
    share_link: 'Share Link',
    referral_rules: 'Referral Rules',
    referral_commission: 'Referral Commission',
    level_1_commission: 'Level 1: 12%',
    level_2_commission: 'Level 2: 5%',
    level_3_commission: 'Level 3: 3%',
    total_referrals: 'Total Referrals',
    active_referrals: 'Active Referrals',
    referral_income_total: 'Referral Income',
    no_referrals_yet: 'No referrals yet',
    
    // Team Page
    team_structure: 'Team Structure',
    direct_referrals: 'Direct Referrals',
    total_team: 'Total Team',
    team_earnings: 'Team Earnings',
    member: 'Member',
    join_date: 'Join Date',
    status_active: 'Active',
    status_inactive: 'Inactive',
    no_team_members: 'No team members yet',
    
    // Deposit Page
    select_amount: 'Select Amount',
    quick_amounts: 'Quick Amounts',
    custom_amount: 'Custom Amount',
    min_deposit: 'Minimum deposit: 20 USDT',
    max_deposit: 'Maximum deposit: 20000 USDT',
    deposit_now: 'Deposit Now',
    select_network: 'Select Network',
    network_fee: 'Network Fee',
    estimated_arrival: 'Estimated Arrival',
    generate_qr: 'Generate QR Code',
    copy_address: 'Copy Address',
    deposit_instructions: 'Deposit Instructions',
    instruction_1: '1. Copy the wallet address or scan QR code',
    instruction_2: '2. Send exact amount to the address',
    instruction_3: '3. Wait for blockchain confirmation',
    instruction_4: '4. Funds will be credited automatically',
    deposit_warning: 'Only send USDT on the selected network',
    new_deposit_received: 'New deposit received: {amount} USDT',
    
    // Withdraw Page
    withdraw_amount: 'Withdraw Amount',
    available_balance: 'Available Balance',
    withdraw_all: 'Withdraw All',
    payment_password: 'Payment Password',
    enter_payment_password: 'Enter payment password',
    withdrawal_fee: 'Withdrawal Fee',
    receive_amount: 'You Will Receive',
    withdraw_now: 'Withdraw Now',
    withdrawal_address: 'Withdrawal Address',
    set_address_first: 'Please set withdrawal address first',
    insufficient_balance: 'Insufficient balance',
    min_withdrawal: 'Minimum withdrawal: 20 USDT',
    withdrawal_request_sent: 'Withdrawal request sent',
    withdrawal_processing: 'Withdrawal processing',
    withdrawal_completed: 'Withdrawal completed',
    
    // Company Page
    about_us: 'About Us',
    our_mission: 'Our Mission',
    our_vision: 'Our Vision',
    our_values: 'Our Values',
    contact_us: 'Contact Us',
    privacy_policy: 'Privacy Policy',
    terms_service: 'Terms of Service',
    
    // Rules Page
    platform_rules: 'Platform Rules',
    quantification_rules: 'Quantification Rules',
    referral_rules_title: 'Referral Rules',
    withdrawal_rules: 'Withdrawal Rules',
    vip_rules: 'VIP Rules',
    
    // Admin Page
    dashboard: 'Dashboard',
    all_users: 'All Users',
    all_transactions: 'All Transactions',
    all_deposits: 'All Deposits',
    statistics: 'Statistics',
    user_management: 'User Management',
    transaction_management: 'Transaction Management',
    system_settings: 'System Settings',
    total_users: 'Total Users',
    total_deposited: 'Total Deposited',
    total_withdrawn: 'Total Withdrawn',
    today_profit: "Today's Profit",
    search_user: 'Search user...',
    actions: 'Actions',
    edit_user: 'Edit User',
    delete_user: 'Delete User',
    user_details: 'User Details',
    
    // Backend Page
    admin_login: 'Admin Login',
    enter_admin_credentials: 'Enter admin credentials',
    
    // Validation Messages
    validation_required: 'All fields are required',
    validation_password_match: 'Passwords do not match',
    validation_password_length: 'Password must be at least 6 characters',
    validation_payment_password_length: 'Payment password must be at least 6 characters',
    validation_invite_code: 'Invite code is required',
    validation_amount: 'Please enter a valid amount',
    validation_min_amount: 'Amount must be at least {min}',
    validation_max_amount: 'Amount must not exceed {max}',
    
    // Error Messages
    error_username_exists: 'Username already exists',
    error_invalid_invite: 'Invalid invitation code',
    error_loading_transactions: 'Error loading transactions',
    error_loading_user: 'Error loading user data',
    error_performing_quantification: 'Error performing quantification',
    error_processing_deposit: 'Error processing deposit',
    error_processing_withdrawal: 'Error processing withdrawal',
    error_updating_profile: 'Error updating profile',
    error_changing_password: 'Error changing password',
    error_saving_address: 'Error saving address',
    error_network: 'Network error. Please check your connection',
    
    // Success Messages
    success_registration: 'Registration successful!',
    success_login: 'Login successful!',
    success_logout: 'Logout successful!',
    success_deposit: 'Deposit successful!',
    success_withdrawal: 'Withdrawal request submitted!',
    success_quantification: 'Quantification successful!',
    success_profile_update: 'Profile updated!',
    success_password_change: 'Password changed!',
    success_address_save: 'Address saved!',
    
    // Notifications
    notification: 'Notification',
    new_deposit: 'New Deposit',
    new_withdrawal: 'New Withdrawal',
    quantification_complete: 'Quantification Complete',
    vip_level_upgraded: 'VIP Level Upgraded to {level}',
    signals_reset_alert: 'Signals have been reset for today',
    
    // Network Types
    network_trc20: 'TRC20',
    network_bep20: 'BEP20',
    network_erc20: 'ERC20',
    
    // Status
    status_pending: 'Pending',
    status_processing: 'Processing',
    status_completed: 'Completed',
    status_failed: 'Failed',
    status_cancelled: 'Cancelled'
  },
  
  ru: {
    // Common
    app_name: 'GLY Платформа',
    welcome: 'Добро пожаловать',
    welcome_to_gly: 'Добро пожаловать в GLY',
    loading: 'Загрузка...',
    error: 'Ошибка',
    success: 'Успех',
    cancel: 'Отмена',
    save: 'Сохранить',
    close: 'Закрыть',
    confirm: 'Подтвердить',
    delete: 'Удалить',
    edit: 'Редактировать',
    update: 'Обновить',
    copy: 'Копировать',
    copied: 'Скопировано',
    yes: 'Да',
    no: 'Нет',
    ok: 'ОК',
    back: 'Назад',
    next: 'Далее',
    previous: 'Назад',
    search: 'Поиск',
    filter: 'Фильтр',
    sort: 'Сортировка',
    refresh: 'Обновить',
    share: 'Поделиться',
    download: 'Скачать',
    upload: 'Загрузить',
    select: 'Выбрать',
    selected: 'Выбрано',
    all: 'Все',
    none: 'Ничего',
    apply: 'Применить',
    reset: 'Сбросить',
    submit: 'Отправить',
    send: 'Отправить',
    receive: 'Получить',
    buy: 'Купить',
    sell: 'Продать',
    deposit: 'Пополнить',
    withdraw: 'Вывести',
    balance: 'Баланс',
    amount: 'Сумма',
    currency: 'Валюта',
    price: 'Цена',
    total: 'Всего',
    fee: 'Комиссия',
    net: 'Чистыми',
    status: 'Статус',
    date: 'Дата',
    time: 'Время',
    description: 'Описание',
    details: 'Детали',
    history: 'История',
    settings: 'Настройки',
    profile: 'Профиль',
    logout: 'Выйти',
    login: 'Войти',
    register: 'Регистрация',
    username: 'Имя пользователя',
    password: 'Пароль',
    email: 'Email',
    phone: 'Телефон',
    address: 'Адрес',
    city: 'Город',
    country: 'Страна',
    zip_code: 'Индекс',
    save_changes: 'Сохранить изменения',
    changes_saved: 'Изменения сохранены',
    save_success: 'Сохранение успешно',
    save_error: 'Ошибка сохранения',
    delete_confirm: 'Подтвердите удаление',
    delete_success: 'Удаление успешно',
    delete_error: 'Ошибка удаления'
  },
  
  zh: {
    // Common
    app_name: 'GLY 平台',
    welcome: '欢迎',
    welcome_to_gly: '欢迎来到 GLY',
    loading: '加载中...',
    error: '错误',
    success: '成功',
    cancel: '取消',
    save: '保存',
    close: '关闭',
    confirm: '确认',
    delete: '删除',
    edit: '编辑',
    update: '更新',
    copy: '复制',
    copied: '已复制',
    yes: '是',
    no: '否',
    ok: '确定',
    back: '返回',
    next: '下一步',
    previous: '上一步',
    search: '搜索',
    filter: '筛选',
    sort: '排序',
    refresh: '刷新',
    share: '分享',
    download: '下载',
    upload: '上传',
    select: '选择',
    selected: '已选择',
    all: '全部',
    none: '无',
    apply: '应用',
    reset: '重置',
    submit: '提交',
    send: '发送',
    receive: '接收',
    buy: '购买',
    sell: '出售',
    deposit: '充值',
    withdraw: '提现',
    balance: '余额',
    amount: '金额',
    currency: '货币',
    price: '价格',
    total: '总计',
    fee: '手续费',
    net: '净额',
    status: '状态',
    date: '日期',
    time: '时间',
    description: '描述',
    details: '详情',
    history: '历史',
    settings: '设置',
    profile: '个人资料',
    logout: '退出登录',
    login: '登录',
    register: '注册',
    username: '用户名',
    password: '密码',
    email: '邮箱',
    phone: '电话',
    address: '地址',
    city: '城市',
    country: '国家',
    zip_code: '邮编',
    save_changes: '保存更改',
    changes_saved: '更改已保存',
    save_success: '保存成功',
    save_error: '保存失败',
    delete_confirm: '确认删除',
    delete_success: '删除成功',
    delete_error: '删除失败'
  }
}

// Language management
let currentLang = 'en'

export const getLanguage = () => {
  return localStorage.getItem('gly_language') || 'en'
}

export const setLanguage = (lang) => {
  if (translations[lang]) {
    localStorage.setItem('gly_language', lang)
    currentLang = lang
    updatePageLanguage()
    return true
  }
  return false
}

export const t = (key, lang = null, params = null) => {
  const language = lang || currentLang
  let translation = translations[language]?.[key] || translations['en'][key] || key
  
  if (params && typeof params === 'object') {
    Object.keys(params).forEach(param => {
      translation = translation.replace(`{${param}}`, params[param])
    })
  }
  
  return translation
}

export const initLanguageSystem = () => {
  const savedLang = localStorage.getItem('gly_language')
  if (savedLang && translations[savedLang]) {
    currentLang = savedLang
  } else {
    // Detect browser language
    const browserLang = navigator.language.split('-')[0]
    if (translations[browserLang]) {
      currentLang = browserLang
      localStorage.setItem('gly_language', browserLang)
    }
  }
  
  updatePageLanguage()
  
  return currentLang
}

export const updatePageLanguage = () => {
  const lang = getLanguage()
  document.documentElement.lang = lang
  
  // Update direction for RTL languages
  if (lang === 'ar') {
    document.documentElement.dir = 'rtl'
  } else {
    document.documentElement.dir = 'ltr'
  }
  
  // Update all elements with data-translate attribute
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate')
    element.textContent = t(key, lang)
  })
  
  // Update all placeholders
  document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
    const key = element.getAttribute('data-translate-placeholder')
    element.placeholder = t(key, lang)
  })
  
  // Update all alt attributes
  document.querySelectorAll('[data-translate-alt]').forEach(element => {
    const key = element.getAttribute('data-translate-alt')
    element.alt = t(key, lang)
  })
  
  // Update all titles
  document.querySelectorAll('[data-translate-title]').forEach(element => {
    const key = element.getAttribute('data-translate-title')
    element.title = t(key, lang)
  })
  
  // Dispatch language change event
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }))
}

export const getAvailableLanguages = () => {
  return Object.keys(translations).map(code => ({
    code,
    name: translations[code].language_name || code.toUpperCase(),
    native: translations[code].language_native || translations[code].language_name || code.toUpperCase()
  }))
}

// Vue composable for translations
export const useI18n = () => {
  return {
    t,
    currentLang,
    setLanguage,
    getAvailableLanguages
  }
}

// Initialize on import
initLanguageSystem()

// Export as default
export default {
  t,
  getLanguage,
  setLanguage,
  initLanguageSystem,
  updatePageLanguage,
  getAvailableLanguages,
  useI18n
}
