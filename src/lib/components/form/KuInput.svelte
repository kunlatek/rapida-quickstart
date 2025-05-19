<script lang="ts">
  import { Label, Input as FlowbiteInput, Helper } from "flowbite-svelte";
  import { getComponentClasses } from "../../styles/theme";
  import { EyeSolid, EyeSlashSolid } from "flowbite-svelte-icons";
  import type {
    IFormCondition,
    IApiRequest,
  } from "../../interfaces/form.interfaces";

  // Interface definitions
  interface InputVariant {
    base: string;
    error?: string;
  }

  interface InputVariants {
    default: InputVariant;
    [key: string]: InputVariant | undefined;
  }

  // Props
  export let name = "";
  export let dataType:
    | "text"
    | "number"
    | "password"
    | "email"
    | "color"
    | "date"
    | "wysiwyg"
    | "time" = "text";
  export let label = "";
  export let value: string | number | undefined = "";
  export let placeholder = "";
  export let tooltip = "";
  export let isAutofocus = false;
  export let isDisabled = false;
  export let isRequired = false;
  export const isUnique = false; // Changed from export let to export const
  export let maxlength: number | undefined = undefined;
  export let minLength: number | undefined = undefined;
  export let error = "";
  export let id = name;
  export let variant = "default";
  export let conditions: IFormCondition[] = [];
  export let validators: (
    | "cep"
    | "cpf"
    | "cnpj"
    | "onlyNumbers"
    | "phone"
    | "email"
  )[] = [];
  
  export let apiRequest: IApiRequest | undefined = undefined;

  // Estado interno
  let showPassword = false;
  let validationError: string | null = null;

  // Valor computado para o tipo do input
  $: inputType =
    dataType === "password" && showPassword
      ? "text"
      : dataType === "wysiwyg"
        ? "text"
        : dataType;

  // Classes de estilo
  $: themeClasses = getComponentClasses("input", variant, {
    error: !!error || !!validationError,
    disabled: isDisabled,
  });
  $: labelClass = `mb-2 ${error || validationError ? "text-red-600 dark:text-red-500" : "text-gray-900 dark:text-white"}`;
  $: inputClass = `w-full ${themeClasses}`;

  // Toggle de visibilidade da senha
  function togglePasswordVisibility(): void {
    showPassword = !showPassword;
  }

  // Validação de entrada
  function validateInput(value: string | number | undefined): string | null {
    if (
      !validators ||
      validators.length === 0 ||
      value === undefined ||
      value === ""
    ) {
      return null;
    }

    const stringValue = value.toString();

    if (validators.includes("cpf") && !isValidCPF(stringValue)) {
      return "CPF inválido";
    }

    if (validators.includes("cnpj") && !isValidCNPJ(stringValue)) {
      return "CNPJ inválido";
    }

    if (validators.includes("cep") && !isValidCEP(stringValue)) {
      return "CEP inválido";
    }

    if (validators.includes("onlyNumbers") && !/^\d+$/.test(stringValue)) {
      return "Apenas números são permitidos";
    }

    if (validators.includes("phone") && !isValidPhone(stringValue)) {
      return "Telefone inválido";
    }

    if (validators.includes("email") && !isValidEmail(stringValue)) {
      return "Email inválido";
    }

    return null;
  }

  // Funções auxiliares de validação
  function isValidCPF(cpf: string): boolean {
    const regex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$|^\d{11}$/;
    return regex.test(cpf);
    // Nota: Uma validação completa incluiria verificação do dígito verificador
  }

  function isValidCNPJ(cnpj: string): boolean {
    const regex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$|^\d{14}$/;
    return regex.test(cnpj);
    // Nota: Uma validação completa incluiria verificação do dígito verificador
  }

  function isValidCEP(cep: string): boolean {
    const regex = /^\d{5}\-\d{3}$|^\d{8}$/;
    return regex.test(cep);
  }

  function isValidPhone(phone: string): boolean {
    const regex = /^(\+\d{1,3}\s?)?\(?\d{2,3}\)?[\s.-]?\d{4,5}[\s.-]?\d{4}$/;
    return regex.test(phone);
  }

  function isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Tratamento de mudança no input
  function handleChange(event: Event): void {
    const targetInput = event.target as HTMLInputElement;

    if (dataType === "date" && targetInput.value === "") {
      value = undefined;
    } else {
      value =
        dataType === "number" ? targetInput.valueAsNumber : targetInput.value;

      // Validar input quando o valor mudar
      validationError = validateInput(value);
    }

    // Se for um campo com requisição de API, disparar a requisição quando o valor mudar
    if (apiRequest && !validationError) {
      fetchDataFromApi();
    }
  }

  // Tratador específico para o evento input para campos numéricos
  function handleInputForNumbers(event: Event): void {
    if (dataType === "number") {
      handleChange(event);
    }
  }

  // Função para tratar o evento input para qualquer tipo (não só números)
  function handleInput(event: Event): void {
    if (dataType === "number") {
      handleInputForNumbers(event);
    }
    // Se necessário, adicione aqui lógica para outros tipos
  }

  // Função placeholder para requisição de API
  async function fetchDataFromApi(): Promise<void> {
    if (!apiRequest || !apiRequest.endpoint) return;

    try {
      // Aqui seria implementada a lógica para buscar dados da API
      // Exemplo:
      /*
      const response = await fetch(apiRequest.endpoint);
      const data = await response.json();
      
      // Preencher outros campos do formulário com base na resposta
      if (apiRequest.formFieldsFilledByApiResponse) {
        apiRequest.formFieldsFilledByApiResponse.forEach(field => {
          // Lógica para preencher campos com base na resposta
        });
      }
      */
    } catch (error) {
      console.error("Erro ao buscar dados da API:", error);
    }
  }

  // Avaliação de condições
  function evaluateConditions(): boolean {
    // Se não houver condições, sempre mostrar
    if (!conditions || conditions.length === 0) return true;

    // Por enquanto, implementar suporte básico - pode ser expandido depois
    return true; // Placeholder para lógica de condição real
  }

  // Mostrar apenas se as condições forem atendidas
  $: showComponent = evaluateConditions();

  // Atualizar a validação quando o valor mudar
  $: {
    if (value !== undefined && value !== "") {
      validationError = validateInput(value);
    } else {
      validationError = null;
    }
  }
</script>

{#if showComponent}
  <div class="w-full">
    <Label for={id} class={labelClass}>
      {label}
      {#if isRequired}<span class="text-red-500">*</span>{/if}
      {#if tooltip}
        <span
          class="ml-1 text-gray-400 hover:text-gray-600 cursor-help"
          title={tooltip}
        >
          <svg
            class="w-4 h-4 inline"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </span>
      {/if}
    </Label>

    <div class="relative">
      <!-- Input normal para a maioria dos tipos -->
      {#if dataType !== "wysiwyg"}
        <FlowbiteInput
          {id}
          type={inputType}
          {name}
          bind:value
          {placeholder}
          disabled={isDisabled}
          required={isRequired}
          autofocus={isAutofocus}
          {maxlength}
          minlength={minLength}
          class={inputClass}
          on:change={handleChange}
          on:input={handleInput}
        />

        <!-- Botão para mostrar/ocultar senha - só aparece se for tipo password -->
        {#if dataType === "password"}
          <button
            type="button"
            class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            on:click|preventDefault={togglePasswordVisibility}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {#if showPassword}
              <EyeSlashSolid class="w-5 h-5" />
            {:else}
              <EyeSolid class="w-5 h-5" />
            {/if}
          </button>
        {/if}
      {:else}
        <!-- Input do tipo wysiwyg - implementar editor rich text aqui -->
        <div
          class="border border-gray-300 rounded-lg p-2 dark:border-gray-600 dark:bg-gray-700"
        >
          <textarea
            {id}
            {name}
            bind:value
            {placeholder}
            disabled={isDisabled}
            required={isRequired}
            {maxlength}
            minlength={minLength}
            class="w-full bg-transparent border-0 focus:ring-0 p-0 dark:text-white"
            rows="5"
          ></textarea>
          <!-- Nota: Aqui seria implementado um editor WYSIWYG real -->
        </div>
      {/if}
    </div>

    {#if error || validationError}
      <Helper class="mt-1 text-red-600 dark:text-red-500"
        >{error || validationError}</Helper
      >
    {/if}
  </div>
{/if}
