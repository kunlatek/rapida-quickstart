import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
 plugins: [sveltekit()],
 server: {
  fs: {
   allow: ['..', 'all']
  },
  proxy: {
   // Configuração do proxy para a API
   '/api': {
     target: 'http://localhost:3000',
     changeOrigin: true,
     rewrite: (path) => path.replace(/^\/api/, '')
   }
  },
  define: {
    'import.meta.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify(process.env.VITE_GOOGLE_CLIENT_ID),
    'import.meta.env.VITE_APPLE_CLIENT_ID': JSON.stringify(process.env.VITE_APPLE_CLIENT_ID)
  }
 }
});