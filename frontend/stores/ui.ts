// stores/ui.ts
import { defineStore } from "pinia";

export const useUIStore = defineStore("ui", () => {
  // State
  const sidebar = ref({
    collapsed: false,
    visible: true,
  });

  const modals = ref<Record<string, { isOpen: boolean; data?: any }>>({});

  const notifications = ref<
    Array<{
      id: string;
      type: "success" | "error" | "warning" | "info";
      title: string;
      message?: string;
      timeout?: number;
    }>
  >([]);

  const notificationTimers = new Map<string, NodeJS.Timeout>();

  const loading = ref({
    global: false,
    actions: {} as Record<string, boolean>,
  });

  const theme = ref<"light" | "dark" | "auto">("dark");

  // Actions
  const setSidebarCollapsed = (collapsed: boolean) => {
    sidebar.value.collapsed = collapsed;

    // Сохраняем в localStorage
    if (import.meta.client) {
      localStorage.setItem("sidebar-collapsed", String(collapsed));
    }
  };

  const setSidebarVisible = (visible: boolean) => {
    sidebar.value.visible = visible;
  };

  const openModal = (modalId: string, data?: any) => {
    modals.value[modalId] = { isOpen: true, data };
  };

  const closeModal = (modalId: string) => {
    if (modals.value[modalId]) {
      modals.value[modalId].isOpen = false;
    }
  };

  const addNotification = (notification: {
    type: "success" | "error" | "warning" | "info";
    title: string;
    message?: string;
    timeout?: number;
  }) => {
    const id = Date.now().toString();

    const newNotification = {
      id,
      ...notification,
      timeout: notification.timeout || 5000,
    };

    notifications.value.push(newNotification);

    // Автоматически удаляем уведомление через timeout
    const timer = setTimeout(() => {
      removeNotification(id);
    }, newNotification.timeout);

    notificationTimers.set(id, timer);
    return id;
  };

  const removeNotification = (id: string) => {
    // Очищаем таймер
    const timer = notificationTimers.get(id);
    if (timer) {
      clearTimeout(timer);
      notificationTimers.delete(id);
    }

    const index = notifications.value.findIndex((n) => n.id === id);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  };

  // ИСПРАВЛЕНО: переименовал параметр, чтобы избежать конфликта
  const setGlobalLoading = (isLoading: boolean) => {
    loading.value.global = isLoading;
  };

  const setActionLoading = (action: string, isLoading: boolean) => {
    loading.value.actions[action] = isLoading;
  };

  const setTheme = (newTheme: "light" | "dark" | "auto") => {
    theme.value = newTheme;

    if (import.meta.client) {
      localStorage.setItem("theme", newTheme);
      updateTheme();
    }
  };

  const updateTheme = () => {
    if (!import.meta.client) return;

    const html = document.documentElement;

    if (theme.value === "auto") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      html.classList.toggle("dark", prefersDark);
    } else {
      html.classList.toggle("dark", theme.value === "dark");
    }
  };

  const initializeTheme = () => {
    if (!import.meta.client) return;

    const savedTheme = localStorage.getItem("theme") as
      | "light"
      | "dark"
      | "auto"
      | null;
    if (savedTheme) {
      theme.value = savedTheme;
    }

    updateTheme();
  };

  const initializeSidebar = () => {
    if (!import.meta.client) return;

    const savedCollapsed = localStorage.getItem("sidebar-collapsed");
    if (savedCollapsed) {
      sidebar.value.collapsed = savedCollapsed === "true";
    }
  };

  // Initialize on store creation
  if (import.meta.client) {
    initializeTheme();
    initializeSidebar();
  }

  return {
    // State
    sidebar: readonly(sidebar),
    modals: readonly(modals),
    notifications: readonly(notifications),
    loading: readonly(loading),
    theme: readonly(theme),

    // Actions
    setSidebarCollapsed,
    setSidebarVisible,
    openModal,
    closeModal,
    addNotification,
    removeNotification,
    setGlobalLoading,
    setActionLoading,
    setTheme,
    updateTheme,
    initializeTheme,
    initializeSidebar,
  };
});
