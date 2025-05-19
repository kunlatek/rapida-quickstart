<script lang="ts">
  import { onMount } from "svelte";
  import { Button, Spinner } from "flowbite-svelte";
  import { getComponentClasses } from "../../styles/theme";
  import KuPagination from "../navigation/KuPagination.svelte";

  // Interfaces para tipagem forte
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
  }

  // Defina o tipo correto para color, baseado nos valores aceitos pelo componente Button
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
    color?: ButtonColor; // Correção do tipo de color
    handler: (row: any) => void;
  }

  interface IHeaderAction {
    label: string;
    color?: ButtonColor; // Correção do tipo de color
    handler: () => void;
  }

  interface IPagination {
    enabled: boolean;
    pageSize: number;
    pageSizeOptions?: number[];
  }

  // Props com tipagem forte
  export const id: string = ""; // Changed from export let to export const
  export let title: string = "";
  export let dataSource: IDataSource = { endpoint: "" };
  export let columns: IColumn[] = [];
  export let pagination: IPagination = { enabled: true, pageSize: 10 };
  export let actions: IAction[] = [];
  export let variant: string = "default";
  export let headerActions: IHeaderAction[] = [];

  // Estado local com tipagem forte
  let data: any[] = [];
  let loading: boolean = false;
  let error: string | null = null;
  let totalItems: number = 0;
  let currentPage: number = 1;

  // Estado de ordenação
  let sortColumn: string | null = null;
  let sortDirection: "asc" | "desc" = "asc";

  // Estado de filtros
  let filters: Record<string, string> = {};

  // Classes da tabela com base no tema
  $: tableClasses = getComponentClasses("dataTable", variant);

  // Inicialização do componente
  onMount(() => {
    fetchData();
  });

  /**
   * Busca dados da API com base nos parâmetros atuais
   */
  async function fetchData(): Promise<void> {
    if (!dataSource.endpoint) return;

    loading = true;

    try {
      // Preparar parâmetros de consulta
      const params = new URLSearchParams();

      // Adicionar parâmetros de paginação
      if (pagination.enabled) {
        params.append("page", currentPage.toString());
        params.append("limit", pagination.pageSize.toString());
      }

      // Adicionar parâmetros de ordenação
      if (sortColumn) {
        params.append("sortBy", sortColumn);
        params.append("sortDir", sortDirection);
      }

      // Adicionar parâmetros de filtro
      for (const [key, value] of Object.entries(filters)) {
        if (value) {
          params.append(key, value);
        }
      }

      // Buscar dados
      const response = await fetch(
        `${dataSource.endpoint}?${params.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();

      // Processar resultados
      data = result.data || result;
      totalItems = result.total || data.length;
    } catch (err) {
      console.error("Error fetching data:", err);
      error = err instanceof Error ? err.message : "Unknown error";
    } finally {
      loading = false;
    }
  }

  /**
   * Manipula a ordenação de colunas
   * @param column - A coluna a ser ordenada
   */
  function handleSort(column: IColumn): void {
    if (column.sortable === false) return;

    if (sortColumn === column.key) {
      // Alternar direção de ordenação se for a mesma coluna
      sortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
      // Definir nova coluna de ordenação e padrão para ascendente
      sortColumn = column.key;
      sortDirection = "asc";
    }

    fetchData();
  }

  /**
   * Manipula a filtragem de dados
   * @param column - A coluna a ser filtrada
   * @param value - O valor do filtro
   */
  function handleFilter(column: IColumn, value: string): void {
    filters[column.key] = value;
    currentPage = 1; // Resetar para a primeira página ao filtrar
    fetchData();
  }

  /**
   * Manipula a mudança de página na paginação
   * @param page - O número da página para navegar
   */
  function handlePageChange(page: number): void {
    currentPage = page;
    fetchData();
  }

  /**
   * Trata o evento de input com segurança de tipo
   * @param e - O evento de input
   * @param column - A coluna a ser filtrada
   */
  function handleInputEvent(e: Event, column: IColumn): void {
    // Garantir que e.target não é null e é do tipo HTMLInputElement
    const target = e.target as HTMLInputElement;
    if (target) {
      handleFilter(column, target.value);
    }
  }

  /**
   * Formata o valor de uma célula com base nas regras de formatação da coluna
   * @param row - A linha de dados
   * @param column - A definição da coluna
   * @returns O valor formatado
   */
  function formatCellValue(row: any, column: IColumn): any {
    const value = column.formatValue
      ? column.formatValue(row[column.key])
      : row[column.key];

    if (column.formatter) {
      // Formatar valor com base no tipo de formatador
      switch (column.formatter) {
        case "date":
          return new Date(value).toLocaleDateString();
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
