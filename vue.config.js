// vue.config.js
const path = require('path')

module.exports = {
  outputDir: 'dist',
  publicPath: './',

  // Ключевое решение: прямое правило для chainWebpack
  chainWebpack: (config) => {
    // Стандартный алиас
    config.resolve.alias.set('@', path.resolve(__dirname, 'src'))

    // 1. ОБЯЗАТЕЛЬНОЕ правило для файлов .mjs из node_modules
    config.module
      .rule('mjs')
        .test(/\.mjs$/)
        .include
          .add(/node_modules/)
          .end()
        .type('javascript/auto');

    // 2. ЯВНОЕ правило для транспиляции iceberk-js и supabase через babel-loader
    // Это переопределяет стандартные настройки и гарантирует обработку.
    config.module
      .rule('js')
        .test(/\.js$/)
        .include
          .add(/node_modules[\\/](iceberg-js|@supabase[\\/](storage-js|supabase-js))/)
          .end()
        .use('babel-loader')
          .loader('babel-loader')
          .end();
  }
}
