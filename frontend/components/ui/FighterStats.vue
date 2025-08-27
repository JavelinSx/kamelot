<!-- components/ui/FighterStats.vue -->
<template>
  <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
    <h3 class="text-white font-bold text-lg mb-4 flex items-center">
      <span class="text-red-400 mr-2">📊</span>
      Статистика бойца
    </h3>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <!-- Общие тренировки -->
      <div class="bg-gray-800 rounded-lg p-4 text-center hover:bg-gray-750 transition-colors">
        <div class="text-2xl font-bold text-red-400">{{ stats.totalWorkouts }}</div>
        <div class="text-xs text-gray-400 mt-1">Тренировок</div>
      </div>

      <!-- Часы тренировок -->
      <div class="bg-gray-800 rounded-lg p-4 text-center hover:bg-gray-750 transition-colors">
        <div class="text-2xl font-bold text-red-400">{{ stats.totalHours }}</div>
        <div class="text-xs text-gray-400 mt-1">Часов</div>
      </div>

      <!-- Текущая серия -->
      <div class="bg-gray-800 rounded-lg p-4 text-center hover:bg-gray-750 transition-colors">
        <div class="text-2xl font-bold text-yellow-400">{{ stats.currentStreak }}</div>
        <div class="text-xs text-gray-400 mt-1">Серия дней</div>
      </div>

      <!-- Процент посещений -->
      <div class="bg-gray-800 rounded-lg p-4 text-center hover:bg-gray-750 transition-colors">
        <div class="text-2xl font-bold text-green-400">{{ stats.completionRate }}%</div>
        <div class="text-xs text-gray-400 mt-1">Посещений</div>
      </div>
    </div>

    <!-- Любимое единоборство -->
    <div v-if="stats.favoriteWorkoutType" class="mt-6 p-4 bg-gray-800 rounded-lg">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-gray-400 text-sm">Любимое единоборство</p>
          <p class="text-white font-semibold">{{ getWorkoutTypeLabel(stats.favoriteWorkoutType) }}</p>
        </div>
        <div class="text-3xl">
          {{ getCategoryIcon(stats.favoriteWorkoutType) }}
        </div>
      </div>
    </div>

    <!-- Прогресс по категориям -->
    <div class="mt-6">
      <h4 class="text-white font-medium mb-3">Прогресс по категориям</h4>
      <div class="space-y-3">
        <div v-for="category in categoryKeys" :key="category" class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="text-lg">{{ getCategoryData(category)?.icon }}</span>
            <span class="text-gray-300 text-sm">{{ getCategoryData(category)?.label }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-16 bg-gray-700 rounded-full h-2">
              <div class="bg-red-600 h-2 rounded-full transition-all duration-500"
                :style="{ width: `${getCategoryProgress(category)}%` }"></div>
            </div>
            <span class="text-gray-400 text-xs w-8">{{ getCategoryProgress(category) }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserStats, WorkoutType } from '@/types';
import { WORKOUT_TYPES } from '@/types';
import {
  MARTIAL_ARTS_CATEGORIES,
  getMartialArtsCategory
} from '@/types/martial-arts';

interface Props {
  stats: UserStats
  categoryProgress?: Record<string, number>
}

const props = defineProps<Props>()

type CategoryKey = keyof typeof MARTIAL_ARTS_CATEGORIES

const categoryKeys = Object.keys(MARTIAL_ARTS_CATEGORIES) as CategoryKey[]

const getCategoryData = (category: string) => {
  return MARTIAL_ARTS_CATEGORIES[category as CategoryKey]
}

const getCategoryIcon = (type: WorkoutType): string => {
  const category = getMartialArtsCategory(type)
  return MARTIAL_ARTS_CATEGORIES[category].icon
}

const getCategoryProgress = (category: string): number => {
  return props.categoryProgress?.[category] || 0
}

const getWorkoutTypeLabel = (type: WorkoutType): string => {
  return WORKOUT_TYPES[type] || type
}

// Computed для форматирования статистики
const formattedStats = computed(() => ({
  totalWorkouts: props.stats.totalWorkouts?.toLocaleString() || '0',
  totalHours: props.stats.totalHours?.toFixed(1) || '0.0',
  currentStreak: props.stats.currentStreak?.toString() || '0',
  completionRate: props.stats.completionRate?.toFixed(0) || '0'
}))
</script>

<style scoped>
/* Дополнительные стили для hover эффектов */
.hover\:bg-gray-750:hover {
  background-color: #374151;
}

/* Анимация для прогресс-баров */
.bg-red-600 {
  transition: width 0.5s ease-in-out;
}

/* Адаптивная сетка для мобильных */
@media (max-width: 640px) {
  .grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 768px) {
  .md\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>