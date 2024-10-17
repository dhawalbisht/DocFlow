import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import polyfillNode from 'rollup-plugin-polyfill-node';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      plugins: [
        // Polyfill Node.js modules for browser environments
        polyfillNode()
      ]
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      // Define `global` for the browser
      define: {
        global: 'globalThis',
      }
    }
  }
});
