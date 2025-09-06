// stores/auth.ts
import type { LoginCredentials, RegisterData, User } from "@/types";
import { defineStore } from "pinia";

// Типизированная версия useCookie для токена
const useAuthToken = () => {
  return useCookie<string | null>("auth-token", {
    default: () => null,
    maxAge: 60 * 60 * 24 * 7, // 7 дней
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};

export const useAuthStore = defineStore("auth", () => {
  // State
  const user = ref<User | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  // Getters
  const isAuthenticated = computed<boolean>(() => !!user.value);
  const isTrainer = computed<boolean>(() => user.value?.role === "trainer");

  // Actions
  const login = async (
    credentials: LoginCredentials
  ): Promise<AuthResponse> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: credentials,
      });

      user.value = response.user;

      // Сохраняем токен в cookie
      const token = useAuthToken();
      token.value = response.tokens.accessToken;

      return response;
    } catch (err: any) {
      const errorMessage = err.data?.message || err.message || "Ошибка входа";
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const register = async (data: RegisterData): Promise<AuthResponse> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: data,
      });

      user.value = response.user;

      const token = useAuthToken();
      token.value = response.tokens.accessToken;

      return response;
    } catch (err: any) {
      const errorMessage =
        err.data?.message || err.message || "Ошибка регистрации";
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const logout = async (): Promise<void> => {
    loading.value = true;

    try {
      await $fetch<void>("/api/auth/logout", {
        method: "POST",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      user.value = null;
      const token = useAuthToken();
      token.value = null;
      loading.value = false;

      // Перенаправление на главную страницу
      await navigateTo("/");
    }
  };

  const fetchUser = async (): Promise<User | null> => {
    const token = useAuthToken();
    if (!token.value) return null;

    loading.value = true;

    try {
      const response = await $fetch<ApiResponse<User>>("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      user.value = response.data;
      return response.data;
    } catch (err) {
      console.error("Fetch user error:", err);
      // Токен невалидный, удаляем его
      token.value = null;
      user.value = null;
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<User> => {
    loading.value = true;
    error.value = null;

    try {
      const token = useAuthToken();

      if (!token.value) {
        throw new Error("Токен не найден");
      }

      const response = await $fetch<ApiResponse<User>>("/api/auth/profile", {
        method: "PATCH",
        body: data,
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      user.value = response.data;
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.data?.message || err.message || "Ошибка обновления профиля";
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const clearError = (): void => {
    error.value = null;
  };

  // Инициализация пользователя при монтировании приложения
  const initAuth = async (): Promise<void> => {
    const token = useAuthToken();
    if (token.value && !user.value) {
      await fetchUser();
    }
  };

  return {
    // State - возвращаем ref'ы напрямую, Pinia автоматически их обработает
    user,
    loading,
    error,

    // Getters - возвращаем computed'ы напрямую
    isAuthenticated,
    isTrainer,

    // Actions
    login,
    register,
    logout,
    fetchUser,
    updateProfile,
    clearError,
    initAuth,
  };
});

// Альтернативная типизация, если нужны строгие типы для использования store
export type AuthStore = ReturnType<typeof useAuthStore>;
