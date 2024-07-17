<script lang="ts">
	import { Input, Label, Button } from 'flowbite-svelte';
	import { signup } from '$lib/services/autentikigo/authService';
	import { writable } from 'svelte/store';
	import { goto } from '$app/navigation';
	import type { IRequestErrorResponse } from '../../types/rest';
	import { handleApiError } from '../../utils/errorHandler';

	const email = writable('');
	const password = writable('');
	const confirmPassword = writable('');
	const errorMessage = writable('');

	async function handleSubmit(event: Event) {
		event.preventDefault();

		if ($password !== $confirmPassword) {
			errorMessage.set('Senhas não coincidem. Por favor, tente novamente.');
			return;
		}

		try {
			await signup($email, $password);
			goto('/');
		} catch (error: IRequestErrorResponse | any) {
			errorMessage.set(handleApiError(error));
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
			<Label for="email" class="mb-2">E-mail pelo qual foi convidado</Label>
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
		<div class="mb-6">
			<Label for="confirmPassword" class="mb-2">Confirmar Senha</Label>
			<Input
				type="password"
				id="confirmPassword"
				bind:value={$confirmPassword}
				placeholder="•••••••••"
				required
			/>
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
