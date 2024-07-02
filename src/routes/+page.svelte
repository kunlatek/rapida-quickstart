<script lang="ts">
  import { Input, Label, Button } from 'flowbite-svelte';
  import { login } from '$lib/services/authService';
  import { writable } from 'svelte/store';

  const email = writable('');
  const password = writable('');
  const errorMessage = writable('');

  async function handleSubmit(event: Event) {
    event.preventDefault();

    try {
      const response = await login($email, $password);
      console.log('Login successful:', response);
      // Redirecionar ou atualizar a interface conforme necessário
    } catch (error) {
      errorMessage.set('Login failed. Please check your credentials.');
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
      <Label for="email" class="mb-2">E-mail</Label>
      <Input type="email" id="email" bind:value={$email} placeholder="john.doe@company.com" required />
    </div>
    <div class="mb-6">
      <Label for="password" class="mb-2">Senha</Label>
      <Input type="password" id="password" bind:value={$password} placeholder="•••••••••" required />
    </div>
    {#if $errorMessage}
      <p class="text-red-500">{$errorMessage}</p>
    {/if}
    <Button type="submit" outline>Entrar</Button>
  </form>
</div>
