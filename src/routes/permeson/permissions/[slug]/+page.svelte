<script lang="ts">
	import {
		Label,
		Input,
		Heading,
		Select,
		Button,
		Toggle,
		MultiSelect,
		Card
	} from 'flowbite-svelte';
	import { EnvelopeSolid } from 'flowbite-svelte-icons';
	import NavBar from '../../../../components/NavBar.svelte';
	import { writable } from 'svelte/store';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import {
		createPermission,
		fetchPermission,
		updatePermission,
		type IModulePermission
	} from '$lib/services/permeson/permissionService';
	import { fetchModules, type IModule } from '$lib/services/permeson/moduleService';
	import { goto } from '$app/navigation';

	const id = writable('');
	const name = writable('');
	const description = writable('');
	const isAdminPermission = writable(false);
	const modulePermissions = writable<IModulePermission[]>([]);
	const modules = writable<IModule[]>([]);
	const permissionActions = [
		{ value: 'GET', name: 'Leitura' },
		{ value: 'POST', name: 'Criação' },
		{ value: 'PATCH', name: 'Atualização' },
		{ value: 'DELETE', name: 'Exclusão' }
	];

	onMount(async () => {
		id.set($page.params.slug);
		if ($id !== 'new') {
			const permission = await fetchPermission($id);
			name.set(permission.name);
			description.set(permission.description);
			isAdminPermission.set(permission.isAdminPermission);
			modulePermissions.set(permission.modulePermissions);
		}

		const data = await fetchModules();
		modules.set(data);
	});

	const addEmptyModulePermission = () => {
		modulePermissions.update((modulePermissions) => [
			...modulePermissions,
			{
				moduleId: '',
				permissionActions: []
			}
		]);
	};

	const removeModulePermission = (index: number) => {
		modulePermissions.update((modulePermissions) => {
			modulePermissions.splice(index, 1);
			return modulePermissions;
		});
	};
</script>

<NavBar />

<div class="p-8">
	<div class="my-6">
		<nav class="breadcrumb">
			<a href="/home">Home</a>
			<span>/</span>
			<a href="/permeson/permissions">Permissões</a>
			<span>/</span>
			<span class="active">{$id === 'new' ? 'Novo' : 'Editar'}</span>
		</nav>
	</div>

	<Heading tag="h2" customSize="text-4xl font-extrabold" class="my-5">Permissão</Heading>

	<div class="mb-6">
		<Label for="name" class="mb-2 block">Nome</Label>
		<Input id="name" placeholder="Nome" required bind:value={$name} />
	</div>

	<div class="mb-6">
		<Label for="description" class="mb-2 block">Descrição</Label>
		<Input id="description" placeholder="Descrição" required bind:value={$description} />
	</div>

	<div class="mb-6">
		<Toggle checked={$isAdminPermission}>Permissão administrativa</Toggle>
	</div>

	<Heading tag="h4" class="mb-6">
		Lista de permissões
		<Button color="light" class="ml-5" on:click={addEmptyModulePermission}>Adicionar</Button>
	</Heading>
	{#each $modulePermissions as modulePermission, index}
		<Card size="none" class="mb-6">
			<div class="mb-6">
				<Label for="moduleId" class="mb-2 block">Módulo</Label>
				<Select
					id="moduleId"
					placeholder="Selecione um módulo"
					bind:value={modulePermission.moduleId}
				>
					{#each $modules as module}
						<option value={module._id}>{module.name}</option>
					{/each}
				</Select>
			</div>

			<div class="mb-6">
				<Label for="permissionAction" class="mb-2 block">Permissões</Label>
				<MultiSelect
					id="permissionAction"
					placeholder="Selecione uma ou mais permissões"
					items={permissionActions}
					bind:value={modulePermission.permissionActions}
				/>
			</div>

			<Button color="light" on:click={() => removeModulePermission(index)}>Remover</Button>
		</Card>
	{/each}

	<Button
		color="light"
		class="mt-5"
		block
		on:click={async () => {
			try {
				if ($id === 'new') {
					await createPermission({
						name: $name,
						description: $description,
						isAdminPermission: $isAdminPermission,
						modulePermissions: $modulePermissions
					});
				} else {
					await updatePermission({
						_id: $id,
						name: $name,
						description: $description,
						isAdminPermission: $isAdminPermission,
						modulePermissions: $modulePermissions
					});
				}
				goto('/permeson/permissions');
			} catch (error) {
				console.error(error);
			}
		}}
	>
		{$id === 'new' ? 'Adicionar' : 'Editar'}
	</Button>
</div>
