<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { authStore } from "$stores/auth";
  import { toastStore } from "$stores/toast";
  import { browser } from "$app/environment";
  import { profileService } from "$services/profile";
  import {
    accountDeletionStore,
    fetchDeletionStatus,
  } from "$stores/account-deletion";
  import Loading from "../../lib/components/common/Loading.svelte";

  let loading = true;
  let isCheckingProfiles = false;

  onMount(async () => {
    if (!$authStore.isAuthenticated) {
      toastStore.error("Você precisa estar logado para acessar esta página");
      goto("/auth/login");
      return;
    }

    // Check if user's account is marked for deletion
    await fetchDeletionStatus();

    // Only check for active role if account is not marked for deletion
    if (!$accountDeletionStore.isDeleted && !$authStore.user?.activeRole) {
      toastStore.error(
        "Você precisa selecionar um papel para acessar esta página"
      );
      goto("/profile/role-select");
      return;
    }

    // Only check for profiles if account is not marked for deletion
    if (!$accountDeletionStore.isDeleted && !isCheckingProfiles) {
      isCheckingProfiles = true;

      try {
        const profiles = await profileService.checkUserProfiles(
          $authStore.user.userId
        );

        // Only redirect if account is not marked for deletion
        if (
          !$accountDeletionStore.isDeleted &&
          !profiles.hasPerson &&
          !profiles.hasCompany
        ) {
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
    } else {
      loading = false;
    }
  });

  // Reactive statement to handle authentication state changes
  $: if (browser && !$authStore.isAuthenticated) {
    goto("/auth/login");
  }

  // Reactive statement to handle active role changes - only if account is not deleted
  $: if (
    browser &&
    $authStore.isAuthenticated &&
    !$authStore.user?.activeRole &&
    !$accountDeletionStore.isDeleted
  ) {
    goto("/profile/role-select");
  }
</script>

{#if loading}
  <Loading />
{:else}
  <div class="w-full p-6">
    <slot />
  </div>
{/if}
