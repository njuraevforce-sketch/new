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
  // 1. Говорим Vue CLI транспилировать эти пакеты
  transpileDependencies: [
    'iceberg-js',
    /@supabase\/storage-js/,
    /@supabase\/supabase-js/
  ],
  // 2. Явно настраиваем chainWebpack для .mjs файлов
  chainWebpack: config => {
    config.module
      .rule('mjs')
      .test(/\.mjs$/)
      .include
        .add(/node_modules/)
        .end()
      .type('javascript/auto') // Важно: сообщаем Webpack, что это JS
  }
}
