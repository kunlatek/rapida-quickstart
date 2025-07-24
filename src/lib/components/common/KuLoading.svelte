<script>
  export let size = "md";
  export let text = "";
  export let fullScreen = false;
  export let color = "blue";
  export let showBackground = false;
  export let className = "";

  const sizeMap = {
    xs: "h-4 w-4",
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
    xl: "h-12 w-12",
  };

  const textSizeMap = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const colorMap = {
    blue: "text-blue-600 dark:text-blue-500",
    gray: "text-gray-600 dark:text-gray-500",
    green: "text-green-600 dark:text-green-500",
    red: "text-red-600 dark:text-red-500",
    yellow: "text-yellow-600 dark:text-yellow-500",
    purple: "text-purple-600 dark:text-purple-500",
  };

  $: spinnerClasses = `${sizeMap[size] || sizeMap.md} ${colorMap[color] || colorMap.blue}`;
  $: textClasses = `${textSizeMap[size] || textSizeMap.md} text-gray-700 dark:text-gray-300 ml-3`;
  $: containerClasses = fullScreen
    ? "fixed inset-0 flex items-center justify-center z-50" +
      (showBackground ? " bg-gray-900/50 dark:bg-gray-900/80" : "")
    : "flex items-center justify-center";
</script>

<div class="{containerClasses} {className}">
  <div class="flex flex-col items-center justify-center">
    <div class="relative">
      <svg
        class="animate-spin {spinnerClasses}"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>

    {#if text}
      <span class={textClasses}>{text}</span>
    {/if}
  </div>
</div>
