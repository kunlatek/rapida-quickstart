<script>
  import { Fileupload, Label, Helper } from "flowbite-svelte";

  export let name = "";
  export let label = "";
  export let value = null;
  export let tooltip = "";
  export let isDisabled = false;
  export let isRequired = false;
  export let isMultiple = false;
  export let error = "";
  export let id = name;

  // Label class based on error state
  $: labelClass = `mb-2 ${error ? "text-red-600 dark:text-red-500" : "text-gray-900 dark:text-white"}`;

  // Handle file change manually
  function handleFileChange(event) {
    if (event.detail && event.detail.files) {
      value = event.detail.files;
    }
  }
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
          xmlns="http://www.w3.org/..."
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

  <Fileupload
    {id}
    {name}
    on:change={handleFileChange}
    disabled={isDisabled}
    required={isRequired}
    multiple={isMultiple}
    class="w-full"
  />

  {#if error}
    <Helper class="mt-1 text-red-600 dark:text-red-500">{error}</Helper>
  {/if}
</div>
