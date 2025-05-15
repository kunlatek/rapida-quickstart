<script lang="ts">
  import { Label, Helper } from "flowbite-svelte";
  import { onMount } from "svelte";
  import Loading from "../common/KuLoading.svelte";
  import { getComponentClasses } from "../../styles/theme";
  import { themeConfig } from "../../styles/theme";
  import type {
    IFormAutocomplete,
    IFormCondition,
    IOptionsApi,
    IApiResponseField,
    IApiResponseFieldFilter,
  } from "../../interfaces/form.interfaces";

  // Interfaces específicas para o componente
  interface AutocompleteOption {
    label: string;
    value: string | number | boolean;
    [key: string]: any;
  }

  interface AutocompleteVariant {
    base: string;
    input: string;
    dropdown: string;
    option: string;
    error?: string;
  }

  interface AutocompleteVariants {
    default: AutocompleteVariant;
    [key: string]: AutocompleteVariant | undefined;
  }

  // Props do componente
  export let name = "";
  export let dataType:
    | "text"
    | "number"
    | "password"
    | "email"
    | "color"
    | "date"
    | "file" = "text";
  export let label = "";
  export let value: string | AutocompleteOption | AutocompleteOption[] = "";
  export let placeholder = "";
  export let tooltip = "";
  export let isAutofocus = false;
  export let isDisabled = false;
  export let isRequired = false;
  export let isMultiple = false;
  export let error = "";
  export let id = name;
  export let variant = "default";
  export let conditions: IFormCondition[] = [];
  export let validators: ("cpf" | "cnpj")[] = [];
  export let relatedEntity = "";
  export let optionsApi: IOptionsApi = {
    endpoint: "",
    labelField: [],
    valueField: "",
    paramsToFilter: [],
    paramType: "query",
  };

  // Estado interno
  let options: AutocompleteOption[] = [];
  let loading = false;
  let searchText = "";
  let showOptions = false;
  let selectedOptions: AutocompleteOption[] | AutocompleteOption | null =
    isMultiple ? [] : null;

  // Classes de estilo
  $: themeClasses = getComponentClasses("autocomplete", variant, {
    error: !!error,
    disabled: isDisabled,
  });

  $: labelClass = `mb-2 ${error ? "text-red-600 dark:text-red-500" : "text-gray-900 dark:text-white"}`;

  let inputClass = "";
  let dropdownClass = "";
  let optionClass = "";

  $: {
    const variants = themeConfig.components.autocomplete
      .variants as AutocompleteVariants;
    const currentVariant = variants[variant] || variants.default;

    inputClass = `${currentVariant.input} ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`;
    dropdownClass = currentVariant.dropdown;
    optionClass = currentVariant.option;
  }

  // Sincronização de valor
  $: if (value && typeof value === "string") {
    searchText = value;
  }

  $: if (isMultiple && Array.isArray(value)) {
    selectedOptions = value as AutocompleteOption[];
  } else if (!isMultiple && value && typeof value === "object") {
    selectedOptions = value as AutocompleteOption;
    searchText = (value as AutocompleteOption).label;
  }

  // Função para buscar opções da API
  async function fetchOptions(query = ""): Promise<void> {
    if (!optionsApi.endpoint) return;

    loading = true;
    try {
      // Simulação de chamada de API (em produção, seria substituída por uma chamada real)
      // TODO: Implementar chamada real à API usando fetch ou axios
      setTimeout(() => {
        options = [
          { label: "Opção 1", value: "option1" },
          { label: "Opção 2", value: "option2" },
          { label: "Opção 3", value: "option3" },
        ].filter((option) =>
          option.label.toLowerCase().includes(query.toLowerCase())
        );
        loading = false;
      }, 300);

      // Exemplo de como seria a implementação real
      /*
      const queryParams = new URLSearchParams();
      
      if (optionsApi.paramType === "query" && query) {
        // Adicionar filtros baseados na consulta
        optionsApi.paramsToFilter.forEach(param => {
          queryParams.append(param, query);
        });
      }
      
      // Adicionar filtros de outros campos do formulário
      if (optionsApi.filtersFromOtherFormFields && optionsApi.filtersFromOtherFormFields.length > 0) {
        // Implementar lógica para adicionar filtros de outros campos
      }
      
      const response = await fetch(`${optionsApi.endpoint}?${queryParams.toString()}`);
      const data = await response.json();
      
      // Processar os dados da resposta
      options = data.map(item => {
        const label = optionsApi.labelField.map(field => item[field]).join(' ');
        return {
          label,
          value: item[optionsApi.valueField],
          original: item // Manter o objeto original para uso posterior
        };
      });
      */
    } catch (error) {
      console.error("Erro ao buscar opções:", error);
      options = [];
    } finally {
      loading = false;
    }
  }

  // Função para selecionar uma opção
  function selectOption(option: AutocompleteOption): void {
    if (isMultiple) {
      const selectedOptionsArray = selectedOptions as AutocompleteOption[];
      const exists = selectedOptionsArray.some((o) => o.value === option.value);

      if (!exists) {
        const newSelectedOptions = [...selectedOptionsArray, option];
        selectedOptions = newSelectedOptions;
        value = newSelectedOptions;

        // Implementar preenchimento de outros campos do formulário
        if (
          optionsApi.formFieldsFilledByApiResponse &&
          optionsApi.formFieldsFilledByApiResponse.length > 0
        ) {
          // TODO: Implementar lógica de preenchimento de outros campos
        }
      }
    } else {
      selectedOptions = option;
      value = option;
      searchText = option.label;

      // Implementar preenchimento de outros campos do formulário
      if (
        optionsApi.formFieldsFilledByApiResponse &&
        optionsApi.formFieldsFilledByApiResponse.length > 0
      ) {
        // TODO: Implementar lógica de preenchimento de outros campos
      }
    }

    showOptions = false;
  }

  // Função para remover uma opção selecionada
  function removeOption(option: AutocompleteOption): void {
    if (isMultiple) {
      const selectedOptionsArray = selectedOptions as AutocompleteOption[];
      selectedOptions = selectedOptionsArray.filter(
        (o) => o.value !== option.value
      );
      value = selectedOptions;
    } else {
      selectedOptions = null;
      value = "";
      searchText = "";
    }
  }

  // Manipulador de entrada de texto
  function handleInput(): void {
    showOptions = true;
    fetchOptions(searchText);
  }

  // Basic condition evaluation function
  function evaluateConditions(): boolean {
    // If no conditions, always show
    if (!conditions || conditions.length === 0) return true;

    // For now, implement basic support - can be expanded later
    return true; // Placeholder for actual condition logic
  }

  // Only show if conditions are met
  $: showComponent = evaluateConditions();

  // Inicializar o componente
  onMount(() => {
    fetchOptions();
  });
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

    <div class={themeClasses}>
      <!-- Mostrar tags selecionadas para seleção múltipla -->
      {#if isMultiple && Array.isArray(selectedOptions) && selectedOptions.length > 0}
        <div class="flex flex-wrap gap-1 mb-2">
          {#each selectedOptions as option}
            <div
              class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center"
            >
              {option.label}
              <button
                type="button"
                class="ml-1"
                on:click={() => removeOption(option)}
                aria-label={`Remover ${option.label}`}
              >
                <svg
                  class="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
          {/each}
        </div>
      {/if}

      <!-- Campo de entrada -->
      <input
        {id}
        type={dataType}
        {name}
        bind:value={searchText}
        {placeholder}
        on:input={handleInput}
        on:focus={() => (showOptions = true)}
        on:blur={() => setTimeout(() => (showOptions = false), 150)}
        disabled={isDisabled}
        required={isRequired}
        autofocus={isAutofocus}
        class={inputClass}
      />

      <!-- Indicador de carregamento -->
      {#if loading}
        <Loading />
      {/if}

      <!-- Lista de opções -->
      {#if showOptions && options.length > 0}
        <div class={dropdownClass}>
          <ul
            class="max-h-60 py-1 overflow-auto text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            role="listbox"
          >
            {#each options as option}
              <button
                class={optionClass}
                on:click={() => selectOption(option)}
                role="option"
                aria-selected={selectedOptions === option ||
                  (isMultiple &&
                    Array.isArray(selectedOptions) &&
                    selectedOptions.some((o) => o.value === option.value))}
              >
                <div class="flex items-center">
                  <span class="block truncate text-gray-900 dark:text-white"
                    >{option.label}</span
                  >
                </div>
              </button>
            {/each}
          </ul>
        </div>
      {/if}
    </div>

    {#if error}
      <Helper class="mt-1 text-red-600 dark:text-red-500">{error}</Helper>
    {/if}
  </div>
{/if}
