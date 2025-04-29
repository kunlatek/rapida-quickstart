<script>
  import { createEventDispatcher } from 'svelte';
  import { Input, Label, Button, Select, Textarea, Radio, Alert } from 'flowbite-svelte';

  export let profile = {
    personName: '',
    personNickname: '',
    gender: '',
    birthday: '',
    maritalStatus: '',
    motherName: '',
    fatherName: '',
    personDescription: '',
    tagId: [],
    
    // Documento
    cpf: '',
    rg: '',
    rgIssuingAuthority: '',
    rgIssuanceDate: '',
    rgState: '',
    
    // Contato
    phoneNumberOne: '',
    phoneNumberTwo: '',
    emailOne: '',
    emailTwo: '',
    linkedin: '',
    instagram: '',
    facebook: '',
    x: '',
    
    // Endereço principal
    addressOneCepBrasilApi: '',
    addressOneType: '',
    addressOneStreet: '',
    addressOneNumber: '',
    addressOneComplement: '',
    addressOneCity: '',
    addressOneState: '',
  };
  
  export let errors = {};
  export let loading = false;
  export let success = '';
  
  const dispatch = createEventDispatcher();
  
  // Opções para selects
  const genderOptions = [
    { value: 'M', name: 'Masculino' },
    { value: 'F', name: 'Feminino' },
    { value: 'N', name: 'Neutro' },
    { value: 'O', name: 'Outro' }
  ];
  
  const maritalStatusOptions = [
    { value: 'single', name: 'Solteiro(a)' },
    { value: 'married', name: 'Casado(a)' },
    { value: 'divorced', name: 'Divorciado(a)' },
    { value: 'widowed', name: 'Viúvo(a)' },
    { value: 'engaged', name: 'Noivo(a)' },
    { value: 'commonLawMarried', name: 'União Estável' }
  ];
  
  const stateOptions = [
    { value: 'AC', name: 'Acre' },
    { value: 'AL', name: 'Alagoas' },
    { value: 'AP', name: 'Amapá' },
    { value: 'AM', name: 'Amazonas' },
    { value: 'BA', name: 'Bahia' },
    { value: 'CE', name: 'Ceará' },
    { value: 'DF', name: 'Distrito Federal' },
    { value: 'ES', name: 'Espírito Santo' },
    { value: 'GO', name: 'Goiás' },
    { value: 'MA', name: 'Maranhão' },
    { value: 'MT', name: 'Mato Grosso' },
    { value: 'MS', name: 'Mato Grosso do Sul' },
    { value: 'MG', name: 'Minas Gerais' },
    { value: 'PA', name: 'Pará' },
    { value: 'PB', name: 'Paraíba' },
    { value: 'PR', name: 'Paraná' },
    { value: 'PE', name: 'Pernambuco' },
    { value: 'PI', name: 'Piauí' },
    { value: 'RJ', name: 'Rio de Janeiro' },
    { value: 'RN', name: 'Rio Grande do Norte' },
    { value: 'RS', name: 'Rio Grande do Sul' },
    { value: 'RO', name: 'Rondônia' },
    { value: 'RR', name: 'Roraima' },
    { value: 'SC', name: 'Santa Catarina' },
    { value: 'SP', name: 'São Paulo' },
    { value: 'SE', name: 'Sergipe' },
    { value: 'TO', name: 'Tocantins' }
  ];
  
  const addressTypeOptions = [
    { value: 'residential', name: 'Residencial' },
    { value: 'commercial', name: 'Comercial' },
    { value: 'other', name: 'Outro' }
  ];
  
  // Mock de tags para selecionar
  const availableTags = [
    { id: 'tag1', name: 'Profissional' },
    { id: 'tag2', name: 'Estudante' },
    { id: 'tag3', name: 'Empreendedor' },
    { id: 'tag4', name: 'Designer' },
    { id: 'tag5', name: 'Desenvolvedor' }
  ];
  
  // Função para submeter o formulário
  function handleSubmit() {
    dispatch('submit', profile);
  }
  
  // Função para adicionar/remover tags
  function toggleTag(tagId) {
    if (profile.tagId.includes(tagId)) {
      profile.tagId = profile.tagId.filter(id => id !== tagId);
    } else {
      profile.tagId = [...profile.tagId, tagId];
    }
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-6">
  {#if success}
    <Alert color="green" class="mb-4">{success}</Alert>
  {/if}
  
  <!-- Seção de Informações Básicas -->
  <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Informações Básicas</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label for="personName" class="mb-1">Nome Completo <span class="text-red-500">*</span></Label>
        <Input 
          id="personName" 
          placeholder="Nome completo" 
          bind:value={profile.personName} 
          required
          error={errors.personName}
        />
      </div>
      
      <div>
        <Label for="personNickname" class="mb-1">Como gosta de ser chamado</Label>
        <Input 
          id="personNickname" 
          placeholder="Apelido ou nome social" 
          bind:value={profile.personNickname}
          error={errors.personNickname}
        />
      </div>
      
      <div>
        <Label for="gender" class="mb-1">Gênero <span class="text-red-500">*</span></Label>
        <Select 
          id="gender" 
          items={genderOptions} 
          bind:value={profile.gender} 
          required
          error={errors.gender}
        />
      </div>
      
      <div>
        <Label for="birthday" class="mb-1">Data de Nascimento <span class="text-red-500">*</span></Label>
        <Input 
          id="birthday" 
          type="date" 
          bind:value={profile.birthday} 
          required
          error={errors.birthday}
        />
      </div>
      
      <div>
        <Label for="maritalStatus" class="mb-1">Estado Civil</Label>
        <Select 
          id="maritalStatus" 
          items={maritalStatusOptions} 
          bind:value={profile.maritalStatus}
          error={errors.maritalStatus}
        />
      </div>
    </div>
    
    <div class="mt-4">
      <Label for="personDescription" class="mb-1">Sobre Você</Label>
      <Textarea 
        id="personDescription" 
        rows="3" 
        placeholder="Conte um pouco sobre você..."
        bind:value={profile.personDescription}
        error={errors.personDescription}
      />
    </div>
    
    <div class="mt-4">
      <Label class="mb-2">Tags / Interesses</Label>
      <div class="flex flex-wrap gap-2">
        {#each availableTags as tag}
          <button 
            type="button"
            class="px-3 py-1 text-sm rounded-full transition-colors
                  {profile.tagId.includes(tag.id) 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}"
            on:click={() => toggleTag(tag.id)}
          >
            {tag.name}
          </button>
        {/each}
      </div>
      {#if errors.tagId}
        <p class="text-red-500 text-sm mt-1">{errors.tagId}</p>
      {/if}
    </div>
  </div>
  
  <!-- Seção de Documentos -->
  <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Documentos</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label for="cpf" class="mb-1">CPF</Label>
        <Input 
          id="cpf" 
          placeholder="123.456.789-00" 
          bind:value={profile.cpf}
          error={errors.cpf}
        />
      </div>
      
      <div>
        <Label for="rg" class="mb-1">RG</Label>
        <Input 
          id="rg" 
          placeholder="12.345.678-9" 
          bind:value={profile.rg}
          error={errors.rg}
        />
      </div>
      
      <div>
        <Label for="rgIssuingAuthority" class="mb-1">Órgão Emissor do RG</Label>
        <Input 
          id="rgIssuingAuthority" 
          placeholder="SSP" 
          bind:value={profile.rgIssuingAuthority}
          error={errors.rgIssuingAuthority}
        />
      </div>
      
      <div>
        <Label for="rgState" class="mb-1">Estado Emissor</Label>
        <Select 
          id="rgState" 
          items={stateOptions} 
          bind:value={profile.rgState}
          error={errors.rgState}
        />
      </div>
      
      <div>
        <Label for="rgIssuanceDate" class="mb-1">Data de Emissão</Label>
        <Input 
          id="rgIssuanceDate" 
          type="date" 
          bind:value={profile.rgIssuanceDate}
          error={errors.rgIssuanceDate}
        />
      </div>
    </div>
  </div>
  
  <!-- Seção de Contatos -->
  <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Contatos</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label for="phoneNumberOne" class="mb-1">Telefone Principal</Label>
        <Input 
          id="phoneNumberOne" 
          placeholder="(99) 99999-9999" 
          bind:value={profile.phoneNumberOne}
          error={errors.phoneNumberOne}
        />
      </div>
      
      <div>
        <Label for="phoneNumberTwo" class="mb-1">Telefone Secundário</Label>
        <Input 
          id="phoneNumberTwo" 
          placeholder="(99) 99999-9999" 
          bind:value={profile.phoneNumberTwo}
          error={errors.phoneNumberTwo}
        />
      </div>
      
      <div>
        <Label for="emailOne" class="mb-1">Email Principal</Label>
        <Input 
          id="emailOne" 
          type="email"
          placeholder="email@exemplo.com" 
          bind:value={profile.emailOne}
          error={errors.emailOne}
        />
      </div>
      
      <div>
        <Label for="emailTwo" class="mb-1">Email Alternativo</Label>
        <Input 
          id="emailTwo" 
          type="email"
          placeholder="email@exemplo.com" 
          bind:value={profile.emailTwo}
          error={errors.emailTwo}
        />
      </div>
    </div>
    
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mt-4 mb-2">Redes Sociais</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label for="linkedin" class="mb-1">LinkedIn</Label>
        <Input 
          id="linkedin" 
          placeholder="https://linkedin.com/in/seu-perfil" 
          bind:value={profile.linkedin}
          error={errors.linkedin}
        />
      </div>
      
      <div>
        <Label for="instagram" class="mb-1">Instagram</Label>
        <Input 
          id="instagram" 
          placeholder="@seu_perfil" 
          bind:value={profile.instagram}
          error={errors.instagram}
        />
      </div>
      
      <div>
        <Label for="facebook" class="mb-1">Facebook</Label>
        <Input 
          id="facebook" 
          placeholder="https://facebook.com/seu.perfil" 
          bind:value={profile.facebook}
          error={errors.facebook}
        />
      </div>
      
      <div>
        <Label for="x" class="mb-1">X / Twitter</Label>
        <Input 
          id="x" 
          placeholder="@seu_perfil" 
          bind:value={profile.x}
          error={errors.x}
        />
      </div>
    </div>
  </div>
  
  <!-- Seção de Endereço -->
  <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Endereço Principal</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Label for="addressOneCepBrasilApi" class="mb-1">CEP</Label>
        <Input 
          id="addressOneCepBrasilApi" 
          placeholder="00000-000" 
          bind:value={profile.addressOneCepBrasilApi}
          error={errors.addressOneCepBrasilApi}
        />
      </div>
      
      <div>
        <Label for="addressOneType" class="mb-1">Tipo de Endereço</Label>
        <Select 
          id="addressOneType" 
          items={addressTypeOptions} 
          bind:value={profile.addressOneType}
          error={errors.addressOneType}
        />
      </div>
      
      <div>
        <Label for="addressOneStreet" class="mb-1">Logradouro</Label>
        <Input 
          id="addressOneStreet" 
          placeholder="Rua, Avenida, etc." 
          bind:value={profile.addressOneStreet}
          error={errors.addressOneStreet}
        />
      </div>
      
      <div>
        <Label for="addressOneNumber" class="mb-1">Número</Label>
        <Input 
          id="addressOneNumber" 
          placeholder="123" 
          bind:value={profile.addressOneNumber}
          error={errors.addressOneNumber}
        />
      </div>
      
      <div>
        <Label for="addressOneComplement" class="mb-1">Complemento</Label>
        <Input 
          id="addressOneComplement" 
          placeholder="Apto, Bloco, etc." 
          bind:value={profile.addressOneComplement}
          error={errors.addressOneComplement}
        />
      </div>
      
      <div>
        <Label for="addressOneCity" class="mb-1">Cidade</Label>
        <Input 
          id="addressOneCity" 
          placeholder="Cidade" 
          bind:value={profile.addressOneCity}
          error={errors.addressOneCity}
        />
      </div>
      
      <div>
        <Label for="addressOneState" class="mb-1">Estado</Label>
        <Select 
          id="addressOneState" 
          items={stateOptions} 
          bind:value={profile.addressOneState}
          error={errors.addressOneState}
        />
      </div>
    </div>
  </div>
  
  <!-- Botões de ação -->
  <div class="flex justify-end space-x-3">
    <Button type="button" color="alternative" on:click={() => dispatch('cancel')}>
      Cancelar
    </Button>
    <Button type="submit" disabled={loading}>
      {loading ? 'Salvando...' : 'Salvar Perfil'}
    </Button>
  </div>
</form>
