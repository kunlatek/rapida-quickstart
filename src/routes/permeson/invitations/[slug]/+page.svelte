<script lang="ts">
	import { Label, Input, Heading, Select, Button } from 'flowbite-svelte';
	import { EnvelopeSolid } from 'flowbite-svelte-icons';
	import NavBar from '../../../../components/NavBar.svelte';
	import { writable } from 'svelte/store';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import { fetchPermissions, type IPermission } from '$lib/services/permeson/permissionService';
	import {
		createInvitation,
		fetchInvitation,
		updateInvitation
	} from '$lib/services/permeson/invitationService';
	import { goto } from '$app/navigation';

	const id = writable('');
	const email = writable('');
	const permissionId = writable('');
	const permissions = writable<IPermission[]>([]);

	onMount(async () => {
		id.set($page.params.slug);
		if ($id !== 'new') {
			const invitation = await fetchInvitation($id);
			email.set(invitation.email);
			permissionId.set(invitation.permission);
		}

		const data = await fetchPermissions();
		permissions.set(data);
	});
</script>

<NavBar />

<div class="p-8">
	<div class="my-6">
		<nav class="breadcrumb">
			<a href="/home">Home</a>
			<span>/</span>
			<a href="/permeson/invitations">Convites</a>
			<span>/</span>
			<span class="active">{$id === 'new' ? 'Novo' : 'Editar'}</span>
		</nav>
	</div>

	<Heading tag="h2" customSize="text-4xl font-extrabold" class="my-5">Convite</Heading>

	<div class="mb-6">
		<Label for="email" class="mb-2 block">E-mail</Label>
		<Input id="email" placeholder="E-mail" required bind:value={$email}>
			<EnvelopeSolid slot="left" class="h-5 w-5 text-gray-500 dark:text-gray-400" />
		</Input>
	</div>

	<div class="mb-6">
		<Label for="permissionId" class="mb-2 block">Permissão</Label>
		<Select
			id="permissionId"
			placeholder="Selecione uma permissão"
			required
			bind:value={$permissionId}
		>
			{#each $permissions as permission}
				<option value={permission._id}>{permission.name}</option>
			{/each}
		</Select>
	</div>

	<Button
		color="light"
		class="mt-5"
		block
		on:click={async () => {
			try {
				if ($id === 'new') {
					await createInvitation({
						email: $email,
						permission: $permissionId
					});
				} else {
					await updateInvitation({
						_id: $id,
						email: $email,
						permission: $permissionId
					});
				}
				goto('/permeson/invitations');
			} catch (error) {
				console.error(error);
			}
		}}
	>
		{$id === 'new' ? 'Adicionar' : 'Editar'}
	</Button>
</div>
