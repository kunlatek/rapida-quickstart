import { writable } from "svelte/store";

// Tipos
export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  timeout: number;
}

// Store base
const { subscribe, update } = writable<Toast[]>([]);

// Função para gerar ID único
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

// Função principal para adicionar toast
const add = (
  message: string,
  type: ToastType = "info",
  timeout: number = 5000
): string => {
  const id = generateId();
  const toast: Toast = { id, message, type, timeout };

  update((toasts: Toast[]) => [...toasts, toast]);

  if (timeout > 0) {
    setTimeout(() => {
      update((toasts: Toast[]) => toasts.filter((t) => t.id !== id));
    }, timeout);
  }

  return id;
};

// Função para remover toast específico
const remove = (id: string): void => {
  update((toasts: Toast[]) => toasts.filter((t) => t.id !== id));
};

// Função para limpar todos os toasts
const clear = (): void => {
  update(() => []);
};

// Métodos de conveniência
const success = (message: string, timeout?: number): string =>
  add(message, "success", timeout);

const error = (message: string, timeout?: number): string =>
  add(message, "error", timeout);

const warning = (message: string, timeout?: number): string =>
  add(message, "warning", timeout);

const info = (message: string, timeout?: number): string =>
  add(message, "info", timeout);

// Export do store completo
export const toastStore = {
  subscribe,
  add,
  remove,
  clear,
  success,
  error,
  warning,
  info,
};
