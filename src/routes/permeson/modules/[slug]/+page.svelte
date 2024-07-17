<script lang="ts">
	import { Label, Input, Heading, Select, Button } from 'flowbite-svelte';
	import { EnvelopeSolid } from 'flowbite-svelte-icons';
	import NavBar from '../../../../components/NavBar.svelte';
	import { writable } from 'svelte/store';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import { fetchPermissions, type IPermission } from '$lib/services/permeson/permissionService';
	import { createModule, fetchModule, updateModule } from '$lib/services/permeson/moduleService';
	import { goto } from '$app/navigation';

	const id = writable('');
	const name = writable('');
	const description = writable<string | undefined>();
	const route = writable('');
	const icon = writable('');

	onMount(async () => {
		id.set($page.params.slug);
		if ($id !== 'new') {
			const module = await fetchModule($id);
			name.set(module.name);
			description.set(module.description);
			route.set(module.route);
			icon.set(module.icon);
		}
	});
</script>

<NavBar />

<div class="p-8">
	<div class="my-6">
		<nav class="breadcrumb">
			<a href="/home">Home</a>
			<span>/</span>
			<a href="/permeson/modules">Módulos</a>
			<span>/</span>
			<span class="active">{$id === 'new' ? 'Novo' : 'Editar'}</span>
		</nav>
	</div>

	<Heading tag="h2" customSize="text-4xl font-extrabold" class="my-5">Convite</Heading>

	<div class="mb-6">
		<Label for="name" class="mb-2 block">Nome</Label>
		<Input id="name" placeholder="Nome" required bind:value={$name} />
	</div>

	<div class="mb-6">
		<Label for="description" class="mb-2 block">Descrição</Label>
		<Input id="description" placeholder="Descrição" required bind:value={$description} />
	</div>

	<div class="mb-6">
		<Label for="route" class="mb-2 block">Rota</Label>
		<Input id="route" placeholder="Rota" required bind:value={$route} />
	</div>

	<div class="mb-6">
		<Label for="icon" class="mb-2 block">Ícone</Label>
		<Input id="icon" placeholder="Ícone" required bind:value={$icon} />
	</div>

	<Button
		color="light"
		class="mt-5"
		block
		on:click={async () => {
			try {
				if ($id === 'new') {
					await createModule({
						name: $name,
						description: $description,
						route: $route,
						icon: $icon
					});
				} else {
					await updateModule({
						_id: $id,
						name: $name,
						description: $description,
						route: $route,
						icon: $icon
					});
				}
				goto('/permeson/modules');
			} catch (error) {
				console.error(error);
			}
		}}
	>
		{$id === 'new' ? 'Adicionar' : 'Editar'}
	</Button>
</div>
