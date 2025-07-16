<script lang="ts">
	import { Label, Select as FlowbiteSelect, Helper, CloseButton } from 'flowbite-svelte';
	import { getComponentClasses } from '$lib/styles/theme';
	import type { IFormCondition } from '../../interfaces/form.interfaces';
	import { createEventDispatcher, onMount } from 'svelte';

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
	export let placeholder = '';
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

	$: selectedItems = value && Array.isArray(value) ? processedOptions.filter(opt => value.includes(opt.value)) : [];
    $: availableItems = processedOptions.filter(opt => !value || !Array.isArray(value) || !value.includes(opt.value));

    function selectItem(itemValue: any) {
        if (isDisabled) return;
        if (!value.includes(itemValue)) {
            value = [...value, itemValue];
            dispatch('change', value);
        }
    }

    function removeItem(itemValue: any) {
        if (isDisabled) return;
        value = Array.isArray(value) ? value.filter(v => v !== itemValue) : [];
        dispatch('change', value);
    }

	$: showComponent = evaluateConditions();
</script>

{#if showComponent}
	<div class="w-full">
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
			<div class="w-full p-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg">
				<div class="flex flex-wrap gap-2 min-h-[2.1rem] items-center">
					{#if selectedItems.length === 0}
						<span class="text-gray-500 dark:text-gray-400 px-2 text-sm">Nenhum item selecionado</span>
					{/if}
					{#each selectedItems as item (item.value)}
						<span class="bg-blue-100 text-blue-800 text-sm font-medium inline-flex items-center px-2.5 py-1 rounded-full dark:bg-blue-900 dark:text-blue-300">
							{item.name}
							<button type="button" on:click={() => removeItem(item.value)} disabled={isDisabled} class="inline-flex items-center p-1 ms-2 text-sm text-blue-400 bg-transparent rounded-sm hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300">
								<svg class="w-2 h-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
									<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
								</svg>
								<span class="sr-only">Remover item</span>
							</button>
						</span>
					{/each}
				</div>

				{#if availableItems.length > 0}
					<hr class="my-2 border-gray-200 dark:border-gray-600" />
				{/if}
				
				<div class="flex flex-wrap gap-2">
					{#each availableItems as item (item.value)}
						<button
							type="button"
							on:click={() => selectItem(item.value)}
							disabled={isDisabled || item.disabled}
							class="px-3 py-1 text-sm font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
							class:cursor-not-allowed={isDisabled || item.disabled}
							class:opacity-50={isDisabled || item.disabled}
						>
							+ {item.name}
						</button>
					{/each}
				</div>
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