<script>
  import { toastStore } from '$stores/toast';
  import { Toast, CloseButton } from 'flowbite-svelte';
  import { fly } from 'svelte/transition';

  // Mapeia os tipos de toast para as classes do Flowbite
  const typeClasses = {
    success: 'green',
    error: 'red',
    warning: 'yellow',
    info: 'blue'
  };
</script>

<div class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
  {#each $toastStore as toast (toast.id)}
    <div 
      transition:fly={{ y: -20, duration: 300 }}
      class="w-full"
    >
      <Toast color={typeClasses[toast.type] || 'blue'} class="mb-2 w-full" dismissable>
        <div class="flex items-center">
          <!-- Ícones diferentes para cada tipo de notificação -->
          {#if toast.type === 'success'}
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
          {:else if toast.type === 'error'}
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
          {:else if toast.type === 'warning'}
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
          {:else}
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd"></path>
            </svg>
          {/if}
          <span class="text-sm font-semibold">{toast.message}</span>
        </div>
        <CloseButton on:click={() => toastStore.remove(toast.id)} />
      </Toast>
    </div>
  {/each}
</div>