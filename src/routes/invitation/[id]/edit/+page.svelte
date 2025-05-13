<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { invitationsService } from '$services/invitations';
  import { toastStore } from '$stores/toast';
  import InvitationForm from '$lib/components/pages/invitation/InvitationForm.svelte';
  
  let invitation = {
    email: '',
    role: '',
  };
  let loading = true;

  onMount(async () => {
    try {
      const response = await invitationsService.getInvitationById($page.params.id);
      invitation = response;
    } catch (error: any) {
      console.error('Error fetching invitation:', error);
      toastStore.add(error.response?.data?.message || 'Erro ao buscar convite', 'error');
    } finally {
      loading = false;
    }
  });

  async function handleSubmit(event: CustomEvent) {
    const {email, role} = event.detail;
    loading = true;
    try {
      await invitationsService.updateInvitation($page.params.id, { email, role });
      toastStore.add('Convite atualizado com sucesso', 'success');
      goto('/invitation');
    } catch (error: any) {
      console.error('Error:', error);
      toastStore.add(error.response?.data?.message || 'Erro ao atualizar convite', 'error');
    } finally {
      loading = false;
    }
  }

  function handleCancel() {
    goto('/invitation');
  }
</script>

<div class="max-w-4xl mx-auto pb-20">
  <h1 class="text-2xl font-bold mb-4 dark:text-white">Editar Convite</h1>
  <p class="text-gray-500 dark:text-gray-400 mb-6">
    Preencha o formulário abaixo para editar o convite.
  </p>

  <InvitationForm
    {invitation}
    bind:loading
    on:submit={handleSubmit}
    on:cancel={handleCancel}
  />
</div>