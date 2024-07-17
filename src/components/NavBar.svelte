<script lang="ts">
	import {
		Dropdown,
		DropdownItem,
		Navbar,
		NavBrand,
		NavHamburger,
		NavLi,
		NavUl
	} from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import { logout } from '$lib/services/autentikigo/authService';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	const signup = async () => await logout();

	onMount(() => {
		if (!localStorage.getItem('authToken')) goto('/');

		if (typeof window === 'undefined') return;
		const storedTheme = localStorage.getItem('theme');
		const classList = document.documentElement.classList;
		if (classList.contains('dark') && storedTheme === 'light') classList.remove('dark');
		else if (!classList.contains('dark')) classList.add('dark');
	});
</script>

<Navbar color="primary">
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
		<NavLi class="cursor-pointer">
			Permeson<ChevronDownOutline class="text-primary-800 ms-2 inline h-6 w-6 dark:text-white" />
		</NavLi>
		<Dropdown class="z-20 w-44">
			<DropdownItem href="/permeson/modules">Módulos</DropdownItem>
			<DropdownItem href="/permeson/permissions">Permissões</DropdownItem>
			<DropdownItem href="/permeson/invitations">Convites</DropdownItem>
		</Dropdown>
		<NavLi href="/" on:click={signup}>Sair</NavLi>
	</NavUl>
</Navbar>
