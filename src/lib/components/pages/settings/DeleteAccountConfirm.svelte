<script>
  import { createEventDispatcher } from "svelte";
  import { Button, Alert } from "flowbite-svelte";
  import {
    accountDeletionStore,
    softDeleteAccount,
  } from "$stores/account-deletion";
  import { toastStore } from "$lib/stores/toast";

  let loading = false;
  let error = "";

  const dispatch = createEventDispatcher();

  async function handleDeleteAccount() {
    error = "";

    try {
      loading = true;
      console.log("🔄 Iniciando processo de exclusão de conta");
      const result = await softDeleteAccount();

      console.log("📥 Resultado da tentativa de exclusão:", result);
      if (result.success) {
        toastStore.success(
          "Sua conta foi marcada para exclusão. Você tem 90 dias para desfazer esta ação."
        );
        dispatch("success");
      } else {
        console.error("❌ Falha na exclusão de conta:", result.error);
        error = "Ocorreu um erro ao tentar excluir sua conta. Tente novamente.";
        toastStore.error(error);
      }
    } catch (err) {
      console.error("❌ Exceção ao excluir conta:", err);
      error = "Ocorreu um erro ao tentar excluir sua conta. Tente novamente.";
      toastStore.error(error);
    } finally {
      loading = false;
    }
  }

  function handleCancel() {
    dispatch("cancel");
  }
</script>

<div class="text-center">
  {#if error}
    <Alert color="red" class="mb-4 text-left">
      <span class="font-medium">Erro!</span>
      {error}
    </Alert>
  {/if}

  <svg
    class="w-12 h-12 mx-auto mb-4 text-red-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http:"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    ></path>
  </svg>

  <h3 class="mb-5 text-lg font-normal text-gray-800 dark:text-gray-400">
    Tem certeza que deseja excluir sua conta?
  </h3>

  <p class="mb-5 text-sm text-gray-600 dark:text-gray-500">
    Sua conta será marcada para exclusão e será removida permanentemente após 90
    dias. Durante esse período, você poderá restaurar sua conta, se desejar.
  </p>

  <div class="flex justify-center gap-4">
    <Button color="alternative" on:click={handleCancel} disabled={loading}>
      Cancelar
    </Button>
    <Button color="red" on:click={handleDeleteAccount} disabled={loading}>
      {loading ? "Processando..." : "Sim, excluir minha conta"}
    </Button>
  </div>
</div>
