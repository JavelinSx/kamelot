// composables/useSchedule.ts - Работа с расписанием
import type {
  ApiResponse,
  BookingResponse,
  PaginatedApiResponse,
} from "@/types/api";
import type { CreateBookingData, ScheduleFilter, ScheduleItem } from "~/types";

export function useSchedule(options: { autoFetch?: boolean } = {}) {
  const schedule = ref<ScheduleItem[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const filters = ref<ScheduleFilter>({});

  const fetchSchedule = async (newFilters?: ScheduleFilter) => {
    loading.value = true;
    error.value = null;

    try {
      if (newFilters) {
        filters.value = { ...filters.value, ...newFilters };
      }

      const response = await $fetch<PaginatedApiResponse<ScheduleItem>>(
        "/api/schedule",
        {
          query: filters.value,
        }
      );

      schedule.value = response.data;
    } catch (err: any) {
      error.value = err.message || "Ошибка загрузки расписания";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const bookWorkout = async (scheduleId: number, data?: CreateBookingData) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch<BookingResponse>("/api/bookings", {
        method: "POST",
        body: {
          scheduleItemId: scheduleId,
          ...data,
        },
      });

      // Обновляем расписание
      await fetchSchedule();

      return response.booking;
    } catch (err: any) {
      error.value = err.message || "Ошибка бронирования";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const cancelBooking = async (bookingId: number, reason?: string) => {
    loading.value = true;
    error.value = null;

    try {
      await $fetch<ApiResponse>(`/api/bookings/${bookingId}/cancel`, {
        method: "POST",
        body: { reason },
      });

      // Обновляем расписание
      await fetchSchedule();
    } catch (err: any) {
      error.value = err.message || "Ошибка отмены бронирования";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Фильтрация расписания
  const filteredSchedule = computed(() => {
    let filtered = schedule.value;

    if (filters.value.workoutType?.length) {
      filtered = filtered.filter((item) =>
        filters.value.workoutType!.includes(item.workout.type)
      );
    }

    if (filters.value.difficulty?.length) {
      filtered = filtered.filter((item) =>
        filters.value.difficulty!.includes(item.workout.difficulty)
      );
    }

    if (filters.value.trainerId?.length) {
      filtered = filtered.filter((item) =>
        filters.value.trainerId!.includes(item.trainer.id)
      );
    }

    if (filters.value.availableOnly) {
      filtered = filtered.filter(
        (item) =>
          item.currentParticipants < item.maxParticipants &&
          item.status === "scheduled"
      );
    }

    return filtered;
  });

  // Автозагрузка при инициализации
  if (options.autoFetch) {
    onMounted(() => {
      fetchSchedule();
    });
  }

  return {
    schedule: readonly(schedule),
    filteredSchedule,
    loading: readonly(loading),
    error: readonly(error),
    filters,
    fetchSchedule,
    bookWorkout,
    cancelBooking,
  };
}
