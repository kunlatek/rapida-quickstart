<script lang="ts">
  import { Label, Select as FlowbiteSelect, Helper } from "flowbite-svelte";
  import { getComponentClasses } from "../../styles/theme";
  import type { IFormCondition } from "../../interfaces/form.interfaces";

  // Interface definitions
  interface ISelectOption {
    label: string;
    value: string | number | boolean;
    isDisabled?: boolean;
    isSelected?: boolean;
  }

  // Legacy option interface
  interface LegacyOption {
    name: string;
    value: any;
    isDisabled?: boolean;
  }

  // FlowbiteSelect option interface
  interface FlowbiteSelectOption {
    name: string;
    value: any;
    disabled?: boolean;
  }

  // Option type
  type OptionType = ISelectOption | LegacyOption;

  type DataType =
    | "text"
    | "number"
    | "password"
    | "email"
    | "color"
    | "date"
    | "file";
  type Validator = "cpf" | "cnpj";

  export let name = "";
  export const dataType: DataType = "text";
  export let label = "";
  export let value: string | number | boolean = "";
  export let placeholder = "";
  export let tooltip = "";
  export let isAutofocus = false;
  export let isDisabled = false;
  export let isRequired = false;
  export const isUnique = false;
  export let isMultiple = false;
  export let options: OptionType[] = [];
  export let error = "";
  export let id = name;
  export let variant = "default";
  export let conditions: IFormCondition[] = [];
  export const validators: Validator[] = [];
  export const todo = "";

  // Função de type guard para verificar se é uma opção legada
  function isLegacyOption(option: OptionType): option is LegacyOption {
    return "name" in option && !("label" in option);
  }

  // Process options to ensure they have the correct format for FlowbiteSelect
  $: processedOptions = options.map((option) => {
    if (isLegacyOption(option)) {
      // Já está no formato correto para FlowbiteSelect
      return {
        name: option.name,
        value: option.value,
        disabled: option.isDisabled || false,
      };
    } else {
      // Precisa converter de label para name
      return {
        name: option.label,
        value: option.value,
        disabled: option.isDisabled || false,
      };
    }
  });

  // Get styles from theme configuration
  $: themeClasses = getComponentClasses("select", variant, {
    error: !!error,
    disabled: isDisabled,
  });
  $: labelClass = `mb-2 ${error ? "text-red-600 dark:text-red-500" : "text-gray-900 dark:text-white"}`;
  $: selectClass = `w-full ${themeClasses}`;

  // Evaluate conditions to determine if the component should be shown
  function evaluateConditions(): boolean {
    // If no conditions are provided, the component is shown
    if (!conditions || conditions.length === 0) return true;

    // Implementation would check conditions against form data
    // For now, we return true as a placeholder
    return true;
  }

  // Reactive variable to determine if component should be shown
  $: showComponent = evaluateConditions();
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

    <FlowbiteSelect
      {id}
      {name}
      bind:value
      {placeholder}
      disabled={isDisabled}
      required={isRequired}
      multiple={isMultiple}
      items={processedOptions}
      class={selectClass}
      autofocus={isAutofocus}
    />

    {#if error}
      <Helper class="mt-1 text-red-600 dark:text-red-500">{error}</Helper>
    {/if}
  </div>
{/if}
