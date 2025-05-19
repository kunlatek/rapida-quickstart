<script lang="ts">
  import { getComponentClasses } from "../../styles/theme";
  import type {
    IFormCondition,
    IFormElement,
  } from "../../interfaces/form.interfaces";

  // Fieldset variant type
  type FieldsetVariant = "default" | "card";

  export let id = "";
  export let title = "";
  export let variant: FieldsetVariant = "default";
  export let conditions: IFormCondition[] = [];
  export const todo = ""; // Changed from export let to export const
  export const elements: IFormElement[] = []; // Changed from export let to export const
  export let error = "";

  // Logic
  $: fieldsetClasses = getComponentClasses("fieldset", variant);

  // Function to evaluate conditions
  function evaluateConditions(): boolean {
    // If no conditions, return true
    if (!conditions || conditions.length === 0) return true;

    // Condition evaluation logic would go here
    return true;
  }

  // Reactive conditions evaluation
  $: showComponent = evaluateConditions();
</script>

{#if showComponent}
  <div {id} class={fieldsetClasses}>
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">
      {title}
    </h3>
    <div class="space-y-4">
      <slot></slot>
    </div>
    {#if error}
      <p class="text-red-500 text-sm mt-1">{error}</p>
    {/if}
  </div>
{/if}
