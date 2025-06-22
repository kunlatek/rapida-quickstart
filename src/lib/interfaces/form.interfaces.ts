/**
 * Base interface for form conditions
 */
export interface IFormCondition {
  type: "form" | "code" | "array";
  elements?: IConditionElement[];
  code?: IConditionCode;
}

/**
 * Interface for condition elements
 */
export interface IConditionElement {
  key: string;
  value?: any;
  array?: string;
  comparisonOperator: "===" | ">" | ">=" | "in" | "<" | "<=" | "!==" | "nin";
  logicalOperator?: "&&" | "!" | "nor" | "||";
}

/**
 * Interface for condition code
 */
export interface IConditionCode {
  triggerField: string;
  code: string;
}

/**
 * Base interface for all form elements
 */
export interface IFormElement {
  type: string;
  name?: string;
  todo?: string;
  conditions?: IFormCondition[];
}

/**
 * Interface for form input
 */
export interface IFormInput extends IFormElement {
  type: "input";
  name: string;
  dataType:
    | "text"
    | "number"
    | "password"
    | "email"
    | "color"
    | "date"
    | "wysiwyg"
    | "time";
  label: string;
  placeholder?: string;
  tooltip?: string;
  isAutofocus?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  isUnique?: boolean;
  validators?: ("cep" | "cpf" | "cnpj" | "onlyNumbers" | "phone" | "email")[];
  maxlength?: number;
  minLength?: number;
  apiRequest?: IApiRequest;
}

/**
 * Interface for API requests
 */
export interface IApiRequest {
  endpoint: string;
  paramType: "query" | "path";
  isNotKunlatekResponse?: boolean;
  filtersFromOtherFormFields?: IApiResponseFieldFilter[];
  formFieldsFilledByApiResponse?: IApiResponseField[];
  hasAuthentication?: boolean;
}

/**
 * Interface for API response fields
 */
export interface IApiResponseField {
  formFieldName: string;
  propertiesFromApiToFillFormField: string[];
  arrayParents?: string[];
}

/**
 * Interface for API response field filters
 */
export interface IApiResponseFieldFilter {
  formFieldName: string;
  filterPropertyName: string;
}

/**
 * Interface for form select
 */
export interface IFormSelect extends IFormElement {
  type: "select";
  name: string;
  dataType:
    | "text"
    | "number"
    | "password"
    | "email"
    | "color"
    | "date"
    | "file";
  label: string;
  placeholder?: string;
  tooltip?: string;
  isAutofocus?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  isUnique?: boolean;
  validators?: ("cpf" | "cnpj")[];
  isMultiple?: boolean;
  options: ISelectOption[];
}

/**
 * Interface for select options
 */
export interface ISelectOption {
  label: string;
  value: string | number | boolean;
  isDisabled?: boolean;
  isSelected?: boolean;
}

/**
 * Interface for form autocomplete
 */
export interface IFormAutocomplete extends IFormElement {
  type: "autocomplete";
  name: string;
  dataType:
    | "text"
    | "number"
    | "password"
    | "email"
    | "color"
    | "date"
    | "file";
  label: string;
  placeholder?: string;
  tooltip?: string;
  isAutofocus?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  isUnique?: boolean;
  validators?: ("cpf" | "cnpj")[];
  isMultiple?: boolean;
  relatedEntity?: string;
  optionsApi: IOptionsApi;
}

/**
 * Interface for options API
 */
export interface IOptionsApi {
  endpoint: string;
  labelField: string[];
  valueField: string;
  paramsToFilter: string[];
  paramType: "query" | "path";
  populate?: string[];
  formFieldsFilledByApiResponse?: IApiResponseField[];
  filtersFromOtherFormFields?: IApiResponseFieldFilter[];
  isNotKunlatekResponse?: boolean;
  rawQuery?: string;
}

/**
 * Interface for form array
 */
export interface IFormArray extends IFormElement {
  type: "array";
  id: string;
  title: string;
  elements: IFormElement[];
}

/**
 * Interface for form fieldset
 */
export interface IFormFieldset extends IFormElement {
  type: "fieldset";
  id: string;
  title: string;
  elements: IFormElement[];
}

/**
 * Interface for form tabs
 */
export interface IFormTab extends IFormElement {
  type: "tab";
  id: string;
  tabs: {
    id: string;
    title: string;
    elements: IFormElement[];
  }[];
}

/**
 * Interface for form file
 */
export interface IFormFile extends IFormElement {
  type: "file";
  name: string;
  label: string;
  placeholder?: string;
  tooltip?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  validators?: ("onlyImages" | "png" | "jpg" | "pdf")[];
  isMultiple?: boolean;
}

/**
 * Interface for form button
 */
export interface IFormButton extends IFormElement {
  type: "button";
  id: string;
  label: string;
  actionType: "submit" | "reset" | "link" | "apiRequest";
  icon?: string;
  tooltip?: string;
  isDisabled?: boolean;
  apiRequest?: IApiRequest;
}

// Theme-related interfaces

/**
 * Interface for array variant in theme
 */
export interface IArrayVariant {
  base: string;
  item: string;
}

/**
 * Interface for array variants in theme
 */
export interface IArrayVariants {
  default: IArrayVariant;
  [key: string]: IArrayVariant | undefined;
}
