import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(({ command }) => {
  return {
    base: command === 'build' ? '/build/' : '/',
    build: {
      outDir: 'public/build',
      emptyOutDir: true,
    },
    // Laravel serves the existing public assets in production; Vite serves them during development.
    publicDir: command === 'build' ? false : 'public',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      proxy: { '/api': { target: 'http://127.0.0.1:8000', changeOrigin: true } },
      // Allow only Cloudflare Quick Tunnel hostnames through Vite's host check.
      allowedHosts: ['.trycloudflare.com'],
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
