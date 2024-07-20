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
	import {
		fetchInvitations,
		type IInvitation,
		deleteInvitation
	} from '$lib/services/permeson/invitationService';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import DeleteModal from '../../../components/DeleteModal.svelte';

	const searchTerm = writable('');
	const items = writable<IInvitation[]>([]);

	async function fetchData() {
		const invitations = await fetchInvitations($searchTerm);
		items.set(invitations);
	}

	onMount(() => fetchData());
</script>

<div class="p-8">
	<!-- <TableSearch placeholder="Burcar por e-mail" hoverable={true} bind:inputValue={$searchTerm}> -->
	<Table hoverable={true}>
		<caption
			class="bg-white p-5 text-left text-lg font-semibold text-gray-900 dark:bg-gray-800 dark:text-white"
		>
			Convites
			<p class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">Lista de convites.</p>
			<br />
			<Button href="/permeson/invitations/new" color="light">Adicionar</Button>
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
					<TableBodyCell>{item.accepted ? 'Aceito' : 'Pendente'}</TableBodyCell>
					<TableBodyCell>
						{#if !item.accepted}
							<a
								href={'/permeson/invitations/' + item._id}
								class="text-primary-600 dark:text-primary-500 font-medium text-blue-500 hover:underline"
							>
								Editar
							</a>
							|
							<DeleteModal
								deleteFunction={async () => {
									await deleteInvitation(item._id);
									await fetchData();
								}}
							/>
						{/if}
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
	<!-- </TableSearch> -->
</div>
