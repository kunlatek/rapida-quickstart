<script lang="ts">
	import {
		Dropdown,
		// DropdownItem,
		Navbar,
		NavBrand,
		NavHamburger,
		NavLi,
		NavUl
	} from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import { logout } from '$lib/services/authService';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	const signup = async () => await logout();

	onMount(() => {
		if (!localStorage.getItem('userIdLogged')) goto('/');
	});
</script>

<Navbar let:NavContainer color="primary">
	<NavContainer class="rounded-lg border bg-white px-5 py-2 dark:bg-gray-600">
		<NavBrand href="/">
			<img src="/images/logo.png" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" />
		</NavBrand>

		<NavHamburger />

		<NavUl>
			<NavLi href="/home">Início</NavLi>
			<NavLi class="cursor-pointer">
				Módulos<ChevronDownOutline class="text-primary-800 ms-2 inline h-6 w-6 dark:text-white" />
			</NavLi>
			<Dropdown class="z-20 w-44">
				<!-- <DropdownItem href="/module-path">Module Name</DropdownItem> -->
			</Dropdown>
			<NavLi href="/permeson/profile">Perfil</NavLi>
			<NavLi href="/permeson/invitations">Convites</NavLi>
			<NavLi href="/permeson/permissions">Permissões</NavLi>
			<NavLi href="/" on:click={signup}>Sair</NavLi>
		</NavUl>
	</NavContainer>
</Navbar>
