import { writable } from "svelte/store";

function createToastStore() {
  const { subscribe, update } = writable([]);

  // Usar timestamp + random para garantir unicidade
  const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  };

  const store = {
    subscribe,

    add: (message, type = "info", timeout = 5000) => {
      const id = generateId();
      const toast = { id, message, type, timeout };

      update((toasts) => [...toasts, toast]);

      if (timeout) {
        setTimeout(() => {
          update((toasts) => toasts.filter((t) => t.id !== id));
        }, timeout);
      }

      return id;
    },

    remove: (id) => {
      update((toasts) => toasts.filter((t) => t.id !== id));
    },

    clear: () => {
      update(() => []);
    },
  };

  store.success = (message, timeout) => store.add(message, "success", timeout);
  store.error = (message, timeout) => store.add(message, "error", timeout);
  store.warning = (message, timeout) => store.add(message, "warning", timeout);
  store.info = (message, timeout) => store.add(message, "info", timeout);

  return store;
}

export const toastStore = createToastStore();
