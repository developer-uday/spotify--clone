import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.GITHUB_REPOSITORY && !process.env.GITHUB_REPOSITORY.split('/')[1].endsWith('.github.io')
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
    : '/',
})
