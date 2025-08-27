// composables/useScheduleCalendar.ts
import type { ScheduleItem } from "~/types";
import type { ScheduleResponse, UserWorkoutsResponse } from "~/types/api";

export const useScheduleCalendar = () => {
  // Reactive state (используем обычные Date вместо CalendarDate)
  const selectedDate = ref<Date>(new Date());
  const currentView = ref<"month" | "week" | "day">("month");
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Calendar data
  const scheduleItems = ref<ScheduleItem[]>([]);
  const filteredItems = ref<ScheduleItem[]>([]);
  const activeFilters = ref<string[]>([]);

  // Добавляем недостающее свойство
  const activeQuickFilters = ref<string[]>([]);

  // Date utilities
  const formatDate = (
    date: Date | string,
    options?: Intl.DateTimeFormatOptions
  ): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      ...options,
    });
  };

  const formatTime = (date: Date | string): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTimeRange = (
    start: Date | string,
    end: Date | string
  ): string => {
    return `${formatTime(start)} - ${formatTime(end)}`;
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  // Calendar navigation
  const navigateToDate = (date: Date) => {
    selectedDate.value = new Date(date);
  };

  const goToToday = () => {
    selectedDate.value = new Date();
  };

  const navigatePrevious = () => {
    const newDate = new Date(selectedDate.value);
    switch (currentView.value) {
      case "month":
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case "week":
        newDate.setDate(newDate.getDate() - 7);
        break;
      case "day":
        newDate.setDate(newDate.getDate() - 1);
        break;
    }
    selectedDate.value = newDate;
  };

  const navigateNext = () => {
    const newDate = new Date(selectedDate.value);
    switch (currentView.value) {
      case "month":
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case "week":
        newDate.setDate(newDate.getDate() + 7);
        break;
      case "day":
        newDate.setDate(newDate.getDate() + 1);
        break;
    }
    selectedDate.value = newDate;
  };

  const changeView = (view: "month" | "week" | "day") => {
    currentView.value = view;
  };

  // Data filtering
  const getEventsForDay = (date: Date): ScheduleItem[] => {
    const dayStr = date.toISOString().split("T")[0];

    return filteredItems.value.filter((item) => {
      const itemDate = new Date(item.startTime).toISOString().split("T")[0];
      return itemDate === dayStr;
    });
  };

  const getEventsForDateRange = (
    startDate: Date,
    endDate: Date
  ): ScheduleItem[] => {
    return filteredItems.value.filter((item) => {
      const itemDate = new Date(item.startTime);
      return itemDate >= startDate && itemDate <= endDate;
    });
  };

  const filterEvents = (filters: string[]) => {
    activeFilters.value = filters;
    activeQuickFilters.value = filters; // Синхронизируем оба массива

    if (filters.length === 0) {
      filteredItems.value = scheduleItems.value;
      return;
    }

    filteredItems.value = scheduleItems.value.filter((item) => {
      return filters.some((filter) => {
        switch (filter) {
          case "available":
            return (
              item.currentParticipants < item.maxParticipants &&
              item.status === "scheduled"
            );
          case "full":
            return item.currentParticipants >= item.maxParticipants;
          case "in-progress":
            return item.status === "in_progress";
          case "completed":
            return item.status === "completed";
          case "cancelled":
            return item.status === "cancelled";
          case "today":
            const itemDate = new Date(item.startTime);
            const today = new Date();
            return itemDate.toDateString() === today.toDateString();
          case "this-week":
            const weekStart = getWeekStart(new Date());
            const weekEnd = getWeekEnd(new Date());
            const eventDate = new Date(item.startTime);
            return eventDate >= weekStart && eventDate <= weekEnd;
          default:
            return true;
        }
      });
    });
  };

  // Event management
  const bookEvent = async (eventId: number): Promise<boolean> => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await $fetch(`/api/schedule/${eventId}/book`, {
        method: "POST",
      });

      // Обновляем локальные данные
      const eventIndex = scheduleItems.value.findIndex(
        (item) => item.id === eventId
      );
      if (eventIndex !== -1) {
        scheduleItems.value[eventIndex] = {
          ...scheduleItems.value[eventIndex],
          currentParticipants:
            scheduleItems.value[eventIndex].currentParticipants + 1,
        };
      }

      // Обновляем фильтрованные данные
      filterEvents(activeFilters.value);

      // Показываем уведомление
      const toast = useToast();
      toast.add({
        title: "Успешно!",
        description: "Вы записались на тренировку",
        color: "green",
        icon: "i-heroicons-check-circle",
      });

      return true;
    } catch (err: any) {
      error.value = err.message || "Ошибка при записи на тренировку";

      const toast = useToast();
      toast.add({
        title: "Ошибка",
        description: error.value,
        color: "red",
        icon: "i-heroicons-x-circle",
      });

      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const cancelBooking = async (eventId: number): Promise<boolean> => {
    try {
      isLoading.value = true;
      error.value = null;

      await $fetch(`/api/schedule/${eventId}/cancel`, {
        method: "POST",
      });

      // Обновляем локальные данные
      const eventIndex = scheduleItems.value.findIndex(
        (item) => item.id === eventId
      );
      if (eventIndex !== -1) {
        scheduleItems.value[eventIndex] = {
          ...scheduleItems.value[eventIndex],
          currentParticipants: Math.max(
            0,
            scheduleItems.value[eventIndex].currentParticipants - 1
          ),
        };
      }

      // Обновляем фильтрованные данные
      filterEvents(activeFilters.value);

      const toast = useToast();
      toast.add({
        title: "Отменено",
        description: "Запись на тренировку отменена",
        color: "yellow",
        icon: "i-heroicons-exclamation-triangle",
      });

      return true;
    } catch (err: any) {
      error.value = err.message || "Ошибка при отмене записи";

      const toast = useToast();
      toast.add({
        title: "Ошибка",
        description: error.value,
        color: "red",
        icon: "i-heroicons-x-circle",
      });

      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // Data loading
  const loadScheduleData = async (startDate?: Date, endDate?: Date) => {
    try {
      isLoading.value = true;
      error.value = null;

      const params: any = {};
      if (startDate) {
        params.startDate = startDate.toISOString();
      }
      if (endDate) {
        params.endDate = endDate.toISOString();
      }

      const response = await $fetch<ScheduleResponse>("/api/schedule", {
        params,
      });

      // Поддерживаем разные форматы ответа API
      const data = response.data || (response as any);

      scheduleItems.value = Array.isArray(data) ? data : [];
      filteredItems.value = Array.isArray(data) ? data : [];
    } catch (err: any) {
      error.value = err.message || "Ошибка загрузки данных";
      console.error("Failed to load schedule data:", err);
    } finally {
      isLoading.value = false;
    }
  };

  const loadUserWorkouts = async (
    userId: number,
    startDate?: Date,
    endDate?: Date
  ) => {
    try {
      isLoading.value = true;
      error.value = null;

      const params: any = { userId };
      if (startDate) {
        params.startDate = startDate.toISOString();
      }
      if (endDate) {
        params.endDate = endDate.toISOString();
      }

      const response = await $fetch<UserWorkoutsResponse>(
        "/api/users/workouts",
        { params }
      );

      // Поддерживаем разные форматы ответа API
      const data = response.data || (response as any);

      scheduleItems.value = Array.isArray(data) ? data : [];
      filteredItems.value = Array.isArray(data) ? data : [];
    } catch (err: any) {
      error.value = err.message || "Ошибка загрузки тренировок пользователя";
      console.error("Failed to load user workouts:", err);
    } finally {
      isLoading.value = false;
    }
  };

  // Utility functions
  const getWeekStart = (date: Date): Date => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Понедельник как начало недели
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    return start;
  };

  const getWeekEnd = (date: Date): Date => {
    const end = new Date(date);
    const day = end.getDay();
    const diff = end.getDate() + (day === 0 ? 0 : 7 - day);
    end.setDate(diff);
    end.setHours(23, 59, 59, 999);
    return end;
  };

  const canBookEvent = (event: ScheduleItem): boolean => {
    return (
      event.currentParticipants < event.maxParticipants &&
      event.status === "scheduled" &&
      new Date(event.startTime) > new Date()
    );
  };

  const canCancelBooking = (event: ScheduleItem): boolean => {
    // Можно отменить за 2 часа до начала
    const eventStart = new Date(event.startTime);
    const now = new Date();
    const hoursUntilEvent =
      (eventStart.getTime() - now.getTime()) / (1000 * 60 * 60);

    return (
      hoursUntilEvent > 2 &&
      (event.status === "scheduled" || event.status === "in_progress")
    );
  };

  const getEventStatusColor = (event: ScheduleItem): string => {
    if (canBookEvent(event)) return "green";
    if (event.status === "in_progress") return "blue";
    if (event.status === "cancelled") return "red";
    if (event.status === "completed") return "gray";
    if (event.currentParticipants >= event.maxParticipants) return "orange";
    return "gray";
  };

  const getEventProgressPercentage = (event: ScheduleItem): number => {
    return Math.round(
      (event.currentParticipants / event.maxParticipants) * 100
    );
  };

  // Проверяем, записан ли пользователь на событие
  const isUserBookedForEvent = (
    event: ScheduleItem,
    userId?: number
  ): boolean => {
    // Эта логика должна быть реализована на бэкенде
    // Здесь просто пример, как это может выглядеть
    return false; // Заглушка, нужно получать данные с сервера
  };

  // Watchers
  watch(
    selectedDate,
    () => {
      // Автоматически загружаем данные при изменении выбранной даты
      const startDate = new Date(selectedDate.value);
      startDate.setDate(startDate.getDate() - 15);
      const endDate = new Date(selectedDate.value);
      endDate.setDate(endDate.getDate() + 15);
      loadScheduleData(startDate, endDate);
    },
    { immediate: true }
  );

  // Computed properties
  const headerTitle = computed(() => {
    const date = selectedDate.value;
    switch (currentView.value) {
      case "month":
        return date.toLocaleDateString("ru-RU", {
          year: "numeric",
          month: "long",
        });
      case "week":
        const weekStart = getWeekStart(date);
        const weekEnd = getWeekEnd(date);
        return `${formatDate(weekStart, {
          day: "numeric",
          month: "short",
        })} - ${formatDate(weekEnd, { day: "numeric", month: "short" })}`;
      case "day":
        return formatDate(date, {
          weekday: "long",
          day: "numeric",
          month: "long",
        });
      default:
        return "";
    }
  });

  const selectedDayEvents = computed(() => {
    return getEventsForDay(selectedDate.value);
  });

  const todayEvents = computed(() => {
    const today = new Date();
    return getEventsForDay(today);
  });

  const upcomingEvents = computed(() => {
    const now = new Date();
    return filteredItems.value
      .filter((event) => new Date(event.startTime) > now)
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      )
      .slice(0, 5);
  });

  return {
    // State
    selectedDate,
    currentView,
    isLoading,
    error,
    scheduleItems,
    filteredItems,
    activeFilters,
    activeQuickFilters, // Добавляем это свойство

    // Computed
    headerTitle,
    selectedDayEvents,
    todayEvents,
    upcomingEvents,

    // Navigation
    navigateToDate,
    goToToday,
    navigatePrevious,
    navigateNext,
    changeView,

    // Data
    loadScheduleData,
    loadUserWorkouts,
    filterEvents,
    getEventsForDay,
    getEventsForDateRange,

    // Actions
    bookEvent,
    cancelBooking,

    // Utilities
    formatDate,
    formatTime,
    formatTimeRange,
    isToday,
    isSameDay,
    canBookEvent,
    canCancelBooking,
    getEventStatusColor,
    getEventProgressPercentage,
    getWeekStart,
    getWeekEnd,
    isUserBookedForEvent,
  };
};
