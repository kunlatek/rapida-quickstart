<script>
  import { Button } from "flowbite-svelte";
  import { getComponentClasses } from "../../styles/theme";

  export let title = "";
  export let items = [];
  export let error = "";
  export let variant = "default";

  // Classes do tema
  $: containerClasses = getComponentClasses("array", variant);
  $: itemClasses =
    themeConfig.components.array.variants[variant]?.item ||
    themeConfig.components.array.variants.default.item;

  function addItem() {
    const newItem = {};

    // Copiar a estrutura do primeiro item, se existir
    if (items.length > 0) {
      Object.keys(items[0]).forEach((key) => {
        newItem[key] = "";
      });
    }
    items = [...items, newItem];
  }

  function removeItem(index) {
    items = items.filter((_, i) => i !== index);
  }
</script>

<div class={containerClasses}>
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
        <slot {item} {index}></slot>
      </div>
    </div>
  {/each}

  {#if error}
    <p class="text-red-500 text-sm mt-1">{error}</p>
  {/if}
</div>
