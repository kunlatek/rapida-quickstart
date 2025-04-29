<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { authStore } from '$stores/auth';
  import { toastStore } from '$stores/toast';
  import { profileService } from '$services/profile';
  import { Card, Heading, Spinner } from 'flowbite-svelte';
  import CompanyProfileForm from '$components/profile/CompanyProfileForm.svelte';
  import { onMount } from 'svelte';

  const profileId = $page.params.id;
  let profile = null;
  let loading = false;
  let loadingProfile = true;
  let errors = {};
  let success = '';

  onMount(async () => {
    if (!$authStore.isAuthenticated) {
      toastStore.error('Você precisa estar logado para acessar esta página');
      goto('/auth/login');
      return;
    }
    
    try {
      // Carregar perfil existente
      profile = await profileService.getCompanyProfileById(profileId);
      
      // Formatar data de fundação para input de data
      if (profile.birthday) {
        profile.birthday = new Date(profile.birthday).toISOString().split('T')[0];
      }
      
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      toastStore.error('Erro ao carregar dados do perfil');
      goto('/dashboard');
    } finally {
      loadingProfile = false;
    }
  });
  
  async function handleSubmit(event) {
    const profileData = event.detail;
    
    try {
      loading = true;
      errors = {};
      
      await profileService.updateCompanyProfile(profileId, profileData);
      success = 'Perfil atualizado com sucesso!';
      toastStore.success('Perfil de empresa atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      
      if (error.response?.data?.message) {
        toastStore.error(error.response.data.message);
      } else {
        toastStore.error('Erro ao atualizar perfil. Tente novamente.');
      }
      
      if (error.response?.data?.errors) {
        errors = error.response.data.errors;
      }
    } finally {
      loading = false;
    }
  }
  
  function handleCancel() {
    goto('/dashboard');
  }
</script>

<svelte:head>
  <title>Editar Perfil de Empresa - Rapida Quickstart</title>
</svelte:head>

<div class="max-w-4xl mx-auto pb-20">
  <Card>
    <Heading tag="h1" class="text-2xl font-bold mb-6">Editar Perfil de Empresa</Heading>
    
    {#if loadingProfile}
      <div class="flex justify-center items-center py-12">
        <Spinner size="xl" />
        <span class="ml-2">Carregando perfil...</span>
      </div>
    {:else if profile}
      <div class="text-gray-500 dark:text-gray-400 mb-6">
        <p>Edite as informações do seu perfil de empresa. Os campos marcados com <span class="text-red-500">*</span> são obrigatórios.</p>
      </div>
      
      <CompanyProfileForm
        {profile}
        {loading}
        {errors}
        {success}
        on:submit={handleSubmit}
        on:cancel={handleCancel}
      />
    {:else}
      <div class="text-center py-12">
        <p class="text-gray-500 dark:text-gray-400">Perfil não encontrado ou você não tem permissão para editá-lo.</p>
      </div>
    {/if}
  </Card>
</div>