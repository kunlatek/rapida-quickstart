<script>
  import { getComponentClasses } from "../../styles/theme";

  export let title = "";
  export let variant = "default"; // default, card

  $: fieldsetClasses = getComponentClasses("fieldset", variant);
</script>

<div class={fieldsetClasses}>
  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">
    {title}
  </h3>
  <div class="space-y-4">
    <slot></slot>
  </div>
</div>
