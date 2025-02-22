import { defineStore } from 'pinia';

  export const useSubtitleStore = defineStore('subtitle', {
    state: () => ({
      subtitle: ''
    }),
    actions: {
      setSubtitle(subtitle: string) {
        this.subtitle = subtitle;
      }
    }
  });
  