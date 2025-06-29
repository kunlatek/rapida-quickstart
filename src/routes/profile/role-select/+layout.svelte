<script>
  import KuToast from "$lib/components/common/KuToast.svelte";
  import { authStore } from "$lib/stores/auth";
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  import "../../../app.css";

  onMount(() => {
    if (browser && !$authStore.isAuthenticated) {
      goto("/auth/login");
      return;
    }

    // If user already has an active role, redirect to dashboard
    if (browser && $authStore.isAuthenticated && $authStore.user?.activeRole) {
      goto("/dashboard");
    }
  });
</script>

<div class="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
  <div class="flex-grow container mx-auto px-4 py-8">
    <slot />
  </div>
</div>

<KuToast />
