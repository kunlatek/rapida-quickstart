<script lang="ts">
  import { Button } from 'flowbite-svelte';
  import { Badge } from 'flowbite-svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { invitationsService } from '$services/invitations';
  import { toastStore } from '$stores/toast';
  let invitation: any = null;
  let loading = true;

  onMount(async () => {
    try {
      invitation = await invitationsService.getInvitationById($page.params.id);
    } catch (error: any) {
      console.error('Error fetching invitation:', error);
      toastStore.add(error.response?.data?.message || 'Erro ao buscar convite', 'error');
    } finally {
      loading = false;
    }
  });

  async function resendInvitation() {
    try {
      await invitationsService.sendInvitation($page.params.id);
    } catch (error: any) {
      console.error('Error resending invitation:', error);
      toastStore.add(error.response?.data?.message || 'Erro ao reenviar convite', 'error');
    }
  }
</script>

<div class="p-4">
  <div class="flex justify-between items-center mb-4">
    <h1 class="text-2xl font-bold dark:text-white">Detalhes do Convite</h1>
    <div class="flex gap-2">
      <Button on:click={() => goto(`/invitation/${$page.params.id}/edit`)}>Editar</Button>
      <Button color="alternative" on:click={() => goto('/invitation')}>Voltar para a lista</Button>
    </div>
  </div>

  {#if loading}
    <p class="text-gray-500 dark:text-gray-400">Carregando...</p>
  {:else if invitation}
    <div class="bg-white shadow rounded-lg p-6 max-w-2xl">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <h3 class="text-sm font-medium text-gray-500">Email</h3>
          <p class="mt-1">{invitation.email}</p>
        </div>
        <div>
          <h3 class="text-sm font-medium text-gray-500">Papel</h3>
          <p class="mt-1">{invitation.role}</p>
        </div>
        <div>
          <h3 class="text-sm font-medium text-gray-500">Status</h3>
          <div class="mt-1">
            <Badge color={invitation.accepted ? 'green' : 'yellow'}>
              {invitation.accepted ? 'Aceito' : 'Pendente'}
            </Badge>
          </div>
        </div>
        {#if !invitation.accepted}
          <div class="flex items-end">
            <Button color="alternative" on:click={resendInvitation}>Reenviar Convite</Button>
          </div>
        {/if}
      </div>
    </div>
  {:else}
    <p class="text-gray-500 dark:text-gray-400">Convite não encontrado</p>
  {/if}
</div> 