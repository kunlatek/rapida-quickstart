<script lang="ts">
  import { getComponentClasses } from "../../styles/theme";
  import type {
    IFormCondition,
    IFormElement,
  } from "../../interfaces/form.interfaces";

  // Tipagem para variantes de fieldset
  type FieldsetVariant = "default" | "card";

  export let id = "";
  export let title = "";
  export let variant: FieldsetVariant = "default";
  export let conditions: IFormCondition[] = [];
  export let todo = "";
  export let elements: IFormElement[] = [];
  export let error = "";

  // Computar classes do fieldset usando o tema
  $: fieldsetClasses = getComponentClasses("fieldset", variant);

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
