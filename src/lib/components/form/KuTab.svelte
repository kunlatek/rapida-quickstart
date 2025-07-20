<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Button } from "flowbite-svelte";
  import { getComponentClasses } from "$lib/styles/theme";
  import { themeConfig } from "../../styles/theme";
  import type {
    IFormCondition,
    IFormElement,
  } from "../../interfaces/form.interfaces";

  interface ITab {
    id: string;
    title: string;
    elements?: IFormElement[];
    conditions?: IFormCondition[];
  }

  type TabVariant = "default" | "pills";

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
  export const todo = "";
  export let formState: Record<string, any> = {};

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
    const tabVariants = themeConfig.components.tab.variants as Record<
      string,
      TabVariantStyles
    >;
    const variantConfig = tabVariants[variant] || tabVariants.default;
    return isActive ? variantConfig.active : variantConfig.inactive;
  }

  function evaluateConditions(
    c: IFormCondition[] | undefined,
    state: Record<string, any>
  ): boolean {
    if (!c || c.length === 0) return true;

    for (const condition of c) {
      if (condition.type === "form" && condition.elements) {
        let overallResult = true;
        let firstElement = true;

        for (const element of condition.elements) {
          const formValue = state[element.key];
          let currentResult = false;

          switch (element.comparisonOperator) {
            case "===":
              currentResult = formValue === element.value;
              break;
            case "!==":
              currentResult = formValue !== element.value;
              break;
            case ">":
              currentResult = formValue > element.value;
              break;
            case ">=":
              currentResult = formValue >= element.value;
              break;
            case "<":
              currentResult = formValue < element.value;
              break;
            case "<=":
              currentResult = formValue <= element.value;
              break;
            case "in":
              currentResult =
                Array.isArray(element.value) &&
                element.value.includes(formValue);
              break;
            case "nin":
              currentResult =
                Array.isArray(element.value) &&
                !element.value.includes(formValue);
              break;
          }

          if (firstElement) {
            overallResult = currentResult;
            firstElement = false;
          } else {
            if (element.logicalOperator === "||") {
              overallResult = overallResult || currentResult;
            } else {
              overallResult = overallResult && currentResult;
            }
          }
        }
        if (!overallResult) return false;
      }
    }
    return true;
  }

  $: showComponent = evaluateConditions(conditions, formState);
  $: visibleTabs = tabs.filter((tab) =>
    evaluateConditions(tab.conditions, formState)
  );

  $: {
    if (
      visibleTabs.length > 0 &&
      !visibleTabs.some((t) => t.id === activeTabId)
    ) {
      setActiveTab(visibleTabs[0].id);
    } else if (visibleTabs.length === 0) {
      activeTabId = "";
    }
  }
</script>

{#if showComponent}
  <div {id} class={tabContainerClasses}>
    <ul class="flex flex-wrap -mb-px text-sm font-medium text-center">
      {#each visibleTabs as tab}
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
    {#if visibleTabs.some((t) => t.id === activeTabId)}
      <slot {activeTabId} />
    {/if}
  </div>

  {#if error}
    <p class="text-red-500 text-sm mt-1">{error}</p>
  {/if}
{/if}
