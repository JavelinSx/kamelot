// composables/useTrainers.ts - Работа с тренерами
import type { PaginatedApiResponse, TrainerResponse } from "@/types/api";
import type { Trainer, TrainerFilter } from "~/types";

export function useTrainers(options: { autoFetch?: boolean } = {}) {
  const trainers = ref<Trainer[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const filters = ref<TrainerFilter>({});
  const pagination = ref({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const fetchTrainers = async (
    newFilters?: TrainerFilter,
    page: number = 1
  ) => {
    loading.value = true;
    error.value = null;

    try {
      if (newFilters) {
        filters.value = { ...filters.value, ...newFilters };
      }

      const response = await $fetch<PaginatedApiResponse<Trainer>>(
        "/api/trainers",
        {
          query: {
            ...filters.value,
            page,
            limit: pagination.value.limit,
          },
        }
      );

      if (page === 1) {
        trainers.value = response.data;
      } else {
        trainers.value.push(...response.data);
      }

      pagination.value = {
        page: response.meta.page,
        limit: response.meta.limit,
        total: response.meta.total,
        totalPages: response.meta.totalPages,
      };
    } catch (err: any) {
      error.value = err.message || "Ошибка загрузки тренеров";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getTrainer = async (id: number): Promise<Trainer> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch<TrainerResponse>(`/api/trainers/${id}`);
      return response.data;
    } catch (err: any) {
      error.value = err.message || "Ошибка загрузки тренера";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const searchTrainers = useDebounceFn(async (query: string) => {
    await fetchTrainers({ ...filters.value, search: query });
  }, 300);

  // Фильтрация тренеров
  const filteredTrainers = computed(() => {
    let filtered = trainers.value;

    if (filters.value.specialization?.length) {
      filtered = filtered.filter((trainer) =>
        trainer.specialization.some((spec) =>
          filters.value.specialization!.includes(spec)
        )
      );
    }

    if (filters.value.experience?.min !== undefined) {
      filtered = filtered.filter(
        (trainer) => trainer.experience >= filters.value.experience!.min!
      );
    }

    if (filters.value.experience?.max !== undefined) {
      filtered = filtered.filter(
        (trainer) => trainer.experience <= filters.value.experience!.max!
      );
    }

    if (filters.value.rating?.min !== undefined) {
      filtered = filtered.filter(
        (trainer) => trainer.rating >= filters.value.rating!.min!
      );
    }

    if (filters.value.isActive !== undefined) {
      filtered = filtered.filter(
        (trainer) => trainer.isActive === filters.value.isActive
      );
    }

    return filtered;
  });

  // Загрузка дополнительных тренеров
  const loadMore = async () => {
    if (pagination.value.page < pagination.value.totalPages) {
      await fetchTrainers(undefined, pagination.value.page + 1);
    }
  };

  const canLoadMore = computed(
    () => pagination.value.page < pagination.value.totalPages
  );

  if (options.autoFetch) {
    onMounted(() => {
      fetchTrainers();
    });
  }

  return {
    trainers: readonly(trainers),
    filteredTrainers,
    loading: readonly(loading),
    error: readonly(error),
    filters,
    pagination: readonly(pagination),
    fetchTrainers,
    getTrainer,
    searchTrainers,
    loadMore,
    canLoadMore,
  };
}
