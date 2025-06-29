<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { authStore } from "$stores/auth";
  import { toastStore } from "$lib/stores/toast";
  import { browser } from "$app/environment";
  import { profileService } from "$services/profile";
  import {
    accountDeletionStore,
    fetchDeletionStatus,
  } from "$lib/stores/account-deletion";
  import KuLoading from "../../lib/components/common/KuLoading.svelte";
  import type { IProfileCheckResult } from "$lib/interfaces/profile.interfaces";

  let loading = true;
  let isCheckingProfiles = false;

  onMount(async () => {
    if (!$authStore.isAuthenticated) {
      toastStore.error("Você precisa estar logado para acessar esta página");
      goto("/auth/login");
      return;
    }

    await fetchDeletionStatus();

    if (!$accountDeletionStore.isDeleted && !$authStore.user?.activeRole) {
      toastStore.error(
        "Você precisa selecionar um papel para acessar esta página"
      );
      goto("/profile/role-select");
      return;
    }

    if (!$accountDeletionStore.isDeleted && !isCheckingProfiles) {
      isCheckingProfiles = true;

      try {
        if (!$authStore.user) {
          toastStore.error("Sessão inválida. Por favor, faça login novamente.");
          goto("/auth/login");
          return;
        }
        const profiles: IProfileCheckResult =
          await profileService.checkUserProfiles($authStore.user.userId);

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

  $: if (browser && !$authStore.isAuthenticated) {
    goto("/auth/login");
  }

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
  <KuLoading />
{:else}
  <div class="w-full p-6">
    <slot />
  </div>
{/if}
