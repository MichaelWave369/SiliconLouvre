import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/SiliconLouvre/',
  build: {
    rollupOptions: {
      input: {
        museum: fileURLToPath(new URL('./index.html', import.meta.url)),
        xr: fileURLToPath(new URL('./xr.html', import.meta.url)),
      },
    },
  },
});
