import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

function versionServiceWorker() {
  return {
    name: 'cashbook-service-worker-version',
    apply: 'build',
    async closeBundle() {
      const serviceWorkerPath = resolve('dist/service-worker.js');
      const source = await readFile(serviceWorkerPath, 'utf8');
      const buildId = Date.now().toString(36);
      await writeFile(serviceWorkerPath, source.replace('__BUILD_ID__', buildId));
    }
  };
}

export default defineConfig({
  plugins: [react(), versionServiceWorker()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
