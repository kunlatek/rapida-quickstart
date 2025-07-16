<script lang="ts">
	import { Label, Select as FlowbiteSelect, Helper, CloseButton, Checkbox, Input } from 'flowbite-svelte';
	import { getComponentClasses } from '$lib/styles/theme';
	import type { IFormCondition } from '../../interfaces/form.interfaces';
	import { createEventDispatcher, onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	interface ISelectOption {
		label: string;
		value: string | number | boolean;
		isDisabled?: boolean;
		isSelected?: boolean;
	}

	interface LegacyOption {
		name: string;
		value: any;
		isDisabled?: boolean;
	}

	interface FlowbiteSelectOption {
		name: string;
		value: any;
		disabled?: boolean;
	}

	type OptionType = ISelectOption | LegacyOption;

	type DataType = 'text' | 'number' | 'password' | 'email' | 'color' | 'date' | 'file';
	type Validator = 'cpf' | 'cnpj';

	export let name = '';
	export const dataType: DataType = 'text';
	export let label = '';
	export let value: string | number | boolean | any[] = [];
	export let placeholder = 'Selecione uma ou mais opções';
	export let tooltip = '';
	export let isAutofocus = false;
	export let isDisabled = false;
	export let isRequired = false;
	export const isUnique = false;
	export let isMultiple = false;
	export let options: OptionType[] = [];
	export let error = '';
	export let id = name;
	export let variant = 'default';
	export let conditions: IFormCondition[] = [];
	export const validators: Validator[] = [];
	export const todo = '';

	const dispatch = createEventDispatcher();
	
	let mainElement: HTMLElement;
	let showDropdown = false;
	let searchTerm = '';

	function isLegacyOption(option: OptionType): option is LegacyOption {
		return 'name' in option && !('label' in option);
	}

	$: processedOptions = options.map((option) => {
		if (isLegacyOption(option)) {
			return {
				name: option.name,
				value: option.value,
				disabled: option.isDisabled || false
			};
		} else {
			return {
				name: option.label,
				value: option.value,
				disabled: option.isDisabled || false
			};
		}
	});

	$: filteredOptions = searchTerm
		? processedOptions.filter((opt) => opt.name.toLowerCase().includes(searchTerm.toLowerCase()))
		: processedOptions;

	$: selectedItems = Array.isArray(value)
		? processedOptions.filter((opt) => value.includes(opt.value))
		: [];
	
	function removeItem(itemValue: any) {
		if (isDisabled || !Array.isArray(value)) return;
		value = value.filter((v) => v !== itemValue);
		dispatch('change', value);
	}

	function handleOutsideClick(event: MouseEvent) {
		if (showDropdown && mainElement && !mainElement.contains(event.target as Node)) {
			showDropdown = false;
		}
	}

	$: themeClasses = getComponentClasses('select', variant, {
		error: !!error,
		disabled: isDisabled
	});
	$: labelClass = `mb-2 ${
		error ? 'text-red-600 dark:text-red-500' : 'text-gray-900 dark:text-white'
	}`;
	$: selectClass = `w-full ${themeClasses}`;

	function evaluateConditions(): boolean {
		if (!conditions || conditions.length === 0) return true;
		return true;
	}

	onMount(() => {
		if (isMultiple && !Array.isArray(value)) {
			value = [];
		}
	});

	$: showComponent = evaluateConditions();
</script>

<svelte:window on:click={handleOutsideClick} />

{#if showComponent}
	<div class="w-full" bind:this={mainElement}>
		<Label for={id} class={labelClass}>
			{label}
			{#if isRequired}<span class="text-red-500">*</span>{/if}
			{#if tooltip}
				<span class="ml-1 text-gray-400 hover:text-gray-600 cursor-help" title={tooltip}>
					<svg
						class="w-4 h-4 inline"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fillRule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
							clipRule="evenodd"
						></path>
					</svg>
				</span>
			{/if}
		</Label>

		{#if isMultiple}
			<div class="relative">
				<button
					type="button"
					on:click={() => !isDisabled && (showDropdown = !showDropdown)}
					class="flex items-center justify-between w-full p-2.5 text-left {themeClasses}"
					class:cursor-not-allowed={isDisabled}
					class:opacity-50={isDisabled}
				>
					<div class="flex flex-wrap gap-1">
						{#if selectedItems.length === 0}
							<span class="text-gray-500 dark:text-gray-400">{placeholder}</span>
						{/if}
						{#each selectedItems as item (item.value)}
							<span class="bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-300">
								{item.name}
								<button type="button" on:click|stopPropagation={() => removeItem(item.value)} class="inline-flex items-center p-0.5 ms-2 text-sm text-blue-400 bg-transparent rounded-sm hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300">
									<svg class="w-2 h-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
										<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
									</svg>
								</button>
							</span>
						{/each}
					</div>
					<svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
					</svg>
				</button>

				{#if showDropdown}
					<div transition:fly={{ y: -5, duration: 200 }} class="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg dark:bg-gray-700 border dark:border-gray-600">
						<div class="p-2">
							<Input type="text" bind:value={searchTerm} placeholder="Pesquisar..." class="w-full text-sm" />
						</div>
						<ul class="max-h-60 py-1 overflow-auto text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
							{#each filteredOptions as option (option.value)}
								<li class="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-600">
									<Label class="flex items-center w-full cursor-pointer">
										<Checkbox class="mr-2" bind:group={value} value={option.value} disabled={option.disabled || isDisabled} />
										<span class="text-gray-900 dark:text-white">{option.name}</span>
									</Label>
								</li>
							{:else}
								<li class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">Nenhuma opção encontrada.</li>
							{/if}
						</ul>
					</div>
				{/if}
			</div>
		{:else}
			<FlowbiteSelect
				{id}
				{name}
				bind:value
				{placeholder}
				disabled={isDisabled}
				required={isRequired}
				multiple={isMultiple}
				items={processedOptions}
				class={selectClass}
				autofocus={isAutofocus}
			/>
		{/if}

		{#if error}
			<Helper class="mt-1 text-red-600 dark:text-red-500">{error}</Helper>
		{/if}
	</div>
{/if}