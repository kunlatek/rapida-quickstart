<script lang="ts">
  import { Label, Helper } from "flowbite-svelte";
  import { onMount } from "svelte";
  import Loading from "../common/KuLoading.svelte";
  import { getComponentClasses, themeConfig } from "$lib/styles/theme";
  import type {
    IFormAutocomplete,
    IFormCondition,
    IOptionsApi,
    IApiResponseField,
    IApiResponseFieldFilter,
  } from "../../interfaces/form.interfaces";
  import api from "$lib/services/api";

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
  export const validators: ("cpf" | "cnpj")[] = [];
  export const relatedEntity = "";
  export let optionsApi: IOptionsApi = {
    endpoint: "",
    labelField: [],
    valueField: "",
    paramsToFilter: [],
    paramType: "query",
  };
  export let formState: Record<string, any> = {};

  let options: AutocompleteOption[] = [];
  let loading = false;
  let searchText = "";
  let showOptions = false;
  let selectedOptions: AutocompleteOption[] | AutocompleteOption | null =
    isMultiple ? [] : null;
  let debounceTimeout: number;

  $: themeClasses = getComponentClasses("autocomplete", variant, {
    error: !!error,
    disabled: isDisabled,
  });

  $: labelClass = `mb-2 ${error ? "text-red-600 dark:text-red-500" : "text-gray-900 dark:text-white"}`;

  $: isInputRequired =
    isRequired &&
    (!selectedOptions ||
      (Array.isArray(selectedOptions) && selectedOptions.length === 0));

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

  $: if (value && typeof value === "string") {
    searchText = value;
  }

  $: if (isMultiple && Array.isArray(value)) {
    selectedOptions = value as AutocompleteOption[];
  } else if (!isMultiple && value && typeof value === "object") {
    selectedOptions = value as AutocompleteOption;
    searchText = (value as AutocompleteOption).label;
  }

  async function fetchOptions(query = ""): Promise<void> {
    if (!optionsApi.endpoint) return;

    loading = true;
    try {
      const params = new URLSearchParams();
      if (query && optionsApi.paramsToFilter.length > 0) {
        optionsApi.paramsToFilter.forEach((param) => {
          params.append(param, query);
        });
      }

      const endpoint = optionsApi.endpoint.startsWith("/api")
        ? optionsApi.endpoint.slice(4)
        : optionsApi.endpoint;

      const response = await api.get(endpoint, { params });
      const items = response.data.data || response.data;

      if (Array.isArray(items)) {
        options = items.map((item) => {
          const label = optionsApi.labelField
            .map((field) => {
              return field
                .split(".")
                .reduce((o, i) => (o ? o[i] : undefined), item);
            })
            .join(" ");

          return {
            ...item,
            label,
            value: item[optionsApi.valueField],
          };
        });
      }
    } catch (err) {
      console.error("Erro ao buscar opções:", err);
      options = [];
    } finally {
      loading = false;
    }
  }

  function selectOption(option: AutocompleteOption): void {
    if (isMultiple) {
      const selectedOptionsArray = selectedOptions as AutocompleteOption[];
      const exists = selectedOptionsArray.some((o) => o.value === option.value);

      if (!exists) {
        const newSelectedOptions = [...selectedOptionsArray, option];
        selectedOptions = newSelectedOptions;
        value = newSelectedOptions;
        searchText = "";

        if (
          optionsApi.formFieldsFilledByApiResponse &&
          optionsApi.formFieldsFilledByApiResponse.length > 0
        ) {
        }
      }
    } else {
      selectedOptions = option;
      value = option;
      searchText = option.label;

      if (
        optionsApi.formFieldsFilledByApiResponse &&
        optionsApi.formFieldsFilledByApiResponse.length > 0
      ) {
      }
    }

    showOptions = false;
  }

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

  function handleInput(): void {
    showOptions = true;
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      fetchOptions(searchText);
    }, 700);
  }

  function evaluateConditions(state: Record<string, any>): boolean {
    if (!conditions || conditions.length === 0) return true;

    for (const condition of conditions) {
      if (condition.type === "form" && condition.elements) {
        let overallResult = true;
        let firstElement = true;

        for (const element of condition.elements) {
          const formValue = state[element.key];
          let currentResult = false;

          switch (element.comparisonOperator) {
            case "===":
              currentResult = formValue === element.value;
              break;
            case "!==":
              currentResult = formValue !== element.value;
              break;
            case ">":
              currentResult = formValue > element.value;
              break;
            case ">=":
              currentResult = formValue >= element.value;
              break;
            case "<":
              currentResult = formValue < element.value;
              break;
            case "<=":
              currentResult = formValue <= element.value;
              break;
            case "in":
              currentResult =
                Array.isArray(element.value) &&
                element.value.includes(formValue);
              break;
            case "nin":
              currentResult =
                Array.isArray(element.value) &&
                !element.value.includes(formValue);
              break;
          }

          if (firstElement) {
            overallResult = currentResult;
            firstElement = false;
          } else {
            if (element.logicalOperator === "||") {
              overallResult = overallResult || currentResult;
            } else {
              overallResult = overallResult && currentResult;
            }
          }
        }
        if (!overallResult) return false;
      }
    }
    return true;
  }

  $: showComponent = evaluateConditions(formState);

  onMount(() => {
    fetchOptions();

    if (isAutofocus && !isDisabled) {
      const inputElement = document.getElementById(id);
      if (inputElement) {
        inputElement.focus();
      }
    }
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
        required={isInputRequired}
        class={inputClass}
      />

      {#if loading}
        <Loading />
      {/if}

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
