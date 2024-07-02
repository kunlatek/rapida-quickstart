// src/lib/i18n.ts
import { register, init, getLocaleFromNavigator } from 'svelte-i18n';

// Registrar traduções
register('en', () => import('../locales/en.json'));
register('pt', () => import('../locales/pt.json'));

// Inicializar a i18n
init({
  fallbackLocale: 'pt',
  initialLocale: getLocaleFromNavigator(),
});
