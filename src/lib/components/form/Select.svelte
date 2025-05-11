<script>
  import { Label, Select as FlowbiteSelect, Helper } from "flowbite-svelte";
  import { getComponentClasses } from "../../styles/theme";

  export let name = "";
  export let label = "";
  export let value = "";
  export let placeholder = "";
  export let tooltip = "";
  export let isDisabled = false;
  export let isRequired = false;
  export let isMultiple = false;
  export let options = [];
  export let error = "";
  export let id = name;
  export let variant = "default";

  // Classes CSS baseadas em estado e variantes usando a função de tema
  $: themeClasses = getComponentClasses("select", variant, {
    error: !!error,
    disabled: isDisabled,
  });
  $: labelClass = `mb-2 ${error ? "text-red-600 dark:text-red-500" : "text-gray-900 dark:text-white"}`;
  $: selectClass = `w-full ${themeClasses}`;
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

  <FlowbiteSelect
    {id}
    {name}
    bind:value
    {placeholder}
    disabled={isDisabled}
    required={isRequired}
    multiple={isMultiple}
    items={options}
    class={selectClass}
  />

  {#if error}
    <Helper class="mt-1 text-red-600 dark:text-red-500">{error}</Helper>
  {/if}
</div>
