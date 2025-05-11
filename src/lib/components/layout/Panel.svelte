<script>
  import { getComponentClasses } from "../../styles/theme";

  export let title = "";
  export let subtitle = "";
  export let icon = "";
  export let collapsible = false;
  export let collapsed = false;
  export let variant = "default";
  export let headerActions = [];

  $: panelClasses = getComponentClasses("panel", variant);
  $: expanded = !collapsed;

  function toggleCollapse() {
    if (collapsible) {
      collapsed = !collapsed;
      expanded = !collapsed;
    }
  }
</script>

<div class={panelClasses}>
  {#if title || headerActions.length > 0}
    <div
      class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700"
      class:cursor-pointer={collapsible}
      on:click={toggleCollapse}
    >
      <div class="flex items-center">
        {#if icon}
          <span class="mr-2">
            {icon}
          </span>
        {/if}

        <div>
          {#if title}
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              {title}
            </h3>
          {/if}

          {#if subtitle}
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          {/if}
        </div>
      </div>

      <div class="flex items-center space-x-2">
        {#each headerActions as action}
          <button
            type="button"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            on:click|stopPropagation={action.handler}
          >
            {action.icon || action.label}
          </button>
        {/each}

        {#if collapsible}
          <button
            type="button"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            on:click|stopPropagation={toggleCollapse}
          >
            {#if expanded}
              <svg
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            {:else}
              <svg
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            {/if}
          </button>
        {/if}
      </div>
    </div>
  {/if}

  {#if expanded}
    <div class="p-4">
      <slot></slot>
    </div>
  {/if}
</div>
