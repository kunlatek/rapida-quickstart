<script>
  import { Button, Modal } from "flowbite-svelte";

  // Props
  export let open = false;
  export let title = "";
  export let testId = "modal"; // ID específico para testes
  export let size = "md";
  export let autoclose = true;
  export let closeButtonClass = "";
  export let classContent = "";
  export let classBgContent = "";

  // Eventos
  function onConfirm() {
    dispatch("confirm");
  }

  function onCancel() {
    dispatch("cancel");
  }

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
</script>

<Modal
  bind:open
  {title}
  {size}
  {autoclose}
  {closeButtonClass}
  {classContent}
  {classBgContent}
  data-testid={testId}
>
  <div
    role="document"
    class="p-4 md:p-5 space-y-4"
    data-testid={`${testId}-content`}
  >
    <slot>
      <!-- Conteúdo padrão do modal -->
      <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
        <slot name="message">Mensagem do modal</slot>
      </p>
    </slot>
  </div>

  <!-- Rodapé com botões -->
  <svelte:fragment slot="footer">
    {#if $$slots.footer}
      <slot name="footer"></slot>
    {:else}
      <Button
        color="alternative"
        on:click={onCancel}
        data-testid={`${testId}-cancel-button`}
      >
        <slot name="cancel-text">Cancelar</slot>
      </Button>

      <Button
        color="primary"
        on:click={onConfirm}
        data-testid={`${testId}-confirm-button`}
      >
        <slot name="confirm-text">Confirmar</slot>
      </Button>
    {/if}
  </svelte:fragment>
</Modal>
