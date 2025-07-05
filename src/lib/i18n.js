import { register, init, getLocaleFromNavigator } from "svelte-i18n";

register("en", () => import("./locales/en.json"));
register("es", () => import("./locales/es.json"));
register("pt", () => import("./locales/pt.json"));

export const i18nLoaded = init({
  fallbackLocale: "en",
  initialLocale: getLocaleFromNavigator(),
});
