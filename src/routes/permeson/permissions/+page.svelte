<script lang="ts">
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		TableSearch
	} from 'flowbite-svelte';
	import NavBar from '../../../components/NavBar.svelte';
	import { fetchPermissions, type IRapidaPermission } from '$lib/services/rapidaPermissionService';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';

	const items = writable<IRapidaPermission[]>([]);

	async function fetchData() {
		const permissions = await fetchPermissions();
		items.set(permissions);
	}

	onMount(() => fetchData());
</script>

<NavBar />

<Table hoverable={true}>
	<caption
		class="bg-white p-5 text-left text-lg font-semibold text-gray-900 dark:bg-gray-800 dark:text-white"
	>
		Permissões
		<p class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">Lista de permissões.</p>
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
						href="/rapida/permissions/edit"
						class="text-primary-600 dark:text-primary-500 font-medium text-blue-500 hover:underline"
					>
						Editar
					</a>
					|
					<a
						href="/rapida/permissions"
						class="text-primary-600 dark:text-primary-500 font-medium text-red-500 hover:underline"
					>
						Excluir
					</a>
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
