import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc' // Tera pehle se SWC hai, wahi use karenge

export default defineConfig({
  plugins: [react()],
})