<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { authStore } from "$stores/auth";
  import { toastStore } from "$lib/stores/toast";
  import { Card, Heading, Button } from "flowbite-svelte";
  import { authService } from "$services/auth";

  let availableRoles: string[] = [];

  onMount(() => {
    console.log("Página de seleção de papel carregada", $authStore);

    if (!$authStore.isAuthenticated) {
      toastStore.error("Você precisa estar logado para acessar esta página");
      goto("/auth/login");
      return;
    }

    availableRoles = $authStore.user?.availableRoles || [];

    if (availableRoles.length <= 1) {
      if (availableRoles.length === 1) {
        selectRole(availableRoles[0]);
      } else {
        toastStore.info("Você não possui papéis disponíveis");
        goto("/profile/select");
      }
    }
  });

  async function selectRole(role: string) {
    try {
      const success = await authService.switchRole(role);
      if (success) {
        toastStore.success(`Papel "${role}" ativado com sucesso!`);
        goto("/dashboard");
      } else {
        toastStore.error("Não foi possível ativar o papel selecionado");
      }
    } catch (error) {
      console.error("Erro ao selecionar papel:", error);
      toastStore.error("Erro ao ativar o papel. Tente novamente.");
    }
  }
</script>

<svelte:head>
  <title>Selecionar Papel Ativo - Rapida Quickstart</title>
</svelte:head>

<div class="max-w-4xl mx-auto pb-20">
  <div class="text-gray-500 dark:text-gray-400 mb-6 px-4">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
      Selecione seu Papel Ativo
    </h1>

    <div class="text-gray-700 dark:text-gray-300 mb-8">
      <p>
        Você possui múltiplos papéis disponíveis. Escolha qual papel deseja
        utilizar nesta sessão:
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {#each availableRoles as role}
        <div
          class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md"
        >
          <div class="mb-4">
            <h2 class="text-xl font-semibold mb-2">
              Papel: {role === "company" ? "Empresa" : "Pessoa"}
            </h2>
            <p class="text-gray-600 dark:text-gray-400">
              Ativar este papel para acessar as funcionalidades correspondentes.
            </p>
          </div>
          <Button color="blue" on:click={() => selectRole(role)}>
            Ativar Papel {role === "company" ? "de Empresa" : "de Pessoa"}
          </Button>
        </div>
      {/each}
    </div>

    <div class="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Você poderá alternar entre os papéis posteriormente através do menu do
        usuário.
      </p>
    </div>
  </div>
</div>
