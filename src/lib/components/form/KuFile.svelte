<script lang="ts">
	import { Label, Helper, Button } from 'flowbite-svelte';
	import { getComponentClasses } from '$lib/styles/theme';
	import type { IFormCondition } from '../../interfaces/form.interfaces';
	import { createEventDispatcher, onMount } from 'svelte';
	import { UploadSolid } from 'flowbite-svelte-icons';

	export let name = '';
	export let label = '';
	export let value: FileList | null = null;
	export let initialUrl: string | null = null;
	export let placeholder = 'Clique para enviar ou arraste e solte';
	export let tooltip = '';
	export let isDisabled = false;
	export let isRequired = false;
	export let isMultiple = false; // Note: This implementation focuses on single file upload as per the image
	export let error = '';
	export let id = name;
	export let variant = 'default';
	export let conditions: IFormCondition[] = [];
	export let validators: ('onlyImages' | 'png' | 'jpg' | 'pdf')[] = [];

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

	function handleFileSelect(files: FileList | null) {
		if (!files || files.length === 0) return;
		const file = files[0];
		
		if (!validateFile(file)) return;

		selectedFile = file;
		previewUrl = URL.createObjectURL(file);
		
		// Create a new FileList to assign to the value
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
		if (fileInput) fileInput.value = ''; // Reset the input
		dispatch('change', null);
	}
	
	function removeExistingFile() {
		initialUrl = null;
		previewUrl = null;
		value = null; // Mark for removal
		dispatch('change', null);
	}

	function validateFile(file: File): boolean {
		if (!validators || validators.length === 0) return true;

		let isValid = true;
		let validationError = '';

		if (validators.includes('onlyImages') && !file.type.startsWith('image/')) {
			isValid = false;
			validationError = 'Apenas imagens são permitidas';
		} else if (validators.includes('png') && file.type !== 'image/png') {
			isValid = false;
			validationError = 'Apenas arquivos PNG são permitidos';
		} else if (validators.includes('jpg') && file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
			isValid = false;
			validationError = 'Apenas arquivos JPG são permitidos';
		} else if (validators.includes('pdf') && file.type !== 'application/pdf') {
			isValid = false;
			validationError = 'Apenas arquivos PDF são permitidos';
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

	// Import toastStore if needed for validation errors
	import { toastStore } from '$lib/stores/toast';

</script>

{#if showComponent}
	<div>
		<Label for={id} class={labelClass}>{label}</Label>

		<div class="mt-1">
			{#if previewUrl}
				<div class="relative group">
					{#if previewUrl.match(/\.(jpeg|jpg|gif|png|svg|webp)$/)}
						<img
							src={previewUrl}
							alt="Pré-visualização do arquivo"
							class="w-full h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
						/>
					{:else}
						<div class="h-48 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600">
							<p class="text-gray-500 dark:text-gray-400">Sem pré-visualização disponível</p>
						</div>
					{/if}
					<div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center rounded-lg">
						<div class="text-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
							{#if selectedFile}
								<p class="font-bold">{selectedFile.name}</p>
								<p class="text-sm">{(selectedFile.size / 1024).toFixed(2)} KB</p>
								<Button color="red" size="xs" class="mt-2" on:click={removePreview}>Remover</Button>
							{:else if initialUrl}
								<p class="font-bold">Arquivo existente</p>
								<Button color="red" size="xs" class="mt-2" on:click={removeExistingFile}>Remover arquivo existente</Button>
							{/if}
						</div>
					</div>
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
					<div class="flex flex-col items-center justify-center pt-5 pb-6">
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