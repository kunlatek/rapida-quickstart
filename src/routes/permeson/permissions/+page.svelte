<script lang="ts">
	import {
		Button,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
	} from 'flowbite-svelte';
	import {
		deletePermission,
		fetchPermissions,
		type IPermission
	} from '$lib/services/permeson/permissionService';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import DeleteModal from '../../../components/DeleteModal.svelte';

	const items = writable<IPermission[]>([]);

	async function fetchData() {
		const permissions = await fetchPermissions();
		items.set(permissions);
	}

	onMount(() => fetchData());
</script>

<div class="p-8">
	<Table hoverable={true}>
		<caption
			class="bg-white p-5 text-left text-lg font-semibold text-gray-900 dark:bg-gray-800 dark:text-white"
		>
			Permissões
			<p class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">Lista de permissões.</p>
			<br />
			<Button href="/permeson/permissions/new" color="light">Adicionar</Button>
		</caption>

		<TableHead>
			<TableHeadCell>Nome</TableHeadCell>
			<TableHeadCell>Descrição</TableHeadCell>
			<TableHeadCell>Permissão admin</TableHeadCell>
			<TableHeadCell class="w-[200px]">
				<span class="sr-only">Edit</span>
			</TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each $items as item}
				<TableBodyRow>
					<TableBodyCell>{item.name}</TableBodyCell>
					<TableBodyCell>{item.description}</TableBodyCell>
					<TableBodyCell>{item.isAdminPermission ? 'Sim' : 'Não'}</TableBodyCell>
					<TableBodyCell>
						<a
							href={'/permeson/permissions/' + item._id}
							class="text-primary-600 dark:text-primary-500 font-medium text-blue-500 hover:underline"
						>
							Editar
						</a>
						|
						<DeleteModal
							deleteFunction={async () => {
								await deletePermission(item._id);
								await fetchData();
							}}
						/>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>
