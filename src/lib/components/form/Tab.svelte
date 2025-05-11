<script>
  import { createEventDispatcher } from "svelte";
  import { Button } from "flowbite-svelte";
  import { getComponentClasses } from "../../styles/theme";
  import { themeConfig } from "../../styles/theme"; // Import themeConfig

  export let id = "";
  export let tabs = [];
  export let activeTabId = tabs.length > 0 ? tabs[0].id : "";
  export let variant = "default";

  const dispatch = createEventDispatcher();

  function setActiveTab(tabId) {
    if (tabId !== activeTabId) {
      activeTabId = tabId;
      dispatch("tabChange", activeTabId);
      console.log("Tab changed to:", activeTabId);
    }
  }

  $: tabContainerClasses = getComponentClasses("tab", variant);

  function getTabItemClasses(isActive) {
    const variantConfig =
      themeConfig.components.tab.variants[variant] ||
      themeConfig.components.tab.variants.default;
    return isActive ? variantConfig.active : variantConfig.inactive;
  }
</script>

<div {id} class={tabContainerClasses}>
  <ul class="flex flex-wrap -mb-px text-sm font-medium text-center">
    {#each tabs as tab}
      <li class="mr-2">
        <Button
          type="button"
          class={`inline-block p-4 rounded-t-lg ${
            activeTabId === tab.id
              ? getTabItemClasses(true)
              : getTabItemClasses(false)
          }`}
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
