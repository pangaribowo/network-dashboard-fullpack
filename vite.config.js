import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx', // Pastikan "loader" adalah string
  },
  build: {
    rollupOptions: {
      input: './public/index.html', 
    },
    outDir: 'dist', 
    sourcemap: true, 
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), 
    },
  },
  server: {
    port: 5173, // Port server pengembangan
    open: true, // Buka di browser otomatis
    proxy: {
      '/ws': {
        target: 'ws://localhost:8080', // Proxy untuk WebSocket
        ws: true,
      },
    },
  },
});