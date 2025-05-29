<script>
  import { onMount } from "svelte";
  import { authStore } from "$stores/auth";
  import { profileStore, loadProfiles } from "$stores/profile";
  import { Heading } from "flowbite-svelte";
  import { goto } from "$app/navigation";
  import { toastStore } from "$lib/stores/toast";
  import { KuLoading } from "$lib/components/common";
  import AccountRestorationNotice from "$lib/components/pages/dashboard/AccountRestorationNotice.svelte";
  import { fetchDeletionStatus } from "$stores/account-deletion";

  let loading = false;

  onMount(async () => {
    if (!$authStore.isAuthenticated) {
      toastStore.error("Você precisa estar logado para acessar esta página");
      goto("/auth/login");
      return;
    }

    // Load profiles and check account deletion status
    loading = true;
    try {
      await Promise.all([loadProfiles(), fetchDeletionStatus()]);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Dashboard - Rapida Quickstart</title>
</svelte:head>

<div class="px-4 pt-6 pb-20">
  <!-- Account Restoration Notice -->
  <AccountRestorationNotice className="mb-6" />

  <div class="mb-8">
    <Heading
      tag="h1"
      class="text-2xl font-bold text-gray-900 dark:text-white mb-2"
    >
      Dashboard
    </Heading>
    <p class="text-gray-600 dark:text-gray-400">
      Olá, {$profileStore.person
        ? $profileStore.person?.personName
        : $profileStore.company?.businessName}!
    </p>
  </div>

  {#if loading}
    <KuLoading size="lg" text="Carregando dashboard..." />
  {:else}
    <!-- Dashboard content -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 class="font-bold text-lg mb-2 dark:text-white">Perfil</h2>
        <p class="text-gray-600 dark:text-gray-400">
          Gerencie suas informações pessoais e profissionais.
        </p>
      </div>

      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 class="font-bold text-lg mb-2 dark:text-white">Configurações</h2>
        <p class="text-gray-600 dark:text-gray-400">
          Ajuste as configurações da sua conta e preferências.
        </p>
      </div>

      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 class="font-bold text-lg mb-2 dark:text-white">Atividade</h2>
        <p class="text-gray-600 dark:text-gray-400">
          Visualize sua atividade recente na plataforma.
        </p>
      </div>
    </div>
  {/if}
</div>
