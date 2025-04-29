// src/lib/stores/toast.js
import { writable } from 'svelte/store';

// Criar store para mensagens toast
function createToastStore() {
  const { subscribe, update } = writable([]);
  
  // Gerar ID único para cada toast
  const generateId = () => Math.floor(Math.random() * 10000);
  
  const store = {
    subscribe,
    // Adicionar uma nova mensagem toast
    add: (message, type = 'info', timeout = 5000) => {
      const id = generateId();
      const toast = { id, message, type, timeout };
      
      update(toasts => [...toasts, toast]);
      
      // Remover automaticamente após o timeout
      if (timeout) {
        setTimeout(() => {
          update(toasts => toasts.filter(t => t.id !== id));
        }, timeout);
      }
      
      return id;
    },
    // Remover uma mensagem toast pelo ID
    remove: (id) => {
      update(toasts => toasts.filter(t => t.id !== id));
    },
    // Limpar todas as mensagens
    clear: () => {
      update(() => []);
    }
  };
  
  // Adicionar métodos de conveniência
  store.success = (message, timeout) => store.add(message, 'success', timeout);
  store.error = (message, timeout) => store.add(message, 'error', timeout);
  store.warning = (message, timeout) => store.add(message, 'warning', timeout);
  store.info = (message, timeout) => store.add(message, 'info', timeout);
  
  return store;
}

export const toastStore = createToastStore();