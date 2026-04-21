import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc' // This name must be exact
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})