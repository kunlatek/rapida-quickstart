<script lang="ts">
 import {
 Label,
 Input as FlowbiteInput,
 Helper,
 Spinner,
 } from "flowbite-svelte";
 import { getComponentClasses } from "$lib/styles/theme";
 import { EyeSolid, EyeSlashSolid } from "flowbite-svelte-icons";
 import type {
 IFormCondition,
 IApiRequest,
 } from "../../interfaces/form.interfaces";
 import { createEventDispatcher } from "svelte";
 import api from "$lib/services/api";

 interface InputVariant {
 base: string;
 error?: string;
 }

 interface InputVariants {
 default: InputVariant;
 [key: string]: InputVariant | undefined;
 }

 export let name = "";
 export let dataType:
 | "text"
 | "number"
 | "password"
 | "email"
 | "color"
 | "date"
 | "wysiwyg"
 | "time" = "text";
 export let label = "";
 export let value: string | number | undefined = "";
 export let placeholder = "";
 export let tooltip = "";
 export let isAutofocus = false;
 export let isDisabled = false;
 export let isRequired = false;
 export const isUnique = false;
 export let maxlength: number | undefined = undefined;
 export let minLength: number | undefined = undefined;
 export let error = "";
 export let id = name;
 export let variant = "default";
 export let conditions: IFormCondition[] = [];
 export let validators: (
 | "cep"
 | "cpf"
 | "cnpj"
 | "onlyNumbers"
 | "phone"
 | "email"
 )[] = [];

 export let apiRequest: IApiRequest | undefined = undefined;
 export let formState: Record<string, any> = {};

 const dispatch = createEventDispatcher();

 let showPassword = false;
 let validationError: string | null = null;
 let isApiLoading = false;

 $: inputType =
 dataType === "password" && showPassword
 ? "text"
 : dataType === "wysiwyg"
 ? "text"
 : dataType;

 $: themeClasses = getComponentClasses("input", variant, {
 error: !!error || !!validationError,
 disabled: isDisabled,
 });
 $: labelClass = `mb-2 ${error || validationError ? "text-red-600 dark:text-red-500" : "text-gray-900 dark:text-white"}`;
 $: inputClass = `w-full ${themeClasses}`;

 function togglePasswordVisibility(): void {
 showPassword = !showPassword;
 }

 function validateInput(value: string | number | undefined): string | null {
 if (
 !validators ||
 validators.length === 0 ||
 value === undefined ||
 value === ""
 ) {
 return null;
 }

 const stringValue = value.toString();

 if (validators.includes("cpf") && !isValidCPF(stringValue)) {
 return "CPF inválido";
 }

 if (validators.includes("cnpj") && !isValidCNPJ(stringValue)) {
 return "CNPJ inválido";
 }

 if (validators.includes("cep") && !isValidCEP(stringValue)) {
 return "CEP inválido";
 }

 if (validators.includes("onlyNumbers") && !/^\d+$/.test(stringValue)) {
 return "Apenas números são permitidos";
 }

 if (validators.includes("phone") && !isValidPhone(stringValue)) {
 return "Telefone inválido";
 }

 if (validators.includes("email") && !isValidEmail(stringValue)) {
 return "Email inválido";
 }

 return null;
 }

 function isValidCPF(cpf: string): boolean {
 const regex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$|^\d{11}$/;
 return regex.test(cpf);
 }

 function isValidCNPJ(cnpj: string): boolean {
 const regex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$|^\d{14}$/;
 return regex.test(cnpj);
 }

 function isValidCEP(cep: string): boolean {
 const regex = /^\d{5}\-?\d{3}$/;
 return regex.test(cep);
 }

 function isValidPhone(phone: string): boolean {
 const regex = /^(\+\d{1,3}\s?)?\(?\d{2,3}\)?[\s.-]?\d{4,5}[\s.-]?\d{4}$/;
 return regex.test(phone);
 }

 function isValidEmail(email: string): boolean {
 const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 return regex.test(email);
 }

 function handleChange(event: Event): void {
 const targetInput = event.target as HTMLInputElement;

 if (dataType === "date" && targetInput.value === "") {
 value = undefined;
 } else {
 value =
 dataType === "number" ? targetInput.valueAsNumber : targetInput.value;

 validationError = validateInput(value);
 }
 }

 function handleBlur(): void {
 if (apiRequest && !validationError) {
 fetchDataFromApi();
 }
 }

 function handleInputForNumbers(event: Event): void {
 if (dataType === "number") {
 handleChange(event);
 }
 }

 function handleInput(event: Event): void {
 if (dataType === "number") {
 handleInputForNumbers(event);
 }
 }

 async function fetchDataFromApi(): Promise<void> {
 if (!apiRequest || !apiRequest.endpoint || !value) return;

 isApiLoading = true;
 try {
 let url = apiRequest.endpoint;
 if (apiRequest.paramType === "path") {
 url += String(value).replace(/\D/g, "");
 } else {
 
 
 }

 const response = await api.get(url);
 const responseData = response.data;

 if (responseData && apiRequest.formFieldsFilledByApiResponse) {
 const updates: Record<string, any> = {};
 apiRequest.formFieldsFilledByApiResponse.forEach((mapping) => {
 let extractedValue = responseData;
 mapping.propertiesFromApiToFillFormField.forEach((prop) => {
 extractedValue = extractedValue?.[prop];
 });
 if (extractedValue !== undefined) {
 updates[mapping.formFieldName] = extractedValue;
 }
 });

 if (Object.keys(updates).length > 0) {
 dispatch("apirequestsuccess", updates);
 }
 }
 } catch (error) {
 console.error("Erro ao buscar dados da API:", error);
 } finally {
 isApiLoading = false;
 }
 }

 function evaluateConditions(state: Record<string, any>): boolean {
    if (!conditions || conditions.length === 0) return true;

    for (const condition of conditions) {
        if (condition.type === 'form' && condition.elements) {
            let overallResult = true;
            let firstElement = true;

            for (const element of condition.elements) {
                const formValue = state[element.key];
                let currentResult = false;

                switch (element.comparisonOperator) {
                    case '===':
                        currentResult = formValue === element.value;
                        break;
                    case '!==':
                        currentResult = formValue !== element.value;
                        break;
                    case '>':
                        currentResult = formValue > element.value;
                        break;
                    case '>=':
                        currentResult = formValue >= element.value;
                        break;
                    case '<':
                        currentResult = formValue < element.value;
                        break;
                    case '<=':
                        currentResult = formValue <= element.value;
                        break;
                    case 'in':
                        currentResult = Array.isArray(element.value) && element.value.includes(formValue);
                        break;
                    case 'nin':
                        currentResult = Array.isArray(element.value) && !element.value.includes(formValue);
                        break;
                }

                if (firstElement) {
                    overallResult = currentResult;
                    firstElement = false;
                } else {
                    if (element.logicalOperator === '||') {
                        overallResult = overallResult || currentResult;
                    } else {
                        overallResult = overallResult && currentResult;
                    }
                }
            }
            if (!overallResult) return false;
        }
    }
    return true;
 }

 $: showComponent = evaluateConditions(formState);
 
 $: {
 if (value !== undefined && value !== "") {
 validationError = validateInput(value);
 } else {
 validationError = null;
 }
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
 >
 <svg
 class="w-4 h-4 inline"
 fill="currentColor"
 viewBox="0 0 20 20"
 xmlns="http:
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

 <div class="relative">
 {#if dataType !== "wysiwyg"}
 <FlowbiteInput
 {id}
 type={inputType}
 {name}
 bind:value
 {placeholder}
 disabled={isDisabled}
 required={isRequired}
 autofocus={isAutofocus}
 {maxlength}
 minlength={minLength}
 class={inputClass}
 on:change={handleChange}
 on:input={handleInput}
 on:blur={handleBlur}
 step={dataType === "number" ? "any" : undefined}
 />
 {#if isApiLoading}
 <div
 class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
 >
 <Spinner size={4} />
 </div>
 {/if}
 {#if dataType === "password"}
 <button
 type="button"
 class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
 on:click|preventDefault={togglePasswordVisibility}
 aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
 >
 {#if showPassword}
 <EyeSlashSolid class="w-5 h-5" />
 {:else}
 <EyeSolid class="w-5 h-5" />
 {/if}
 </button>
 {/if}
 {:else}
 <div
 class="border border-gray-300 rounded-lg p-2 dark:border-gray-600 dark:bg-gray-700"
 >
 <textarea
 {id}
 {name}
 bind:value
 {placeholder}
 disabled={isDisabled}
 required={isRequired}
 {maxlength}
 minlength={minLength}
 class="w-full bg-transparent border-0 focus:ring-0 p-0 dark:text-white"
 rows="5"
 ></textarea>
 </div>
 {/if}
 </div>

 {#if error || validationError}
 <Helper class="mt-1 text-red-600 dark:text-red-500"
 >{error || validationError}</Helper
 >
 {/if}
 </div>
{/if}