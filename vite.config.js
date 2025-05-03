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
     target: 'http://localhost:3000', //'https://api-traampo-kunlatek.ngrok.dev'
     changeOrigin: true,
     rewrite: (path) => path.replace(/^\/api/, '')
   }
  }
 }
});