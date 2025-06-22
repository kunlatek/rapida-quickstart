<script lang="ts">
  import { toastStore, type Toast, type ToastType } from "$stores/toast";
  import { Toast as FlowbiteToast } from "flowbite-svelte";
  import { fly } from "svelte/transition";

  // Tipos válidos do Flowbite Toast
  type FlowbiteToastColor =
    | "none"
    | "red"
    | "yellow"
    | "green"
    | "indigo"
    | "purple"
    | "pink"
    | "blue"
    | "dark"
    | "primary"
    | undefined;

  // Mapeamento de tipos para cores do Flowbite
  const typeClasses: Record<ToastType, FlowbiteToastColor> = {
    success: "green",
    error: "red",
    warning: "yellow",
    info: "blue",
  };

  // Função helper para obter a cor correta
  const getToastColor = (type: ToastType): FlowbiteToastColor => {
    return typeClasses[type];
  };

  // Mapeamento de ícones SVG para cada tipo de toast
  const getIcon = (type: ToastType): string => {
    const icons: Record<ToastType, string> = {
      success: `
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clip-rule="evenodd"
        />
      `,
      error: `
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clip-rule="evenodd"
        />
      `,
      warning: `
        <path
          fill-rule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clip-rule="evenodd"
        />
      `,
      info: `
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
          clip-rule="evenodd"
        />
      `,
    };
    return icons[type];
  };
</script>

<div
  class="fixed top-0 left-1/2 transform -translate-x-1/2 mt-[100px] z-50 flex flex-col gap-2 max-w-md"
  role="region"
  aria-label="Notificações"
>
  {#each $toastStore as toast (toast.id)}
    <div
      transition:fly={{ y: -20, duration: 300 }}
      class="w-full"
      role="alert"
      aria-live="polite"
    >
      <FlowbiteToast
        color={getToastColor(toast.type)}
        class="mb-2 w-full shadow-lg"
        dismissable={true}
        on:close={() => toastStore.remove(toast.id)}
      >
        <div class="flex items-center">
          <!-- Ícone para cada tipo de toast -->
          <svg
            class="w-5 h-5 mr-2 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {@html getIcon(toast.type)}
          </svg>

          <span class="text-sm font-medium break-words" title={toast.message}>
            {toast.message}
          </span>
        </div>
      </FlowbiteToast>
    </div>
  {/each}
</div>
