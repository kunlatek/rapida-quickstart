<script>
  import { goto } from "$app/navigation";
  import { toastStore } from "$lib/stores/toast";
  import { Button, Card, Input, Label, Alert, Spinner } from "flowbite-svelte";
  import AuthLayout from "$lib/components/layout/AuthLayout.svelte";
  import { userService } from "$services/user";
  import GoogleLoginButton from "$lib/components/pages/auth/GoogleLoginButton.svelte";
  import AppleLoginButton from "$lib/components/pages/auth/AppleLoginButton.svelte";
  import { onMount } from "svelte";

  // Form data and state
  let email = "";
  let password = "";
  let confirmPassword = "";
  let token = "";
  let loading = false;
  let errorMessage = "";
  let googleLoading = false;
  let appleLoading = false;

  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get("email");
    const tokenParam = urlParams.get("token");
    
    if (emailParam) {
      email = emailParam;
    }

    if (tokenParam) {
      token = tokenParam;
    }
  });

  // Form validation
  $: passwordMatch = password === confirmPassword;
  $: passwordLength = password.length >= 8;
  $: formIsValid =
    email && password && confirmPassword && passwordMatch && passwordLength;

  // Handle registration form submission
  async function handleRegister() {
    // Validate fields
    if (!email || !password || !confirmPassword) {
      errorMessage = "Por favor, preencha todos os campos";
      return;
    }

    if (password !== confirmPassword) {
      errorMessage = "As senhas não coincidem";
      return;
    }

    if (password.length < 8) {
      errorMessage = "A senha deve ter pelo menos 8 caracteres";
      return;
    }

    try {
      loading = true;
      errorMessage = "";

      await userService.invitationRegister(email, password, token);

      toastStore.add(
        "Conta criada com sucesso! Faça login para continuar.",
        "success"
      );
      goto("/auth/login");
    } catch (error) {
      console.error("Erro no registro:", error);
      errorMessage =
        error.response?.data?.message ||
        "Erro ao criar conta. Verifique os dados e tente novamente.";
      toastStore.add(errorMessage, "error");
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Criar Conta - Rapida Quickstart</title>
</svelte:head>

<AuthLayout>
  <Card class="w-full max-w-md mx-auto">
    <div class="flex flex-col items-center">
      <img src="/images/logo.svg" alt="Logo" class="h-16 mb-6" />
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Criar nova conta
      </h2>

      {#if errorMessage}
        <Alert color="red" class="mb-4 w-full">{errorMessage}</Alert>
      {/if}

      <form on:submit|preventDefault={handleRegister} class="w-full space-y-4">
        <div>
          <Label for="email" class="mb-2">Email</Label>
          <Input
            type="email"
            id="email"
            placeholder="nome@empresa.com"
            bind:value={email}
            required
            disabled={true}
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
            disabled={loading}
            color={password ? (passwordLength ? "green" : "red") : ""}
          />
          <p
            class="text-xs mt-1"
            class:text-green-600={passwordLength}
            class:text-red-600={password && !passwordLength}
            class:text-gray-500={!password}
          >
            A senha deve ter pelo menos 8 caracteres
          </p>
        </div>

        <div>
          <Label for="confirm-password" class="mb-2">Confirmar Senha</Label>
          <Input
            type="password"
            id="confirm-password"
            placeholder="••••••••"
            bind:value={confirmPassword}
            required
            disabled={loading}
            color={confirmPassword ? (passwordMatch ? "green" : "red") : ""}
          />
          {#if confirmPassword && !passwordMatch}
            <p class="text-xs text-red-600 mt-1">As senhas não coincidem</p>
          {/if}
        </div>

        <Button
          type="submit"
          class="w-full"
          color="blue"
          disabled={loading || !formIsValid}
        >
          {#if loading}
            <div class="flex items-center justify-center">
              <Spinner class="mr-3" size="sm" />
              Registrando...
            </div>
          {:else}
            Criar Conta
          {/if}
        </Button>

        <div
          class="text-sm font-medium text-gray-500 dark:text-gray-400 text-center"
        >
          Já tem uma conta? <a
            href="/auth/login"
            class="text-blue-600 hover:underline dark:text-blue-500"
            >Fazer login</a
          >
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

      <p class="mt-4 text-xs text-gray-500 dark:text-gray-400">
        Ao criar uma conta, você concorda com nossos
        <a
          href="/terms-of-service"
          class="text-blue-600 hover:underline dark:text-blue-500"
        >
          Termos de Serviço
        </a>
        e
        <a
          href="/privacy-policy"
          class="text-blue-600 hover:underline dark:text-blue-500"
        >
          Política de Privacidade
        </a>.
      </p>
    </div>
  </Card>
</AuthLayout>
