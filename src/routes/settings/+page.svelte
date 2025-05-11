<!-- /Users/opah/Code/personal/svelte-flowbite-permeson/src/routes/settings/+page.svelte -->
<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { authStore } from "$stores/auth";
  import { toastStore } from "$stores/toast";
  import {
    accountDeletionStore,
    fetchDeletionStatus,
  } from "$stores/account-deletion";
  import { Button, Card, Heading, Modal } from "flowbite-svelte";
  import { KuLoading } from "$components/common";
  import ChangePasswordForm from "$lib/components/pages/settings/ChangePasswordForm.svelte";
  import DeleteAccountConfirm from "$lib/components/pages/settings/DeleteAccountConfirm.svelte";
  import AccountRestorationNotice from "../../lib/components/pages/dashboard/AccountRestorationNotice.svelte";

  let deleteConfirmModal = false;
  let changePasswordModal = false;
  let loading = true;

  onMount(async () => {
    if (!$authStore.isAuthenticated) {
      toastStore.error("Você precisa estar logado para acessar esta página");
      goto("/auth/login");
      return;
    }

    try {
      await fetchDeletionStatus();
    } catch (error) {
      console.error("Error fetching settings data:", error);
    } finally {
      loading = false;
    }
  });

  function openChangePasswordModal() {
    changePasswordModal = true;
  }

  function closeChangePasswordModal() {
    changePasswordModal = false;
  }

  function handlePasswordChangeSuccess() {
    closeChangePasswordModal();
  }

  function openDeleteConfirmModal() {
    deleteConfirmModal = true;
  }

  function closeDeleteConfirmModal() {
    deleteConfirmModal = false;
  }

  function handleDeleteSuccess() {
    closeDeleteConfirmModal();
  }
</script>

<svelte:head>
  <title>Configurações - Rapida Quickstart</title>
</svelte:head>

<div class="px-4 pt-6 pb-20">
  <div class="mb-8">
    <Heading
      tag="h1"
      class="text-2xl font-bold text-gray-900 dark:text-white mb-2"
    >
      Configurações da Conta
    </Heading>
    <p class="text-gray-600 dark:text-gray-400">
      Gerencie suas preferências e configurações de conta
    </p>
  </div>

  {#if loading}
    <div class="py-12">
      <KuLoading size="lg" text="Carregando configurações..." />
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Seção de Segurança -->
      <Card>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Segurança da Conta
        </h2>

        <div class="space-y-4 mb-4">
          <div>
            <h3 class="text-lg font-medium mb-2">Alterar Senha</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-3">
              Recomendamos alterar sua senha regularmente para maior segurança.
            </p>
            <Button color="blue" on:click={openChangePasswordModal}
              >Alterar senha</Button
            >
          </div>

          <hr class="my-4 border-gray-200 dark:border-gray-700" />

          <!-- Seção de Autenticação em Duas Etapas -->
          <div>
            <h3 class="text-lg font-medium mb-2">
              Autenticação em Duas Etapas
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-3">
              Adicione uma camada extra de segurança à sua conta.
            </p>
            <Button color="blue">Configurar autenticação em duas etapas</Button>
          </div>
        </div>
      </Card>

      <!-- Seção de Exclusão de Conta -->
      {#if $accountDeletionStore.isDeleted}
        <AccountRestorationNotice />
      {:else}
        <Card>
          <div class="border-b pb-4 mb-4 border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-bold text-red-600 dark:text-red-500 mb-2">
              Exclusão de Conta
            </h2>
            <p class="text-gray-600 dark:text-gray-400">
              Cuidado! A exclusão da sua conta é permanente após o período de 90
              dias.
            </p>
          </div>
          <div class="mb-4">
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              Ao excluir sua conta, você perderá acesso a todos os seus dados
              após o período de recuperação de 90 dias. Durante este período,
              você poderá restaurar sua conta.
            </p>
          </div>

          <Button color="red" on:click={openDeleteConfirmModal}>
            Excluir minha conta
          </Button>
        </Card>
      {/if}
    </div>
  {/if}
</div>

<!-- Modal de confirmação de exclusão de conta -->
<Modal
  bind:open={deleteConfirmModal}
  size="sm"
  title="Confirmação de Exclusão de Conta"
>
  <DeleteAccountConfirm
    on:success={handleDeleteSuccess}
    on:cancel={closeDeleteConfirmModal}
  />
</Modal>

<!-- Modal de alteração de senha -->
<Modal bind:open={changePasswordModal} size="md" title="Alteração de Senha">
  <ChangePasswordForm
    on:success={handlePasswordChangeSuccess}
    on:cancel={closeChangePasswordModal}
  />
</Modal>
