<script>
	import { Button, Modal } from 'flowbite-svelte';
	import { ExclamationCircleOutline } from 'flowbite-svelte-icons';
	let popupModal = false;
	export let deleteFunction;
</script>

<!-- svelte-ignore a11y-invalid-attribute -->
<a
	href="#"
	class="text-primary-600 dark:text-primary-500 font-medium text-red-500 hover:underline"
	on:click={() => (popupModal = true)}
>
	Excluir
</a>

<Modal bind:open={popupModal} size="xs" autoclose>
	<div class="text-center">
		<ExclamationCircleOutline class="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-200" />
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			Tem certeza que quer excluir esse registro?
		</h3>
		<Button color="red" class="me-2" on:click={() => deleteFunction()}>Sim</Button>
		<Button color="alternative">Cancelar</Button>
	</div>
</Modal>
