import { useAuth } from "~/composables/useAuth";

// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuth();

  // Если пользователь не авторизован и пытается попасть на защищенную страницу
  if (!isAuthenticated.value) {
    return navigateTo("/auth/login");
  }
});
