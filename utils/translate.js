const translations = {
  en: {
    welcome: 'Welcome',
    welcome_to_gly: 'Welcome to GLY',
    username: 'Username',
    password: 'Password',
    login: 'Login',
    register: 'Register',
    // ... все остальные переводы
  },
  zh: {
    welcome: '欢迎',
    welcome_to_gly: '欢迎来到 GLY',
    username: '用户名',
    password: '密码',
    login: '登录',
    register: '注册',
    // ...
  },
  ru: {
    welcome: 'Добро пожаловать',
    welcome_to_gly: 'Добро пожаловать в GLY',
    username: 'Имя пользователя',
    password: 'Пароль',
    login: 'Войти',
    register: 'Регистрация',
    // ...
  },
  ar: {
    welcome: 'مرحباً',
    welcome_to_gly: 'مرحباً بكم في GLY',
    username: 'اسم المستخدم',
    password: 'كلمة المرور',
    login: 'تسجيل الدخول',
    register: 'تسجيل',
    // ...
  }
}

export function t(key, lang = null, params = {}) {
  const language = lang || localStorage.getItem('gly_language') || 'en'
  let translation = translations[language]?.[key] || translations['en'][key] || key
  
  // Replace parameters
  Object.keys(params).forEach(param => {
    translation = translation.replace(`{${param}}`, params[param])
  })
  
  return translation
}

export function setLanguage(lang) {
  localStorage.setItem('gly_language', lang)
  window.location.reload()
}
