// vue.config.js
const path = require('path')

module.exports = {
  outputDir: 'dist',
  publicPath: './',
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  },
  // Главное: Эта настройка ВСЕ ЕЩЕ КРИТИЧНА.
  // Она заставит встроенный babel-loader Vue CLI обработать эти пакеты.
  transpileDependencies: [
    'iceberg-js',
    /@supabase\/storage-js/,
    /@supabase\/supabase-js/
  ]
}
