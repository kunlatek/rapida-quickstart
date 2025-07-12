<script lang="ts">
	import { Fileupload, Label, Helper, Button } from 'flowbite-svelte';
	import { getComponentClasses } from '$lib/styles/theme';
	import type { IFormCondition } from '../../interfaces/form.interfaces';
	import { createEventDispatcher } from 'svelte';

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
	export let value: FileList | string | null = null;
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
    
    // --- LINHA DE DIAGNÓSTICO ---
    $: console.log(`[KuFile DEBUG: '${name}'] valor recebido:`, value, `| (Tipo: ${typeof value})`);
    // --- FIM DA LINHA DE DIAGNÓSTICO ---

	$: themeClasses = getComponentClasses('file', variant, {
		error: !!error,
		disabled: isDisabled
	});
	$: labelClass = `mb-2 ${error ? 'text-red-600 dark:text-red-500' : 'text-gray-900 dark:text-white'}`;
	$: fileClass = `w-full ${themeClasses}`;

	function validateFiles(files: FileList | null): void {
		if (!validators || validators.length === 0 || !files) return;

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

	function removeExistingFile() {
		value = null;
		dispatch('change', value);
	}

	function getFileName(url: string | FileList | null): string {
		if (typeof url === 'string') {
			try {
				const urlObject = new URL(url);
				return urlObject.pathname.split('/').pop() || 'Arquivo existente';
			} catch (e) {
				return url.split('/').pop() || 'Arquivo existente';
			}
		}
		if (url instanceof FileList && url.length > 0) {
			return Array.from(url)
				.map((f) => f.name)
				.join(', ');
		}
		return 'Nenhum arquivo selecionado';
	}

	$: showComponent = evaluateConditions();

	function getAcceptAttributeFromValidators(
		validators: ('onlyImages' | 'png' | 'jpg' | 'pdf')[]
	): string {
		if (!validators || validators.length === 0) return '*/*';
		const acceptTypes: string[] = [];
		if (validators.includes('onlyImages')) {
			acceptTypes.push('image/*');
		}
		if (validators.includes('png')) {
			acceptTypes.push('image/png');
		}
		if (validators.includes('jpg')) {
			acceptTypes.push('image/jpeg', 'image/jpg');
		}
		if (validators.includes('pdf')) {
			acceptTypes.push('application/pdf');
		}
		return acceptTypes.join(',');
	}
</script>

{#if showComponent}
	<div class="w-full">
		<Label for={id} class={labelClass}>
			{label}
			{#if isRequired}<span class="text-red-500">*</span>{/if}
			{#if tooltip}
				<span
					class="ml-1 text-gray-400 hover:text-gray-600 cursor-help"
					title={tooltip}
					aria-label={tooltip}
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

		{#if value && typeof value === 'string'}
			<div
				class="flex items-center justify-between p-2.5 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
			>
				<a
					href={value}
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center text-blue-600 dark:text-blue-500 hover:underline"
				>
					<svg
						class="w-5 h-5 mr-2"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
					>
						<path
							clip-rule="evenodd"
							fill-rule="evenodd"
							d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
						></path>
					</svg>
					<span class="truncate">{getFileName(value)}</span>
				</a>
				<Button size="xs" color="alternative" on:click={removeExistingFile}>
					<svg
						class="w-4 h-4"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
					>
						<path
							clip-rule="evenodd"
							fill-rule="evenodd"
							d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
						></path>
					</svg>
				</Button>
			</div>
		{:else}
			<Fileupload
				{id}
				bind:value
				{isMultiple}
				class={fileClass}
				on:change={() => validateFiles(value)}
				accept={getAcceptAttributeFromValidators(validators)}
				disabled={isDisabled}
			/>
			{#if value instanceof FileList && value.length > 0}
				<Helper class="mt-2">Arquivo(s) selecionado(s): {getFileName(value)}</Helper>
			{/if}
		{/if}

		{#if error}
			<Helper class="mt-1 text-red-600 dark:text-red-500">{error}</Helper>
		{/if}
	</div>
{/if}