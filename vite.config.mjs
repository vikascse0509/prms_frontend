import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const API_URL = `${env.VITE_APP_BASE_NAME}`;
  // this sets a default port to 3000
  const PORT = `${'3000'}`;

  return {
    server: {
      host: '0.0.0.0', // Listen on all network interfaces
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:5000', // Backend URL
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }, // Specify the port
      hmr: {
        clientPort: 3000
      }
    },
    define: {
      global: 'window'
    },
    resolve: {},
    preview: {
      // this ensures that the browser opens upon preview start
      open: true,
      port: PORT
    },
    // base: API_URL,
    base: env.VITE_APP_BASE_NAME || './',
    plugins: [react(), jsconfigPaths(), tailwindcss()]
  };
});
