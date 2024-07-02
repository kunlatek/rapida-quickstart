<script lang="ts">
  import { Input, Label, Button, Spinner, Alert } from 'flowbite-svelte';
  import { login } from '$lib/services/authService';
  import { writable } from 'svelte/store';
  import { handleApiError } from '../utils/errorHandler';

  // Inicializar a i18n
  import '$lib/i18n';

  const email = writable('');
  const password = writable('');
  const errorMessage = writable('');
  const isLoading = writable(false);

  async function handleSubmit(event: Event) {
    event.preventDefault();
    isLoading.set(true);

    try {
      const response = await login($email, $password);
      console.log('Login successful:', response);
      // Redirecionar ou atualizar a interface conforme necessário
    } catch (error) {
      errorMessage.set(handleApiError(error));
    } finally {
      isLoading.set(false);
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
    <Button type="submit" outline disabled={$isLoading}>
      {#if $isLoading}
        <Spinner class="mr-2" />
      {/if}
      Entrar
    </Button>


    {#if $errorMessage}
      <Alert color="red" class="mb-6">{$errorMessage}</Alert>
    {/if}
  </form>
</div>