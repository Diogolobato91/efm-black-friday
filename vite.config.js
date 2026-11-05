import { defineConfig } from 'vite';

export default defineConfig({
  // Exact managed-preview hostname; keep host checks enabled for all others.
  server: { allowedHosts: ['terminal.local'] },
});
