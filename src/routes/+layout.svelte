<script>
  import { onMount } from "svelte";
  import KuToast from "$lib/components/common/KuToast.svelte";
  import KuNavbar from "$lib/components/common/KuNavbar.svelte";
  import KuFooter from "$lib/components/common/KuFooter.svelte";
  import { authStore } from "$lib/stores/auth";
  import { profileService } from "$services/profile";
  import { goto } from "$app/navigation";
  import ThemeProvider from "$lib/components/theme/ThemeProvider.svelte";
  import {
    accountDeletionStore,
    fetchDeletionStatus,
  } from "$lib/stores/account-deletion";

  import "../app.css";
  import "$lib/styles/flowbite.css";
  import "$lib/styles/contentCard.css";
  import "$lib/styles/theme.css";

  import { _, i18n as i18nStore } from "svelte-i18n";
  import "$lib/i18n";

  let hasActiveRole = false;
  let accountIsDeleted = false;

  function isProtectedRoute(path) {
    const publicRoutes = [
      "/auth/login",
      "/auth/register",
      "/profile/select",
      "/profile/role-select",
    ];

    return !publicRoutes.some((route) => path.startsWith(route));
  }

  onMount(async () => {
    const currentPath = window.location.pathname;

    if ($authStore.isAuthenticated) {
      await fetchDeletionStatus();
      accountIsDeleted = $accountDeletionStore.isDeleted;
    }

    hasActiveRole = !!$authStore.user?.activeRole;

    if (
      $authStore.isAuthenticated &&
      !hasActiveRole &&
      isProtectedRoute(currentPath)
    ) {
      console.log("No active role, redirecting to role selection");
      goto("/profile/role-select");
      return;
    }

    if (
      $authStore.isAuthenticated &&
      $accountDeletionStore.isDeleted &&
      currentPath !== "/dashboard"
    ) {
      console.log("Account is marked for deletion, redirecting to dashboard");
      goto("/dashboard");
      return;
    }

    if (
      $authStore.isAuthenticated &&
      !currentPath.includes("/profile/") &&
      !currentPath.includes("/auth/") &&
      currentPath !== "/dashboard"
    ) {
      try {
        const profiles = await profileService.checkUserProfiles(
          $authStore.user.userId
        );

        if (!profiles.hasPerson && !profiles.hasCompany) {
          console.log("Redirecionando para seleção de perfil do layout");
          goto("/profile/select");
        }
      } catch (error) {
        console.error("Erro ao verificar perfis no layout:", error);
      }
    }
  });

  $: hasActiveRole = !!$authStore.user?.activeRole;
  $: accountIsDeleted = $accountDeletionStore.isDeleted;
</script>

{#await $i18nStore}
  <p>Carregando traduções...</p>
{:then _}
  <ThemeProvider>
    <KuNavbar
      showMenu={$authStore.isAuthenticated
        ? !!$authStore.user?.activeRole && !$accountDeletionStore.isDeleted
        : true}
    />

    <div class="flex flex-col min-h-screen">
      <div class="flex-grow container mx-auto px-4 py-8">
        <slot />
      </div>
    </div>

    <KuFooter />
    <KuToast />
  </ThemeProvider>
{/await}
