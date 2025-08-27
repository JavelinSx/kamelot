// composables/useAuth.ts
import type { ApiResponse, AuthResponse } from "@/types/api";
import type {
  LoginCredentials,
  RegisterData,
  UpdateProfileData,
  User,
} from "~/types";

export const useAuth = () => {
  const user = ref<User | undefined>(undefined);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!user.value);
  const isTrainer = computed(() => user.value?.role === "trainer");

  const login = async (credentials: LoginCredentials) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: credentials,
      });

      user.value = response.user;

      // Способ 1: Явное указание типа через as
      const token = useCookie("auth-token", {
        default: () => null as string | null,
        maxAge: 60 * 60 * 24 * 7, // 7 дней
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      }) as Ref<string | null>;

      token.value = response.token;

      return response;
    } catch (err: any) {
      error.value = err.data?.message || err.message || "Ошибка входа";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const register = async (data: RegisterData) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: data,
      });

      user.value = response.user;

      const token = useCookie("auth-token", {
        default: () => null as string | null,
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      }) as Ref<string | null>;

      token.value = response.token;

      return response;
    } catch (err: any) {
      error.value = err.data?.message || err.message || "Ошибка регистрации";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    loading.value = true;

    try {
      await $fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      user.value = undefined;

      // Удаляем токен
      const token = useCookie("auth-token") as Ref<string | null>;
      token.value = null;

      loading.value = false;

      // Перенаправляем на главную
      await navigateTo("/");
    }
  };

  const fetchUser = async () => {
    const token = useCookie("auth-token") as Ref<string | null>;

    if (!token.value) {
      return null;
    }

    try {
      loading.value = true;
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
      user.value = undefined;
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    loading.value = true;
    error.value = null;

    try {
      const token = useCookie("auth-token") as Ref<string | null>;

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
      error.value =
        err.data?.message || err.message || "Ошибка обновления профиля";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const clearError = () => {
    error.value = null;
  };

  // Инициализация пользователя при создании composable
  const initAuth = async () => {
    const token = useCookie("auth-token") as Ref<string | null>;
    if (token.value) {
      await fetchUser();
    }
  };

  return {
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),
    isAuthenticated,
    isTrainer,
    login,
    register,
    logout,
    fetchUser,
    updateProfile,
    clearError,
    initAuth,
  };
};
