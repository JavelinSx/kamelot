import type { FormField, UseFormReturn, ValidationRule } from "@/types/forms";
import { useDebounceFn } from "@vueuse/core";

export function useForm<T extends Record<string, any>>(
  initialData: T
): UseFormReturn<T> {
  // ПРОСТОЕ РЕШЕНИЕ: используем shallowRef для избежания проблем с типизацией
  const data = ref({ ...initialData });
  const fields = ref<Record<string, FormField>>({});
  const isSubmitting = ref(false);
  const errors = ref<Record<string, string>>({});

  // Инициализация полей
  Object.keys(initialData).forEach((key) => {
    fields.value[key] = {
      value: initialData[key],
      touched: false,
      validating: false,
    };
  });

  const validateField = async (fieldName: string): Promise<boolean> => {
    const field = fields.value[fieldName];
    const rules = field?.rules;

    if (!rules || !Array.isArray(rules)) return true;

    const value = data.value[fieldName];
    let error: string | null = null;

    if (field) {
      field.validating = true;
    }

    try {
      for (const rule of rules) {
        // Required
        if (
          rule.required &&
          (!value || (typeof value === "string" && value.trim() === ""))
        ) {
          error = "Поле обязательно для заполнения";
          break;
        }

        if (!value && !rule.required) continue;

        // Min length
        if (rule.minLength && value && value.length < rule.minLength) {
          error = `Минимум ${rule.minLength} символов`;
          break;
        }

        // Max length
        if (rule.maxLength && value && value.length > rule.maxLength) {
          error = `Максимум ${rule.maxLength} символов`;
          break;
        }

        // Pattern
        if (rule.pattern && value && !rule.pattern.test(value)) {
          error = "Неверный формат";
          break;
        }

        // Email
        if (rule.email && value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            error = "Неверный email адрес";
            break;
          }
        }

        // Numeric
        if (rule.numeric && value && isNaN(Number(value))) {
          error = "Должно быть числом";
          break;
        }

        // Min value
        if (rule.min !== undefined && value && Number(value) < rule.min) {
          error = `Минимальное значение: ${rule.min}`;
          break;
        }

        // Max value
        if (rule.max !== undefined && value && Number(value) > rule.max) {
          error = `Максимальное значение: ${rule.max}`;
          break;
        }

        // Sync custom validation
        if (rule.custom) {
          const customResult = rule.custom(value);
          if (typeof customResult === "string") {
            error = customResult;
            break;
          }
          if (customResult === false) {
            error = "Ошибка валидации";
            break;
          }
        }

        // Async custom validation
        if (rule.asyncCustom) {
          try {
            const asyncError = await rule.asyncCustom(value);
            if (asyncError) {
              error = asyncError;
              break;
            }
          } catch (err) {
            error = "Ошибка валидации";
            break;
          }
        }
      }
    } finally {
      if (field) {
        field.validating = false;
      }
    }

    if (field) {
      field.error = error || undefined;
    }
    errors.value[fieldName] = error || "";

    return !error;
  };

  const validate = async (fieldName?: string): Promise<boolean> => {
    if (fieldName) {
      return await validateField(fieldName);
    }

    const validationPromises = Object.keys(fields.value).map((key) =>
      validateField(key)
    );

    const results = await Promise.all(validationPromises);
    return results.every((result) => result);
  };

  const setFieldRule = (fieldName: string, rules: ValidationRule[]) => {
    const field = fields.value[fieldName];
    if (field) {
      field.rules = rules;
    }
  };

  const setFieldValue = (fieldName: string, value: any) => {
    // Создаем новый объект для триггера реактивности
    data.value = { ...data.value, [fieldName]: value };

    const field = fields.value[fieldName];
    if (field) {
      field.value = value;
      field.touched = true;
    }

    debouncedValidation(fieldName);
  };

  const setFieldError = (fieldName: string, error: string) => {
    const field = fields.value[fieldName];
    if (field) {
      field.error = error;
    }
    errors.value[fieldName] = error;
  };

  const clearFieldError = (fieldName: string) => {
    const field = fields.value[fieldName];
    if (field) {
      field.error = undefined;
    }
    errors.value[fieldName] = "";
  };

  const touchField = (fieldName: string) => {
    const field = fields.value[fieldName];
    if (field) {
      field.touched = true;
    }
  };

  const reset = () => {
    data.value = { ...initialData };

    Object.keys(initialData).forEach((key) => {
      const field = fields.value[key];
      if (field) {
        field.value = initialData[key];
        field.touched = false;
        field.error = undefined;
        field.validating = false;
      }

      errors.value[key] = "";
    });
  };

  const resetField = (fieldName: string) => {
    const initialValue = (initialData as any)[fieldName];

    data.value = { ...data.value, [fieldName]: initialValue };

    const field = fields.value[fieldName];
    if (field) {
      field.value = initialValue;
      field.touched = false;
      field.error = undefined;
      field.validating = false;
    }

    errors.value[fieldName] = "";
  };

  // Дебаунс для валидации
  const debouncedValidation = useDebounceFn(async (fieldName: string) => {
    await validateField(fieldName);
  }, 300);

  // Computed свойства
  const isValid = computed(() => {
    return Object.keys(fields.value).every((key) => {
      const field = fields.value[key];
      return !field?.error;
    });
  });

  const hasErrors = computed(() => {
    return Object.values(errors.value).some((error) => !!error);
  });

  // Методы получения информации о полях
  const getFieldValue = (fieldName: string) => {
    return data.value[fieldName];
  };

  const getFieldError = (fieldName: string) => {
    return fields.value[fieldName]?.error;
  };

  const isFieldTouched = (fieldName: string) => {
    return !!fields.value[fieldName]?.touched;
  };

  const isFieldValid = (fieldName: string) => {
    return !fields.value[fieldName]?.error;
  };

  const isFieldValidating = (fieldName: string) => {
    return !!fields.value[fieldName]?.validating;
  };

  return {
    data,
    fields,
    errors,
    isSubmitting,
    isValid,
    hasErrors,
    validate,
    validateField,
    setFieldRule,
    setFieldValue,
    setFieldError,
    clearFieldError,
    touchField,
    getFieldValue,
    getFieldError,
    isFieldTouched,
    isFieldValid,
    isFieldValidating,
    reset,
    resetField,
  };
}

// ========================================
// ФАБРИКА ПРАВИЛ ВАЛИДАЦИИ
// ========================================

export const createValidationRules = () => {
  return {
    required: (message?: string): ValidationRule => ({
      required: true,
      custom: (value: any) => {
        if (!value || (typeof value === "string" && value.trim() === "")) {
          return message || "Поле обязательно для заполнения";
        }
        return true;
      },
    }),

    minLength: (min: number, message?: string): ValidationRule => ({
      minLength: min,
      custom: (value: any) => {
        if (value && value.length < min) {
          return message || `Минимум ${min} символов`;
        }
        return true;
      },
    }),

    maxLength: (max: number, message?: string): ValidationRule => ({
      maxLength: max,
      custom: (value: any) => {
        if (value && value.length > max) {
          return message || `Максимум ${max} символов`;
        }
        return true;
      },
    }),

    email: (message?: string): ValidationRule => ({
      email: true,
      custom: (value: any) => {
        if (value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            return message || "Неверный email адрес";
          }
        }
        return true;
      },
    }),

    pattern: (pattern: RegExp, message?: string): ValidationRule => ({
      pattern,
      custom: (value: any) => {
        if (value && !pattern.test(value)) {
          return message || "Неверный формат";
        }
        return true;
      },
    }),

    sameAs: (otherFieldValue: Ref<any>, message?: string): ValidationRule => ({
      custom: (value: any) => {
        if (value !== unref(otherFieldValue)) {
          return message || "Поля не совпадают";
        }
        return true;
      },
    }),

    async: (
      validator: (value: any) => Promise<string | null>
    ): ValidationRule => ({
      asyncCustom: validator,
    }),

    custom: (validator: (value: any) => string | null): ValidationRule => ({
      custom: (value: any) => {
        const result = validator(value);
        return result === null ? true : result;
      },
    }),

    emailUnique: (message?: string): ValidationRule => ({
      asyncCustom: async (email: string): Promise<string | null> => {
        if (!email) return null;
        try {
          const response = await $fetch<{ exists: boolean }>(
            "/api/check-email",
            {
              method: "POST",
              body: { email },
            }
          );
          return response.exists ? message || "Email уже используется" : null;
        } catch {
          return "Ошибка проверки email";
        }
      },
    }),

    usernameUnique: (message?: string): ValidationRule => ({
      asyncCustom: async (username: string): Promise<string | null> => {
        if (!username) return null;
        try {
          const response = await $fetch<{ exists: boolean }>(
            "/api/check-username",
            {
              method: "POST",
              body: { username },
            }
          );
          return response.exists
            ? message || "Имя пользователя уже занято"
            : null;
        } catch {
          return "Ошибка проверки имени пользователя";
        }
      },
    }),

    passwordStrength: (
      level: "weak" | "medium" | "strong" = "medium"
    ): ValidationRule => ({
      custom: (password: string) => {
        if (!password) return true;

        const patterns = {
          weak: /^.{6,}$/,
          medium: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
          strong: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{12,}$/,
        };

        const messages = {
          weak: "Пароль должен содержать минимум 6 символов",
          medium:
            "Пароль должен содержать минимум 8 символов, буквы разного регистра и цифры",
          strong:
            "Пароль должен содержать минимум 12 символов, буквы разного регистра, цифры и спецсимволы",
        };

        return patterns[level].test(password) ? true : messages[level];
      },
    }),

    numeric: (): ValidationRule => ({ numeric: true }),
    min: (min: number): ValidationRule => ({ min }),
    max: (max: number): ValidationRule => ({ max }),
  };
};
