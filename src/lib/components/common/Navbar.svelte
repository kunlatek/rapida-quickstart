<script>
  import {
    Navbar,
    NavBrand,
    NavLi,
    NavUl,
    NavHamburger,
    Dropdown,
    DropdownItem,
    Button,
    Modal,
    Drawer,
    CloseButton,
    Sidebar,
    SidebarGroup,
    SidebarItem,
  } from "flowbite-svelte";
  // Remover importações problemáticas
  import { UserCircleSolid } from "flowbite-svelte-icons";
  import { authStore } from "$stores/auth";
  import { authService } from "$services/auth";
  import { toastStore } from "$stores/toast";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import { sineIn } from "svelte/easing";

  let drawerHidden = true;
  let showLogoutConfirm = false;

  let transitionParams = {
    x: -320,
    duration: 200,
    easing: sineIn,
  };

  function openDrawer() {
    drawerHidden = false;
  }

  function closeDrawer() {
    drawerHidden = true;
  }

  function confirmLogout() {
    showLogoutConfirm = true;
  }

  function handleLogout() {
    if (browser) {
      authService.logout();
      showLogoutConfirm = false;
      toastStore.success("Você saiu da plataforma com sucesso!");
      goto("/auth/login");
    }
  }

  function cancelLogout() {
    showLogoutConfirm = false;
  }

  async function switchRole(role) {
    if (browser) {
      try {
        await authService.switchRole(role);
        closeDrawer();
        goto("/dashboard");
      } catch (error) {
        console.error("Erro ao trocar o papel:", error);
      }
    }
  }
</script>

<Navbar
  let:hidden
  let:toggle
  fluid={true}
  rounded={true}
  class="py-3 px-4 mx-auto"
>
  <NavBrand href="/">
    <img src="/images/logo.svg" class="mr-3 h-6 sm:h-9" alt="Logo" />
    <span
      class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
    >
      Rapida Quickstart
    </span>
  </NavBrand>

  <div class="flex items-center md:order-2">
    {#if $authStore.isAuthenticated}
      <div class="flex items-center space-x-3">
        <!-- Botão do menu - usando SVG inline em vez de ícone importado -->
        <Button color="light" size="sm" on:click={openDrawer} class="mr-2">
          <svg
            class="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span class="hidden md:inline">Menu</span>
        </Button>

        <!-- Botão de logout - usando SVG inline em vez de ícone importado -->
        <Button
          color="light"
          size="sm"
          on:click={confirmLogout}
          class="hidden md:flex"
        >
          <svg
            class="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.293 3.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L12.586 10l-2.293-2.293a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
            <path
              fill-rule="evenodd"
              d="M7 8a1 1 0 011-1h7a1 1 0 110 2H8a1 1 0 01-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span>Sair</span>
        </Button>

        <Dropdown inline={true} class="w-44">
          <!-- Ícone de usuário para dropdown - mantendo UserCircleSolid pois parece funcionar -->
          <div slot="trigger" class="cursor-pointer">
            <UserCircleSolid
              size="lg"
              class="text-gray-600 dark:text-gray-300"
            />
          </div>

          <div slot="content" class="py-1">
            <DropdownItem class="flex items-center space-x-2">
              <span class="text-sm text-gray-700"
                >{$authStore.user?.email || ""}</span
              >
            </DropdownItem>
            <DropdownItem>Perfil</DropdownItem>
            <DropdownItem>Configurações</DropdownItem>
            <hr class="my-1" />

            {#if $authStore.user?.availableRoles && $authStore.user.availableRoles.length > 0}
              <div class="px-4 py-2">
                <span class="text-sm text-gray-500"
                  >Papel Ativo: {$authStore.user.activeRole || "Nenhum"}</span
                >
              </div>
              {#each $authStore.user.availableRoles as role}
                <DropdownItem on:click={() => switchRole(role)}>
                  Usar papel: {role}
                </DropdownItem>
              {/each}
              <hr class="my-1" />
            {/if}

            <DropdownItem
              on:click={confirmLogout}
              class="md:hidden text-red-600 dark:text-red-500"
            >
              <div class="flex items-center">
                <!-- Ícone de logout - usando SVG inline em vez de ícone importado -->
                <svg
                  class="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.293 3.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L12.586 10l-2.293-2.293a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                  <path
                    fill-rule="evenodd"
                    d="M7 8a1 1 0 011-1h7a1 1 0 110 2H8a1 1 0 01-1-1z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                Sair
              </div>
            </DropdownItem>
          </div>
        </Dropdown>
      </div>
    {:else}
      <Button href="/auth/login">Login</Button>
    {/if}
  </div>

  <NavUl {hidden} class="order-1">
    <NavLi href="/">Início</NavLi>
    {#if $authStore.isAuthenticated}
      <NavLi href="/dashboard">Dashboard</NavLi>
      {#if $authStore.user?.activeRole === "person"}
        <NavLi href="/profile/person">Perfil Pessoa</NavLi>
      {/if}
      {#if $authStore.user?.activeRole === "company"}
        <NavLi href="/profile/company">Perfil Empresa</NavLi>
      {/if}
    {/if}
  </NavUl>
</Navbar>

<!-- Drawer implementado corretamente -->
{#if browser}
  <Drawer
    placement="left"
    transitionType="fly"
    {transitionParams}
    bind:hidden={drawerHidden}
    id="sidebar-drawer"
    backdrop={true}
    width="w-72"
    class="overflow-x-hidden"
  >
    <div
      class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700"
    >
      <div class="flex items-center">
        <img src="/images/logo.svg" class="h-8 mr-3" alt="Logo" />
        <h5
          id="drawer-label"
          class="text-lg font-semibold text-gray-800 dark:text-white"
        >
          Menu
        </h5>
      </div>
      <CloseButton on:click={closeDrawer} class="dark:text-white" />
    </div>

    <div class="py-4 overflow-y-auto overflow-x-hidden">
      <Sidebar>
        <SidebarGroup class="space-y-1">
          <SidebarItem
            href="/"
            on:click={closeDrawer}
            label="Início"
            class="break-words"
          >
            <svelte:fragment slot="icon">
              <svg
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
                ></path>
              </svg>
            </svelte:fragment>
          </SidebarItem>

          {#if $authStore.isAuthenticated}
            <SidebarItem
              href="/dashboard"
              on:click={closeDrawer}
              label="Dashboard"
              class="break-words"
            >
              <svelte:fragment slot="icon">
                <svg
                  class="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                </svg>
              </svelte:fragment>
            </SidebarItem>

            {#if $authStore.user?.activeRole === "person"}
              <SidebarItem
                href="/profile/person"
                on:click={closeDrawer}
                label="Perfil Pessoa"
                class="break-words"
              >
                <svelte:fragment slot="icon">
                  <svg
                    class="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </svelte:fragment>
              </SidebarItem>
            {/if}

            {#if $authStore.user?.activeRole === "company"}
              <SidebarItem
                href="/profile/company"
                on:click={closeDrawer}
                label="Perfil Empresa"
                class="break-words"
              >
                <svelte:fragment slot="icon">
                  <svg
                    class="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </svelte:fragment>
              </SidebarItem>
            {/if}

            {#if $authStore.user?.availableRoles && $authStore.user.availableRoles.length > 0}
              <hr class="my-2" />
              <div class="px-4 py-2">
                <span
                  class="text-sm font-medium text-gray-600 dark:text-gray-400"
                  >Trocar Papel</span
                >
              </div>
              {#each $authStore.user.availableRoles as role}
                <SidebarItem
                  on:click={() => switchRole(role)}
                  label={role}
                  class="break-words"
                >
                  <svelte:fragment slot="icon">
                    <svg
                      class="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </svelte:fragment>
                </SidebarItem>
              {/each}
            {/if}

            <hr class="my-2" />

            <SidebarItem
              class="text-red-600 dark:text-red-500 break-words"
              on:click={() => {
                confirmLogout();
                closeDrawer();
              }}
              label="Sair"
            >
              <svelte:fragment slot="icon">
                <!-- Ícone de logout - usando SVG inline em vez de ícone importado -->
                <svg
                  class="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.293 3.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L12.586 10l-2.293-2.293a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                  <path
                    fill-rule="evenodd"
                    d="M7 8a1 1 0 011-1h7a1 1 0 110 2H8a1 1 0 01-1-1z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </svelte:fragment>
            </SidebarItem>
          {/if}
        </SidebarGroup>
      </Sidebar>
    </div>
  </Drawer>
{/if}

<!-- Modal de confirmação de logout -->
<Modal title="Confirmação de Logout" bind:open={showLogoutConfirm} autoclose>
  <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
    Tem certeza que deseja sair da plataforma?
  </p>
  <svelte:fragment slot="footer">
    <Button color="alternative" on:click={cancelLogout}>Cancelar</Button>
    <Button color="red" on:click={handleLogout}>Confirmar</Button>
  </svelte:fragment>
</Modal>
