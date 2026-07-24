import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base harus sama dengan nama repo agar aset termuat benar di
// https://azizalassad23.github.io/cpp-oopanalyze/
export default defineConfig({
  base: '/cpp-oopanalyze/',
  plugins: [react(), tailwindcss()],
})
