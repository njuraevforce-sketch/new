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
    },
    // КРИТИЧНО: Правило для файлов .mjs из node_modules
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto'
        }
      ]
    }
  },
  // КРИТИЧНО: Транспиляция конкретных проблемных пакетов
  transpileDependencies: [
    'iceberg-js',
    /@supabase\/storage-js/,
    /@supabase\/supabase-js/
  ]
}
