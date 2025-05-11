<script>
  import { Button } from "flowbite-svelte";
  import { getComponentClasses } from "../../styles/theme";

  export let title = "";
  export let subtitle = "";
  export let image = "";
  export let description = "";
  export let properties = [];
  export let actions = [];
  export let link = "";
  export let variant = "default";

  $: cardClasses = getComponentClasses("dataCard", variant);
</script>

<div class={cardClasses}>
  {#if image}
    <div class="relative w-full h-40 mb-4">
      <img
        src={image}
        alt={title}
        class="object-cover w-full h-full rounded-t-lg"
      />
    </div>
  {/if}

  <div class="p-4">
    {#if title}
      <h3 class="text-xl font-semibold mb-1 text-gray-900 dark:text-white">
        {#if link}
          <a href={link} class="hover:underline">{title}</a>
        {:else}
          {title}
        {/if}
      </h3>
    {/if}

    {#if subtitle}
      <h4 class="text-md text-gray-600 dark:text-gray-400 mb-3">{subtitle}</h4>
    {/if}

    {#if description}
      <p class="text-gray-700 dark:text-gray-300 mb-4">{description}</p>
    {/if}

    {#if properties && properties.length > 0}
      <div class="mb-4 space-y-2">
        {#each properties as property}
          <div class="flex justify-between">
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400"
              >{property.label}</span
            >
            <span class="text-sm text-gray-900 dark:text-white"
              >{property.value}</span
            >
          </div>
        {/each}
      </div>
    {/if}

    {#if actions && actions.length > 0}
      <div class="flex space-x-2 mt-4">
        {#each actions as action}
          <Button
            size="sm"
            color={action.color || "blue"}
            on:click={action.handler}
          >
            {action.label}
          </Button>
        {/each}
      </div>
    {/if}
  </div>
</div>
