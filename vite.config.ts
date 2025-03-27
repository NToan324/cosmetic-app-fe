import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss(), tsConfigPaths()],
  server: {
    port: parseInt(process.env.VITE_PORT || '3001'),
    strictPort: false
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
