<script lang="ts">
  import {
    Navbar,
    NavBrand,
    Dropdown,
    DropdownItem,
    Button,
    Drawer,
    CloseButton,
    Sidebar,
    SidebarGroup,
    SidebarItem,
  } from "flowbite-svelte";
  import { navigationMenu } from "$lib/config/navigation";
  import { UserCircleSolid } from "flowbite-svelte-icons";
  import { profileStore } from "$stores/profile";
  import { authStore } from "$stores/auth";
  import { authService } from "$services/auth";
  import { toastStore } from "$lib/stores/toast";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import { sineIn } from "svelte/easing";
  import { accountDeletionStore } from "$stores/account-deletion";
  import KuModal from "./KuModal.svelte";

  export let showMenu = true;

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

  let showLogoutModal = false;

  function confirmLogout() {
    showLogoutModal = true;
  }

  function handleLogout() {
    if (browser) {
      authService.logout();
      showLogoutModal = false;
      toastStore.success("Você saiu da plataforma com sucesso!");
      goto("/auth/login");
    }
  }

  function cancelLogout() {
    showLogoutModal = false;
  }

  async function switchRole(role: string) {
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

  $: profileUrl = $profileStore.person?._id
    ? `/profile/person/${$profileStore.person._id}`
    : $profileStore.company?._id
      ? `/profile/company/${$profileStore.company._id}`
      : "/profile/select";
</script>

// MODIFICATION BASED ON:
/Users/opah/Code/personal/kunlatek/rapida/rapida-quickstart/src/lib/components/common/KuNavbar.svelte
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
      {#if showMenu && !$accountDeletionStore.isDeleted}
        <div class="flex items-center space-x-3">
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
          <Dropdown class="w-44">
            <div slot="trigger" class="cursor-pointer">
              <UserCircleSolid
                size="lg"
                class="text-gray-600 dark:text-gray-300"
              />
            </div>

            <div class="py-1">
              <DropdownItem class="flex items-center space-x-2">
                <span class="text-sm text-gray-700"
                  >{$authStore.user?.email || ""}</span
                >
              </DropdownItem>
              <DropdownItem href={profileUrl}>Perfil</DropdownItem>
              <DropdownItem href="/settings">Configurações</DropdownItem>
              <hr class="my-1" />

              {#if $authStore.user?.availableRoles && $authStore.user.availableRoles.length > 1}
                <div class="px-4 py-2">
                  <span class="text-sm text-gray-500"
                    >Papel Ativo: {$authStore.user.activeRole || "Nenhum"}</span
                  >
                </div>
                {#each $authStore.user.availableRoles as role}
                  {#if role !== $authStore.user.activeRole}
                    <DropdownItem on:click={() => switchRole(role)}>
                      Usar papel: {role === "person" ? "Pessoa" : "Empresa"}
                    </DropdownItem>
                  {/if}
                {/each}
                <hr class="my-1" />
              {/if}

              <DropdownItem
                on:click={confirmLogout}
                data-testid="logout-button"
                class="text-red-600 dark:text-red-500"
              >
                <div class="flex items-center">
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
        <Button
          color="light"
          size="sm"
          on:click={confirmLogout}
          data-testid="logout-button"
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
          Sair
        </Button>
      {/if}
    {:else}
      <Button href="/">Início</Button>
      <Button href="/auth/register">Criar conta</Button>
      <Button href="/auth/login">Login</Button>
    {/if}
  </div>
</Navbar>

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

            {#if navigationMenu && navigationMenu.length > 0}
              {#each navigationMenu as module}
                {#if module.subItems && module.subItems.length > 0}
                  <div
                    class="px-3 pt-4 pb-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {module.title}
                  </div>
                  {#each module.subItems as item}
                    <SidebarItem
                      href={item.route}
                      label={item.title}
                      on:click={closeDrawer}
                      class="pl-5"
                    />
                  {/each}
                {/if}
              {/each}
            {/if}

            <hr class="my-2 border-gray-200 dark:border-gray-700" />

            <div
              class="px-3 pt-4 pb-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Conta
            </div>

            {#if !$accountDeletionStore.isDeleted && $authStore.user?.availableRoles && $authStore.user.availableRoles.length > 0}
              <SidebarItem
                href={profileUrl}
                on:click={closeDrawer}
                label="Meu Perfil"
                class="break-words pl-5"
              ></SidebarItem>
            {/if}

            {#if !$accountDeletionStore.isDeleted && $authStore.user?.availableRoles && $authStore.user.availableRoles.length > 1}
              <div class="px-4 py-2">
                <span
                  class="text-sm font-medium text-gray-600 dark:text-gray-400"
                  >Trocar Papel</span
                >
              </div>
              {#each $authStore.user.availableRoles as role}
                {#if role !== $authStore.user.activeRole}
                  <SidebarItem
                    on:click={() => switchRole(role)}
                    label={role === "company" ? "Empresa" : "Pessoa"}
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
                {/if}
              {/each}
              <hr class="my-2 border-gray-200 dark:border-gray-700" />
            {/if}

            {#if !$accountDeletionStore.isDeleted}
              <SidebarItem
                href="/settings"
                on:click={closeDrawer}
                label="Configurações"
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
                      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </svelte:fragment>
              </SidebarItem>
            {/if}

            <SidebarItem
              class="text-red-600 dark:text-red-500 break-words"
              on:click={() => {
                confirmLogout();
                closeDrawer();
              }}
              label="Sair"
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

<KuModal
  bind:open={showLogoutModal}
  title="Confirmação de Logout"
  testId="logout-modal"
  on:confirm={handleLogout}
  on:cancel={cancelLogout}
>
  <p slot="message">Tem certeza que deseja sair da plataforma?</p>
  <span slot="cancel-text">Cancelar</span>
  <span slot="confirm-text">Confirmar</span>
</KuModal>
