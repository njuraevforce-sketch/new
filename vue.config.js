// vue.config.js
const path = require('path')

module.exports = {
  outputDir: 'dist',
  publicPath: './',
  
  chainWebpack: config => {
    config.resolve.alias.set('@', path.resolve(__dirname, 'src'))
    
    // Правило для .mjs файлов
    config.module
      .rule('mjs')
      .test(/\.mjs$/)
      .include
        .add(/node_modules/)
        .end()
      .type('javascript/auto')
  },
  
  // Транспиляция всех проблемных пакетов
  transpileDependencies: [
    /node_modules[\\/]iceberg-js/,
    /node_modules[\\/]@supabase[\\/]storage-js/,
    /node_modules[\\/]@supabase[\\/]supabase-js/
  ]
}
