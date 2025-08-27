// middleware/trainer.ts
import { useAuth } from "~/composables/useAuth";
export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated, isTrainer } = useAuth();

  if (!isAuthenticated.value) {
    return navigateTo("/auth/login");
  }

  if (!isTrainer.value) {
    throw createError({
      statusCode: 403,
      statusMessage: "Доступ только для тренеров",
    });
  }
});
