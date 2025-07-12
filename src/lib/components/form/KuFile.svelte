<script lang="ts">
	import { Fileupload, Label, Helper } from 'flowbite-svelte';
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
	export let value: FileList | null = null;
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

	$: themeClasses = getComponentClasses('file', variant, {
		error: !!error,
		disabled: isDisabled
	});
	$: labelClass = `mb-2 ${error ? 'text-red-600 dark:text-red-500' : 'text-gray-900 dark:text-white'}`;"
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
</script>