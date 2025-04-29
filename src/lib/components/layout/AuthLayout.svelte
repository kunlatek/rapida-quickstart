<script>
  export let title = '';
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
  <div class="flex flex-col items-center justify-center">
    {#if title}
      <h1 class="text-center text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
        {title}
      </h1>
    {/if}
    
    <slot />
    
    <div class="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
      <p>© {new Date().getFullYear()} Rapida Quickstart. Todos os direitos reservados.</p>
    </div>
  </div>
</div>