<script lang="ts">
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		TableSearch,
		Modal,
		Button
	} from 'flowbite-svelte';
	import NavBar from '../../../components/NavBar.svelte';
	import { fetchModules, type IModule, deleteModule } from '$lib/services/permeson/moduleService';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import DeleteModal from '../../../components/DeleteModal.svelte';

	const searchTerm = writable('');
	const items = writable<IModule[]>([]);

	async function fetchData() {
		const modules = await fetchModules($searchTerm);
		items.set(modules);
	}

	onMount(() => fetchData());
</script>

<NavBar />

<div class="p-8">
	<Table hoverable={true}>
		<caption
			class="bg-white p-5 text-left text-lg font-semibold text-gray-900 dark:bg-gray-800 dark:text-white"
		>
			Convites
			<p class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">Lista de convites.</p>
			<br />
			<Button href="/permeson/modules/new" color="light">Adicionar</Button>
		</caption>

		<TableHead>
			<TableHeadCell>Nome</TableHeadCell>
			<TableHeadCell>Descrição</TableHeadCell>
			<TableHeadCell>Rota</TableHeadCell>
			<TableHeadCell class="w-[200px]">
				<span class="sr-only">Edit</span>
			</TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each $items as item}
				<TableBodyRow>
					<TableBodyCell>{item.name}</TableBodyCell>
					<TableBodyCell>{item.description}</TableBodyCell>
					<TableBodyCell>{item.route}</TableBodyCell>
					<TableBodyCell>
						<a
							href={'/permeson/modules/' + item._id}
							class="text-primary-600 dark:text-primary-500 font-medium text-blue-500 hover:underline"
						>
							Editar
						</a>
						|
						<DeleteModal
							deleteFunction={async () => {
								await deleteModule(item._id);
								await fetchData();
							}}
						/>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>
