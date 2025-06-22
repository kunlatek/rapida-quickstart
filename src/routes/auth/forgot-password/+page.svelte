<script lang="ts">
  import { KuInput, KuButton } from '$lib/components/form';
  import { authService } from '$services/auth';
  import { toastStore } from '$lib/stores/toast';
  import { goto } from '$app/navigation';

  let email = '';
  let loading = false;
  let errors = { email: '' };

  async function handleSubmit() {
    loading = true;
    errors = { email: '' }; // Reset errors

    if (!email) {
      errors.email = 'Email é obrigatório';
      loading = false;
      return;
    }

    try {
      await authService.forgotPassword(email);
      toastStore.add(
        "Email de redefinição de senha enviado com sucesso! Verifique sua caixa de entrada.",
        "success"
      );
    } catch (error: any) {
      console.error("Error sending forgot password email:", error);
      toastStore.add(
        error.response?.data?.message ||
          "Erro ao enviar email de redefinição de senha.",
        "error"
      );
    } finally {
      loading = false;
    }
  }
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
  <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
    <h1 class="text-2xl font-bold text-center text-gray-900 dark:text-white">Esqueceu sua Senha?</h1>
    <p class="text-center text-sm text-gray-600 dark:text-gray-400">
      Digite seu email abaixo e enviaremos um link para redefinir sua senha.
    </p>
    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
      <KuInput
        name="email"
        label="Email"
        dataType="email"
        bind:value={email}
        error={errors.email}
        isRequired={true}
        placeholder="seu@email.com"
      />
      <KuButton
        label={loading ? 'Enviando...' : 'Enviar Email de Redefinição'}
        actionType="submit"
        isDisabled={loading}
        customClass="w-full"
      />
    </form>
    <div class="text-sm text-center">
      <a href="/auth/login" class="font-medium text-blue-600 hover:underline dark:text-blue-500">
        Voltar para o Login
      </a>
    </div>
  </div>
</div> 