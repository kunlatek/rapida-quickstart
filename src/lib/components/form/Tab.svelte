<script>
  import { createEventDispatcher } from "svelte";
  import { Button } from "flowbite-svelte";

  export let id = "";
  export let tabs = [];
  export let activeTabId = tabs.length > 0 ? tabs[0].id : "";

  const dispatch = createEventDispatcher();

  function setActiveTab(tabId) {
    if (tabId !== activeTabId) {
      activeTabId = tabId;
      dispatch("tabChange", activeTabId);
      console.log("Tab changed to:", activeTabId);
    }
  }
</script>

<div
  {id}
  class="border-b border-gray-200 dark:border-gray-100 dark:text-gray-100"
>
  <ul class="flex flex-wrap -mb-px text-sm font-medium text-center">
    {#each tabs as tab}
      <li class="mr-2">
        <Button
          type="button"
          class="inline-block p-4 rounded-t-lg {activeTabId === tab.id
            ? 'text-blue-600 border-b border-blue-600 dark:text-gray-100 dark:border-gray-500 dark:bg-gray-700'
            : 'hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 border-b-2 border-transparent'}"
          on:click={(event) => setActiveTab(tab.id, event)}
          aria-current={activeTabId === tab.id ? "page" : undefined}
        >
          {tab.title}
        </Button>
      </li>
    {/each}
  </ul>
</div>

<div class="mt-4">
  <slot {activeTabId} />
</div>
