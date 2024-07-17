<script lang="ts">
	import { Input, Label, Button, Spinner, Alert } from 'flowbite-svelte';
	import { login } from '$lib/services/authService';
	import { writable } from 'svelte/store';
	import { handleApiError } from '../utils/errorHandler';
	import { onMount } from 'svelte';

	// Inicializar a i18n
	import '$lib/i18n';
	import { goto } from '$app/navigation';

	const email = writable('');
	const password = writable('');
	const errorMessage = writable('');
	const isLoading = writable(false);

	onMount(() => {
		if (localStorage.getItem('userIdLogged')) {
			goto('/home');
		}
	});

	async function handleSubmit(event: Event) {
		event.preventDefault();
		isLoading.set(true);

		try {
			await login($email, $password);
			goto('/home');
		} catch (error) {
			errorMessage.set(handleApiError(error));
		} finally {
			isLoading.set(false);
		}
	}
</script>

<div class="bg-default absolute inset-0 flex items-center justify-center">
	<form
		on:submit={handleSubmit}
		class="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-gray-800 dark:text-white"
	>
		<!-- Logo Section -->
		<div class="mb-8 flex justify-center">
			<img src="/images/logo.png" alt="Logo Kunlatek" class="h-12 w-auto" />
		</div>
		<!-- Form Section -->
		<div class="mb-6">
			<Label for="email" class="mb-2">E-mail</Label>
			<Input
				type="email"
				id="email"
				bind:value={$email}
				placeholder="john.doe@company.com"
				required
			/>
		</div>
		<div class="mb-6">
			<Label for="password" class="mb-2">Senha</Label>
			<Input
				type="password"
				id="password"
				bind:value={$password}
				placeholder="•••••••••"
				required
			/>
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
