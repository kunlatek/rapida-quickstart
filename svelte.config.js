import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Preprocessor para Tailwind
  preprocess: vitePreprocess(),

  kit: {
    // adapter-auto só implementa alguns ambientes, se precisar você pode trocar por um específico como adapter-node
    adapter: adapter(),
    alias: {
      // Atalhos úteis para importação
      '$lib': './src/lib',
      '$components': './src/lib/components',
      '$services': './src/lib/services',
      '$stores': './src/lib/stores',
      '$utils': './src/lib/utils',
      '$static': './static'
    }
  }
};

export default config;
