import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiProxyTarget = env.VITE_API_PROXY_TARGET || env.VITE_API_ORIGIN || 'http://localhost:8080';
  const appBase = env.VITE_APP_BASE || '/';
  const certPath = path.resolve(__dirname, 'cert.crt');
  const keyPath = path.resolve(__dirname, 'cert.key');

  return {
    base: appBase,
    server: {
      host: '0.0.0.0',
      port: 3000,
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        clientPort: 3000,
      },
      https: fs.existsSync(certPath) && fs.existsSync(keyPath)
        ? {
            cert: fs.readFileSync(certPath),
            key: fs.readFileSync(keyPath),
          }
        : undefined,
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
          rewrite: (requestPath) => requestPath.replace(/^\/api/, '/api'),
        },
      },
    },
    preview: {
      host: '0.0.0.0',
      port: 4173,
    },
    plugins: [react()],
  };
});
