<script>
  import { onMount } from "svelte";
  import { authStore } from "$stores/auth";
  import { profileStore, loadProfiles } from "$stores/profile";
  import { Heading } from "flowbite-svelte";
  import { goto } from "$app/navigation";
  import { toastStore } from "$stores/toast";

  // Loading state when no profile is in the store yet
  let loading = false;

  onMount(async () => {
    if (!$authStore.isAuthenticated) {
      toastStore.error("Você precisa estar logado para acessar esta página");
      goto("/auth/login");
      return;
    }

    // If not loaded yet, load profiles
    if (!$profileStore.isLoaded) {
      loading = true;
      try {
        await loadProfiles();
        console.log('ryzzan:', $profileStore);
      } catch (error) {
        console.error("Erro ao carregar perfis:", error);
      } finally {
        loading = false;
      }
    }
  });
</script>

<svelte:head>
  <title>Dashboard - Rapida Quickstart</title>
</svelte:head>

<div class="px-4 pt-6 pb-20">
  <div class="mb-8">
    <Heading
      tag="h1"
      class="text-2xl font-bold text-gray-900 dark:text-white mb-2"
    >
      Dashboard
    </Heading>
    <p class="text-gray-600 dark:text-gray-400">
      Olá, {$profileStore.person ? $profileStore.person?.personName : $profileStore.company?.businessName }!
    </p>
  </div>
</div>
