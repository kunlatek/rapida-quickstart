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
	import { fetchInvitations, type IRapidaInvitation } from '$lib/services/rapidaInvitationService';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';

	const searchTerm = writable('');
	const items = writable<IRapidaInvitation[]>([]);

	async function fetchData() {
		const invitations = await fetchInvitations($searchTerm);
		items.set(invitations);
	}

	onMount(() => fetchData());
</script>

<NavBar />

<TableSearch placeholder="Burcar por e-mail" hoverable={true} bind:inputValue={$searchTerm}>
	<caption
		class="bg-white p-5 text-left text-lg font-semibold text-gray-900 dark:bg-gray-800 dark:text-white"
	>
		Convites
		<p class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">Lista de convites.</p>
	</caption>

	<TableHead>
		<TableHeadCell>E-mail</TableHeadCell>
		<TableHeadCell>Status</TableHeadCell>
		<TableHeadCell class="w-[200px]">
			<span class="sr-only">Edit</span>
		</TableHeadCell>
	</TableHead>
	<TableBody tableBodyClass="divide-y">
		{#each $items as item}
			<TableBodyRow>
				<TableBodyCell>{item.email}</TableBodyCell>
				<TableBodyCell>{item.accepted ? '' : 'Pendente'}</TableBodyCell>
				<TableBodyCell>
					<a
						href="/rapida/invitations/edit"
						class="text-primary-600 dark:text-primary-500 font-medium text-blue-500 hover:underline"
					>
						Editar
					</a>
					|
					<a
						href="/rapida/invitations"
						class="text-primary-600 dark:text-primary-500 font-medium text-red-500 hover:underline"
					>
						Excluir
					</a>
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</TableSearch>
