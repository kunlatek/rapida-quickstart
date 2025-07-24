<script lang="ts">
  import { onMount } from "svelte";
  import { Button, Spinner } from "flowbite-svelte";
  import { getComponentClasses } from "$lib/styles/theme";
  import KuPagination from "../navigation/KuPagination.svelte";
  import api from "$lib/services/api";

  interface IDataSource {
    endpoint: string;
  }

  interface IColumn {
    key: string;
    header: string;
    sortable?: boolean;
    filterable?: boolean;
    isTag?: boolean;
    formatValue?: (value: any) => any;
    formatter?: "date" | "currency" | "number" | "boolean" | "custom";
    displayProperty?: string;
    type?:
      | "title"
      | "subtitle"
      | "description"
      | "video"
      | "image"
      | "images"
      | "icon";
  }

  type ButtonColor =
    | "red"
    | "yellow"
    | "green"
    | "purple"
    | "blue"
    | "light"
    | "dark"
    | "primary"
    | "none"
    | "alternative"
    | undefined;

  interface IAction {
    label: string;
    color?: ButtonColor;
    handler: (row: any) => void;
  }

  interface IHeaderAction {
    label: string;
    color?: ButtonColor;
    handler: () => void;
  }

  interface IPagination {
    enabled: boolean;
    pageSize: number;
    pageSizeOptions?: number[];
  }

  export const id: string = "";
  export let title: string = "";
  export let dataSource: IDataSource = { endpoint: "" };
  export let columns: IColumn[] = [];
  export let pagination: IPagination = { enabled: true, pageSize: 10 };
  export let actions: IAction[] = [];
  export let variant: string = "default";
  export let headerActions: IHeaderAction[] = [];

  let data: any[] = [];
  let loading: boolean = false;
  let error: string | null = null;
  let totalItems: number = 0;
  let currentPage: number = 1;

  let sortColumn: string | null = "updatedAt";
  let sortDirection: "asc" | "desc" = "desc";

  let filters: Record<string, string> = {};

  $: tableClasses = getComponentClasses("dataTable", variant);

  onMount(() => {
    fetchData();
  });

  async function fetchData(): Promise<void> {
    if (!dataSource.endpoint) return;

    loading = true;
    error = null;

    try {
      const params = new URLSearchParams();

      if (pagination.enabled) {
        params.append("page", currentPage.toString());
        params.append("limit", pagination.pageSize.toString());
      }

      if (sortColumn) {
        params.append("sortBy", sortColumn);
        params.append("sortDir", sortDirection);
      }

      for (const [key, value] of Object.entries(filters)) {
        if (value) {
          params.append(key, value);
        }
      }

      const response = await api.get(dataSource.endpoint, { params });

      const result = response.data;

      data = result.data || result;
      totalItems = result.total || data.length;
    } catch (err: any) {
      console.error("Error fetching data:", err);
      error = err.response?.data?.message || err.message || "Unknown error";
    } finally {
      loading = false;
    }
  }

  function handleSort(column: IColumn): void {
    if (column.sortable === false) return;

    if (sortColumn === column.key) {
      sortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
      sortColumn = column.key;
      sortDirection = "asc";
    }

    fetchData();
  }

  function handleFilter(column: IColumn, value: string): void {
    filters[column.key] = value;
    currentPage = 1;
    fetchData();
  }

  function handlePageChange(page: number): void {
    currentPage = page;
    fetchData();
  }

  function handleInputEvent(e: Event, column: IColumn): void {
    const target = e.target as HTMLInputElement;
    if (target) {
      handleFilter(column, target.value);
    }
  }

  function resolveNestedValue(obj: any, path: string): any {
    const parts = path.split(".");
    let current = obj;
    for (let i = 0; i < parts.length; i++) {
      if (current === null || typeof current === "undefined") {
        return null;
      }
      const part = parts[i];
      if (Array.isArray(current)) {
        return current
          .map((item) => (item ? item[part] : null))
          .filter((item) => item != null);
      }
      current = current[part];
    }
    return current;
  }

  function formatCellValue(row: any, column: IColumn): any {
    let value = resolveNestedValue(row, column.key);

    if (column.formatValue) {
      return column.formatValue(value);
    }

    if (Array.isArray(value)) {
      if (
        value.length > 0 &&
        typeof value[0] === "object" &&
        column.displayProperty
      ) {
        return value
          .map(
            (item) => resolveNestedValue(item, column.displayProperty!) || ""
          )
          .join(", ");
      }
      return value.join(", ");
    }

    if (column.formatter) {
      switch (column.formatter) {
        case "date":
          if (!value) return "";
          return new Date(value).toLocaleDateString("pt-BR", {
            timeZone: "UTC",
          });
        case "currency":
          return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(value);
        case "number":
          return new Intl.NumberFormat("pt-BR").format(value);
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
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold mb-4 dark:text-white pl-4 pt-4">
        {title}
      </h2>
      {#if headerActions && headerActions.length > 0}
        <div class="flex justify-end pr-4">
          {#each headerActions as action}
            <Button
              size="xs"
              color={action.color || "blue"}
              on:click={() => action.handler()}
            >
              {action.label}
            </Button>
          {/each}
        </div>
      {/if}
    </div>
  {/if}

  {#if error}
    <div class="bg-red-100 text-red-700 p-4 rounded mb-4">
      Error: {error}
    </div>
  {/if}

  <div class="overflow-x-auto relative">
    {#if loading}
      <div class="flex justify-center p-4">
        <Spinner />
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
                      on:input={(e) => handleInputEvent(e, column)}
                    />
                  </div>
                {/if}
              </th>
            {/each}

            {#if actions && actions.length > 0}
              <th scope="col" class="px-6 py-3"> Ações </th>
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
                Nenhum dado disponível
              </td>
            </tr>
          {:else}
            {#each data as row}
              <tr
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {#each columns as column}
                  <td class="px-6 py-4">
                    {#if column.isTag}
                      <span
                        class="px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded-full"
                      >
                        {formatCellValue(row, column)}
                      </span>
                    {:else if column.type === "image"}
                      <img
                        src={formatCellValue(row, column)}
                        alt={column.header}
                        class="h-16 object-cover rounded-md"
                      />
                    {:else}
                      {formatCellValue(row, column)}
                    {/if}
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
          <KuPagination
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
