<script lang="ts">
  import { Fileupload, Label, Helper } from "flowbite-svelte";
  import { getComponentClasses } from "$lib/styles/theme";
  import type {
    IFormCondition,
  } from "../../interfaces/form.interfaces";

  // Definindo interfaces específicas para o componente
  interface FileVariant {
    base: string;
    error?: string;
  }

  interface FileVariants {
    default: FileVariant;
    [key: string]: FileVariant | undefined;
  }

  // Props do componente
  export let name = "";
  export let label = "";
  export let value: File | FileList | null = null;
  export let placeholder = "";
  export let tooltip = "";
  export let isDisabled = false;
  export let isRequired = false;
  export let isMultiple = false;
  export let error = "";
  export let id = name;
  export let variant = "default";
  export let conditions: IFormCondition[] = [];
  export let validators: ("onlyImages" | "png" | "jpg" | "pdf")[] = [];

  // Estilos do componente
  $: themeClasses = getComponentClasses("file", variant, {
    error: !!error,
    disabled: isDisabled,
  });
  $: labelClass = `mb-2 ${error ? "text-red-600 dark:text-red-500" : "text-gray-900 dark:text-white"}`;
  $: fileClass = `w-full ${themeClasses}`;

  // Tratamento de mudança de arquivo
  function handleFileChange(event: Event): void {
    // Como o evento pode ser qualquer tipo de Event, precisamos verificar a estrutura
    // para garantir que estamos lidando com o evento correto
    const customEvent = event as unknown as { detail?: { files?: FileList } };

    if (customEvent && customEvent.detail && customEvent.detail.files) {
      value = customEvent.detail.files;

      if (validators && validators.length > 0) {
        validateFiles(customEvent.detail.files);
      }
    }
  }

  // Validação de arquivos
  function validateFiles(files: FileList): void {
    if (!validators || validators.length === 0) return;

    let isValid = true;
    let validationError = "";

    // Converter FileList para Array para facilitar a iteração
    const fileArray = Array.from(files);

    if (validators.includes("onlyImages")) {
      const allImages = fileArray.every((file) =>
        file.type.startsWith("image/")
      );
      if (!allImages) {
        isValid = false;
        validationError = "Apenas imagens são permitidas";
      }
    }

    if (validators.includes("png")) {
      const allPNG = fileArray.every((file) => file.type === "image/png");
      if (!allPNG) {
        isValid = false;
        validationError = "Apenas arquivos PNG são permitidos";
      }
    }

    if (validators.includes("jpg")) {
      const allJPG = fileArray.every(
        (file) => file.type === "image/jpeg" || file.type === "image/jpg"
      );
      if (!allJPG) {
        isValid = false;
        validationError = "Apenas arquivos JPG são permitidos";
      }
    }

    if (validators.includes("pdf")) {
      const allPDF = fileArray.every((file) => file.type === "application/pdf");
      if (!allPDF) {
        isValid = false;
        validationError = "Apenas arquivos PDF são permitidos";
      }
    }

    if (!isValid) {
      // Caso a validação falhe, limpar o valor e definir o erro
      value = null;
      error = validationError;
    }
  }

  // Avaliação de condições
  function evaluateConditions(): boolean {
    // Se não houver condições, sempre mostrar
    if (!conditions || conditions.length === 0) return true;

    // Por enquanto, implementar suporte básico - pode ser expandido depois
    return true; // Placeholder para lógica de condição real
  }

  // Mostrar apenas se as condições forem atendidas
  $: showComponent = evaluateConditions();

  // Função auxiliar para determinar o valor do atributo accept
  function getAcceptAttributeFromValidators(
    validators: ("onlyImages" | "png" | "jpg" | "pdf")[]
  ): string {
    if (!validators || validators.length === 0) return "";

    const acceptTypes: string[] = [];

    if (validators.includes("onlyImages")) {
      acceptTypes.push("image/*");
    } else {
      if (validators.includes("png")) acceptTypes.push("image/png");
      if (validators.includes("jpg")) acceptTypes.push("image/jpeg");
    }

    if (validators.includes("pdf")) acceptTypes.push("application/pdf");

    return acceptTypes.join(",");
  }
</script>

{#if showComponent}
  <div class="w-full">
    <Label for={id} class={labelClass}>
      {label}
      {#if isRequired}<span class="text-red-500">*</span>{/if}
      {#if tooltip}
        <span
          class="ml-1 text-gray-400 hover:text-gray-600 cursor-help"
          title={tooltip}
        >
          <svg
            class="w-4 h-4 inline"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </span>
      {/if}
    </Label>

    <Fileupload
      {id}
      {name}
      {placeholder}
      on:change={handleFileChange}
      disabled={isDisabled}
      required={isRequired}
      multiple={isMultiple}
      class={fileClass}
      accept={getAcceptAttributeFromValidators(validators)}
    />

    {#if error}
      <Helper class="mt-1 text-red-600 dark:text-red-500">{error}</Helper>
    {/if}
  </div>
{/if}
