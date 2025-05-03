<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { authStore } from "$stores/auth";
  import { toastStore } from "$stores/toast";
  import { Card, Heading, Button } from "flowbite-svelte";
  import { UserRole } from "../../../enums/user-role.enum";

  // Nesta tela, assumimos que os papéis disponíveis já estão no JWT
  let canCreatePerson = true;
  let canCreateCompany = true;

  onMount(() => {
    console.log("Página de seleção carregada", $authStore);

    if (!$authStore.isAuthenticated) {
      toastStore.error("Você precisa estar logado para acessar esta página");
      goto("/auth/login");
      return;
    }

    // Verificar papéis já vinculados (que estão no token)
    const userRoles = $authStore.user?.availableRoles || [];

    // Se já tiver o papel, significa que o perfil já existe
    canCreatePerson = !userRoles.includes("person");
    canCreateCompany = !userRoles.includes("company");

    console.log("Pode criar perfis:", {
      pessoa: canCreatePerson,
      empresa: canCreateCompany,
    });

    // Se já tiver papéis ativos, redirecionar para o dashboard
    if (!canCreatePerson && !canCreateCompany) {
      toastStore.info("Você já possui todos os perfis disponíveis");
      goto("/dashboard");
    }
  });

  function goToPersonProfile() {
    goto("/profile/person/new");
  }

  function goToCompanyProfile() {
    goto("/profile/company/new");
  }
</script>

<svelte:head>
  <title>Selecionar Perfil - Rapida Quickstart</title>
</svelte:head>

<div class="max-w-4xl mx-auto pb-20">
  <div class="text-gray-500 dark:text-gray-400 mb-6 px-4">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
      Bem-vindo à Plataforma
    </h1>

    <div class="text-gray-700 dark:text-gray-300 mb-8">
      <p>
        Para continuar, você precisa criar pelo menos um perfil na plataforma.
        Escolha uma das opções abaixo:
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Card para perfil de pessoa -->
      {#if canCreatePerson}
        <div
          class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md"
        >
          <div class="mb-4">
            <h2 class="text-xl font-semibold mb-2">Perfil de Pessoa</h2>
            <p class="text-gray-600 dark:text-gray-400">
              Crie um perfil pessoal com suas informações, contatos e
              documentos.
            </p>
          </div>
          <Button color="blue" on:click={goToPersonProfile}
            >Criar Perfil de Pessoa</Button
          >
        </div>
      {/if}

      <!-- Card para perfil de empresa -->
      {#if canCreateCompany}
        <div
          class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md"
        >
          <div class="mb-4">
            <h2 class="text-xl font-semibold mb-2">Perfil de Empresa</h2>
            <p class="text-gray-600 dark:text-gray-400">
              Crie um perfil empresarial com informações da empresa, contatos e
              documentos.
            </p>
          </div>
          <Button color="blue" on:click={goToCompanyProfile}
            >Criar Perfil de Empresa</Button
          >
        </div>
      {/if}
    </div>

    <div class="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Você precisa criar pelo menos um perfil para acessar as funcionalidades
        da plataforma.
      </p>
    </div>
  </div>
</div>
