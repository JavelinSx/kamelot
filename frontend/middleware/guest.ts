// middleware/guest.ts
import { useAuth } from "~/composables/useAuth";
export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuth();

  // Если пользователь уже авторизован и пытается попасть на страницы аутентификации
  if (isAuthenticated.value) {
    return navigateTo("/");
  }
});
