<script lang="ts">
  import { Button } from "flowbite-svelte";

  export let totalItems: number = 0;
  export let pageSize: number = 10;
  export let currentPage: number = 1;
  export let onPageChange: (page: number) => void = () => {};
  export let showPageNumbers: boolean = true;
  export let maxPageNumbers: number = 5;

  // Calcular número total de páginas
  $: totalPages = Math.ceil(totalItems / pageSize);

  // Calcular páginas visíveis para paginação
  $: visiblePages = calculateVisiblePages(
    currentPage,
    totalPages,
    maxPageNumbers
  );

  function calculateVisiblePages(
    current: number,
    total: number,
    max: number
  ): number[] {
    if (total <= max) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const half: number = Math.floor(max / 2);
    let start: number = current - half;
    let end: number = current + half;

    if (start < 1) {
      start = 1;
      end = max;
    } else if (end > total) {
      end = total;
      start = total - max + 1;
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  function goToPage(page: number): void {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  }

  function goToFirstPage(): void {
    goToPage(1);
  }

  function goToLastPage(): void {
    goToPage(totalPages);
  }

  function goToPreviousPage(): void {
    goToPage(currentPage - 1);
  }

  function goToNextPage(): void {
    goToPage(currentPage + 1);
  }
</script>

<div class="flex items-center justify-between px-4 py-2">
  <div class="text-sm text-gray-700 dark:text-gray-400">
    Exibindo <span class="font-medium"
      >{Math.min((currentPage - 1) * pageSize + 1, totalItems)}</span
    >
    de
    <span class="font-medium"
      >{Math.min(currentPage * pageSize, totalItems)}</span
    >
    de <span class="font-medium">{totalItems}</span> resultados
  </div>

  <div class="flex items-center space-x-2">
    <Button
      size="xs"
      color="light"
      on:click={goToFirstPage}
      disabled={currentPage === 1}
    >
      Primeiro
    </Button>

    <Button
      size="xs"
      color="light"
      on:click={goToPreviousPage}
      disabled={currentPage === 1}
    >
      Anterior
    </Button>

    {#if showPageNumbers}
      {#each visiblePages as page}
        <Button
          size="xs"
          color={page === currentPage ? "blue" : "light"}
          on:click={() => goToPage(page)}
        >
          {page}
        </Button>
      {/each}
    {/if}

    <Button
      size="xs"
      color="light"
      on:click={goToNextPage}
      disabled={currentPage === totalPages}
    >
      Próximo
    </Button>

    <Button
      size="xs"
      color="light"
      on:click={goToLastPage}
      disabled={currentPage === totalPages}
    >
      Último
    </Button>
  </div>
</div>
