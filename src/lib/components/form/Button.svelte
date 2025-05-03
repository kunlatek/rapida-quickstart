<script>
  import { Button as FlowbiteButton } from "flowbite-svelte";

  export let id = "";
  export let actionType = "submit";
  export let label = "";
  export let icon = "";
  export let tooltip = "";
  export let isDisabled = false;
  export let customClass = "";
  export let ariaProps = {};

  $: type = actionType === "link" ? "button" : actionType;
  $: color = actionType === "reset" ? "alternative" : "primary";
</script>

<FlowbiteButton
  {id}
  {type}
  disabled={isDisabled}
  {color}
  title={tooltip}
  class={customClass}
  {...ariaProps}
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
