// vue.config.js
const path = require('path')

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  },
  devServer: {
    historyApiFallback: true,
    allowedHosts: 'all'
  },
  // For Cloudflare Pages
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/'
}
