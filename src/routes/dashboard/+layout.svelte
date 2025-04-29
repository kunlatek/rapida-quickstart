<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { authStore } from "$stores/auth";
  import { toastStore } from "$stores/toast";
  import { browser } from "$app/environment";

  onMount(() => {
    if (!$authStore.isAuthenticated) {
      toastStore.error("Você precisa estar logado para acessar esta página");
      goto("/auth/login");
    }
  });

  $: if (browser && $authStore && !$authStore.isAuthenticated) {
    goto("/auth/login");
  }
</script>

<div class="w-full p-6">
  <slot />
</div>
