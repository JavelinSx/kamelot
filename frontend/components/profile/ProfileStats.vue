<!-- components/profile/ProfileStats.vue -->
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Total Workouts -->
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-red-600 transition-colors">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-gray-400 text-sm font-medium">Всего тренировок</p>
          <p class="text-3xl font-bold text-white mt-2">{{ stats.totalWorkouts }}</p>
          <div v-if="stats.workoutChange" class="flex items-center mt-2">
            <svg :class="stats.workoutChange >= 0 ? 'text-green-400' : 'text-red-400'" class="w-4 h-4 mr-1"
              fill="currentColor" viewBox="0 0 20 20">
              <path :fill-rule="stats.workoutChange >= 0 ? 'evenodd' : 'nonzero'"
                :d="stats.workoutChange >= 0 ? 'M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z' : 'M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z'"
                :clip-rule="stats.workoutChange >= 0 ? 'evenodd' : 'nonzero'" />
            </svg>
            <span :class="stats.workoutChange >= 0 ? 'text-green-400' : 'text-red-400'" class="text-sm font-medium">
              {{ Math.abs(stats.workoutChange) }}
            </span>
            <span class="text-gray-500 text-sm ml-1">за {{ periodLabel }}</span>
          </div>
        </div>
        <div class="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Total Hours -->
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-red-600 transition-colors">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-gray-400 text-sm font-medium">Часов тренировок</p>
          <p class="text-3xl font-bold text-white mt-2">{{ stats.totalHours }}</p>
          <div v-if="stats.averagePerWeek" class="mt-2">
            <span class="text-gray-500 text-sm">{{ stats.averagePerWeek }}ч в неделю</span>
          </div>
        </div>
        <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
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
              {{ stats.currentStreak === 1 ? 'день' : stats.currentStreak < 5 ? 'дня' : 'дней' }} </span>
          </div>
        </div>
        <div class="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
          </svg>
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
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </div>
  </div>

  <!-- Favorite Workout Type -->
  <div v-if="stats.favoriteWorkoutType" class="mt-6 bg-gray-900 border border-gray-800 rounded-xl p-6">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-white font-semibold text-lg mb-2">Любимое единоборство</h3>
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center text-2xl">
            {{ getCategoryIcon(stats.favoriteWorkoutType) }}
          </div>
          <div>
            <p class="text-white font-medium">{{ WORKOUT_TYPES[stats.favoriteWorkoutType] }}</p>
            <p class="text-gray-400 text-sm">{{ getFavoriteStats(stats.favoriteWorkoutType) }}</p>
          </div>
        </div>
      </div>

      <div class="text-right">
        <UButton @click="handlePeriodChange" variant="outline" size="sm">
          {{ periodLabel }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserStats, WorkoutType } from '@/types';
import { WORKOUT_TYPES } from '@/types';
import { MARTIAL_ARTS_CATEGORIES, getMartialArtsCategory } from '@/types/martial-arts';

interface Props {
  stats: UserStats
  period?: 'week' | 'month' | 'year'
}

const props = withDefaults(defineProps<Props>(), {
  period: 'month'
})

const emit = defineEmits<{
  periodChange: [period: string]
}>()

const periodLabel = computed(() => {
  const labels = {
    week: 'неделю',
    month: 'месяц',
    year: 'год'
  }
  return labels[props.period]
})

const getCategoryIcon = (type: WorkoutType) => {
  const category = getMartialArtsCategory(type)
  return MARTIAL_ARTS_CATEGORIES[category].icon
}

const getFavoriteStats = (type: WorkoutType) => {
  // This would come from the actual stats
  return `${Math.round(Math.random() * 20 + 10)} тренировок за ${periodLabel.value}`
}

const handlePeriodChange = () => {
  const periods = ['week', 'month', 'year']
  const currentIndex = periods.indexOf(props.period)
  const nextIndex = (currentIndex + 1) % periods.length
  emit('periodChange', periods[nextIndex])
}
</script>