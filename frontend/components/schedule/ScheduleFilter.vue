<!-- components/schedule/ScheduleFilter.vue -->
<template>
  <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-white font-bold text-lg">Фильтры расписания</h3>
      <UButton @click="resetFilters" variant="ghost" size="sm" class="text-gray-400 hover:text-white">
        Сбросить
      </UButton>
    </div>

    <!-- Date Filter -->
    <div>
      <label class="block text-sm font-medium text-gray-300 mb-3">
        Дата
      </label>
      <div class="grid grid-cols-2 gap-3">
        <AppInput v-model="filters.dateFrom" type="date" label="С" size="sm" />
        <AppInput v-model="filters.dateTo" type="date" label="По" size="sm" />
      </div>
    </div>

    <!-- Workout Type Filter -->
    <div>
      <label class="block text-sm font-medium text-gray-300 mb-3">
        Тип единоборства
      </label>
      <div class="space-y-2 max-h-48 overflow-y-auto scrollbar-custom">
        <label v-for="(name, type) in WORKOUT_TYPES" :key="type"
          class="flex items-center space-x-3 cursor-pointer group">
          <input v-model="filters.workoutTypes" :value="type" type="checkbox" class="form-checkbox">
          <div class="flex items-center space-x-2">
            <span class="text-lg">{{ getMartialArtIcon(type) }}</span>
            <span class="text-gray-300 group-hover:text-white transition-colors text-sm">
              {{ name }}
            </span>
          </div>
        </label>
      </div>
    </div>

    <!-- Trainer Filter -->
    <div>
      <label class="block text-sm font-medium text-gray-300 mb-3">
        Тренер
      </label>
      <AppSelect v-model="filters.trainerId" :options="trainerOptions" placeholder="Выберите тренера" size="sm" />
    </div>

    <!-- Difficulty Filter -->
    <div>
      <label class="block text-sm font-medium text-gray-300 mb-3">
        Сложность
      </label>
      <div class="space-y-2">
        <label v-for="difficulty in difficultyOptions" :key="difficulty.value"
          class="flex items-center space-x-3 cursor-pointer">
          <input v-model="filters.difficulties" :value="difficulty.value" type="checkbox" class="form-checkbox">
          <UBadge :color="getDifficultyColor(difficulty.value)" size="sm" variant="soft">
            {{ difficulty.label }}
          </UBadge>
        </label>
      </div>
    </div>

    <!-- Time Filter -->
    <div>
      <label class="block text-sm font-medium text-gray-300 mb-3">
        Время тренировки
      </label>
      <div class="grid grid-cols-2 gap-3">
        <AppInput v-model="filters.timeStart" type="time" label="С" size="sm" />
        <AppInput v-model="filters.timeEnd" type="time" label="По" size="sm" />
      </div>
    </div>

    <!-- Availability Filter -->
    <div>
      <label class="flex items-center space-x-3 cursor-pointer">
        <input v-model="filters.availableOnly" type="checkbox" class="form-checkbox">
        <span class="text-gray-300 text-sm">Только доступные для записи</span>
      </label>
    </div>

    <!-- Status Filter -->
    <div>
      <label class="block text-sm font-medium text-gray-300 mb-3">
        Статус
      </label>
      <div class="space-y-2">
        <label v-for="status in statusOptions" :key="status.value" class="flex items-center space-x-3 cursor-pointer">
          <input v-model="filters.statuses" :value="status.value" type="checkbox" class="form-checkbox">
          <UBadge :color="getStatusColor(status.value)" size="sm" variant="soft">
            {{ status.label }}
          </UBadge>
        </label>
      </div>
    </div>

    <!-- Apply Button -->
    <div class="pt-4 border-t border-gray-800">
      <UButton @click="applyFilters" color="red" size="sm" class="w-full">
        Применить фильтры
      </UButton>

      <div class="mt-3 text-center">
        <span class="text-gray-400 text-sm">
          Найдено: {{ resultsCount }} тренировок
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DifficultyType, ScheduleFilter, StatusType, Trainer, WORKOUT_TYPES, WorkoutType } from '@/types';
import { MARTIAL_ARTS_CATEGORIES, getMartialArtsCategory } from '@/types/martial-arts';

interface Props {
  trainers: Trainer[]
  resultsCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  resultsCount: 0
})

const emit = defineEmits<{
  filtersChange: [filters: ScheduleFilter]
  reset: []
}>()

const filters = reactive({
  dateFrom: '',
  dateTo: '',
  workoutTypes: [] as string[],
  trainerId: '',
  difficulties: [] as string[],
  timeStart: '',
  timeEnd: '',
  availableOnly: false,
  statuses: [] as string[]
})

const trainerOptions = computed(() => [
  { label: 'Все тренеры', value: '' },
  ...props.trainers.map(trainer => ({
    label: `${trainer.user.firstName} ${trainer.user.lastName}`,
    value: trainer.id.toString()
  }))
])

// ИСПРАВЛЕНО: Используем правильные значения согласно DifficultyType
const difficultyOptions = [
  { value: 'beginner', label: 'Начальный' },
  { value: 'intermediate', label: 'Средний' },
  { value: 'advanced', label: 'Продвинутый' }
]

const statusOptions = [
  { value: 'scheduled', label: 'Запланировано' },
  { value: 'in_progress', label: 'В процессе' },
  { value: 'completed', label: 'Завершено' },
  { value: 'cancelled', label: 'Отменено' }
]

const getMartialArtIcon = (type: string) => {
  const category = getMartialArtsCategory(type as WorkoutType)
  return MARTIAL_ARTS_CATEGORIES[category].icon
}

// ИСПРАВЛЕНО: Обновлены ключи согласно DifficultyType
const getDifficultyColor = (difficulty: string) => {
  const colors = {
    easy: 'green',
    medium: 'yellow',
    hard: 'red'
  } as const;

  return colors[difficulty as DifficultyType] || 'gray';
}

const getStatusColor = (status: string) => {
  const colors = {
    scheduled: 'blue',
    in_progress: 'yellow',
    completed: 'green',
    cancelled: 'red'
  } as const;

  return colors[status as StatusType] || 'gray';
}

const resetFilters = () => {
  Object.assign(filters, {
    dateFrom: '',
    dateTo: '',
    workoutTypes: [],
    trainerId: '',
    difficulties: [],
    timeStart: '',
    timeEnd: '',
    availableOnly: false,
    statuses: []
  })
  emit('reset')
}

const applyFilters = () => {
  const filterData: ScheduleFilter = {
    dateRange: filters.dateFrom && filters.dateTo ? {
      start: filters.dateFrom,
      end: filters.dateTo
    } : undefined,
    workoutType: filters.workoutTypes as WorkoutType[],
    trainer: filters.trainerId ? [Number(filters.trainerId)] : undefined,
    difficulty: filters.difficulties as DifficultyType[],
    time: filters.timeStart && filters.timeEnd ? {
      start: filters.timeStart,
      end: filters.timeEnd
    } : undefined,
    availableOnly: filters.availableOnly,
    status: filters.statuses as StatusType[]
  }

  emit('filtersChange', filterData)
}

// Auto-apply filters on change
watch(filters, () => {
  applyFilters()
}, { deep: true })
</script>