<script>
  import { Button } from "flowbite-svelte";
  import {
    accountDeletionStore,
    restoreAccount,
    fetchDeletionStatus,
  } from "$stores/account-deletion";
  import { toastStore } from "$stores/toast";
  import { onMount } from "svelte";

  export let className = "";

  let restoring = false;

  onMount(() => {
    fetchDeletionStatus();
  });

  async function handleRestore() {
    restoring = true;
    try {
      const result = await restoreAccount();

      if (result.success) {
        toastStore.success("Sua conta foi restaurada com sucesso!");
      } else {
        toastStore.error(
          "Ocorreu um erro ao restaurar sua conta. Tente novamente."
        );
      }
    } catch (error) {
      console.error("Error restoring account:", error);
      toastStore.error(
        "Ocorreu um erro ao restaurar sua conta. Tente novamente."
      );
    } finally {
      restoring = false;
    }
  }

  // Format date for better readability
  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  // Calculate deletion date (90 days after deletion)
  $: deletionDate = $accountDeletionStore.deletedAt
    ? new Date(
        new Date($accountDeletionStore.deletedAt).getTime() +
          90 * 24 * 60 * 60 * 1000
      )
    : null;
</script>

{#if $accountDeletionStore.isDeleted}
  <div
    class="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 {className}"
  >
    <div class="flex flex-col md:flex-row md:items-center justify-between">
      <div class="mb-4">
        <h3
          class="text-lg font-medium text-yellow-700 dark:text-yellow-400 mb-2"
        >
          Sua conta está marcada para exclusão
        </h3>
        <p class="text-yellow-600 dark:text-yellow-300 mb-1">
          Sua conta será excluída permanentemente em <span class="font-semibold"
            >{$accountDeletionStore.daysRemaining} dias</span
          >. Desde já sua conta só pode ser vista por você. Todos os dados que
          são do seu domínio também serão excluídos em 90 dias, mas também desde
          não podem ser vistos por ninguém.
        </p>
        <p class="text-yellow-600 dark:text-yellow-300 mb-1">
          Caso você restaure sua conta, seus dados também voltarão.
        </p>
        <p class="text-sm text-yellow-500 dark:text-yellow-400">
          Data de exclusão: {formatDate(deletionDate?.toISOString())}
        </p>
      </div>

    </div>
    <div class="mt-4 flex justify-center">
      <Button color="yellow" on:click={handleRestore} disabled={restoring}>
        {restoring ? "Restaurando..." : "Restaurar minha conta"}
      </Button>
    </div>
  </div>
{/if}
