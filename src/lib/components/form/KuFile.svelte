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
	export let initialUrl: string | string[] | null = null;
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
	let isDragOver = false;

	// State to handle multiple files
	let previewItems: {
		url: string;
		name: string;
		size?: number;
		file?: File;
	}[] = [];

	onMount(() => {
		if (initialUrl) {
			const urls = Array.isArray(initialUrl) ? initialUrl : [initialUrl];
			previewItems = urls
				.filter((url) => !!url)
				.map((url) => ({
					url,
					name: getFileName(url),
					file: undefined,
					size: undefined
				}));
		}
	});

	function getFileName(url: string | null): string {
		if (!url) return 'Arquivo existente';
		try {
			// Tenta decodificar o nome do arquivo a partir da URL do GCS
			const decodedName = decodeURIComponent(url.split('/').pop() || '');
			// Remove o UUID e o traço inicial, se houver
			return decodedName.replace(/^[a-f0-9]{8}-([a-f0-9]{4}-){3}[a-f0-9]{12}-/, '');
		} catch (e) {
			return url.split('/').pop() || 'Arquivo';
		}
	}

	function handleFileSelect(files: FileList | null) {
		if (!files || files.length === 0) return;

		const newValidFiles = Array.from(files).filter(validateFile);
		if (newValidFiles.length === 0) return;
		
		const newItems = newValidFiles.map((file) => ({
			url: URL.createObjectURL(file),
			name: file.name,
			size: file.size,
			file
		}));

		if (isMultiple) {
			previewItems = [...previewItems, ...newItems];
		} else {
			// Revoga URLs de objetos antigos para evitar vazamentos de memória
			previewItems.forEach(item => {
				if(item.url.startsWith('blob:')) URL.revokeObjectURL(item.url);
			});
			previewItems = newItems;
		}

		updateValue();
	}
	
	function updateValue() {
		const dataTransfer = new DataTransfer();
		const currentFiles = previewItems.map(item => item.file).filter(Boolean) as File[];
		currentFiles.forEach(file => dataTransfer.items.add(file));
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

	function removeItem(index: number) {
		const removedItem = previewItems[index];

		if (removedItem.url.startsWith('blob:')) {
			URL.revokeObjectURL(removedItem.url);
		}
		
		previewItems.splice(index, 1);
		previewItems = [...previewItems]; // Trigger reactivity
		updateValue();
	}

	function validateFile(file: File): boolean {
		if (!validators || validators.length === 0) return true;

		let isValid = true;
		let validationError = '';
		const fileExtension = file.name.split('.').pop()?.toLowerCase();

		const allowedTypes = validators.map((v) => (v === 'jpg' ? 'jpeg' : v));

		if (validators.includes('onlyImages') && !file.type.startsWith('image/')) {
			isValid = false;
			validationError = 'Apenas imagens são permitidas';
		} else if (fileExtension && !allowedTypes.includes(fileExtension)) {
			isValid = false;
			validationError = `Tipo de arquivo inválido. Permitidos: ${validators.join(', ').toUpperCase()}`;
		}

		if (!isValid) {
			toastStore.error(validationError);
		}
		
		error = isValid ? '' : validationError;

		return isValid;
	}

	$: themeClasses = getComponentClasses('file', variant, { error: !!error, disabled: isDisabled });
	$: labelClass = `mb-2 ${error ? 'text-red-600 dark:text-red-500' : 'text-gray-900 dark:text-white'}`;

	function evaluateConditions(): boolean {
		if (!conditions || conditions.length === 0) return true;
		return true;
	}

	$: showComponent = evaluateConditions();
</script>

{#if showComponent}
	<div>
		<Label {for_id} class={labelClass}>{label}</Label>

		<div class="mt-1">
			{#if previewItems.length > 0}
				<div class="space-y-2">
					{#each previewItems as item, index (item.url)}
						<div
							class="flex items-center justify-between p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg"
						>
							<div class="flex items-center gap-3 overflow-hidden">
								{#if item.url.match(/\.(jpeg|jpg|gif|png|svg|webp)$/i)}
									<img
										src={item.url}
										alt="Pré-visualização"
										class="w-12 h-12 rounded object-cover flex-shrink-0"
									/>
								{:else}
									<div
										class="w-12 h-12 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0"
									>
										<svg
											class="w-6 h-6 text-gray-400"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
											><path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
											></path></svg
										>
									</div>
								{/if}
								<div class="truncate">
									<p class="text-sm font-medium text-gray-900 dark:text-white truncate" title={item.name}>
										{item.name}
									</p>
									{#if item.size}
										<p class="text-xs text-gray-500 dark:text-gray-400">
											{(item.size / 1024).toFixed(2)} KB
										</p>
									{/if}
								</div>
							</div>
							<Button
								color="none"
								class="!p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white flex-shrink-0"
								on:click={() => removeItem(index)}
								aria-label="Remover arquivo"
							>
								<CloseOutline class="w-5 h-5" />
							</Button>
						</div>
					{/each}
				</div>

				{#if isMultiple}
					<label
						for={id}
						class="mt-2 relative flex items-center justify-center w-full p-4 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
						class:border-blue-500={isDragOver}
						class:dark:border-blue-400={isDragOver}
						on:dragover|preventDefault={() => (isDragOver = true)}
						on:dragleave|preventDefault={() => (isDragOver = false)}
						on:drop|preventDefault={handleDrop}
					>
						<UploadSolid class="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
						<span class="text-sm text-gray-500 dark:text-gray-400">Adicionar mais arquivos</span>
						<input
							bind:this={fileInput}
							on:change={handleFileChange}
							{id}
							{name}
							type="file"
							class="hidden"
							{multiple}
							accept={validators.map((v) => `.${v}`).join(',')}
						/>
					</label>
				{/if}
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
					<input
						bind:this={fileInput}
						on:change={handleFileChange}
						{id}
						{name}
						type="file"
						class="hidden"
						multiple={isMultiple}
						accept={validators.map((v) => `.${v}`).join(',')}
					/>
				</label>
			{/if}
		</div>

		{#if error}
			<Helper class="mt-1 text-red-600 dark:text-red-500">{error}</Helper>
		{/if}
	</div>
{/if}