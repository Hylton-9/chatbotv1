import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: replace 'chatbotv1' with your repo name
export default defineConfig({
  plugins: [react()],
  base: '/chatbotv1/', 
})
