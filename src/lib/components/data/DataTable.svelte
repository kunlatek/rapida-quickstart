<script>
  import { onMount } from "svelte";
  import { Button, Spinner } from "flowbite-svelte";
  import { getComponentClasses } from "../../styles/theme";
  import Pagination from "../navigation/Pagination.svelte";

  export let id = "";
  export let title = "";
  export let dataSource = { endpoint: "" };
  export let columns = [];
  export let pagination = { enabled: true, pageSize: 10 };
  export let actions = [];
  export let variant = "default";

  let data = [];
  let loading = false;
  let error = null;
  let totalItems = 0;
  let currentPage = 1;

  // Sorting state
  let sortColumn = null;
  let sortDirection = "asc";

  // Filter state
  let filters = {};

  $: tableClasses = getComponentClasses("dataTable", variant);

  onMount(() => {
    fetchData();
  });

  async function fetchData() {
    if (!dataSource.endpoint) return;

    loading = true;

    try {
      // Build query parameters
      const params = new URLSearchParams();

      // Add pagination
      if (pagination.enabled) {
        params.append("page", currentPage.toString());
        params.append("limit", pagination.pageSize.toString());
      }

      // Add sorting
      if (sortColumn) {
        params.append("sortBy", sortColumn);
        params.append("sortDir", sortDirection);
      }

      // Add filters
      for (const [key, value] of Object.entries(filters)) {
        if (value) {
          params.append(key, value);
        }
      }

      // Make the API request
      const response = await fetch(
        `${dataSource.endpoint}?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();

      // Update component state
      data = result.data || result;
      totalItems = result.total || data.length;
    } catch (err) {
      console.error("Error fetching data:", err);
      error = err.message;
    } finally {
      loading = false;
    }
  }

  function handleSort(column) {
    if (column.sortable === false) return;

    if (sortColumn === column.key) {
      // Toggle direction
      sortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
      // New column
      sortColumn = column.key;
      sortDirection = "asc";
    }

    fetchData();
  }

  function handleFilter(column, value) {
    filters[column.key] = value;
    currentPage = 1; // Reset to first page
    fetchData();
  }

  function handlePageChange(page) {
    currentPage = page;
    fetchData();
  }

  function formatCellValue(row, column) {
    const value = row[column.key];

    if (column.formatter) {
      // Handle different formatters
      switch (column.formatter) {
        case "date":
          return new Date(value).toLocaleDateString();
        case "currency":
          return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(value);
        case "boolean":
          return value ? "Sim" : "Não";
        default:
          return value;
      }
    }

    return value;
  }
</script>

<div class={tableClasses}>
  {#if title}
    <h2 class="text-xl font-semibold mb-4">{title}</h2>
  {/if}

  {#if error}
    <div class="bg-red-100 text-red-700 p-4 rounded mb-4">
      Error: {error}
    </div>
  {/if}

  <div class="overflow-x-auto relative">
    {#if loading}
      <div class="flex justify-center p-4">
        <Spinner size="lg" />
      </div>
    {:else}
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            {#each columns as column}
              <th
                scope="col"
                class="px-6 py-3 cursor-pointer {column.sortable !== false
                  ? 'hover:bg-gray-200 dark:hover:bg-gray-600'
                  : ''}"
                on:click={() => handleSort(column)}
              >
                <div class="flex items-center">
                  {column.header}

                  {#if sortColumn === column.key}
                    <span class="ml-1">
                      {#if sortDirection === "asc"}
                        ↑
                      {:else}
                        ↓
                      {/if}
                    </span>
                  {/if}
                </div>

                {#if column.filterable}
                  <div class="mt-2">
                    <input
                      type="text"
                      class="w-full py-1 px-2 text-xs rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800"
                      placeholder="Filter..."
                      on:input={(e) => handleFilter(column, e.target.value)}
                    />
                  </div>
                {/if}
              </th>
            {/each}

            {#if actions && actions.length > 0}
              <th scope="col" class="px-6 py-3"> Actions </th>
            {/if}
          </tr>
        </thead>

        <tbody>
          {#if data.length === 0}
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <td
                colspan={columns.length + (actions.length > 0 ? 1 : 0)}
                class="px-6 py-4 text-center"
              >
                No data available
              </td>
            </tr>
          {:else}
            {#each data as row}
              <tr
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {#each columns as column}
                  <td class="px-6 py-4">
                    {formatCellValue(row, column)}
                  </td>
                {/each}

                {#if actions && actions.length > 0}
                  <td class="px-6 py-4">
                    <div class="flex space-x-2">
                      {#each actions as action}
                        <Button
                          size="xs"
                          color={action.color || "blue"}
                          on:click={() => action.handler(row)}
                        >
                          {action.label}
                        </Button>
                      {/each}
                    </div>
                  </td>
                {/if}
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>

      {#if pagination.enabled && totalItems > pagination.pageSize}
        <div class="mt-4">
          <Pagination
            {totalItems}
            pageSize={pagination.pageSize}
            {currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      {/if}
    {/if}
  </div>
</div>
