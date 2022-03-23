import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import icons from 'unplugin-icons/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), icons()],
  test: {
    setupFiles: ['./test/setup.ts'],
    environment: 'jsdom',
    globals: true,
  },
})
