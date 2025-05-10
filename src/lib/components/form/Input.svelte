<script>
  import { Label, Input as FlowbiteInput, Helper } from "flowbite-svelte";

  export let name = "";
  export let dataType = "text";
  export let label = "";
  export let value = "";
  export let placeholder = "";
  export let tooltip = "";
  export let isAutofocus = false;
  export let isDisabled = false;
  export let isRequired = false;
  export let maxlength = undefined;
  export let minLength = undefined;
  export let error = "";
  export let id = name;

  // Função para lidar com a mudança de valor em campos de data
  function handleChange(event) {
    // Se for um campo de data e o valor estiver vazio, defina como undefined
    if (dataType === "date" && event.target.value === "") {
      value = undefined;
    } else {
      value = event.target.value;
    }
  }

  // Classe CSS condicional baseada no erro
  $: labelClass = `mb-2 ${error ? "text-red-600 dark:text-red-500" : "text-gray-900 dark:text-white"}`;
  $: inputClass = error
    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
    : "";
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

  <FlowbiteInput
    {id}
    type={dataType}
    {name}
    bind:value
    {placeholder}
    disabled={isDisabled}
    required={isRequired}
    autofocus={isAutofocus}
    {maxlength}
    minlength={minLength}
    class="w-full {inputClass}"
    on:change={handleChange}
  />

  {#if error}
    <Helper class="mt-1 text-red-600 dark:text-red-500">{error}</Helper>
  {/if}
</div>
