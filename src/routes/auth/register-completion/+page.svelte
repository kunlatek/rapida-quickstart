<script lang="ts">
  import { goto } from "$app/navigation";
  import { toastStore } from "$lib/stores/toast";
  import { Alert } from "flowbite-svelte"; 
  import AuthLayout from "$lib/components/layout/AuthLayout.svelte";
  import { userService } from "$services/user";
  import GoogleLoginButton from "$lib/components/pages/auth/GoogleLoginButton.svelte";
  import AppleLoginButton from "$lib/components/pages/auth/AppleLoginButton.svelte";
  import { mapBackendErrorToFrontendMessage } from "$lib/services/errorMapper";
  import { KuInput, KuButton } from "$lib/components/form";
  import { onMount } from "svelte";

  let email = "";
  let password = "";
  let confirmPassword = "";
  let token = "";
  let loading = false;
  let errorMessage = "";
  let googleLoading = false;
  let appleLoading = false;

  $: passwordMatch = password === confirmPassword;
  $: passwordLength = password.length >= 8;
  $: formIsValid =
    email && password && confirmPassword && passwordMatch && passwordLength && token;

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

    if (!emailParam || !tokenParam) {
      toastStore.error("Link de registro inválido");
      goto("/auth/register");
    }
  });

  async function handleRegister(): Promise<void> {
    if (!email || !password || !confirmPassword) {
      errorMessage = "Por favor, preencha todos os campos";
      toastStore.error(errorMessage);
      return;
    }

    if (!passwordMatch) {
      errorMessage = "As senhas não coincidem";
      toastStore.error(errorMessage);
      return;
    }

    if (!passwordLength) {
      errorMessage = "A senha deve ter pelo menos 8 caracteres";
      toastStore.error(errorMessage);
      return;
    }

    try {
      loading = true;
      errorMessage = "";

      await userService.registerWithToken(email, password, token);

      toastStore.success(
        "Conta criada com sucesso! Faça login para continuar."
      );
      await goto("/auth/login");
    } catch (error: any) {
      console.error("Erro no registro:", error);
      const mappedError = mapBackendErrorToFrontendMessage(error);
      errorMessage = mappedError;
      toastStore.error(mappedError);
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Completar Cadastro - Rapida Quickstart</title>
</svelte:head>

<AuthLayout>
  <div
    role="main"
    class="w-full max-w-md mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 md:p-8"
  >
    <div class="flex flex-col items-center">
      <img
        src="/images/logo.svg"
        alt="Logo Rapida Quickstart"
        class="h-16 mb-6"
      />
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Complete seu cadastro
      </h2>

      {#if errorMessage && !loading}
        <Alert
          color="red"
          class="mb-4 w-full"
          dismissable
          on:close={() => (errorMessage = "")}
        >
          {errorMessage}
        </Alert>
      {/if}

      <form on:submit|preventDefault={handleRegister} class="w-full space-y-4">
        <KuInput
          id="email"
          name="email"
          dataType="email"
          label="Email"
          placeholder="nome@empresa.com"
          bind:value={email}
          isRequired={true}
          isDisabled={true}
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
            error={password !== "" && !passwordLength
              ? "A senha deve ter pelo menos 8 caracteres"
              : ""}
          />
          {#if password !== "" && !passwordLength}
            <p class="text-xs mt-1 text-red-600 dark:text-red-500">
              A senha deve ter pelo menos 8 caracteres
            </p>
          {:else if password !== "" && passwordLength}
            <p class="text-xs mt-1 text-green-600 dark:text-green-500">
              Força da senha adequada.
            </p>
          {/if}
        </div>

        <div>
          <KuInput
            id="confirm-password"
            name="confirmPassword"
            dataType="password"
            label="Confirmar Senha"
            placeholder="••••••••"
            bind:value={confirmPassword}
            isRequired={true}
            isDisabled={loading}
            error={confirmPassword !== "" && !passwordMatch
              ? "As senhas não coincidem"
              : ""}
          />
          {#if confirmPassword !== "" && !passwordMatch}
            <p class="text-xs text-red-600 dark:text-red-500 mt-1">
              As senhas não coincidem
            </p>
          {/if}
        </div>

        <KuButton
          actionType="submit"
          label={loading ? "Registrando..." : "Criar Conta"}
          isDisabled={loading || !formIsValid}
          customClass="w-full"
          variant="primary"
        />

        <div
          class="text-sm font-medium text-gray-500 dark:text-gray-400 text-center"
        >
          Já tem uma conta?
          
          <a href="/auth/login"
            class="text-blue-600 hover:underline dark:text-blue-500"
          >
            Fazer login
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

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <GoogleLoginButton bind:loading={googleLoading} />
          <AppleLoginButton bind:loading={appleLoading} />
        </div>
      </div>

      <p class="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
        Ao criar uma conta, você concorda com nossos
        
        <a href="/terms-of-service"
          class="text-blue-600 hover:underline dark:text-blue-500"
        >
          Termos de Serviço
        </a>
        e
        
        <a href="/privacy-policy"
          class="text-blue-600 hover:underline dark:text-blue-500"
        >
          Política de Privacidade
        </a>.
      </p>
    </div>
  </div>
</AuthLayout>