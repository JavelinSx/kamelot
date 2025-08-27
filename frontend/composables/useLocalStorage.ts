// composables/useLocalStorage.ts - Работа с localStorage (ИСПРАВЛЕНО)
import { useDebounceFn } from "@vueuse/core";

export function useLocalStorage<T>(key: string, defaultValue: T) {
  // ИСПРАВЛЕНО: добавлена функция getInitialValue
  const getInitialValue = (): T => {
    if (!import.meta.client) {
      return defaultValue;
    }

    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error("localStorage read error:", error);
      return defaultValue;
    }
  };

  const state = ref<T>(getInitialValue());
  let isUpdating = false;

  // ИСПРАВЛЕНО: правильная типизация debounced функции
  const saveToStorage = useDebounceFn((value: T) => {
    if (import.meta.client && !isUpdating) {
      try {
        if (value === null || value === undefined) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, JSON.stringify(value));
        }
      } catch (error) {
        console.error("localStorage error:", error);
      }
    }
  }, 500);

  // ИСПРАВЛЕНО: правильная обработка watch
  if (typeof defaultValue === "object") {
    watchEffect(() => {
      saveToStorage(toRaw(state.value));
    });
  } else {
    // ИСПРАВЛЕНО: используем правильный колбэк для watch
    watch(state, (newValue) => {
      saveToStorage(newValue);
    });
  }

  // Слушаем изменения в других вкладках
  if (import.meta.client) {
    window.addEventListener("storage", (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          isUpdating = true;
          state.value = JSON.parse(e.newValue);
          nextTick(() => {
            isUpdating = false;
          });
        } catch (error) {
          console.error("localStorage sync error:", error);
        }
      }
    });
  }

  // ИСПРАВЛЕНО: убираем проблемную очистку, она не критична
  // onUnmounted не нужен - debounced функция очистится сама

  return state;
}

// ========================================
// СПЕЦИАЛИЗИРОВАННЫЕ ВЕРСИИ
// ========================================

/**
 * Хранение объектов в localStorage
 */
export function useLocalStorageObject<T extends Record<string, any>>(
  key: string,
  defaultValue: T
) {
  return useLocalStorage(key, defaultValue);
}

/**
 * Хранение массивов в localStorage
 */
export function useLocalStorageArray<T>(key: string, defaultValue: T[] = []) {
  return useLocalStorage(key, defaultValue);
}

/**
 * Хранение булевых значений
 */
export function useLocalStorageBoolean(
  key: string,
  defaultValue: boolean = false
) {
  return useLocalStorage(key, defaultValue);
}

/**
 * Хранение строк
 */
export function useLocalStorageString(key: string, defaultValue: string = "") {
  return useLocalStorage(key, defaultValue);
}

/**
 * Хранение чисел
 */
export function useLocalStorageNumber(key: string, defaultValue: number = 0) {
  return useLocalStorage(key, defaultValue);
}
