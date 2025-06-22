<script lang="ts">
  import { goto } from '$app/navigation';
  import { invitationsService } from '$services/invitations';
  import { toastStore } from '$lib/stores/toast';
  import InvitationForm from '$lib/components/pages/invitation/InvitationForm.svelte';
  let email = '';
  let role = '';
  
  let loading = false;

  async function handleSubmit(event: CustomEvent) {
    const {email, role} = event.detail;
    loading = true;
    try {
      await invitationsService.createInvitation({ email, role });
      toastStore.add('Convite criado com sucesso', 'success');
      goto('/invitation');
    } catch (error: any) {
      console.error('Error:', error);
      toastStore.add(error.response?.data?.message || 'Erro ao criar convite', 'error');
    } finally {
      loading = false;
    }
  }

  function handleCancel() {
    goto('/invitation');
  }
</script>

<div class="max-w-4xl mx-auto pb-20">
  <h1 class="text-2xl font-bold mb-4 dark:text-white">Novo Convite</h1>
  <p class="text-gray-500 dark:text-gray-400 mb-6">
    Preencha o formulário abaixo para criar um novo convite.
  </p>
  <InvitationForm
    bind:loading
    on:submit={handleSubmit}
    on:cancel={handleCancel}
  />
</div>