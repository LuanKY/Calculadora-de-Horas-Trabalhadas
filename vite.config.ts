import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  base: '/Calculadora-de-Horas-Trabalhadas/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
