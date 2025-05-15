<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Button } from "flowbite-svelte";
  import { getComponentClasses } from "../../styles/theme";
  import { themeConfig } from "../../styles/theme";
  import type {
    IFormCondition,
    IFormElement,
  } from "../../interfaces/form.interfaces";

  // Interface para o formato das abas
  interface ITab {
    id: string;
    title: string;
    elements?: IFormElement[];
  }

  // Interface para os tipos de variantes suportadas
  type TabVariant = "default" | "pills";

  // Interface para configurações de estilo das abas
  interface TabVariantStyles {
    base: string;
    active: string;
    inactive: string;
  }

  export let id = "";
  export let tabs: ITab[] = [];
  export let activeTabId = tabs.length > 0 ? tabs[0].id : "";
  export let variant: TabVariant = "default";
  export let conditions: IFormCondition[] = [];
  export let error = "";
  export let todo = "";

  const dispatch = createEventDispatcher<{ tabChange: string }>();

  function setActiveTab(tabId: string): void {
    if (tabId !== activeTabId) {
      activeTabId = tabId;
      dispatch("tabChange", activeTabId);
      console.log("Tab changed to:", activeTabId);
    }
  }

  $: tabContainerClasses = getComponentClasses("tab", variant);

  function getTabItemClasses(isActive: boolean): string {
    // Garantir que estamos acessando variantes válidas
    const tabVariants = themeConfig.components.tab.variants as Record<
      TabVariant,
      TabVariantStyles
    >;
    const variantConfig = tabVariants[variant] || tabVariants.default;
    return isActive ? variantConfig.active : variantConfig.inactive;
  }

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
            on:click={() => setActiveTab(tab.id)}
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

  {#if error}
    <p class="text-red-500 text-sm mt-1">{error}</p>
  {/if}
{/if}
