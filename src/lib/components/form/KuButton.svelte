<script>
  import { Button as FlowbiteButton } from "flowbite-svelte";
  import {
    getComponentClasses,
    getButtonSizeClasses,
  } from "../../styles/theme";

  export let id = "";
  export let actionType = "submit";
  export let label = "";
  export let icon = "";
  export let tooltip = "";
  export let isDisabled = false;
  export let customClass = "";
  export let ariaProps = {};
  export let variant = "primary"; // primary, secondary, success, danger, warning
  export let size = "md"; // sm, md, lg

  $: type = actionType === "link" ? "button" : actionType;

  // Mapeamento de variantes para cores do Flowbite
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
  })();

  // Classes de tamanho
  $: sizeClasses = getButtonSizeClasses(size);

  // Combinar todas as classes
  $: buttonClass = `${sizeClasses} ${customClass}`;
</script>

<FlowbiteButton
  {id}
  {type}
  disabled={isDisabled}
  {color}
  title={tooltip}
  class={buttonClass}
  {...ariaProps}
>
  {#if icon}
    <span class="mr-2">
      <svg
        class="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/licenses/svg"
      >
        <path fill-rule="evenodd" d={icon} clip-rule="evenodd"></path>
      </svg>
    </span>
  {/if}
  {label}
</FlowbiteButton>
