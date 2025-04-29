<script>
  import { onMount } from 'svelte';
  import { authStore } from '$stores/auth';
  import { Card, Heading, Button } from 'flowbite-svelte';
  import { goto } from '$app/navigation';
  import { profileService } from '$services/profile';
  import { toastStore } from '$stores/toast';
  
  let personProfile = null;
  let companyProfile = null;
  let loading = {
    person: false,
    company: false
  };
  
  onMount(async () => {
    if (!$authStore.isAuthenticated) return;
    
    const userId = $authStore.user.userId;
    
    // Tentar carregar perfil de pessoa
    if ($authStore.user.availableRoles.includes('person')) {
      try {
        loading.person = true;
        personProfile = await profileService.getPersonProfileByUserId(userId);
      } catch (error) {
        console.log('Perfil de pessoa não encontrado ou erro ao carregar');
      } finally {
        loading.person = false;
      }
    }
    
    // Tentar carregar perfil de empresa
    if ($authStore.user.availableRoles.includes('company')) {
      try {
        loading.company = true;
        companyProfile = await profileService.getCompanyProfileByUserId(userId);
      } catch (error) {
        console.log('Perfil de empresa não encontrado ou erro ao carregar');
      } finally {
        loading.company = false;
      }
    }
  });
  
  function createPersonProfile() {
    goto('/profile/person/new');
  }
  
  function createCompanyProfile() {
    goto('/profile/company/new');
  }
  
  function editPersonProfile() {
    if (personProfile && personProfile._id) {
      goto(`/profile/person/${personProfile._id}`);
    } else {
      toastStore.error('Não foi possível encontrar o perfil de pessoa');
    }
  }
  
  function editCompanyProfile() {
    if (companyProfile && companyProfile._id) {
      goto(`/profile/company/${companyProfile._id}`);
    } else {
      toastStore.error('Não foi possível encontrar o perfil de empresa');
    }
  }
</script>

<svelte:head>
  <title>Dashboard - Rapida Quickstart</title>
</svelte:head>

<div class="px-4 pt-6 pb-20">
  <div class="mb-8">
    <Heading tag="h1" class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
      Dashboard
    </Heading>
    <p class="text-gray-600 dark:text-gray-400">
      Bem-vindo(a) ao seu painel de controle, {$authStore.user?.email}
    </p>
  </div>
  
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <!-- Status do papel atual -->
    <Card>
      <Heading tag="h2" class="text-lg font-semibold mb-2">Papel Ativo</Heading>
      <div class="flex justify-between items-center">
        <span class="text-gray-700 dark:text-gray-300">
          {$authStore.user?.activeRole || 'Nenhum papel ativo'}
        </span>
        <div class="px-2.5 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full text-xs font-medium">
          {$authStore.user?.availableRoles?.length || 0} papéis disponíveis
        </div>
      </div>
      <div class="mt-4">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Use o menu de perfil no cabeçalho para alternar entre os papéis disponíveis.
        </p>
      </div>
    </Card>
    
    <!-- Perfil de Pessoa -->
    <Card>
      <Heading tag="h2" class="text-lg font-semibold mb-2">Perfil de Pessoa</Heading>
      
      {#if loading.person}
        <p>Carregando perfil...</p>
      {:else if personProfile}
        <div class="mb-4">
          <p class="text-gray-700 dark:text-gray-300">
            <span class="font-semibold">Nome:</span> {personProfile.personName}
          </p>
          {#if personProfile.gender}
            <p class="text-gray-700 dark:text-gray-300">
              <span class="font-semibold">Gênero:</span> 
              {personProfile.gender === 'M' ? 'Masculino' : 
               personProfile.gender === 'F' ? 'Feminino' : 
               personProfile.gender === 'N' ? 'Neutro' : 'Outro'}
            </p>
          {/if}
          {#if personProfile.birthday}
            <p class="text-gray-700 dark:text-gray-300">
              <span class="font-semibold">Data de nascimento:</span> 
              {new Date(personProfile.birthday).toLocaleDateString()}
            </p>
          {/if}
        </div>
        <Button color="blue" on:click={editPersonProfile}>Editar Perfil</Button>
      {:else if $authStore.user?.availableRoles?.includes('person')}
        <p class="mb-4 text-gray-500 dark:text-gray-400">
          Você ainda não criou seu perfil de pessoa.
        </p>
        <Button color="blue" on:click={createPersonProfile}>Criar Perfil</Button>
      {:else}
        <p class="text-gray-500 dark:text-gray-400">
          Você não tem acesso ao papel de pessoa.
        </p>
      {/if}
    </Card>
    
    <!-- Perfil de Empresa -->
    <Card>
      <Heading tag="h2" class="text-lg font-semibold mb-2">Perfil de Empresa</Heading>
      
      {#if loading.company}
        <p>Carregando perfil...</p>
      {:else if companyProfile}
        <div class="mb-4">
          <p class="text-gray-700 dark:text-gray-300">
            <span class="font-semibold">Nome:</span> {companyProfile.companyName}
          </p>
          {#if companyProfile.businessName}
            <p class="text-gray-700 dark:text-gray-300">
              <span class="font-semibold">Nome Fantasia:</span> {companyProfile.businessName}
            </p>
          {/if}
          {#if companyProfile.cnpj}
            <p class="text-gray-700 dark:text-gray-300">
              <span class="font-semibold">CNPJ:</span> {companyProfile.cnpj}
            </p>
          {/if}
        </div>
        <Button color="blue" on:click={editCompanyProfile}>Editar Perfil</Button>
      {:else if $authStore.user?.availableRoles?.includes('company')}
        <p class="mb-4 text-gray-500 dark:text-gray-400">
          Você ainda não criou seu perfil de empresa.
        </p>
        <Button color="blue" on:click={createCompanyProfile}>Criar Perfil</Button>
      {:else}
        <p class="text-gray-500 dark:text-gray-400">
          Você não tem acesso ao papel de empresa.
        </p>
      {/if}
    </Card>
  </div>
</div>