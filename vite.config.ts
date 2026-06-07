import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiProxyTarget = env.VITE_API_PROXY_TARGET || env.VITE_API_ORIGIN || 'http://localhost:8080';
  const appBase = env.VITE_APP_BASE || '/';
  const useGeneratedHttps = mode === 'https';
  const certPath = path.resolve(__dirname, 'cert.crt');
  const keyPath = path.resolve(__dirname, 'cert.key');
  const hasCustomCertificate = fs.existsSync(certPath) && fs.existsSync(keyPath);

  return {
    base: appBase,
    server: {
      host: '0.0.0.0',
      port: 3000,
      hmr: {
        protocol: hasCustomCertificate || useGeneratedHttps ? 'wss' : 'ws',
        host: 'localhost',
        clientPort: 3000,
      },
      https: hasCustomCertificate
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
    plugins: [react(), ...(useGeneratedHttps ? [basicSsl()] : [])],
  };
});
