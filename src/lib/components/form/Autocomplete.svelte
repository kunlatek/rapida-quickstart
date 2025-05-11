<script>
  import { Label, Helper } from "flowbite-svelte";
  import { writable } from "svelte/store";
  import { onMount } from "svelte";
  import Loading from "../common/Loading.svelte";
  import { getComponentClasses } from "../../styles/theme";

  export let name = "";
  export let dataType = "text";
  export let label = "";
  export let value = "";
  export let placeholder = "";
  export let tooltip = "";
  export let isDisabled = false;
  export let isRequired = false;
  export let isMultiple = false;
  export let error = "";
  export let id = name;
  export let variant = "default";
  export let optionsApi = {
    endpoint: "",
    labelField: [],
    valueField: "",
    paramsToFilter: [],
    paramType: "query",
  };

  let options = [];
  let loading = false;
  let searchText = "";
  let showOptions = false;
  let selectedOptions = isMultiple ? [] : null;

  // Classes do tema
  $: themeClasses = getComponentClasses("autocomplete", variant, {
    error: !!error,
    disabled: isDisabled,
  });
  $: labelClass = `mb-2 ${error ? "text-red-600 dark:text-red-500" : "text-gray-900 dark:text-white"}`;
  $: inputClass = `${themeConfig.components.autocomplete.variants[variant]?.input || themeConfig.components.autocomplete.variants.default.input} ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`;
  $: dropdownClass =
    themeConfig.components.autocomplete.variants[variant]?.dropdown ||
    themeConfig.components.autocomplete.variants.default.dropdown;
  $: optionClass =
    themeConfig.components.autocomplete.variants[variant]?.option ||
    themeConfig.components.autocomplete.variants.default.option;

  $: if (value && typeof value === "string") {
    searchText = value;
  }

  $: if (isMultiple && Array.isArray(value)) {
    selectedOptions = value;
  } else if (!isMultiple && value) {
    selectedOptions = value;
  }

  async function fetchOptions(query = "") {
    if (!optionsApi.endpoint) return;

    loading = true;
    try {
      // Simulação da API - em uma implementação real, isso seria substituído por uma chamada à API real
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
    } catch (error) {
      console.error("Erro ao buscar opções:", error);
      options = [];
      loading = false;
    }
  }

  function selectOption(option) {
    if (isMultiple) {
      const exists = selectedOptions.some((o) => o.value === option.value);
      if (!exists) {
        selectedOptions = [...selectedOptions, option];
        value = selectedOptions;
      }
    } else {
      selectedOptions = option;
      value = option.value;
      searchText = option.label;
    }
    showOptions = false;
  }

  function removeOption(option) {
    if (isMultiple) {
      selectedOptions = selectedOptions.filter((o) => o.value !== option.value);
      value = selectedOptions;
    } else {
      selectedOptions = null;
      value = "";
      searchText = "";
    }
  }

  function handleInput() {
    showOptions = true;
    fetchOptions(searchText);
  }

  onMount(() => {
    fetchOptions();
  });
</script>

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
          xmlns="http://www.w3.org/licenses/svg"
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
    {#if isMultiple && selectedOptions.length > 0}
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
                xmlns="http://www.w3.org/licenses/svg"
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
