// babel.config.js
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    '@babel/plugin-proposal-optional-chaining' // Этот плагин обрабатывает оператор `?.`
  ]
}
