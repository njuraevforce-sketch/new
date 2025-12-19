// vue.config.js
const path = require('path')

module.exports = {
  outputDir: 'dist',
  publicPath: './',

  chainWebpack: (config) => {
    config.resolve.alias.set('@', path.resolve(__dirname, 'src'))
    
    // Критически важное правило для .mjs
    config.module
      .rule('mjs')
        .test(/\.mjs$/)
        .include.add(/node_modules/).end()
        .type('javascript/auto')
        .use('babel-loader')
          .loader('babel-loader')
          .options({
            presets: ['@babel/preset-env']
          });
  },
  
  transpileDependencies: [
    'iceberg-js',
    /@supabase\/storage-js/,
    /@supabase\/supabase-js/
  ]
}
