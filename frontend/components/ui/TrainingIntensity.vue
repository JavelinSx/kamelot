<!-- components/ui/TrainingIntensity.vue -->
<template>
  <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-white font-bold text-lg">Интенсивность тренировки</h3>
      <UBadge :color="intensityColor" size="lg">
        {{ intensityLabel }}
      </UBadge>
    </div>

    <!-- Визуальный индикатор интенсивности -->
    <div class="relative mb-6">
      <div class="w-full bg-gray-700 rounded-full h-4">
        <div class="h-4 rounded-full transition-all duration-1000 ease-out" :class="intensityBarClass"
          :style="{ width: `${intensityPercentage}%` }"></div>
      </div>

      <!-- Маркеры уровней -->
      <div class="flex justify-between mt-2 text-xs text-gray-500">
        <span>Низкая</span>
        <span>Средняя</span>
        <span>Высокая</span>
        <span>Экстремальная</span>
      </div>
    </div>

    <!-- Детальная информация -->
    <div class="grid grid-cols-2 gap-4 mb-4">
      <div class="text-center">
        <div class="text-2xl font-bold text-red-400">{{ calories }}</div>
        <div class="text-xs text-gray-400">кал/час</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-blue-400">{{ heartRate }}</div>
        <div class="text-xs text-gray-400">ЧСС среднее</div>
      </div>
    </div>

    <!-- Эффекты тренировки -->
    <div class="space-y-2">
      <h4 class="text-gray-300 font-medium text-sm">Эффекты тренировки:</h4>
      <div class="flex flex-wrap gap-2">
        <UBadge v-for="effect in trainingEffects" :key="effect" variant="soft" color="gray" size="sm">
          {{ effect }}
        </UBadge>
      </div>
    </div>

    <!-- Рекомендации -->
    <div v-if="recommendations.length > 0" class="mt-4 p-3 bg-gray-800 rounded-lg">
      <h4 class="text-gray-300 font-medium text-sm mb-2">💡 Рекомендации:</h4>
      <ul class="text-gray-400 text-xs space-y-1">
        <li v-for="rec in recommendations" :key="rec" class="flex items-start">
          <span class="text-red-400 mr-2">•</span>
          {{ rec }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WorkoutType } from '~/types'
import {
  isGrapplingArt,
  isMixedArt,
  isStrikingArt,
  type BadgeColor
} from '~/types/martial-arts'

interface Props {
  calories: number
  duration?: number
  workoutType?: WorkoutType
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
}

const props = withDefaults(defineProps<Props>(), {
  duration: 60,
  difficulty: 'intermediate'
})

// Расчет интенсивности на основе калорий
const intensityLevel = computed(() => {
  if (props.calories < 350) return 1 // Низкая
  if (props.calories < 450) return 2 // Средняя
  if (props.calories < 550) return 3 // Высокая
  return 4 // Экстремальная
})

const intensityPercentage = computed(() => {
  return (intensityLevel.value / 4) * 100
})

const intensityLabel = computed(() => {
  const labels = ['', 'Низкая', 'Средняя', 'Высокая', 'Экстремальная']
  return labels[intensityLevel.value] || 'Неизвестно'
})

const intensityColor = computed((): BadgeColor => {
  const colors: BadgeColor[] = ['gray', 'green', 'yellow', 'orange', 'red']
  return colors[intensityLevel.value] || 'gray'
})

const intensityBarClass = computed(() => {
  const classes = [
    '',
    'bg-gradient-to-r from-green-500 to-green-400',
    'bg-gradient-to-r from-yellow-500 to-yellow-400',
    'bg-gradient-to-r from-orange-500 to-orange-400',
    'bg-gradient-to-r from-red-600 to-red-500 animate-pulse-red'
  ]
  return classes[intensityLevel.value] || 'bg-gray-600'
})

// Примерная ЧСС на основе интенсивности
const heartRate = computed(() => {
  const baseHR = 70
  const maxHR = 190
  const intensityMultiplier = [0, 0.5, 0.65, 0.8, 0.9][intensityLevel.value] || 0.5
  return Math.round(baseHR + (maxHR - baseHR) * intensityMultiplier)
})

// Эффекты тренировки
const trainingEffects = computed(() => {
  const effects: string[] = []

  // Базовые эффекты по интенсивности
  if (intensityLevel.value >= 2) effects.push('Сжигание жира')
  if (intensityLevel.value >= 3) effects.push('Улучшение выносливости')
  if (intensityLevel.value >= 4) effects.push('Рост мышечной массы')

  // Специфичные эффекты для категорий боевых искусств
  if (props.workoutType) {
    if (isStrikingArt(props.workoutType)) {
      effects.push('Координация ударов')
      effects.push('Скорость реакции')
    }

    if (isGrapplingArt(props.workoutType)) {
      effects.push('Силовая выносливость')
      effects.push('Гибкость')
      effects.push('Баланс и координация')
    }

    if (isMixedArt(props.workoutType)) {
      effects.push('Комплексная подготовка')
      effects.push('Взрывная сила')
      effects.push('Кардио-выносливость')
    }
  }

  // Дополнительные эффекты по типам тренировок
  if (props.workoutType) {
    const typeSpecificEffects = {
      boxing: ['Работа с дыханием', 'Сила удара'],
      kickboxing: ['Гибкость ног', 'Баланс'],
      bjj: ['Техническое мышление', 'Терпение'],
      wrestling: ['Взрывная сила', 'Выносливость'],
      grappling: ['Функциональная сила', 'Выносливость'],
      mma: ['Универсальность', 'Адаптивность'],
      pankration: ['Историческая техника', 'Разносторонность']
    }

    const specific = typeSpecificEffects[props.workoutType]
    if (specific) {
      effects.push(...specific)
    }
  }

  // Убираем дубли и ограничиваем количество
  return [...new Set(effects)].slice(0, 6)
})

// Рекомендации
const recommendations = computed(() => {
  const recs: string[] = []

  if (intensityLevel.value >= 4) {
    recs.push('Обязательна хорошая разминка')
    recs.push('Контролируйте пульс во время тренировки')
    recs.push('Достаточный отдых между тренировками')
  } else if (intensityLevel.value >= 3) {
    recs.push('Не забывайте про восстановление')
    recs.push('Пейте воду во время тренировки')
  } else if (intensityLevel.value <= 2) {
    recs.push('Подходит для ежедневных тренировок')
    recs.push('Отличный выбор для начинающих')
  }

  if (props.difficulty === 'beginner' && intensityLevel.value >= 3) {
    recs.push('Возможно, стоит начать с более легкого уровня')
  }

  // Специфичные рекомендации по типам тренировок
  if (props.workoutType) {
    if (isStrikingArt(props.workoutType)) {
      recs.push('Используйте защитное снаряжение')
      recs.push('Следите за техникой ударов')
    }

    if (isGrapplingArt(props.workoutType)) {
      recs.push('Тренируйтесь на мягкой поверхности')
      recs.push('Изучайте технику безопасности')
    }

    if (isMixedArt(props.workoutType)) {
      recs.push('Разнообразьте нагрузку')
      recs.push('Комбинируйте разные техники')
    }
  }

  return recs.slice(0, 4) // Ограничиваем количество рекомендаций
})
</script>

<style scoped>
@keyframes pulse-red {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.8;
  }
}

.animate-pulse-red {
  animation: pulse-red 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>