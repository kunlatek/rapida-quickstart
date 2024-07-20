<script lang="ts">
  import '../app.css';
  import {
    Dropdown,
    DropdownItem,
    Navbar,
    NavBrand,
    NavHamburger,
    NavLi,
    NavUl,
    Toggle
  } from 'flowbite-svelte';
  import { ChevronDownOutline } from 'flowbite-svelte-icons';
  import { logout } from '$lib/services/autentikigo/authService';
  import { writable } from 'svelte/store';
  import { onMount } from 'svelte';

  // Inicializar a i18n
  import '$lib/i18n';
  import { afterNavigate, goto } from '$app/navigation';

  const isLoggedIn = writable(false);
  const signup = async () => await logout();

  let theme = 'light';

  onMount(() => {
    if (typeof window !== 'undefined') {
      const authToken = localStorage.getItem('authToken');
      isLoggedIn.set(!!authToken);

      if (authToken) goto('/home');

      setInitialTheme();
    }
  });

  afterNavigate(() => {
    if (typeof window !== 'undefined') {
      const authToken = localStorage.getItem('authToken');
      isLoggedIn.set(!!authToken);
    }
  });

  const toggleTheme = () => {
    if (typeof window === 'undefined') return;

    const classList = document.documentElement.classList;
    theme = theme === 'dark' ? 'light' : 'dark';

    if (theme === 'light') {
      classList.remove('dark');
    } else {
      classList.add('dark');
    }

    localStorage.setItem('theme', theme);
  };

  const capitalizeFirstLetter = (term: string) => {
    return term.charAt(0).toUpperCase() + term.slice(1);
  };

  const setInitialTheme = () => {
    if (typeof window === 'undefined') return;

    const storedTheme = localStorage.getItem('theme');
    theme = storedTheme || 'light';
    const classList = document.documentElement.classList;
    if (!storedTheme) {
      classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else if (storedTheme === 'dark') {
      classList.add('dark');
    } else {
      classList.remove('dark');
    }
  };
</script>

<div
  class="flex min-h-screen flex-col overflow-hidden bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text"
>
  <Navbar color="primary">
    <NavBrand href="/">
      <img
        src="/images/logo-{theme === 'dark' ? 'light' : 'dark'}.png"
        class="me-3 h-6 sm:h-9"
        alt="Flowbite Logo"
      />
    </NavBrand>

    {#if $isLoggedIn}
    <NavHamburger />
      <NavUl>
        <NavLi href="/home">Início</NavLi>
        <NavLi href="/profile">Perfil</NavLi>
        <NavLi class="cursor-pointer">
          Módulos<ChevronDownOutline class="text-primary-800 ms-2 inline h-6 w-6 dark:text-white" />
        </NavLi>
        <Dropdown class="z-20 w-44">
          <!-- <DropdownItem href="/module-path">Module Name</DropdownItem> -->
        </Dropdown>
        <NavLi class="cursor-pointer">
          Permeson<ChevronDownOutline
            class="text-primary-800 ms-2 inline h-6 w-6 dark:text-white"
          />
        </NavLi>
        <Dropdown class="z-20 w-44">
          <DropdownItem href="/permeson/modules">Módulos</DropdownItem>
          <DropdownItem href="/permeson/permissions">Permissões</DropdownItem>
          <DropdownItem href="/permeson/invitations">Convites</DropdownItem>
        </Dropdown>
        <NavLi href="/" on:click={signup}>Sair</NavLi>
      </NavUl>
    {/if}

    <div class="flex md:order-2">
      <Toggle
        on:click={toggleTheme}
        checked={theme === 'dark'}
        class="bg-primary-500 z-10 w-full p-4 text-white"
      >
        {capitalizeFirstLetter(theme)} mode
      </Toggle>
    </div>
  </Navbar>
  <main class="relative flex-1 overflow-auto">
    <slot></slot>
  </main>
</div>
