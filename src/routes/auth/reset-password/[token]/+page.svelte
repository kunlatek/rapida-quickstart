<script lang="ts">
  import { KuInput, KuButton } from '$lib/components/form';
  import { authService } from '$services/auth';
  import { toastStore } from '$stores/toast';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  let password = '';
  let passwordConfirmation = '';
  let loading = false;
  let errors = { password: '', passwordConfirmation: '' };

  async function handleSubmit() {
    loading = true;
    errors = { password: '', passwordConfirmation: '' }; // Reset errors

    if (!password) {
      errors.password = 'Nova senha é obrigatória';
    }
    if (!passwordConfirmation) {
      errors.passwordConfirmation = 'Confirmação de senha é obrigatória';
    }
    if (password !== passwordConfirmation) {
      errors.passwordConfirmation = 'As senhas não coincidem';
    }

    if (errors.password || errors.passwordConfirmation) {
      loading = false;
      return;
    }

    try {
      const token = $page.params.token;
      await authService.resetPassword(token, password);
      toastStore.add('Senha redefinida com sucesso!', 'success');
      goto('/auth/login');
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toastStore.add(
        error.response?.data?.message || "Erro ao redefinir senha.",
        "error"
      );
    } finally {
      loading = false;
    }
  }
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
  <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
    <h1 class="text-2xl font-bold text-center text-gray-900 dark:text-white">Redefinir Senha</h1>
    <p class="text-center text-sm text-gray-600 dark:text-gray-400">
      Digite sua nova senha abaixo.
    </p>
    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
      <KuInput
        name="password"
        label="Nova Senha"
        type="password"
        bind:value={password}
        error={errors.password}
        isRequired={true}
        placeholder="••••••••"
      />
      <KuInput
        name="passwordConfirmation"
        label="Confirmar Nova Senha"
        type="password"
        bind:value={passwordConfirmation}
        error={errors.passwordConfirmation}
        isRequired={true}
        placeholder="••••••••"
      />
      <KuButton
        label={loading ? 'Redefinindo...' : 'Redefinir Senha'}
        actionType="submit"
        isDisabled={loading}
        customClass="w-full"
      />
    </form>
  </div>
</div> 