<script lang="ts">
  import { goto } from '$app/navigation';
  import KuDataTable from '$lib/components/data/KuDataTable.svelte';
  import { invitationsService } from '$services/invitations';
  import { toastStore } from '$stores/toast';

  const columns = [
    { key: 'email', header: 'Email', sortable: true },
    { key: 'role', header: 'Papel', sortable: true },
    {
      key: 'accepted',
      header: 'Status',
      isTag: true,
      formatValue: (value: boolean) => value ? 'Aceito' : 'Pendente'
    }
  ];

  const actions = [
    {
      label: 'Editar',
      handler: (row: any) => goto(`/invitation/${row.id}/edit`)
    },
    {
      label: 'Reenviar',
      color: 'alternative',
      handler: async (row: any) => {
        if (!row.accepted) {
          try {
            await invitationsService.sendInvitation(row.id);
            toastStore.add('Convite reenviado com sucesso', 'success');
          } catch (error: any) {
            console.error('Error resending invitation:', error);
            toastStore.add(error.response?.data?.message || 'Erro ao reenviar convite', 'error');
          }
        }
      }
    },
    {
      label: 'Excluir',
      color: 'danger',
      handler: async (row: any) => {
        try {
          if (confirm('Tem certeza que deseja excluir este convite?')) {
            await invitationsService.deleteInvitation(row.id);
            toastStore.add('Convite excluído com sucesso', 'success');
            window.location.reload();
          }
        } catch (error: any) {
          console.error('Error deleting invitation:', error);
          toastStore.add(error.response?.data?.message || 'Erro ao excluir convite', 'error');
        }
      }
    }
  ];

  const dataSource = {
    endpoint: '/api/invitations'
  };
</script>

<div class="p-4">
  <KuDataTable
    {columns}
    {actions}
    {dataSource}
    title="Lista de Convites"
    headerActions={[
      {
        label: 'Novo Convite',
        handler: () => goto('/invitation/new')
      }
    ]}
    pagination={{ enabled: true, pageSize: 10 }}
  />
</div> 