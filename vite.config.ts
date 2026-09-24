import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
export default defineConfig({
  plugins: [react()],
  server: { hmr: { port: Number(process.env.WORKSHOP_HMR_PORT ?? 24678) } },
  resolve: {
    alias: { '@lesson': resolve(process.env.WORKSHOP_LESSON ?? 'solutions/12-external-agent') },
  },
  build: {
    outDir: 'dist',
    rollupOptions: { input: { workshop: resolve('index.html'), agent: resolve('agent.html') } },
  },
});
