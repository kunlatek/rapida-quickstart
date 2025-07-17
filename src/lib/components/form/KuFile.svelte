<script lang="ts">
	import { Label, Helper, Button } from 'flowbite-svelte';
	import { getComponentClasses } from '$lib/styles/theme';
	import type { IFormCondition } from '../../interfaces/form.interfaces';
	import { createEventDispatcher, onMount } from 'svelte';
	import { UploadSolid, CloseOutline } from 'flowbite-svelte-icons';
	import { toastStore } from '$lib/stores/toast';

	export let name = '';
	export let label = '';
	export let value: FileList | null = null;
	export let initialUrl: string | null = null;
	export let placeholder = 'Clique para enviar ou arraste e solte';
	export let tooltip = '';
	export let isDisabled = false;
	export let isRequired = false;
	export let isMultiple = false; 
	export let error = '';
	export let id = name;
	export let variant = 'default';
	export let conditions: IFormCondition[] = [];
	export let validators: ('onlyImages' | 'png' | 'jpg' | 'pdf' | 'svg' | 'gif')[] = [];

	const dispatch = createEventDispatcher();

	let fileInput: HTMLInputElement;
	let previewUrl: string | null = null;
	let selectedFile: File | null = null;
	let isDragOver = false;

	onMount(() => {
		if (initialUrl) {
			previewUrl = initialUrl;
		}
	});

	function getFileName(url: string | null): string {
		if (!url) return 'Arquivo existente';
		try {
			const urlObject = new URL(url);
			const pathParts = urlObject.pathname.split('/');
			const encodedName = pathParts[pathParts.length - 1];
			const decodedName = decodeURIComponent(encodedName);
			// Remove o UUID e o traço inicial
			return decodedName.replace(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}-/, '');
		} catch (e) {
			// Fallback para nomes de arquivos que não são URLs
			const parts = url.split('/');
			return parts[parts.length - 1];
		}
	}

	function handleFileSelect(files: FileList | null) {
		if (!files || files.length === 0) return;
		const file = files[0];
		
		if (!validateFile(file)) return;

		selectedFile = file;
		previewUrl = URL.createObjectURL(file);
		
		
		const dataTransfer = new DataTransfer();
		dataTransfer.items.add(file);
		value = dataTransfer.files;

		dispatch('change', value);
	}

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		handleFileSelect(target.files);
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragOver = false;
		if (event.dataTransfer?.files) {
			handleFileSelect(event.dataTransfer.files);
		}
	}

	function removePreview() {
		previewUrl = null;
		selectedFile = null;
		value = null;
		if (fileInput) fileInput.value = ''; 
		dispatch('change', null);
	}
	
	function removeExistingFile() {
		initialUrl = null;
		previewUrl = null;
		value = null; 
		dispatch('change', null);
	}

	function validateFile(file: File): boolean {
		if (!validators || validators.length === 0) return true;

		let isValid = true;
		let validationError = '';
		const fileExtension = file.name.split('.').pop()?.toLowerCase();

		const allowedTypes = validators.map(v => {
			if (v === 'jpg') return 'jpeg';
			return v;
		});

		if (validators.includes('onlyImages') && !file.type.startsWith('image/')) {
			isValid = false;
			validationError = 'Apenas imagens são permitidas';
		} else if (fileExtension && !allowedTypes.includes(fileExtension)) {
			isValid = false;
			validationError = `Tipo de arquivo inválido. Permitidos: ${validators.join(', ').toUpperCase()}`;
		}
		
		if (!isValid) {
			error = validationError;
			toastStore.error(validationError);
		} else {
			error = '';
		}

		return isValid;
	}

	$: themeClasses = getComponentClasses('file', variant, { error: !!error,	disabled: isDisabled });
	$: labelClass = `mb-2 ${error ? 'text-red-600 dark:text-red-500' : 'text-gray-900 dark:text-white'}`;
	
	function evaluateConditions(): boolean {
		if (!conditions || conditions.length === 0) return true;
		return true;
	}

	$: showComponent = evaluateConditions();

</script>

{#if showComponent}
	<div>
		<Label for={id} class={labelClass}>{label}</Label>

		<div class="mt-1">
			{#if previewUrl}
				<div class="flex items-center justify-between p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg">
					<div class="flex items-center gap-3">
						{#if previewUrl.match(/\.(jpeg|jpg|gif|png|svg|webp)$/i)}
							<img
								src={previewUrl}
								alt="Pré-visualização"
								class="w-12 h-12 rounded object-cover"
							/>
						{:else}
							<div class="w-12 h-12 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
								<svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
							</div>
						{/if}
						<div>
							<p class="text-sm font-medium text-gray-900 dark:text-white">
								{selectedFile ? selectedFile.name : getFileName(initialUrl)}
							</p>
							{#if selectedFile}
								<p class="text-xs text-gray-500 dark:text-gray-400">
									{(selectedFile.size / 1024).toFixed(2)} KB
								</p>
							{/if}
						</div>
					</div>
					<Button
						color="none"
						class="!p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white"
						on:click={selectedFile ? removePreview : removeExistingFile}
						aria-label="Remover arquivo"
					>
						<CloseOutline class="w-5 h-5" />
					</Button>
				</div>
				{:else}
				<label
					for={id}
					class="relative flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
					class:border-blue-500={isDragOver}
					class:dark:border-blue-400={isDragOver}
					on:dragover|preventDefault={() => (isDragOver = true)}
					on:dragleave|preventDefault={() => (isDragOver = false)}
					on:drop|preventDefault={handleDrop}
				>
					<div class="flex flex-col items-center justify-center pt-5 pb-6 text-center">
						<UploadSolid class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
						<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
							<span class="font-semibold">{placeholder}</span>
						</p>
						<p class="text-xs text-gray-500 dark:text-gray-400">
							{validators.join(', ').toUpperCase() || 'Qualquer tipo de arquivo'}
						</p>
					</div>
					<input bind:this={fileInput} on:change={handleFileChange} {id} {name} type="file" class="hidden" accept={validators.map(v => `.${v}`).join(',')} />
				</label>
			{/if}
		</div>

		{#if error}
			<Helper class="mt-1 text-red-600 dark:text-red-500">{error}</Helper>
		{/if}
	</div>
{/if}