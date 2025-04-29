<script>
  import { createEventDispatcher } from 'svelte';
  import { Input, Label, Button, Select, Textarea, Alert } from 'flowbite-svelte';

  export let profile = {
    companyName: '',
    businessName: '',
    cnpj: '',
    birthday: '',
    legalNature: '',
    companyDescription: '',
    logoImage: '',
    companyImages: [],
    tagId: [],
    
    // Contatos
    contacts: [],
    
    // Endereço principal
    addressOneCepBrasilApi: '',
    addressOneType: '',
    addressOneStreet: '',
    addressOneNumber: '',
    addressOneComplement: '',
    addressOneCity: '',
    addressOneState: '',
    
    // Dados bancários
    bankDataOne: {
      bankName: '',
      bankBranch: '',
      bankAccount: '',
      bankAccountType: ''
    }
  };
  
  export let errors = {};
  export let loading = false;
  export let success = '';
  
  const dispatch = createEventDispatcher();
  
  // Opções para selects
  const addressTypeOptions = [
    { value: 'commercial', name: 'Comercial' },
    { value: 'branch', name: 'Filial' },
    { value: 'virtual', name: 'Virtual' }
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
  
  const contactTypeOptions = [
    { value: 'mobile', name: 'Celular' },
    { value: 'email', name: 'Email' },
    { value: 'website', name: 'Website' },
    { value: 'linkedin', name: 'LinkedIn' },
    { value: 'instagram', name: 'Instagram' },
    { value: 'facebook', name: 'Facebook' }
  ];
  
  const accountTypeOptions = [
    { value: 'currentAccount', name: 'Conta Corrente' },
    { value: 'savingsAccount', name: 'Conta Poupança' }
  ];
  
  // Mock de tags para selecionar
  const availableTags = [
    { id: 'tag1', name: 'Tecnologia' },
    { id: 'tag2', name: 'Saúde' },
    { id: 'tag3', name: 'Educação' },
    { id: 'tag4', name: 'Finanças' },
    { id: 'tag5', name: 'E-commerce' }
  ];
  
  // Estado temporário para novo contato
  let newContact = {
    contactType: '',
    contactValue: '',
    contactComplement: ''
  };
  
  // Função para submeter o formulário
  function handleSubmit() {
    dispatch('submit', profile);
  }
  
  // Função para adicionar contato
  function addContact() {
    if (newContact.contactType && newContact.contactValue) {
      profile.contacts = [
        ...profile.contacts, 
        { ...newContact }
      ];
      
      // Limpar formulário
      newContact = {
        contactType: '',
        contactValue: '',
        contactComplement: ''
      };
    }
  }
  
  // Função para remover contato
  function removeContact(index) {
    profile.contacts = profile.contacts.filter((_, i) => i !== index);
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
        <Label for="companyName" class="mb-1">Razão Social <span class="text-red-500">*</span></Label>
        <Input 
          id="companyName" 
          placeholder="Razão Social" 
          bind:value={profile.companyName} 
          required
          error={errors.companyName}
        />
      </div>
      
      <div>
        <Label for="businessName" class="mb-1">Nome Fantasia <span class="text-red-500">*</span></Label>
        <Input 
          id="businessName" 
          placeholder="Nome Fantasia" 
          bind:value={profile.businessName}
          required
          error={errors.businessName}
        />
      </div>
      
      <div>
        <Label for="cnpj" class="mb-1">CNPJ</Label>
        <Input 
          id="cnpj" 
          placeholder="00.000.000/0000-00" 
          bind:value={profile.cnpj}
          error={errors.cnpj}
        />
      </div>
      
      <div>
        <Label for="birthday" class="mb-1">Data de Fundação</Label>
        <Input 
          id="birthday" 
          type="date" 
          bind:value={profile.birthday}
          error={errors.birthday}
        />
      </div>
      
      <div>
        <Label for="legalNature" class="mb-1">Natureza Jurídica</Label>
        <Input 
          id="legalNature" 
          placeholder="Ex: LTDA, ME, EIRELI..." 
          bind:value={profile.legalNature}
          error={errors.legalNature}
        />
      </div>
    </div>
    
    <div class="mt-4">
      <Label for="companyDescription" class="mb-1">Descrição da Empresa</Label>
      <Textarea 
        id="companyDescription" 
        rows="3" 
        placeholder="Descreva sua empresa, produtos ou serviços..."
        bind:value={profile.companyDescription}
        error={errors.companyDescription}
      />
    </div>
    
    <div class="mt-4">
      <Label class="mb-2">Segmentos / Tags</Label>
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
  
  <!-- Seção de Contatos -->
  <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Contatos</h2>
    
    <!-- Lista de contatos adicionados -->
    {#if profile.contacts.length > 0}
      <div class="mb-4 border dark:border-gray-700 rounded-lg overflow-hidden">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">Tipo</th>
              <th scope="col" class="px-6 py-3">Valor</th>
              <th scope="col" class="px-6 py-3">Complemento</th>
              <th scope="col" class="px-6 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {#each profile.contacts as contact, index}
              <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td class="px-6 py-4">
                  {contactTypeOptions.find(t => t.value === contact.contactType)?.name || contact.contactType}
                </td>
                <td class="px-6 py-4">{contact.contactValue}</td>
                <td class="px-6 py-4">{contact.contactComplement}</td>
                <td class="px-6 py-4">
                  <button 
                    type="button" 
                    class="font-medium text-red-600 dark:text-red-500 hover:underline"
                    on:click={() => removeContact(index)}
                  >
                    Remover
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {:else}
      <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center mb-4">
        <p class="text-gray-500 dark:text-gray-400">Nenhum contato adicionado</p>
      </div>
    {/if}
    
    <!-- Formulário para adicionar novo contato -->
    <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
      <h3 class="text-md font-medium text-gray-900 dark:text-white mb-2">Adicionar Contato</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label for="contactType" class="mb-1">Tipo</Label>
          <Select 
            id="contactType" 
            items={contactTypeOptions} 
            bind:value={newContact.contactType}
          />
        </div>
        
        <div>
          <Label for="contactValue" class="mb-1">Valor</Label>
          <Input 
            id="contactValue" 
            placeholder="(99) 99999-9999, email@exemplo.com, etc." 
            bind:value={newContact.contactValue}
          />
        </div>
        
        <div>
          <Label for="contactComplement" class="mb-1">Complemento</Label>
          <Input 
            id="contactComplement" 
            placeholder="Comercial, Financeiro, etc." 
            bind:value={newContact.contactComplement}
          />
        </div>
      </div>
      <Button type="button" class="mt-3" size="sm" on:click={addContact}>
        Adicionar Contato
      </Button>
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
          placeholder="Sala, Andar, etc." 
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
  
  <!-- Seção de Dados Bancários -->
  <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Dados Bancários</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label for="bankName" class="mb-1">Banco</Label>
        <Input 
          id="bankName" 
          placeholder="Nome ou Código do Banco" 
          bind:value={profile.bankDataOne.bankName}
          error={errors.bankDataOne?.bankName}
        />
      </div>
      
      <div>
        <Label for="bankBranch" class="mb-1">Agência</Label>
        <Input 
          id="bankBranch" 
          placeholder="0000" 
          bind:value={profile.bankDataOne.bankBranch}
          error={errors.bankDataOne?.bankBranch}
        />
      </div>
      
      <div>
        <Label for="bankAccount" class="mb-1">Conta</Label>
        <Input 
          id="bankAccount" 
          placeholder="00000-0" 
          bind:value={profile.bankDataOne.bankAccount}
          error={errors.bankDataOne?.bankAccount}
        />
      </div>
      
      <div>
        <Label for="bankAccountType" class="mb-1">Tipo de Conta</Label>
        <Select 
          id="bankAccountType" 
          items={accountTypeOptions} 
          bind:value={profile.bankDataOne.bankAccountType}
          error={errors.bankDataOne?.bankAccountType}
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
