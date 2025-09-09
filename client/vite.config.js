import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';


export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,              
    open: true,              
    proxy: {
      '/api': 'http://localhost:4000' 
    }
  },
  resolve: {
    alias: {
      '@': '/src'            
    }
  }
});