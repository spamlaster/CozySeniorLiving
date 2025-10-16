import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
export default defineConfig({
  plugins: [vue()],
  base: 'cozyseniorliving.com',
  build: { outDir: 'docs', emptyOutDir: true }
})
