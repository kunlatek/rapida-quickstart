<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { authStore } from "$stores/auth";
  import { toastStore } from "$stores/toast";
  import { browser } from "$app/environment";
  import { profileService } from "$services/profile";

  let loading = true;
  let isCheckingProfiles = false;

  onMount(async () => {
    if (!$authStore.isAuthenticated) {
      toastStore.error("Você precisa estar logado para acessar esta página");
      goto("/auth/login");
      return;
    }

    // Check if user has active role
    if (!$authStore.user?.activeRole) {
      toastStore.error(
        "Você precisa selecionar um papel para acessar esta página"
      );
      goto("/profile/role-select");
      return;
    }

    // Check for profiles
    if (!isCheckingProfiles) {
      isCheckingProfiles = true;

      try {
        const profiles = await profileService.checkUserProfiles(
          $authStore.user.userId
        );

        // If user has no profiles, redirect to profile selection
        if (!profiles.hasPerson && !profiles.hasCompany) {
          toastStore.info(
            "Você precisa criar um perfil para acessar a plataforma"
          );
          goto("/profile/select");
          return;
        }
      } catch (error) {
        console.error("Erro ao verificar perfis do usuário:", error);
      } finally {
        loading = false;
        isCheckingProfiles = false;
      }
    }
  });

  // Reactive check for authentication status
  $: if (browser && !$authStore.isAuthenticated) {
    goto("/auth/login");
  }

  // Reactive check for active role
  $: if (
    browser &&
    $authStore.isAuthenticated &&
    !$authStore.user?.activeRole
  ) {
    goto("/profile/role-select");
  }
</script>

{#if loading}
  <div class="flex justify-center items-center w-full h-full min-h-[300px]">
    <div
      class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"
    ></div>
  </div>
{:else}
  <div class="w-full p-6">
    <slot />
  </div>
{/if}
