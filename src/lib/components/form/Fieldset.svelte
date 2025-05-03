<script>
  export let title = "";
</script>

<div
  class="w-full bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700"
>
  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">
    {title}
  </h3>
  <div class="space-y-4">
    <slot></slot>
  </div>
</div>
