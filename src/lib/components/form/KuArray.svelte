<script lang="ts">
  import { Button } from "flowbite-svelte";
  import { getComponentClasses, themeConfig } from "$lib/styles/theme";
  import type {
    IFormArray,
    IFormElement,
    IFormCondition,
    IArrayVariants,
  } from "../../interfaces/form.interfaces";

  export let id = "";
  export let title = "";
  export let items: any[] = [];
  export let error = "";
  export let variant: string = "default";
  export let conditions: IFormCondition[] = [];
  export let elements: IFormElement[] = [];

  $: containerClasses = getComponentClasses("array", variant);

  let itemClasses: string;

  $: {
    const arrayVariants = themeConfig.components.array
      .variants as IArrayVariants;
    itemClasses = arrayVariants[variant]?.item || arrayVariants.default.item;
  }

  function addItem(): void {
    const newItem: Record<string, any> = {};

    if (elements && elements.length > 0) {
      elements.forEach((element) => {
        if (element.name) {
          newItem[element.name] = "";
        }
      });
    } else if (items.length > 0) {
      Object.keys(items[0]).forEach((key) => {
        newItem[key] = "";
      });
    }

    items = [...items, newItem];
  }

  function removeItem(index: number): void {
    items = items.filter((_, i) => i !== index);
  }

  function evaluateConditions(): boolean {
    if (!conditions || conditions.length === 0) return true;

    return true;
  }

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
          <slot name="item" {item} {index} {elements}></slot>
        </div>
      </div>
    {/each}

    {#if error}
      <p class="text-red-500 text-sm mt-1">{error}</p>
    {/if}
  </div>
{/if}
  