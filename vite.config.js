import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import uni from '@uni-helper/vite-plugin-uni'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    vue(),
    uni(),
    Components({
      dts: true,
    })
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'static',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'pinia', 'vue-router'],
          supabase: ['@supabase/supabase-js']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
})
