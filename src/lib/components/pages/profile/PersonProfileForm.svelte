<script>
  import { createEventDispatcher } from "svelte";
  import { Label, Button, Alert, Radio, Textarea } from "flowbite-svelte";
  import {
    KuInput,
    KuSelect,
    KuFile,
    KuFieldset,
    KuTab,
    KuButton,
  } from "$lib/components/form";
  import { STATES } from "../../../../../static/constants/states";

  export let profile = {
    personName: "",
    personNickname: "",
    gender: "",
    birthday: undefined,
    maritalStatus: "",
    motherName: "",
    fatherName: "",
    personDescription: "",
    tagId: [],

    // Document data
    cpf: "",
    cpfFile: "",
    rg: "",
    rgIssuingAuthority: "",
    rgIssuanceDate: undefined,
    rgState: "",
    rgFile: "",
    passport: "",
    passportIssuanceDate: undefined,
    passportExpirationDate: undefined,
    passportFile: "",

    // Contact data
    phoneNumberOne: "",
    phoneNumberTwo: "",
    emailOne: "",
    emailTwo: "",
    linkedin: "",
    instagram: "",
    facebook: "",
    x: "",

    // Address data
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

    // Education data
    personEducation: "",
    personLanguages: [],

    // Bank data
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
  };

  export let errors = {};
  export let loading = false;
  export let success = "";

  const dispatch = createEventDispatcher();

  // Options for form fields
  const genderOptions = [
    { value: "M", name: "Masculino" },
    { value: "F", name: "Feminino" },
    { value: "N", name: "Neutro" },
    { value: "O", name: "Outro" },
  ];

  const maritalStatusOptions = [
    { value: "single", name: "Solteiro(a)" },
    { value: "married", name: "Casado(a)" },
    { value: "divorced", name: "Divorciado(a)" },
    { value: "widowed", name: "Viúvo(a)" },
    { value: "engaged", name: "Noivo(a)" },
    { value: "commonLawMarried", name: "União Estável" },
  ];

  const educationLevelOptions = [
    {
      value: "incompleteElementarySchool",
      name: "Ensino Fundamental Incompleto",
    },
    { value: "completeElementarySchool", name: "Ensino Fundamental Completo" },
    { value: "incompleteHighSchool", name: "Ensino Médio Incompleto" },
    { value: "completeHighSchool", name: "Ensino Médio Completo" },
    { value: "incompleteHigherEducation", name: "Ensino Superior Incompleto" },
    { value: "completeHigherEducation", name: "Ensino Superior Completo" },
    { value: "postgraduate", name: "Pós-graduação" },
    { value: "mastersDegree", name: "Mestrado" },
    { value: "doctorate", name: "Doutorado" },
  ];

  const stateOptions = STATES;

  const addressTypeOptions = [
    { value: "residential", name: "Residencial" },
    { value: "commercial", name: "Comercial" },
    { value: "other", name: "Outro" },
  ];

  const bankAccountTypeOptions = [
    { value: "currentAccount", name: "Conta Corrente" },
    { value: "savingsAccount", name: "Conta Poupança" },
  ];

  const languageOptions = [
    { value: "portuguese", name: "Português" },
    { value: "english", name: "Inglês" },
    { value: "spanish", name: "Espanhol" },
    { value: "french", name: "Francês" },
    { value: "german", name: "Alemão" },
    { value: "italian", name: "Italiano" },
    { value: "japanese", name: "Japonês" },
    { value: "chinese", name: "Chinês" },
    { value: "other", name: "Outro" },
  ];

  const availableTags = [
    { id: "tag1", name: "Profissional" },
    { id: "tag2", name: "Estudante" },
    { id: "tag3", name: "Empreendedor" },
    { id: "tag4", name: "Designer" },
    { id: "tag5", name: "Desenvolvedor" },
  ];

  function handleSubmit() {
    dispatch("submit", profile);
  }

  function handleCancel() {
    dispatch("cancel");
  }

  function toggleTag(tagId) {
    if (profile.tagId.includes(tagId)) {
      profile.tagId = profile.tagId.filter((id) => id !== tagId);
    } else {
      profile.tagId = [...profile.tagId, tagId];
    }
  }

  function toggleLanguage(language) {
    if (!profile.personLanguages) {
      profile.personLanguages = [];
    }

    if (profile.personLanguages.includes(language)) {
      profile.personLanguages = profile.personLanguages.filter(
        (lang) => lang !== language
      );
    } else {
      profile.personLanguages = [...profile.personLanguages, language];
    }
  }

  // Tabs configuration
  const tabs = [
    { id: "main", title: "Dados Principais" },
    { id: "documents", title: "Documentos" },
    { id: "contacts", title: "Contatos e Redes" },
    { id: "addresses", title: "Endereços" },
    { id: "education", title: "Formação" },
    { id: "banking", title: "Dados Bancários" },
  ];

  let activeTabId = tabs[0].id;

  $: console.log("PersonProfileForm - activeTabId changed to:", activeTabId);

  function handleTabChange(event) {
    console.log("Tab change event received:", event.detail);
    activeTabId = event.detail;
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-6">
  {#if success}
    <Alert color="green" class="mb-4">{success}</Alert>
  {/if}

  <KuTab
    id="person-tabs" 
    {tabs} 
    bind:activeTabId
    on:tabChange={handleTabChange}
  >
    {#if activeTabId === "main"}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <KuInput
          name="personName"
          dataType="text"
          label="Nome Completo"
          placeholder="Nome completo"
          bind:value={profile.personName}
          isRequired={true}
          error={errors.personName}
        />

        <KuInput
          name="personNickname"
          dataType="text"
          label="Como gosta de ser chamado"
          placeholder="Apelido ou nome social"
          bind:value={profile.personNickname}
          error={errors.personNickname}
        />

        <KuSelect
          name="gender"
          dataType="text"
          label="Gênero"
          options={genderOptions}
          bind:value={profile.gender}
          isRequired={true}
          error={errors.gender}
        />

        <KuInput
          name="birthday"
          dataType="date"
          label="Data de Nascimento"
          bind:value={profile.birthday}
          isRequired={true}
          error={errors.birthday}
        />

        <KuSelect
          name="maritalStatus"
          dataType="text"
          label="Estado Civil"
          options={maritalStatusOptions}
          bind:value={profile.maritalStatus}
          error={errors.maritalStatus}
        />

        <KuInput
          name="motherName"
          dataType="text"
          label="Nome da Mãe"
          placeholder="Nome completo da mãe"
          bind:value={profile.motherName}
          error={errors.motherName}
        />

        <KuInput
          name="fatherName"
          dataType="text"
          label="Nome do Pai"
          placeholder="Nome completo do pai"
          bind:value={profile.fatherName}
          error={errors.fatherName}
        />
      </div>

      <div class="mt-6">
        <Label for="personDescription" class="mb-2">Sobre Você</Label>
        <Textarea
          id="personDescription"
          rows="3"
          placeholder="Conte um pouco sobre você..."
          bind:value={profile.personDescription}
          error={errors.personDescription}
          class="w-full"
        />
      </div>

      <div class="mt-6">
        <Label class="mb-2"
          >Tags / Interesses <span class="text-red-500">*</span></Label
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
    {:else if activeTabId === "documents"}
      <KuFieldset id="documents-section" title="Documentos Pessoais">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <KuInput
            name="cpf"
            dataType="text"
            label="CPF"
            placeholder="123.456.789-00"
            bind:value={profile.cpf}
            error={errors.cpf}
          />

          <KuFile
            name="cpfFile"
            label="Arquivo do CPF"
            bind:value={profile.cpfFile}
            error={errors.cpfFile}
          />

          <KuInput
            name="rg"
            dataType="text"
            label="RG"
            placeholder="12.345.678-9"
            bind:value={profile.rg}
            error={errors.rg}
          />

          <KuFile
            name="rgFile"
            label="Arquivo do RG"
            bind:value={profile.rgFile}
            error={errors.rgFile}
          />

          <KuInput
            name="rgIssuingAuthority"
            dataType="text"
            label="Órgão Emissor do RG"
            placeholder="SSP"
            bind:value={profile.rgIssuingAuthority}
            error={errors.rgIssuingAuthority}
          />

          <KuSelect
            name="rgState"
            dataType="text"
            label="Estado Emissor"
            options={stateOptions}
            bind:value={profile.rgState}
            error={errors.rgState}
          />

          <KuInput
            name="rgIssuanceDate"
            dataType="date"
            label="Data de Emissão"
            bind:value={profile.rgIssuanceDate}
            error={errors.rgIssuanceDate}
          />
        </div>
      </KuFieldset>

      <KuFieldset id="passport-section" title="Dados de Passaporte">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <KuInput
            name="passport"
            dataType="text"
            label="Passaporte"
            placeholder="AA1234567"
            bind:value={profile.passport}
            error={errors.passport}
          />

          <KuInput
            name="passportIssuanceDate"
            dataType="date"
            label="Data de Emissão do Passaporte"
            bind:value={profile.passportIssuanceDate}
            error={errors.passportIssuanceDate}
          />

          <KuInput
            name="passportExpirationDate"
            dataType="date"
            label="Data de Expiração do Passaporte"
            bind:value={profile.passportExpirationDate}
            error={errors.passportExpirationDate}
          />

          <KuFile
            name="passportFile"
            label="Arquivo do Passaporte"
            bind:value={profile.passportFile}
            error={errors.passportFile}
          />
        </div>
      </KuFieldset>
    {:else if activeTabId === "contacts"}
      <KuFieldset id="contacts-section" title="Informações de Contato">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <KuInput
            name="phoneNumberOne"
            dataType="text"
            label="Telefone Principal"
            placeholder="(99) 99999-9999"
            bind:value={profile.phoneNumberOne}
            error={errors.phoneNumberOne}
          />

          <KuInput
            name="phoneNumberTwo"
            dataType="text"
            label="Telefone Secundário"
            placeholder="(99) 99999-9999"
            bind:value={profile.phoneNumberTwo}
            error={errors.phoneNumberTwo}
          />

          <KuInput
            name="emailOne"
            dataType="email"
            label="Email Principal"
            placeholder="email@exemplo.com"
            bind:value={profile.emailOne}
            error={errors.emailOne}
          />

          <KuInput
            name="emailTwo"
            dataType="email"
            label="Email Alternativo"
            placeholder="email@exemplo.com"
            bind:value={profile.emailTwo}
            error={errors.emailTwo}
          />
        </div>
      </KuFieldset>

      <KuFieldset id="social-section" title="Redes Sociais">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <KuInput
            name="linkedin"
            dataType="text"
            label="LinkedIn"
            placeholder="https://linkedin.com/in/seu_perfil"
            bind:value={profile.linkedin}
            error={errors.linkedin}
          />

          <KuInput
            name="instagram"
            dataType="text"
            label="Instagram"
            placeholder="@seu_perfil"
            bind:value={profile.instagram}
            error={errors.instagram}
          />

          <KuInput
            name="facebook"
            dataType="text"
            label="Facebook"
            placeholder="https://facebook.com/seu_perfil"
            bind:value={profile.facebook}
            error={errors.facebook}
          />

          <KuInput
            name="x"
            dataType="text"
            label="X / Twitter"
            placeholder="@seu_perfil"
            bind:value={profile.x}
            error={errors.x}
          />
        </div>
      </KuFieldset>
    {:else if activeTabId === "addresses"}
      <KuFieldset id="address-one-section" title="Endereço Principal">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KuInput
            name="addressOneCepBrasilApi"
            dataType="text"
            label="CEP"
            placeholder="00000-000"
            bind:value={profile.addressOneCepBrasilApi}
            error={errors.addressOneCepBrasilApi}
          />

          <KuSelect
            name="addressOneType"
            dataType="text"
            label="Tipo de Endereço"
            options={addressTypeOptions}
            bind:value={profile.addressOneType}
            error={errors.addressOneType}
          />

          <KuInput
            name="addressOneStreet"
            dataType="text"
            label="Logradouro"
            placeholder="Rua, Avenida, etc."
            bind:value={profile.addressOneStreet}
            error={errors.addressOneStreet}
          />

          <KuInput
            name="addressOneNumber"
            dataType="text"
            label="Número"
            placeholder="123"
            bind:value={profile.addressOneNumber}
            error={errors.addressOneNumber}
          />

          <KuInput
            name="addressOneComplement"
            dataType="text"
            label="Complemento"
            placeholder="Apto, Bloco, etc."
            bind:value={profile.addressOneComplement}
            error={errors.addressOneComplement}
          />

          <KuInput
            name="addressOneCity"
            dataType="text"
            label="Cidade"
            placeholder="Cidade"
            bind:value={profile.addressOneCity}
            error={errors.addressOneCity}
          />

          <KuSelect
            name="addressOneState"
            dataType="text"
            label="Estado"
            options={stateOptions}
            bind:value={profile.addressOneState}
            error={errors.addressOneState}
          />
        </div>
      </KuFieldset>

      <KuFieldset id="address-two-section" title="Endereço Secundário">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KuInput
            name="addressTwoCepBrasilApi"
            dataType="text"
            label="CEP"
            placeholder="00000-000"
            bind:value={profile.addressTwoCepBrasilApi}
            error={errors.addressTwoCepBrasilApi}
          />

          <KuSelect
            name="addressTwoType"
            dataType="text"
            label="Tipo de Endereço"
            options={addressTypeOptions}
            bind:value={profile.addressTwoType}
            error={errors.addressTwoType}
          />

          <KuInput
            name="addressTwoStreet"
            dataType="text"
            label="Logradouro"
            placeholder="Rua, Avenida, etc."
            bind:value={profile.addressTwoStreet}
            error={errors.addressTwoStreet}
          />

          <KuInput
            name="addressTwoNumber"
            dataType="text"
            label="Número"
            placeholder="123"
            bind:value={profile.addressTwoNumber}
            error={errors.addressTwoNumber}
          />

          <KuInput
            name="addressTwoComplement"
            dataType="text"
            label="Complemento"
            placeholder="Apto, Bloco, etc."
            bind:value={profile.addressTwoComplement}
            error={errors.addressTwoComplement}
          />

          <KuInput
            name="addressTwoCity"
            dataType="text"
            label="Cidade"
            placeholder="Cidade"
            bind:value={profile.addressTwoCity}
            error={errors.addressTwoCity}
          />

          <KuSelect
            name="addressTwoState"
            dataType="text"
            label="Estado"
            options={stateOptions}
            bind:value={profile.addressTwoState}
            error={errors.addressTwoState}
          />
        </div>
      </KuFieldset>
    {:else if activeTabId === "education"}
      <KuFieldset id="education-section" title="Formação Acadêmica">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <KuSelect
            name="personEducation"
            dataType="text"
            label="Nível de Escolaridade"
            options={educationLevelOptions}
            bind:value={profile.personEducation}
            error={errors.personEducation}
          />
        </div>

        <div class="mt-6">
          <Label class="mb-2">Idiomas</Label>
          <div class="flex flex-wrap gap-2">
            {#each languageOptions as language}
              <button
                type="button"
                class="px-3 py-1 text-sm rounded-full transition-colors
                  {profile.personLanguages?.includes(language.value)
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}"
                on:click={() => toggleLanguage(language.value)}
              >
                {language.name}
              </button>
            {/each}
          </div>
          {#if errors.personLanguages}
            <p class="text-red-500 text-sm mt-1">{errors.personLanguages}</p>
          {/if}
        </div>
      </KuFieldset>
    {:else if activeTabId === "banking"}
      <KuFieldset id="bank-one-section" title="Dados Bancários Principais">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <KuInput
            name="bankDataOneName"
            dataType="text"
            label="Banco"
            placeholder="Nome ou Código do Banco"
            bind:value={profile.bankDataOne.bankName}
            error={errors.bankDataOne?.bankName}
          />

          <KuInput
            name="bankDataOneBranch"
            dataType="text"
            label="Agência"
            placeholder="0000"
            bind:value={profile.bankDataOne.bankBranch}
            error={errors.bankDataOne?.bankBranch}
          />

          <KuInput
            name="bankDataOneAccount"
            dataType="text"
            label="Conta"
            placeholder="00000-0"
            bind:value={profile.bankDataOne.bankAccount}
            error={errors.bankDataOne?.bankAccount}
          />

          <KuSelect
            name="bankDataOneAccountType"
            dataType="text"
            label="Tipo de Conta"
            options={bankAccountTypeOptions}
            bind:value={profile.bankDataOne.bankAccountType}
            error={errors.bankDataOne?.bankAccountType}
          />
        </div>
      </KuFieldset>

      <KuFieldset id="bank-two-section" title="Dados Bancários Secundários">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <KuInput
            name="bankDataTwoName"
            dataType="text"
            label="Banco"
            placeholder="Nome ou Código do Banco"
            bind:value={profile.bankDataTwo.bankName}
            error={errors.bankDataTwo?.bankName}
          />

          <KuInput
            name="bankDataTwoBranch"
            dataType="text"
            label="Agência"
            placeholder="0000"
            bind:value={profile.bankDataTwo.bankBranch}
            error={errors.bankDataTwo?.bankBranch}
          />

          <KuInput
            name="bankDataTwoAccount"
            dataType="text"
            label="Conta"
            placeholder="00000-0"
            bind:value={profile.bankDataTwo.bankAccount}
            error={errors.bankDataTwo?.bankAccount}
          />

          <KuSelect
            name="bankDataTwoAccountType"
            dataType="text"
            label="Tipo de Conta"
            options={bankAccountTypeOptions}
            bind:value={profile.bankDataTwo.bankAccountType}
            error={errors.bankDataTwo?.bankAccountType}
          />
        </div>
      </KuFieldset>
    {/if}
  </KuTab>

  <!-- Botões de ação -->
  <!-- Botões de ação -->
  <div class="flex justify-end space-x-4 mt-8 px-4">
    <KuButton
      id="cancel-button"
      label="Cancelar"
      actionType="reset"
      on:click={handleCancel}
    />
    <KuButton
      id="submit-button"
      label={loading ? "Salvando..." : "Salvar Perfil"}
      actionType="submit"
      isDisabled={loading}
    />
  </div>
</form>
