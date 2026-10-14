import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, strictPort: true, watch: { ignored: ['**/artifacts/**', '**/sites/**', '**/作品集/**'] } },
  build: { target: 'es2022' },
});
