<script lang="ts">
  import { KuInput, KuButton } from "$lib/components/form";
  import { authService } from "$services/auth";
  import { toastStore } from "$lib/stores/toast";
  import { goto } from "$app/navigation";
  import AuthLayout from "$lib/components/layout/AuthLayout.svelte";
  import { Alert } from "flowbite-svelte";
  import { mapBackendErrorToFrontendMessage } from "$lib/services/errorMapper";

  let email = "";
  let loading = false;
  let errorMessage = "";
  let success = false;

  async function handleSubmit() {
    loading = true;
    errorMessage = "";

    if (!email) {
      errorMessage = "Email é obrigatório";
      loading = false;
      return;
    }

    try {
      const response = await authService.registerInit(email);
      success = true;
      toastStore.success(
        "Email de registro enviado com sucesso! Verifique sua caixa de entrada."
      );
    } catch (error: any) {
      console.error("Error sending register email:", error);
      const mappedError = mapBackendErrorToFrontendMessage(error) || "Erro ao enviar email de registro.";
      toastStore.error(mappedError);
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Criar Conta - Rapida Quickstart</title>
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
        Criar nova conta
      </h2>

      {#if success}
        <Alert color="green" class="mb-4 w-full">
          Email enviado com sucesso! Verifique sua caixa de entrada para
          continuar o cadastro.
        </Alert>
      {/if}

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

      {#if !success}
        <p class="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
          Digite seu email abaixo e enviaremos um link para completar seu
          cadastro.
        </p>

        <form on:submit|preventDefault={handleSubmit} class="w-full space-y-6">
          <KuInput
            name="email"
            label="Email"
            dataType="email"
            bind:value={email}
            error={errorMessage && !email ? "Email é obrigatório" : ""}
            isRequired={true}
            placeholder="seu@email.com"
          />

          <KuButton
            label={loading ? "Enviando..." : "Enviar Email de Cadastro"}
            actionType="submit"
            isDisabled={loading}
            customClass="w-full"
          />
        </form>
      {/if}

      <div class="text-sm text-center mt-6">
        <p class="text-gray-500 dark:text-gray-400">
          Já tem uma conta?
          <a
            href="/auth/login"
            class="font-medium text-blue-600 hover:underline dark:text-blue-500"
          >
            Fazer login
          </a>
        </p>
      </div>
    </div>
  </div>
</AuthLayout>
