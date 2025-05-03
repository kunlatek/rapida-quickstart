<script>
  import { onMount } from "svelte";
  import Toast from "$lib/components/common/Toast.svelte";
  import Navbar from "$lib/components/common/Navbar.svelte";
  import Footer from "$lib/components/common/Footer.svelte";
  import { authStore } from "$stores/auth";
  import { profileService } from "$services/profile";
  import { goto } from "$app/navigation";

  import "../app.css";

  // Track if user has active role
  let hasActiveRole = false;

  // Check if current route should be protected by active role
  function isProtectedRoute(path) {
    // Routes that don't require active role
    const publicRoutes = [
      "/auth/login",
      "/auth/register",
      "/profile/select",
      "/profile/role-select",
    ];

    // Check if current path is in public routes
    return !publicRoutes.some((route) => path.startsWith(route));
  }

  onMount(async () => {
    const currentPath = window.location.pathname;

    // Update hasActiveRole based on authStore
    hasActiveRole = !!$authStore.user?.activeRole;

    // If authenticated but with no active role and trying to access protected route
    if (
      $authStore.isAuthenticated &&
      !hasActiveRole &&
      isProtectedRoute(currentPath)
    ) {
      console.log("No active role, redirecting to role selection");
      goto("/profile/role-select");
      return;
    }

    // Original profile checking logic
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

  // Reactive statement to update hasActiveRole when auth store changes
  $: hasActiveRole = !!$authStore.user?.activeRole;
</script>

<!-- Fixed the conditional rendering to prevent DOM hierarchy errors -->
<Navbar
  showMenu={$authStore.isAuthenticated ? !!$authStore.user?.activeRole : true}
/>

<div class="flex flex-col min-h-screen">
  <div class="flex-grow container mx-auto px-4 py-8">
    <slot />
  </div>
</div>

<Footer />
<Toast />
