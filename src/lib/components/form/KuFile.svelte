<script lang="ts">
	import { Fileupload, Label, Helper, Button } from 'flowbite-svelte';
	import { getComponentClasses } from '$lib/styles/theme';
	import type { IFormCondition } from '../../interfaces/form.interfaces';
	import { createEventDispatcher, onMount } from 'svelte';

	interface FileVariant {
		base: string;
		error?: string;
	}

	interface FileVariants {
		default: FileVariant;
		[key: string]: FileVariant | undefined;
	}

	export let name = '';
	export let label = '';

	export let value: FileList | null = null;
	export let initialUrl: string | null = null;

	export let placeholder = '';
	export let tooltip = '';
	export let isDisabled = false;
	export let isRequired = false;
	export let isMultiple = false;
	export let error = '';
	export let id = name;
	export let variant = 'default';
	export let conditions: IFormCondition[] = [];
	export let validators: ('onlyImages' | 'png' | 'jpg' | 'pdf')[] = [];

	const dispatch = createEventDispatcher();

	let displayUrl: string | null = null;

	onMount(() => {
		displayUrl = initialUrl;
	});

	$: if (value && value.length > 0) {
		displayUrl = null;
	}

	function removeExistingFile() {
		displayUrl = null;
		value = null;
		dispatch('change', null);
	}

	$: themeClasses = getComponentClasses('file', variant, {
		error: !!error,
		disabled: isDisabled
	});
	$: labelClass = `mb-2 ${
		error ? 'text-red-600 dark:text-red-500' : 'text-gray-900 dark:text-white'
	}`;
	$: fileClass = `w-full ${themeClasses}`;

	function validateFiles(files: FileList): void {
		if (!validators || validators.length === 0) return;

		let isValid = true;
		let validationError = '';
		const fileArray = Array.from(files);

		if (validators.includes('onlyImages')) {
			const allImages = fileArray.every((file) => file.type.startsWith('image/'));
			if (!allImages) {
				isValid = false;
				validationError = 'Apenas imagens são permitidas';
			}
		}
		if (validators.includes('png')) {
			const allPNG = fileArray.every((file) => file.type === 'image/png');
			if (!allPNG) {
				isValid = false;
				validationError = 'Apenas arquivos PNG são permitidos';
			}
		}
		if (validators.includes('jpg')) {
			const allJPG = fileArray.every(
				(file) => file.type === 'image/jpeg' || file.type === 'image/jpg'
			);
			if (!allJPG) {
				isValid = false;
				validationError = 'Apenas arquivos JPG são permitidos';
			}
		}
		if (validators.includes('pdf')) {
			const allPDF = fileArray.every((file) => file.type === 'application/pdf');
			if (!allPDF) {
				isValid = false;
				validationError = 'Apenas arquivos PDF são permitidos';
			}
		}

		if (!isValid) {
			value = null;
			error = validationError;
		}
	}

	function evaluateConditions(): boolean {
		if (!conditions || conditions.length === 0) return true;
		return true;
	}

	$: showComponent = evaluateConditions();

	function getAcceptAttributeFromValidators(
		validators: ('onlyImages' | 'png' | 'jpg' | 'pdf')[]
	): string {
		if (!validators || validators.length === 0) return '';
		const acceptTypes: string[] = [];

		if (validators.includes('onlyImages')) acceptTypes.push('image/*');
		if (validators.includes('png')) acceptTypes.push('image/png');
		if (validators.includes('jpg')) acceptTypes.push('image/jpeg', 'image/jpg');
		if (validators.includes('pdf')) acceptTypes.push('application/pdf');

		return [...new Set(acceptTypes)].join(',');
	}
</script>

{#if showComponent}
	<div class="w-full">
		<Label for={id} class={labelClass}>
			{label}
			{#if isRequired && !displayUrl}<span class="text-red-500">*</span>{/if}
			{#if tooltip}
				<span
					class="ml-1 text-gray-400 hover:text-gray-600 cursor-help"
					title={tooltip}
				>
					<svg
						class="w-4 h-4 inline"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
							clip-rule="evenodd"
						></path>
					</svg>
				</span>
			{/if}
		</Label>

		{#if displayUrl && !value}
			<div class="mt-2">
				<div
					class="flex items-center justify-between p-2 mt-1 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
				>
					<a
						href={displayUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="text-sm text-blue-600 dark:text-blue-400 hover:underline truncate mr-4"
					>
						{displayUrl.split('/').pop()}
					</a>
					<Button size="xs" on:click={removeExistingFile} color="alternative">Alterar</Button>
				</div>
			</div>
		{:else}
			<Fileupload
				{id}
				{name}
				bind:value
				{placeholder}
				{isRequired}
				{isMultiple}
				disabled={isDisabled}
				class={fileClass}
				on:change={() => validateFiles(value)}
				accept={getAcceptAttributeFromValidators(validators)}
			/>
		{/if}

		{#if error}
			<Helper class="mt-2" color="red">{error}</Helper>
		{/if}
	</div>
{/if}