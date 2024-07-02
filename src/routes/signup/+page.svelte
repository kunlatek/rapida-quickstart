<script lang="ts">
  import { Input, Label, Button } from 'flowbite-svelte';
  import { signup } from '$lib/services/authService';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { goto } from '$app/navigation';
	import type { IRequestErrorResponse } from '../../types/rest';

  const email = writable('');
  const password = writable('');
  const confirmPassword = writable('');
  const errorMessage = writable('');

  onMount(() => {
    const url = new URL(window.location.href);
    $email = url.searchParams.get('email') || '';
    if ($email === '') {
      goto('/');
    }
  });

  async function handleSubmit(event: Event) {
    event.preventDefault();

    if ($password !== $confirmPassword) {
      errorMessage.set('Senhas não coincidem. Por favor, tente novamente.');
      return;
    }

    try {
      const response = await signup($email, $password);
      console.log('Signup successful:', response);
      // Redirecionar para a página de login ou outra página após o registro
      goto('/login');
    } catch (error: IRequestErrorResponse | any) {
      errorMessage.set(error.message);
    }
  }
</script>

<div class="absolute inset-0 flex justify-center items-center bg-default">
  <form on:submit={handleSubmit} class="max-w-md w-full bg-white rounded-lg shadow-md p-8 dark:bg-gray-800 dark:text-white">
    <!-- Logo Section -->
    <div class="flex justify-center mb-8">
      <img src="/images/logo.png" alt="Logo Kunlatek" class="h-12 w-auto">
    </div>
    <!-- Form Section -->
    <div class="mb-6">
      <Label for="email" class="mb-2">E-mail pelo qual foi convidado</Label>
      <Input type="email" id="email" bind:value={$email} placeholder="john.doe@company.com" required disabled />
    </div>
    <div class="mb-6">
      <Label for="password" class="mb-2">Senha</Label>
      <Input type="password" id="password" bind:value={$password} placeholder="•••••••••" required />
    </div>
    <div class="mb-6">
      <Label for="confirmPassword" class="mb-2">Confirmar Senha</Label>
      <Input type="password" id="confirmPassword" bind:value={$confirmPassword} placeholder="•••••••••" required />
    </div>
    {#if $errorMessage}
      <p class="text-red-500">{$errorMessage}</p>
    {/if}
    <Button type="submit" outline>Salvar</Button>
  </form>
</div>

<style>
  .bg-default {
    background-color: var(--bg-color);
  }

  @media (max-width: 640px) {
    .max-w-md {
      width: 100%;
      padding: 16px;
    }

    .h-12 {
      height: 8rem;
    }
  }
</style>
