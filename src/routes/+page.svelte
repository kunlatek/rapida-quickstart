<script>
  import { onMount } from "svelte";
  import { Button, Heading } from "flowbite-svelte";
  import { authStore } from "$stores/auth";
  import { profileService } from "$services/profile";
  import { goto } from "$app/navigation";
  import { toastStore } from "$stores/toast";

  // Verificar apenas se estamos em uma URL específica
  onMount(async () => {
    const currentPath = window.location.pathname;

    // Verificar apenas se estamos na página inicial
    if (currentPath === "/" && $authStore.isAuthenticated) {
      try {
        const userId = $authStore.user.userId;
        const profiles = await profileService.checkUserProfiles(userId);

        if (!profiles.hasPerson && !profiles.hasCompany) {
          console.log(
            "Redirecionando para seleção de perfil da página inicial"
          );
          goto("/profile/select");
        }
      } catch (error) {
        console.error("Erro ao verificar perfis:", error);
      }
    }
  });
</script>

<svelte:head>
  <title>Rapida Quickstart - Plataforma de Gerenciamento de Perfis</title>
</svelte:head>

<div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
  <Heading
    tag="h1"
    class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
  >
    Gerenciamento de Perfis com Autenticação Segura
  </Heading>

  <p
    class="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400"
  >
    Uma plataforma completa para gerenciar perfis de pessoas e empresas, com
    autenticação multi-provider e controle de funções.
  </p>

  <div
    class="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4"
  >
    {#if !$authStore.isAuthenticated}
      <Button href="/auth/login" size="xl" color="blue"
        >Entrar na plataforma</Button
      >
      <Button href="/auth/register" size="xl" color="alternative"
        >Criar uma conta</Button
      >
    {:else}
      <Button href="/dashboard" size="xl" color="blue"
        >Ir para o Dashboard</Button
      >
    {/if}
  </div>
</div>

<div
  class="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12"
>
  <div class="mr-auto place-self-center lg:col-span-7">
    <Heading
      tag="h2"
      class="max-w-2xl mb-4 text-3xl font-extrabold tracking-tight leading-none md:text-4xl xl:text-5xl dark:text-white"
    >
      Principais recursos da plataforma
    </Heading>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
      <div
        class="p-5 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700"
      >
        <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">
          Autenticação Multi-provider
        </h3>
        <p class="text-gray-500 dark:text-gray-400">
          Login seguro com Google, Apple e email/senha. Proteção com JWT.
        </p>
      </div>

      <div
        class="p-5 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700"
      >
        <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">
          Perfis Flexíveis
        </h3>
        <p class="text-gray-500 dark:text-gray-400">
          Crie e gerencie perfis de pessoas e empresas com informações
          detalhadas.
        </p>
      </div>

      <div
        class="p-5 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700"
      >
        <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">
          Controle de Acesso
        </h3>
        <p class="text-gray-500 dark:text-gray-400">
          Sistema de papéis (roles) para controle de permissões granular.
        </p>
      </div>

      <div
        class="p-5 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700"
      >
        <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">
          Interface Moderna
        </h3>
        <p class="text-gray-500 dark:text-gray-400">
          UI responsiva e acessível com tema claro/escuro.
        </p>
      </div>
    </div>
  </div>

  <div class="hidden lg:mt-0 lg:col-span-5 lg:flex">
    <img src="/images/logo.svg" alt="Dashboard mockup" />
  </div>
</div>
