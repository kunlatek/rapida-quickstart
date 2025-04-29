<script>
  import { goto } from '$app/navigation';
  import { authStore } from '$stores/auth';
  import { toastStore } from '$stores/toast';
  import { profileService } from '$services/profile';
  import { Card, Heading } from 'flowbite-svelte';
  import PersonProfileForm from '$components/profile/PersonProfileForm.svelte';
  import { onMount } from 'svelte';

  let loading = false;
  let errors = {};
  let success = '';

  // Redirecionar se não estiver autenticado
  onMount(() => {
    if (!$authStore.isAuthenticated) {
      toastStore.error('Você precisa estar logado para acessar esta página');
      goto('/auth/login');
    }
  });
  
  async function handleSubmit(event) {
    const profileData = event.detail;
    
    // Adiciona o userId
    profileData.userId = $authStore.user.userId;
    
    try {
      loading = true;
      errors = {};
      
      const response = await profileService.createPersonProfile(profileData);
      success = 'Perfil criado com sucesso!';
      toastStore.success('Perfil de pessoa criado com sucesso!');
      
      // Redirecionar após criação
      setTimeout(() => {
        goto('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Erro ao criar perfil:', error);
      
      // Processar erros do servidor
      if (error.response?.data?.message) {
        toastStore.error(error.response.data.message);
      } else {
        toastStore.error('Erro ao criar perfil. Tente novamente.');
      }
      
      // Mapear erros de validação, se houver
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
  <title>Criar Perfil de Pessoa - Rapida Quickstart</title>
</svelte:head>

<div class="max-w-4xl mx-auto pb-20">
  <Card>
    <Heading tag="h1" class="text-2xl font-bold mb-6">Criar Perfil de Pessoa</Heading>
    <div class="text-gray-500 dark:text-gray-400 mb-6">
      <p>Preencha o formulário abaixo para criar seu perfil de pessoa. Os campos marcados com <span class="text-red-500">*</span> são obrigatórios.</p>
    </div>
    
    <PersonProfileForm
      {loading}
      {errors}
      {success}
      on:submit={handleSubmit}
      on:cancel={handleCancel}
    />
  </Card>
</div>