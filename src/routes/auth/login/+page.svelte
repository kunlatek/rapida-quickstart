<script lang="ts">
  import { goto } from "$app/navigation";
  import { authService } from "$services/auth";
  import { authStore as rawAuthStore } from "$stores/auth";
  import { profileService } from "$services/profile";
  import { toastStore } from "$lib/stores/toast"; // Usando diretamente, vamos chamar .add()

  import { Card, Alert, Spinner, Checkbox, Label } from "flowbite-svelte";
  import AuthLayout from "$lib/components/layout/AuthLayout.svelte";
  import { onMount } from "svelte";
  import { KuInput, KuButton } from "$lib/components/form";
  import GoogleLoginButton from "$lib/components/pages/auth/GoogleLoginButton.svelte";
  import AppleLoginButton from "$lib/components/pages/auth/AppleLoginButton.svelte";
  import { mapBackendErrorToFrontendMessage } from "$lib/services/errorMapper";
  import type { Writable } from "svelte/store";

  // --- Interface Definitions for better Typing ---
  interface AuthUser {
    userId: string;
    email: string;
    activeRole: string | null;
    availableRoles: string[];
  }

  interface AuthStoreType {
    isAuthenticated: boolean;
    user: AuthUser | null;
    token: string | null;
  }

  const authStore = rawAuthStore as Writable<AuthStoreType>;

  interface ProfileCheckResult {
    hasPerson: boolean;
    hasCompany: boolean;
    personId: string | null;
    companyId: string | null;
  }

  // --- Component State ---
  let email = "";
  let password = "";
  let rememberMe = false;
  let loading = false;
  let googleLoading = false;
  let appleLoading = false;
  let errorMessage = "";

  async function checkAndRedirect(): Promise<void> {
    if ($authStore.isAuthenticated && $authStore.user) {
      try {
        const roleStatus = await authService.checkAndSetActiveRole();

        if (roleStatus.needsSelection) {
          console.log("Redirecionando para seleção de papel");
          await goto("/profile/role-select");
          return;
        }

        const userId = $authStore.user.userId;
        if (!userId) {
          console.error(
            "UserID não encontrado no authStore, mesmo após verificação."
          );
          toastStore.add("Erro de autenticação. Tente novamente.", "error");
          await authService.logout();
          await goto("/auth/login");
          return;
        }

        // Asserção de tipo explícita no resultado da Promise
        const profiles = (await profileService.checkUserProfiles(
          userId
        )) as ProfileCheckResult;

        console.log("Verificação de perfis após login:", profiles);

        if (!profiles.hasPerson && !profiles.hasCompany) {
          console.log("Redirecionando para seleção de perfil");
          await goto("/profile/select");
        } else {
          console.log("Redirecionando para dashboard");
          await goto("/dashboard");
        }
      } catch (error: unknown) {
        console.error("Erro ao verificar perfis:", error);
        toastStore.add(
          "Ocorreu um erro ao verificar seus perfis. Redirecionando para o dashboard.",
          "error"
        );
        await goto("/dashboard");
      }
    } else if ($authStore.isAuthenticated && !$authStore.user) {
      console.error(
        "Estado de autenticação inconsistente: autenticado mas sem dados de usuário."
      );
      toastStore.add(
        "Sua sessão é inválida. Por favor, faça login novamente.",
        "error"
      );
      await authService.logout();
      await goto("/auth/login");
    }
  }

  onMount(async () => {
    if ($authStore.isAuthenticated) {
      await checkAndRedirect();
    }
  });

  async function handleLogin(): Promise<void> {
    if (!email || !password) {
      errorMessage = "Por favor, preencha todos os campos";
      toastStore.add(errorMessage, "error"); // Usando toastStore.add
      return;
    }

    try {
      loading = true;
      errorMessage = "";

      await authService.login(email, password);
      toastStore.add("Login realizado com sucesso!", "success"); // Usando toastStore.add
      await checkAndRedirect();
    } catch (error: any) {
      console.error("Erro no login:", error);
      const mappedError = mapBackendErrorToFrontendMessage(error);
      errorMessage = mappedError;
      toastStore.add(mappedError, "error"); // Usando toastStore.add
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
        <Alert color="red" class="mb-4 w-full" dismissable>{errorMessage}</Alert
        >
      {/if}

      <form on:submit|preventDefault={handleLogin} class="w-full space-y-4">
        <KuInput
          id="email"
          name="email"
          dataType="email"
          label="Email"
          placeholder="nome@empresa.com"
          bind:value={email}
          isRequired={true}
          isDisabled={loading}
          error={errorMessage && !email ? "Email é obrigatório" : ""}
        />

        <div>
          <KuInput
            id="password"
            name="password"
            dataType="password"
            label="Senha"
            placeholder="••••••••"
            bind:value={password}
            isRequired={true}
            isDisabled={loading}
            error={errorMessage && !password ? "Senha é obrigatória" : ""}
          />
          <div class="flex items-center justify-between mt-2 mb-2">
            <a
              href="/auth/forgot-password"
              class="text-sm text-blue-600 hover:underline dark:text-blue-500"
            >
              Esqueceu sua senha?
            </a>
          </div>
        </div>

        <div class="flex items-center">
          <Checkbox
            id="remember"
            bind:checked={rememberMe}
            disabled={loading}
          />
          <Label for="remember" class="ml-2">Lembrar de mim</Label>
        </div>

        <KuButton
          actionType="submit"
          label={loading ? "Entrando..." : "Entrar"}
          isDisabled={loading || !email || !password}
          customClass="w-full"
        />

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
