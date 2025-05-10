<script>
  import { goto } from "$app/navigation";
  import { authService } from "$services/auth";
  import { toastStore } from "$stores/toast";
  import { authStore } from "$stores/auth";
  import { profileService } from "$services/profile";
  import {
    Button,
    Card,
    Input,
    Label,
    Checkbox,
    Alert,
    Spinner,
  } from "flowbite-svelte";
  import AuthLayout from "$lib/components/layout/AuthLayout.svelte";
  import { onMount } from "svelte";
  import GoogleLoginButton from "$lib/components/pages/auth/GoogleLoginButton.svelte";
  import AppleLoginButton from "$lib/components/pages/auth/AppleLoginButton.svelte";

  // Form data and state
  let email = "";
  let password = "";
  let rememberMe = false;
  let loading = false;
  let googleLoading = false;
  let appleLoading = false;
  let errorMessage = "";

  // Handle redirects if already logged in
  async function checkAndRedirect() {
    if ($authStore.isAuthenticated) {
      try {
        // Check if the user needs to select a role
        const roleStatus = await authService.checkAndSetActiveRole();

        // Redirect based on role status
        if (roleStatus.needsSelection) {
          console.log("Redirecionando para seleção de papel");
          goto("/profile/role-select");
          return;
        }

        // Check if the user has any profiles
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

  // Check if already logged in on mount
  onMount(() => {
    if ($authStore.isAuthenticated) {
      checkAndRedirect();
    }
  });

  // Handle login form submission
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
</script>

<svelte:head>
  <title>Login - Rapida Quickstart</title>
</svelte:head>

<AuthLayout>
  <Card class="w-full max-w-md mx-auto">
    <div class="flex flex-col items-center">
      <img src="/images/logo.svg" alt="Logo" class="h-16 mb-6" />
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
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
            disabled={loading}
          />
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <Label for="password">Senha</Label>
            <a
              href="/auth/forgot-password"
              class="text-sm text-blue-600 hover:underline dark:text-blue-500"
            >
              Esqueceu sua senha?
            </a>
          </div>
          <Input
            type="password"
            id="password"
            placeholder="••••••••"
            bind:value={password}
            required
            disabled={loading}
          />
        </div>

        <div class="flex items-center">
          <Checkbox id="remember" bind:checked={rememberMe} />
          <Label for="remember" class="ml-2">Lembrar de mim</Label>
        </div>

        <Button type="submit" class="w-full" color="blue" disabled={loading}>
          {#if loading}
            <div class="flex items-center justify-center">
              <Spinner class="mr-3" size="sm" />
              Entrando...
            </div>
          {:else}
            Entrar
          {/if}
        </Button>

        <div
          class="text-sm font-medium text-gray-500 dark:text-gray-400 text-center"
        >
          Não tem uma conta?
          <a
            href="/auth/register"
            class="text-blue-600 hover:underline dark:text-blue-500"
          >
            Criar conta
          </a>
        </div>
      </form>

      <div class="flex flex-col w-full mt-4 space-y-3">
        <div class="relative flex items-center justify-center w-full">
          <hr class="w-full border-gray-300 dark:border-gray-600" />
          <span
            class="absolute px-3 text-xs text-gray-500 bg-white dark:bg-gray-800 dark:text-gray-400"
          >
            ou continue com
          </span>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <GoogleLoginButton bind:loading={googleLoading} />
          <AppleLoginButton bind:loading={appleLoading} />
        </div>
      </div>
    </div>
  </Card>
</AuthLayout>
