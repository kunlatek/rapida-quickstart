<script lang="ts">
  import { Button } from "flowbite-svelte";
  import { getComponentClasses, themeConfig } from "$lib/styles/theme";
  import type {
    IFormArray,
    IFormElement,
    IFormCondition,
    IArrayVariants,
  } from "../../interfaces/form.interfaces";

  // Props do componente
  export let id = "";
  export let title = "";
  export let items: any[] = [];
  export let error = "";
  export let variant: string = "default";
  export let conditions: IFormCondition[] = [];
  export let elements: IFormElement[] = [];

  // Get classes from theme
  $: containerClasses = getComponentClasses("array", variant);

  // Declarando a variável itemClasses
  let itemClasses: string;

  // Corrigindo o acesso ao themeConfig com tipagem adequada
  $: {
    const arrayVariants = themeConfig.components.array
      .variants as IArrayVariants;
    itemClasses = arrayVariants[variant]?.item || arrayVariants.default.item;
  }

  // Function to create a new item based on elements or first item
  function addItem(): void {
    const newItem: Record<string, any> = {};

    if (elements && elements.length > 0) {
      // Create item based on defined elements
      elements.forEach((element) => {
        if (element.name) {
          newItem[element.name] = "";
        }
      });
    } else if (items.length > 0) {
      // Fallback to existing item structure
      Object.keys(items[0]).forEach((key) => {
        newItem[key] = "";
      });
    }

    items = [...items, newItem];
  }

  function removeItem(index: number): void {
    items = items.filter((_, i) => i !== index);
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
</script>

{#if showComponent}
  <div {id} class={containerClasses}>
    <div class="flex justify-between items-center mb-3">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
      <Button size="xs" on:click={addItem}>Adicionar Item</Button>
    </div>

    {#if items.length === 0}
      <p class="text-gray-500 dark:text-gray-400 text-sm">
        Nenhum item adicionado
      </p>
    {/if}

    {#each items as item, index}
      <div class={itemClasses}>
        <div class="flex justify-between items-center mb-2">
          <h4 class="text-md font-medium text-gray-800 dark:text-white">
            Item {index + 1}
          </h4>
          <button
            type="button"
            class="text-red-600 dark:text-red-500 hover:underline text-sm"
            on:click={() => removeItem(index)}
          >
            Remover
          </button>
        </div>

        <div class="space-y-3">
          <slot {item} {index} {elements}></slot>
        </div>
      </div>
    {/each}

    {#if error}
      <p class="text-red-500 text-sm mt-1">{error}</p>
    {/if}
  </div>
{/if}
