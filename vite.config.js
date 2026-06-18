import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // allow Cloudflare quick-tunnel hosts to reach the dev server (for sharing)
  server: { allowedHosts: ['.trycloudflare.com'] },
})
