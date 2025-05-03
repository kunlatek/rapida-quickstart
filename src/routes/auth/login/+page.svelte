<script>
  import { goto } from "$app/navigation";
  import { authService } from "$services/auth";
  import { toastStore } from "$stores/toast";
  import { authStore } from "$stores/auth";
  import { profileService } from "$services/profile";
  import { Button, Card, Input, Label, Checkbox, Alert } from "flowbite-svelte";
  import AuthLayout from "$components/layout/AuthLayout.svelte";
  import { onMount } from "svelte";

  let email = "";
  let password = "";
  let rememberMe = false;
  let loading = false;
  let errorMessage = "";

  async function checkAndRedirect() {
    if ($authStore.isAuthenticated) {
      try {
        // First check if the user already has an active role or needs to select one
        const roleStatus = await authService.checkAndSetActiveRole();

        // If the user needs to select a role from multiple available ones
        if (roleStatus.needsSelection) {
          console.log("Redirecionando para seleção de papel");
          goto("/profile/role-select");
          return;
        }

        // Check if user has any profiles
        const profiles = await profileService.checkUserProfiles(
          $authStore.user.userId
        );

        console.log("Verificação de perfis após login:", profiles);

        if (!profiles.hasPerson && !profiles.hasCompany) {
          console.log("Redirecionando para seleção de perfil");
          goto("/profile/select");
        } else {
          console.log("Redirecionando para dashboard");
          goto("/dashboard");
        }
      } catch (error) {
        console.error("Erro ao verificar perfis:", error);

        goto("/dashboard");
      }
    }
  }

  // Check authentication status on mount
  onMount(() => {
    if ($authStore.isAuthenticated) {
      checkAndRedirect();
    }
  });

  async function handleLogin() {
    if (!email || !password) {
      errorMessage = "Por favor, preencha todos os campos";
      return;
    }

    try {
      loading = true;
      errorMessage = "";

      await authService.login(email, password);
      toastStore.success("Login realizado com sucesso!");
      checkAndRedirect();
    } catch (error) {
      console.error("Erro no login:", error);
      errorMessage =
        error.response?.data?.message ||
        "Erro ao fazer login. Verifique suas credenciais.";
      toastStore.error(errorMessage);
    } finally {
      loading = false;
    }
  }

  async function handleGoogleLogin() {
    // This would be implemented with the Google API

    alert("Esta funcionalidade seria implementada com a API do Google");
  }

  async function handleAppleLogin() {
    // This would be implemented with the Apple API

    alert("Esta funcionalidade seria implementada com a API da Apple");
  }
</script>

<svelte:head>
  <title>Login - Rapida Quickstart</title>
</svelte:head>

<AuthLayout>
  <Card class="w-full max-w-md">
    <div class="flex flex-col items-center">
      <img src="/images/logo.svg" alt="Logo" class="h-16 mb-6" />
      <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Entrar na sua conta
      </h2>

      {#if errorMessage}
        <Alert color="red" class="mb-4 w-full">{errorMessage}</Alert>
      {/if}

      <form on:submit|preventDefault={handleLogin} class="w-full space-y-4">
        <div>
          <Label for="email" class="mb-2">Email</Label>
          <Input
            type="email"
            id="email"
            placeholder="nome@empresa.com"
            bind:value={email}
            required
          />
        </div>

        <div>
          <Label for="password" class="mb-2">Senha</Label>
          <Input
            type="password"
            id="password"
            placeholder="••••••••"
            bind:value={password}
            required
          />
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <Checkbox id="remember" bind:checked={rememberMe} />
            <Label for="remember" class="ml-2">Lembrar de mim</Label>
          </div>
          <a
            href="/auth/forgot-password"
            class="text-sm text-primary-600 hover:underline dark:text-primary-500"
          >
            Esqueceu sua senha?
          </a>
        </div>

        <Button type="submit" class="w-full" color="blue" disabled={loading}>
          {loading ? "Aguarde..." : "Entrar"}
        </Button>

        <div
          class="text-sm font-medium text-gray-500 dark:text-gray-400 text-center"
        >
          Não tem uma conta? <a
            href="/auth/register"
            class="text-primary-600 hover:underline dark:text-primary-500"
            >Criar conta</a
          >
        </div>
      </form>

      <div class="flex flex-col w-full mt-4 space-y-3">
        <div class="relative flex items-center justify-center w-full">
          <hr class="w-full border-gray-300 dark:border-gray-600" />
          <span
            class="absolute px-3 text-xs text-gray-500 bg-white dark:bg-gray-800 dark:text-gray-400"
            >ou continue com</span
          >
        </div>

        <div class="grid grid-cols-2 gap-3">
          <Button color="alternative" on:click={handleGoogleLogin}>
            <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
              />
            </svg>
            Google
          </Button>
          <Button color="alternative" on:click={handleAppleLogin}>
            <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.09,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"
              />
            </svg>
            Apple
          </Button>
        </div>
      </div>
    </div>
  </Card>
</AuthLayout>
