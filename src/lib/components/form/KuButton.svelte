<script lang="ts">
  import { Button as FlowbiteButton } from "flowbite-svelte";
  import { getButtonSizeClasses } from "$lib/styles/theme";
  import type {
    IFormCondition,
    IApiRequest,
  } from "../../interfaces/form.interfaces";

  type ActionType = "submit" | "reset" | "link" | "apiRequest";

  type FlowbiteButtonType = "submit" | "reset" | "button" | null | undefined;
  type FlowbiteButtonColor =
    | "primary"
    | "blue"
    | "alternative"
    | "green"
    | "red"
    | "yellow"
    | "purple"
    | "light"
    | "dark"
    | "none"
    | "alternative"
    | undefined;

  type ButtonSize = "sm" | "md" | "lg";
  type ButtonVariant =
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning";

  export let id = "";
  export let actionType: ActionType = "submit";
  export let label = "";
  export let icon = "";
  export let tooltip = "";
  export let isDisabled = false;
  export let customClass = "";
  export let ariaProps: Record<string, string> = {};
  export let variant: ButtonVariant = "primary";
  export let size: ButtonSize = "md";
  export let conditions: IFormCondition[] = [];
  export let apiRequest: IApiRequest | undefined = undefined;
  export const todo = "";

  $: type = (() => {
    switch (actionType) {
      case "submit":
        return "submit";
      case "reset":
        return "reset";
      case "link":
      case "apiRequest":
        return "button";
      default:
        return "submit";
    }
  })() as FlowbiteButtonType;

  $: color = (() => {
    switch (variant) {
      case "primary":
        return "blue";
      case "secondary":
        return "alternative";
      case "success":
        return "green";
      case "danger":
        return "red";
      case "warning":
        return "yellow";
      default:
        return "blue";
    }
  })() as FlowbiteButtonColor;

  $: sizeClasses = getButtonSizeClasses(size);

  $: buttonClass = `${sizeClasses} ${customClass}`;

  async function handleApiRequest() {
    if (actionType === "apiRequest" && apiRequest) {
      try {
        console.log("API request would be made to:", apiRequest.endpoint);
      } catch (error) {
        console.error("Error making API request:", error);
      }
    }
  }

  function handleClick(event: Event) {
    if (actionType === "apiRequest") {
      handleApiRequest();
      event.preventDefault();
    }
  }

  function evaluateConditions(): boolean {
    if (!conditions || conditions.length === 0) return true;

    return true;
  }

  $: showComponent = evaluateConditions();
</script>

{#if showComponent}
  <FlowbiteButton
    {id}
    {type}
    {disabled}
    {color}
    title={tooltip}
    class={buttonClass}
    {...ariaProps}
    on:click={handleClick}
  >
    {#if icon}
      <span class="mr-2">
        <svg
          class="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path fill-rule="evenodd" d={icon} clip-rule="evenodd"></path>
        </svg>
      </span>
    {/if}
    {label}
  </FlowbiteButton>
{/if}
