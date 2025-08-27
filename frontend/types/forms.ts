// types/forms.ts - ТОЛЬКО ТИПЫ ФОРМ И ВАЛИДАЦИИ
import type { Ref } from "vue";

// ========================================
// ВАЛИДАЦИЯ (единственный источник истины)
// ========================================

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  numeric?: boolean;
  min?: number;
  max?: number;
  custom?: (value: any) => boolean | string;
  asyncCustom?: (value: any) => Promise<string | null>;
}

export interface FormField {
  value: any;
  rules?: ValidationRule[];
  error?: string;
  touched?: boolean;
  validating?: boolean;
}

export interface FormError {
  field: string;
  message: string;
}

export interface FormState<T = any> {
  data: T;
  errors: FormError[];
  isSubmitting: boolean;
  isValid: boolean;
}

export interface ValidationSchema {
  [field: string]: ValidationRule[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// ========================================
// ИНТЕРФЕЙС ДЛЯ ДЕБАУНСИРОВАННОЙ ВАЛИДАЦИИ
// ========================================

export interface DebouncedValidator {
  validate: (value: any) => Promise<string | null>;
  cancel: () => void;
}

// ========================================
// ТИПЫ ДЛЯ КОМПОНЕНТОВ ФОРМ
// ========================================

export type FormFieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "url"
  | "search"
  | "textarea"
  | "select"
  | "multiselect"
  | "checkbox"
  | "radio"
  | "date"
  | "time"
  | "datetime"
  | "file"
  | "image"
  | "range"
  | "color"
  | "toggle";

export interface FormFieldConfig {
  name: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  validation?: ValidationRule[];
  options?: Array<{ label: string; value: string | number }>;
  multiple?: boolean;
  accept?: string;
  min?: number | string;
  max?: number | string;
  step?: number;
  rows?: number;
  cols?: number;
  autocomplete?: string;
  description?: string;
  icon?: string;
  prefix?: string;
  suffix?: string;
  mask?: string;
  format?: string;
  defaultValue?: any;
  dependsOn?: string;
  condition?: (values: Record<string, any>) => boolean;
}

export interface FormConfig {
  fields: FormFieldConfig[];
  layout: "vertical" | "horizontal" | "inline";
  validation: "onSubmit" | "onChange" | "onBlur";
  submitButton: {
    text: string;
    loadingText?: string;
    disabled?: boolean;
  };
  resetButton?: {
    text: string;
    show: boolean;
  };
}

// ========================================
// ТИПЫ ДЛЯ COMPOSABLES
// ========================================

export interface UseFormReturn<T> {
  data: any;
  fields: Ref<Record<string, FormField>>;
  errors: Ref<Record<string, string>>;
  isSubmitting: Ref<boolean>;
  isValid: Ref<boolean>;
  hasErrors: Ref<boolean>;

  // Методы валидации
  validate: (fieldName?: string) => Promise<boolean>;
  validateField: (fieldName: string) => Promise<boolean>;

  // Методы управления полями
  setFieldRule: (fieldName: string, rules: ValidationRule[]) => void;
  setFieldValue: (fieldName: string, value: any) => void;
  setFieldError: (fieldName: string, error: string) => void;
  clearFieldError: (fieldName: string) => void;
  touchField: (fieldName: string) => void;

  // Методы получения информации о полях
  getFieldValue: (fieldName: string) => any;
  getFieldError: (fieldName: string) => string | undefined;
  isFieldTouched: (fieldName: string) => boolean;
  isFieldValid: (fieldName: string) => boolean;
  isFieldValidating: (fieldName: string) => boolean;

  // Сброс
  reset: () => void;
  resetField: (fieldName: string) => void;
}
