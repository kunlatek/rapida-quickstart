<script>
  import { onMount } from "svelte";
  import KuToast from "$lib/components/common/KuToast.svelte";
  import KuNavbar from "$lib/components/common/KuNavbar.svelte";
  import KuFooter from "$lib/components/common/KuFooter.svelte";
  import { authStore } from "$stores/auth";
  import { profileService } from "$services/profile";
  import { goto } from "$app/navigation";
  import ThemeProvider from "$lib/components/theme/ThemeProvider.svelte";
  import {
    accountDeletionStore,
    fetchDeletionStatus,
  } from "$stores/account-deletion";

  import "../app.css";
  import "$lib/styles/flowbite.css";
  import "$lib/styles/contentCard.css";
  import "$lib/styles/theme.css";

  // Modified hasActiveRole calculation to consider the deleted account status
  let hasActiveRole = false;
  let accountIsDeleted = false;

  // This function detects if route is protected
  function isProtectedRoute(path) {
    // List of public routes that don't require authentication
    const publicRoutes = [
      "/auth/login",
      "/auth/register",
      "/profile/select",
      "/profile/role-select",
    ];

    // Route is protected if it's not in the public routes list
    return !publicRoutes.some((route) => path.startsWith(route));
  }

  onMount(async () => {
    const currentPath = window.location.pathname;

    // Check if account is marked for deletion
    if ($authStore.isAuthenticated) {
      await fetchDeletionStatus();
      accountIsDeleted = $accountDeletionStore.isDeleted;
    }

    // Verify active role
    hasActiveRole = !!$authStore.user?.activeRole;

    // Redirect to role selection if authenticated but no active role
    if (
      $authStore.isAuthenticated &&
      !hasActiveRole &&
      isProtectedRoute(currentPath)
    ) {
      console.log("No active role, redirecting to role selection");
      goto("/profile/role-select");
      return;
    }

    // If account is deleted and user is not on dashboard, redirect to dashboard
    if (
      $authStore.isAuthenticated &&
      $accountDeletionStore.isDeleted &&
      currentPath !== "/dashboard"
    ) {
      console.log("Account is marked for deletion, redirecting to dashboard");
      goto("/dashboard");
      return;
    }

    // Check for profiles
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

  // Update reactively when auth store or deletion status changes
  $: hasActiveRole = !!$authStore.user?.activeRole;
  $: accountIsDeleted = $accountDeletionStore.isDeleted;
</script>

<ThemeProvider>
  <!-- Show menu only if user has an active role AND account is not deleted -->
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
