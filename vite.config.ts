import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Sub-path deploy safe: relative asset base (HVC/하위 경로 검증 대응).
export default defineConfig({
  plugins: [react()],
  base: './',
  server: { port: 5173 },
});
