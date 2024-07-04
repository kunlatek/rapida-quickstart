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
</script>

<Navbar let:NavContainer color="primary">
	<NavContainer class="rounded-lg border bg-white px-5 py-2 dark:bg-gray-600">
		<NavBrand href="/">
			<img src="/images/logo.png" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" />
		</NavBrand>

		<NavHamburger />

		<NavUl>
			<NavLi href="/">Início</NavLi>
			<NavLi class="cursor-pointer">
				Módulos<ChevronDownOutline class="text-primary-800 ms-2 inline h-6 w-6 dark:text-white" />
			</NavLi>
			<Dropdown class="z-20 w-44">
				<!-- <DropdownItem href="/module-path">Module Name</DropdownItem> -->
			</Dropdown>
			<NavLi href="/rapida/profile">Perfil</NavLi>
			<NavLi href="/rapida/invitations">Convites</NavLi>
			<NavLi href="/rapida/permissions">Permissões</NavLi>
			<NavLi href="/">Sair</NavLi>
		</NavUl>
	</NavContainer>
</Navbar>
