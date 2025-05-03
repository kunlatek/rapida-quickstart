<script>
  import { createEventDispatcher } from "svelte";
  import { Label, Button, Alert, Tabs, TabItem } from "flowbite-svelte";
  import {
    FormInput,
    FormSelect,
    FormFile,
    FormFieldset,
    FormTab,
    FormButton,
  } from "$lib/components/form";
  import { STATES } from "/static/constants/states";

  export let profile = {
    companyName: "",
    businessName: "",
    cnpj: "",
    birthday: "",
    legalNature: "",
    companyDescription: "",
    logoImage: null,
    companyImages: [],
    tagId: [],

    // Sócios
    partners: [],

    // Contatos
    contacts: [],

    // Endereços
    addressOneCepBrasilApi: "",
    addressOneType: "",
    addressOneStreet: "",
    addressOneNumber: "",
    addressOneComplement: "",
    addressOneCity: "",
    addressOneState: "",
    addressTwoCepBrasilApi: "",
    addressTwoType: "",
    addressTwoStreet: "",
    addressTwoNumber: "",
    addressTwoComplement: "",
    addressTwoCity: "",
    addressTwoState: "",

    // Dados Bancários
    bankDataOne: {
      bankName: "",
      bankBranch: "",
      bankAccount: "",
      bankAccountType: "",
    },
    bankDataTwo: {
      bankName: "",
      bankBranch: "",
      bankAccount: "",
      bankAccountType: "",
    },

    // Arquivos Relacionados
    relatedFiles: [],
  };

  export let errors = {};
  export let loading = false;
  export let success = "";

  const dispatch = createEventDispatcher();

  // Opções de seleção
  const addressTypeOptions = [
    { value: "commercial", name: "Comercial" },
    { value: "branch", name: "Filial" },
    { value: "virtual", name: "Virtual" },
  ];

  const stateOptions = STATES;

  const contactTypeOptions = [
    { value: "mobile", name: "Celular" },
    { value: "email", name: "Email" },
    { value: "website", name: "Website" },
    { value: "linkedin", name: "LinkedIn" },
    { value: "instagram", name: "Instagram" },
    { value: "facebook", name: "Facebook" },
  ];

  const accountTypeOptions = [
    { value: "currentAccount", name: "Conta Corrente" },
    { value: "savingsAccount", name: "Conta Poupança" },
  ];

  const availableTags = [
    { id: "tag1", name: "Tecnologia" },
    { id: "tag2", name: "Saúde" },
    { id: "tag3", name: "Educação" },
    { id: "tag4", name: "Finanças" },
    { id: "tag5", name: "E-commerce" },
  ];

  // Novo contato
  let newContact = {
    contactType: "",
    contactValue: "",
    contactComplement: "",
  };

  // Novo arquivo
  let newFile = {
    filesDescription: "",
    relatedFilesFiles: null,
    relatedFilesDateDay: new Date().getDate(),
    relatedFilesDateMonth: new Date().getMonth() + 1,
    relatedFilesDateYear: new Date().getFullYear(),
  };

  function handleSubmit() {
    dispatch("submit", profile);
  }

  function handleCancel() {
    dispatch("cancel");
  }

  function addContact() {
    if (newContact.contactType && newContact.contactValue) {
      profile.contacts = [...profile.contacts, { ...newContact }];

      // Reset do formulário de contato
      newContact = {
        contactType: "",
        contactValue: "",
        contactComplement: "",
      };
    }
  }

  function removeContact(index) {
    profile.contacts = profile.contacts.filter((_, i) => i !== index);
  }

  function addRelatedFile() {
    if (newFile.filesDescription && newFile.relatedFilesFiles) {
      profile.relatedFiles = [...profile.relatedFiles, { ...newFile }];

      // Reset do formulário de arquivo
      newFile = {
        filesDescription: "",
        relatedFilesFiles: "",
        relatedFilesDateDay: new Date().getDate(),
        relatedFilesDateMonth: new Date().getMonth() + 1,
        relatedFilesDateYear: new Date().getFullYear(),
      };
    }
  }

  function removeRelatedFile(index) {
    profile.relatedFiles = profile.relatedFiles.filter((_, i) => i !== index);
  }

  function toggleTag(tagId) {
    if (profile.tagId.includes(tagId)) {
      profile.tagId = profile.tagId.filter((id) => id !== tagId);
    } else {
      profile.tagId = [...profile.tagId, tagId];
    }
  }

  function handleTabChange(event) {
    activeTabId = event.detail;
    console.log("Tab changed to:", activeTabId);
  }

  // Define abas
  const tabs = [
    { id: "main", title: "Dados Principais" },
    { id: "contacts", title: "Contatos e Redes" },
    { id: "addresses", title: "Endereços" },
    { id: "files", title: "Arquivos" },
    { id: "banking", title: "Dados Bancários" },
  ];

  // Estado para rastrear a aba ativa
  let activeTabId = tabs[0].id;
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-6">
  {#if success}
    <Alert color="green" class="mb-4">{success}</Alert>
  {/if}

  <FormTab
    id="person-tabs" 
    {tabs} 
    bind:activeTabId
    on:tabChange={handleTabChange}
  >
    {#if activeTabId === "main"}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          name="companyName"
          label="Razão Social"
          placeholder="Razão Social"
          bind:value={profile.companyName}
          isRequired={true}
          error={errors.companyName}
        />

        <FormInput
          name="businessName"
          label="Nome Fantasia"
          placeholder="Nome Fantasia"
          bind:value={profile.businessName}
          isRequired={true}
          error={errors.businessName}
        />

        <FormInput
          name="cnpj"
          label="CNPJ"
          placeholder="00.000.000/0000-00"
          bind:value={profile.cnpj}
          error={errors.cnpj}
        />

        <FormInput
          name="birthday"
          dataType="date"
          label="Data de Fundação"
          bind:value={profile.birthday}
          error={errors.birthday}
        />

        <FormInput
          name="legalNature"
          label="Natureza Jurídica"
          placeholder="Ex: LTDA, ME, EIRELI..."
          bind:value={profile.legalNature}
          error={errors.legalNature}
        />
      </div>

      <div class="mt-6">
        <Label for="companyDescription" class="mb-2"
          >Descrição da Empresa</Label
        >
        <textarea
          id="companyDescription"
          rows="3"
          placeholder="Descreva sua empresa, produtos ou serviços..."
          bind:value={profile.companyDescription}
          class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        ></textarea>
        {#if errors.companyDescription}
          <p class="mt-1 text-red-600 dark:text-red-500 text-sm">
            {errors.companyDescription}
          </p>
        {/if}
      </div>

      <div class="mt-6">
        <FormFile
          name="logoImage"
          label="Logo da Empresa"
          bind:value={profile.logoImage}
          error={errors.logoImage}
        />
      </div>

      <div class="mt-6">
        <Label class="mb-2"
          >Segmentos / Tags <span class="text-red-500">*</span></Label
        >
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
    {:else if activeTabId === "contacts"}
      <FormFieldset title="Contatos">
        <!-- Lista de contatos adicionados -->
        {#if profile.contacts.length > 0}
          <div
            class="mb-4 border dark:border-gray-700 rounded-lg overflow-hidden"
          >
            <table
              class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
            >
              <thead
                class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
              >
                <tr>
                  <th scope="col" class="px-6 py-3">Tipo</th>
                  <th scope="col" class="px-6 py-3">Valor</th>
                  <th scope="col" class="px-6 py-3">Complemento</th>
                  <th scope="col" class="px-6 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {#each profile.contacts as contact, index}
                  <tr
                    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td class="px-6 py-4">
                      {contactTypeOptions.find(
                        (t) => t.value === contact.contactType
                      )?.name || contact.contactType}
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
          <div
            class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center mb-4"
          >
            <p class="text-gray-500 dark:text-gray-400">
              Nenhum contato adicionado
            </p>
          </div>
        {/if}

        <!-- Formulário para adicionar novo contato -->
        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 class="text-md font-medium text-gray-900 dark:text-white mb-2">
            Adicionar Contato
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormSelect
              name="contactType"
              label="Tipo"
              options={contactTypeOptions}
              bind:value={newContact.contactType}
            />

            <FormInput
              name="contactValue"
              label="Valor"
              placeholder="(99) 99999-9999, email@exemplo.com, etc."
              bind:value={newContact.contactValue}
            />

            <FormInput
              name="contactComplement"
              label="Complemento"
              placeholder="Comercial, Financeiro, etc."
              bind:value={newContact.contactComplement}
            />
          </div>
          <Button type="button" class="mt-3" size="sm" on:click={addContact}>
            Adicionar Contato
          </Button>
        </div>
      </FormFieldset>
    {:else if activeTabId === "addresses"}
      <FormFieldset title="Endereço Principal">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            name="addressOneCepBrasilApi"
            label="CEP"
            placeholder="00000-000"
            bind:value={profile.addressOneCepBrasilApi}
            error={errors.addressOneCepBrasilApi}
          />

          <FormSelect
            name="addressOneType"
            label="Tipo de Endereço"
            options={addressTypeOptions}
            bind:value={profile.addressOneType}
            error={errors.addressOneType}
          />

          <FormInput
            name="addressOneStreet"
            label="Logradouro"
            placeholder="Rua, Avenida, etc."
            bind:value={profile.addressOneStreet}
            error={errors.addressOneStreet}
          />

          <FormInput
            name="addressOneNumber"
            label="Número"
            placeholder="123"
            bind:value={profile.addressOneNumber}
            error={errors.addressOneNumber}
          />

          <FormInput
            name="addressOneComplement"
            label="Complemento"
            placeholder="Sala, Andar, etc."
            bind:value={profile.addressOneComplement}
            error={errors.addressOneComplement}
          />

          <FormInput
            name="addressOneCity"
            label="Cidade"
            placeholder="Cidade"
            bind:value={profile.addressOneCity}
            error={errors.addressOneCity}
          />

          <FormSelect
            name="addressOneState"
            label="Estado"
            options={stateOptions}
            bind:value={profile.addressOneState}
            error={errors.addressOneState}
          />
        </div>
      </FormFieldset>

      <FormFieldset title="Endereço Secundário">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            name="addressTwoCepBrasilApi"
            label="CEP"
            placeholder="00000-000"
            bind:value={profile.addressTwoCepBrasilApi}
            error={errors.addressTwoCepBrasilApi}
          />

          <FormSelect
            name="addressTwoType"
            label="Tipo de Endereço"
            options={addressTypeOptions}
            bind:value={profile.addressTwoType}
            error={errors.addressTwoType}
          />

          <FormInput
            name="addressTwoStreet"
            label="Logradouro"
            placeholder="Rua, Avenida, etc."
            bind:value={profile.addressTwoStreet}
            error={errors.addressTwoStreet}
          />

          <FormInput
            name="addressTwoNumber"
            label="Número"
            placeholder="123"
            bind:value={profile.addressTwoNumber}
            error={errors.addressTwoNumber}
          />

          <FormInput
            name="addressTwoComplement"
            label="Complemento"
            placeholder="Sala, Andar, etc."
            bind:value={profile.addressTwoComplement}
            error={errors.addressTwoComplement}
          />

          <FormInput
            name="addressTwoCity"
            label="Cidade"
            placeholder="Cidade"
            bind:value={profile.addressTwoCity}
            error={errors.addressTwoCity}
          />

          <FormSelect
            name="addressTwoState"
            label="Estado"
            options={stateOptions}
            bind:value={profile.addressTwoState}
            error={errors.addressTwoState}
          />
        </div>
      </FormFieldset>
    {:else if activeTabId === "files"}
      <FormFieldset title="Arquivos Relacionados">
        <!-- Lista de arquivos adicionados -->
        {#if profile.relatedFiles.length > 0}
          <div
            class="mb-4 border dark:border-gray-700 rounded-lg overflow-hidden"
          >
            <table
              class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
            >
              <thead
                class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
              >
                <tr>
                  <th scope="col" class="px-6 py-3">Descrição</th>
                  <th scope="col" class="px-6 py-3">Arquivo</th>
                  <th scope="col" class="px-6 py-3">Data</th>
                  <th scope="col" class="px-6 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {#each profile.relatedFiles as file, index}
                  <tr
                    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td class="px-6 py-4">{file.filesDescription}</td>
                    <td class="px-6 py-4">{file.relatedFilesFiles}</td>
                    <td class="px-6 py-4">
                      {file.relatedFilesDateDay}/{file.relatedFilesDateMonth}/{file.relatedFilesDateYear}
                    </td>
                    <td class="px-6 py-4">
                      <button
                        type="button"
                        class="font-medium text-red-600 dark:text-red-500 hover:underline"
                        on:click={() => removeRelatedFile(index)}
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
          <div
            class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center mb-4"
          >
            <p class="text-gray-500 dark:text-gray-400">
              Nenhum arquivo adicionado
            </p>
          </div>
        {/if}

        <!-- Formulário para adicionar novo arquivo -->
        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 class="text-md font-medium text-gray-900 dark:text-white mb-2">
            Adicionar Arquivo
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              name="filesDescription"
              label="Descrição"
              placeholder="Ex: Contrato Social, Alvará de Funcionamento"
              bind:value={newFile.filesDescription}
            />

            <FormFile
              name="relatedFilesFiles"
              label="Arquivo"
              bind:value={newFile.relatedFilesFiles}
            />

            <div>
              <Label class="mb-2">Data do Documento</Label>
              <div class="grid grid-cols-3 gap-2">
                <FormInput
                  name="relatedFilesDateDay"
                  dataType="number"
                  placeholder="Dia"
                  bind:value={newFile.relatedFilesDateDay}
                />
                <FormInput
                  name="relatedFilesDateMonth"
                  dataType="number"
                  placeholder="Mês"
                  bind:value={newFile.relatedFilesDateMonth}
                />
                <FormInput
                  name="relatedFilesDateYear"
                  dataType="number"
                  placeholder="Ano"
                  bind:value={newFile.relatedFilesDateYear}
                />
              </div>
            </div>
          </div>
          <Button
            type="button"
            class="mt-3"
            size="sm"
            on:click={addRelatedFile}
          >
            Adicionar Arquivo
          </Button>
        </div>
      </FormFieldset>
    {:else if activeTabId === "banking"}
      <FormFieldset title="Dados Bancários Principais">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="bankDataOneName"
            label="Banco"
            placeholder="Nome ou Código do Banco"
            bind:value={profile.bankDataOne.bankName}
            error={errors.bankDataOne?.bankName}
          />

          <FormInput
            name="bankDataOneBranch"
            label="Agência"
            placeholder="0000"
            bind:value={profile.bankDataOne.bankBranch}
            error={errors.bankDataOne?.bankBranch}
          />

          <FormInput
            name="bankDataOneAccount"
            label="Conta"
            placeholder="00000-0"
            bind:value={profile.bankDataOne.bankAccount}
            error={errors.bankDataOne?.bankAccount}
          />

          <FormSelect
            name="bankDataOneAccountType"
            label="Tipo de Conta"
            options={accountTypeOptions}
            bind:value={profile.bankDataOne.bankAccountType}
            error={errors.bankDataOne?.bankAccountType}
          />
        </div>
      </FormFieldset>

      <FormFieldset title="Dados Bancários Secundários">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            name="bankDataTwoName"
            label="Banco"
            placeholder="Nome ou Código do Banco"
            bind:value={profile.bankDataTwo.bankName}
            error={errors.bankDataTwo?.bankName}
          />

          <FormInput
            name="bankDataTwoBranch"
            label="Agência"
            placeholder="0000"
            bind:value={profile.bankDataTwo.bankBranch}
            error={errors.bankDataTwo?.bankBranch}
          />

          <FormInput
            name="bankDataTwoAccount"
            label="Conta"
            placeholder="00000-0"
            bind:value={profile.bankDataTwo.bankAccount}
            error={errors.bankDataTwo?.bankAccount}
          />

          <FormSelect
            name="bankDataTwoAccountType"
            label="Tipo de Conta"
            options={accountTypeOptions}
            bind:value={profile.bankDataTwo.bankAccountType}
            error={errors.bankDataTwo?.bankAccountType}
          />
        </div>
      </FormFieldset>
    {/if}
  </FormTab>

  <!-- Botões de ação -->
  <div class="flex justify-end space-x-4 mt-8 px-4">
    <FormButton
      id="cancel-button"
      label="Cancelar"
      actionType="reset"
      on:click={handleCancel}
    />
    <FormButton
      id="submit-button"
      label={loading ? "Salvando..." : "Salvar Perfil"}
      actionType="submit"
      isDisabled={loading}
    />
  </div>
</form>
