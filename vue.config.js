// vue.config.js
const path = require('path')
module.exports = {
  outputDir: 'dist',
  publicPath: './', // КРИТИЧНО для Cloudflare Pages!
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  }
}
