<script>
  import { goto } from "$app/navigation";
  import { authService } from "$services/auth";
  import { toastStore } from "$stores/toast";
  import { authStore } from "$stores/auth";
  import { profileService } from "$services/profile";
  import { Card, Alert, Spinner, Checkbox, Label } from "flowbite-svelte";
  import AuthLayout from "$lib/components/layout/AuthLayout.svelte";
  import { onMount } from "svelte";
  import { KuInput, KuButton } from "$lib/components/form";
  import GoogleLoginButton from "../../../lib/components/pages/auth/GoogleLoginButton.svelte";
  import AppleLoginButton from "../../../lib/components/pages/auth/AppleLoginButton.svelte";

  // Variáveis de estado do formulário
  let email = "";
  let password = "";
  let rememberMe = false;
  let loading = false;
  let googleLoading = false;
  let appleLoading = false;
  let errorMessage = "";

  // Função para verificar papel ativo e redirecionar
  async function checkAndRedirect() {
    if ($authStore.isAuthenticated) {
      try {
        // Verifica o status do papel ativo
        const roleStatus = await authService.checkAndSetActiveRole();

        // Se o usuário tem múltiplos papéis disponíveis e nenhum ativo
        if (roleStatus.needsSelection) {
          console.log("Redirecionando para seleção de papel");
          goto("/profile/role-select");
          return;
        }

        // Verifica se o usuário possui perfis criados
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

  // Verifica autenticação ao carregar a página
  onMount(() => {
    if ($authStore.isAuthenticated) {
      checkAndRedirect();
    }
  });

  // Função para realizar o login
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
        <KuInput
          name="email"
          dataType="email"
          label="Email"
          placeholder="nome@empresa.com"
          bind:value={email}
          isRequired={true}
          isDisabled={loading}
        />

        <div>
          <KuInput
            name="password"
            dataType="password"
            label="Senha"
            placeholder="••••••••"
            bind:value={password}
            isRequired={true}
            isDisabled={loading}
          />
          <div class="flex items-center justify-between mb-2">
            <a
              href="/auth/forgot-password"
              class="text-sm text-blue-600 hover:underline dark:text-blue-500"
            >
              Esqueceu sua senha?
            </a>
          </div>
        </div>

        <div class="flex items-center">
          <Checkbox id="remember" bind:checked={rememberMe} />
          <Label for="remember" class="ml-2">Lembrar de mim</Label>
        </div>

        <KuButton
          actionType="submit"
          label={loading ? "Entrando..." : "Entrar"}
          isDisabled={loading}
          customClass="w-full"
        >
          {#if loading}
            <div class="flex items-center justify-center">
              <Spinner class="mr-3" size="sm" />
            </div>
          {/if}
        </KuButton>

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
