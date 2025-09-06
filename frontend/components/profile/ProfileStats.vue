<!-- components/profile/ProfileStats.vue -->
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Total Workouts -->
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-red-600 transition-colors">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-gray-400 text-sm font-medium">Всего тренировок</p>
          <p class="text-3xl font-bold text-white mt-2">{{ stats.totalWorkouts }}</p>
          <div v-if="workoutChange" class="flex items-center mt-2">
            <UIcon :name="workoutChange >= 0 ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down'"
              :class="workoutChange >= 0 ? 'text-green-400' : 'text-red-400'" class="w-4 h-4 mr-1" />
            <span :class="workoutChange >= 0 ? 'text-green-400' : 'text-red-400'" class="text-sm font-medium">
              {{ Math.abs(workoutChange) }}
            </span>
            <span class="text-gray-500 text-sm ml-1">за {{ periodLabel }}</span>
          </div>
        </div>
        <div class="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
          <UIcon name="i-heroicons-bolt" class="w-6 h-6 text-white" />
        </div>
      </div>
    </div>

    <!-- Total Hours -->
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-red-600 transition-colors">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-gray-400 text-sm font-medium">Часов тренировок</p>
          <p class="text-3xl font-bold text-white mt-2">{{ stats.totalHours }}</p>
          <div v-if="averagePerWeek" class="mt-2">
            <span class="text-gray-500 text-sm">{{ averagePerWeek }}ч в неделю</span>
          </div>
        </div>
        <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
          <UIcon name="i-heroicons-clock" class="w-6 h-6 text-white" />
        </div>
      </div>
    </div>

    <!-- Current Streak -->
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-red-600 transition-colors">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-gray-400 text-sm font-medium">Текущая серия</p>
          <p class="text-3xl font-bold text-white mt-2">{{ stats.currentStreak }}</p>
          <div class="mt-2">
            <span class="text-gray-500 text-sm">
              {{ getStreakLabel(stats.currentStreak) }}
            </span>
          </div>
        </div>
        <div class="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
          <UIcon name="i-heroicons-fire" class="w-6 h-6 text-white" />
        </div>
      </div>
    </div>

    <!-- Completion Rate -->
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-red-600 transition-colors">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-gray-400 text-sm font-medium">Процент посещений</p>
          <p class="text-3xl font-bold text-white mt-2">{{ stats.completionRate }}%</p>
          <div class="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div class="bg-green-600 h-2 rounded-full transition-all duration-500"
              :style="{ width: `${stats.completionRate}%` }"></div>
          </div>
        </div>
        <div class="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
          <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  </div>

  <!-- Favorite Workout Types -->
  <div v-if="stats.favoriteWorkoutTypes && stats.favoriteWorkoutTypes.length > 0"
    class="mt-6 bg-gray-900 border border-gray-800 rounded-xl p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-white font-semibold text-lg">Любимые единоборства</h3>
      <UButton @click="handlePeriodChange" variant="outline" size="sm">
        {{ periodLabel }}
      </UButton>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="(workoutType, index) in topFavoriteTypes" :key="workoutType"
        class="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
        <div :class="getWorkoutTypeIconBackground(workoutType as WorkoutType)"
          class="w-10 h-10 rounded-lg flex items-center justify-center">
          <UIcon :name="getWorkoutTypeIcon(workoutType as WorkoutType)" class="w-5 h-5 text-white" />
        </div>
        <div class="flex-1">
          <p class="text-white font-medium text-sm">{{ getWorkoutTypeLabel(workoutType as WorkoutType) }}</p>
          <p class="text-gray-400 text-xs">{{ getFavoriteTypeStats(workoutType, index + 1) }}</p>
        </div>
        <div class="text-right">
          <span class="text-gray-500 text-xs">#{{ index + 1 }}</span>
        </div>
      </div>
    </div>

    <!-- Показать все типы, если их больше 3 -->
    <div v-if="stats.favoriteWorkoutTypes.length > 3" class="mt-4">
      <UButton variant="ghost" size="sm" @click="showAllTypes = !showAllTypes">
        {{ showAllTypes ? 'Скрыть' : `Показать ещё ${stats.favoriteWorkoutTypes.length - 3}` }}
        <UIcon :name="showAllTypes ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'" class="w-4 h-4 ml-1" />
      </UButton>

      <div v-if="showAllTypes" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <div v-for="(workoutType, index) in remainingFavoriteTypes" :key="workoutType"
          class="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
          <div :class="getWorkoutTypeIconBackground(workoutType as WorkoutType)"
            class="w-10 h-10 rounded-lg flex items-center justify-center">
            <UIcon :name="getWorkoutTypeIcon(workoutType as WorkoutType)" class="w-5 h-5 text-white" />
          </div>
          <div class="flex-1">
            <p class="text-white font-medium text-sm">{{ getWorkoutTypeLabel(workoutType as WorkoutType) }}</p>
            <p class="text-gray-400 text-xs">{{ getFavoriteTypeStats(workoutType, index + 4) }}</p>
          </div>
          <div class="text-right">
            <span class="text-gray-500 text-xs">#{{ index + 4 }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserStats, WorkoutType } from '@/types'
import {
  WORKOUT_TYPE_ICONS,
  WORKOUT_TYPE_ICON_BACKGROUNDS,
  WORKOUT_TYPE_LABELS
} from '@/types/constants'

interface Props {
  stats: UserStats
  period?: 'week' | 'month' | 'year'
  workoutChange?: number
  averagePerWeek?: number
}

const props = withDefaults(defineProps<Props>(), {
  period: 'month'
})

const emit = defineEmits<{
  periodChange: [period: string]
}>()

// Локальное состояние
const showAllTypes = ref(false)

// Computed properties
const periodLabel = computed(() => {
  const labels = {
    week: 'неделю',
    month: 'месяц',
    year: 'год'
  }
  return labels[props.period]
})

const topFavoriteTypes = computed(() => {
  return props.stats.favoriteWorkoutTypes?.slice(0, 3) || []
})

const remainingFavoriteTypes = computed(() => {
  return props.stats.favoriteWorkoutTypes?.slice(3) || []
})

// Методы
const getWorkoutTypeLabel = (type: WorkoutType): string => {
  return WORKOUT_TYPE_LABELS[type] || type
}

const getWorkoutTypeIcon = (type: WorkoutType): string => {
  return WORKOUT_TYPE_ICONS[type] || 'i-heroicons-academic-cap'
}

const getWorkoutTypeIconBackground = (type: WorkoutType): string => {
  return WORKOUT_TYPE_ICON_BACKGROUNDS[type] || 'bg-gray-600'
}

const getStreakLabel = (streak: number): string => {
  if (streak === 1) return 'день'
  if (streak >= 2 && streak <= 4) return 'дня'
  return 'дней'
}

const getFavoriteTypeStats = (workoutType: string, rank: number): string => {
  // В реальном приложении эти данные должны приходить из API
  const mockStats = {
    1: Math.round(Math.random() * 15 + 10),
    2: Math.round(Math.random() * 12 + 7),
    3: Math.round(Math.random() * 10 + 5),
  }

  const count = mockStats[rank as keyof typeof mockStats] || Math.round(Math.random() * 8 + 3)
  return `${count} тренировок за ${periodLabel.value}`
}

const handlePeriodChange = () => {
  const periods = ['week', 'month', 'year'] as const
  const currentIndex = periods.indexOf(props.period)
  const nextIndex = (currentIndex + 1) % periods.length
  emit('periodChange', periods[nextIndex])
}
</script>

<style scoped>
/* Анимация для hover эффектов */
.hover\:border-red-600:hover {
  border-color: #dc2626;
}

/* Плавная анимация для прогресс-бара */
.bg-green-600 {
  transition: width 0.5s ease-in-out;
}

/* Адаптивные стили */
@media (max-width: 640px) {
  .grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

@media (min-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .md\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .lg\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .lg\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>