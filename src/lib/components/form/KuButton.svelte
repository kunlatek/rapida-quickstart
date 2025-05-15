<script lang="ts">
  import { Button as FlowbiteButton } from "flowbite-svelte";
  import {
    getComponentClasses,
    getButtonSizeClasses,
  } from "../../styles/theme";
  import type {
    IFormCondition,
    IApiRequest,
  } from "../../interfaces/form.interfaces";

  // ActionType para nosso componente
  type ActionType = "submit" | "reset" | "link" | "apiRequest";

  // Tipos esperados pelo FlowbiteButton
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
  export let todo = "";

  // Determine button type based on actionType, convertendo para tipo compatível
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

  // Map variant to Flowbite color
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

  // Get size classes from theme
  $: sizeClasses = getButtonSizeClasses(size);

  // Combine all button classes
  $: buttonClass = `${sizeClasses} ${customClass}`;

  // Handle API request if actionType is apiRequest
  async function handleApiRequest() {
    if (actionType === "apiRequest" && apiRequest) {
      try {
        // This would be implemented to handle API requests
        console.log("API request would be made to:", apiRequest.endpoint);
        // Example implementation would fetch from the endpoint
      } catch (error) {
        console.error("Error making API request:", error);
      }
    }
  }

  // Handle button click based on actionType
  function handleClick(event: Event) {
    if (actionType === "apiRequest") {
      handleApiRequest();
      event.preventDefault();
    }
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
  <FlowbiteButton
    {id}
    {type}
    disabled={isDisabled}
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
