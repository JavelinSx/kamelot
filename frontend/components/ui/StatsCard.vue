<template>
  <UCard :class="[
    'stats-card',
    {
      'stats-card--clickable': clickable,
      'stats-card--highlighted': highlighted
    }
  ]" @click="handleClick">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <!-- Заголовок -->
        <p class="text-sm font-medium text-gray-400 mb-1">
          {{ title }}
        </p>

        <!-- Основное значение -->
        <div class="flex items-baseline space-x-2">
          <p class="text-2xl font-bold text-white">
            {{ formattedValue }}
          </p>

          <!-- Единица измерения -->
          <span v-if="unit" class="text-sm text-gray-400">
            {{ unit }}
          </span>
        </div>

        <!-- Изменение -->
        <div v-if="change" class="flex items-center mt-2">
          <UIcon :name="changeIcon" :class="changeColorClass" class="w-4 h-4 mr-1" />
          <span :class="[changeColorClass, 'text-sm font-medium']">
            {{ Math.abs(change.value) }}{{ change.format === 'percentage' ? '%' : '' }}
          </span>
          <span class="text-gray-400 text-sm ml-1">
            {{ change.period }}
          </span>
        </div>

        <!-- Описание -->
        <p v-if="description" class="text-xs text-gray-500 mt-2">
          {{ description }}
        </p>
      </div>

      <!-- Иконка -->
      <div v-if="icon" class="ml-4">
        <div :class="[
          'p-3 rounded-lg',
          iconBackgroundClass
        ]">
          <UIcon :name="icon" :class="iconColorClass" class="w-6 h-6" />
        </div>
      </div>
    </div>

    <!-- Прогресс-бар (опционально) -->
    <div v-if="progress !== undefined" class="mt-4">
      <div class="flex items-center justify-between text-xs text-gray-400 mb-1">
        <span>Прогресс</span>
        <span>{{ Math.round(progress) }}%</span>
      </div>
      <UProgress :value="progress" :color="progressColor" class="h-2" />
    </div>

    <!-- Дополнительные метрики -->
    <div v-if="subMetrics && subMetrics.length" class="mt-4 pt-4 border-t border-gray-800">
      <div class="grid grid-cols-2 gap-4">
        <div v-for="metric in subMetrics" :key="metric.label" class="text-center">
          <p class="text-xs text-gray-400">{{ metric.label }}</p>
          <p class="text-sm font-semibold text-white mt-1">{{ metric.value }}</p>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import {
  getIconBackgroundClass,
  getIconColorClass,
  getProgressColor,
  type BadgeColor
} from '~/types/martial-arts'

interface SubMetric {
  label: string
  value: string | number
}

interface ChangeData {
  value: number // положительное или отрицательное значение
  period: string // например, "за месяц", "за неделю"
  format?: 'number' | 'percentage'
}

interface Props {
  title: string
  value: string | number
  unit?: string
  description?: string
  icon?: string
  change?: ChangeData
  progress?: number // 0-100
  subMetrics?: SubMetric[]

  // Стили - используем BadgeColor для совместимости
  color?: BadgeColor
  highlighted?: boolean
  clickable?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: 'blue',
  highlighted: false,
  clickable: false,
  loading: false
})

interface Emits {
  click: [event: MouseEvent]
}

const emit = defineEmits<Emits>()

// Вычисляемые свойства
const formattedValue = computed(() => {
  if (props.loading) return '...'

  if (typeof props.value === 'number') {
    // Форматирование чисел
    if (props.value >= 1000000) {
      return `${(props.value / 1000000).toFixed(1)}M`
    } else if (props.value >= 1000) {
      return `${(props.value / 1000).toFixed(1)}K`
    }
    return props.value.toLocaleString()
  }

  return props.value
})

const changeIcon = computed(() => {
  if (!props.change) return ''
  return props.change.value >= 0 ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down'
})

const changeColorClass = computed(() => {
  if (!props.change) return ''
  return props.change.value >= 0 ? 'text-green-500' : 'text-red-500'
})

// Используем централизованные утилиты
const iconColorClass = computed(() => getIconColorClass(props.color))
const iconBackgroundClass = computed(() => getIconBackgroundClass(props.color))
const progressColor = computed(() => getProgressColor(props.color))

const handleClick = (event: MouseEvent) => {
  if (props.clickable && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.stats-card {
  @apply bg-gray-900 border-gray-800;
}

.stats-card--clickable {
  @apply cursor-pointer hover:bg-gray-800/50 transition-colors duration-200;
}

.stats-card--highlighted {
  @apply ring-2 ring-blue-500/20 border-blue-500/30;
}

.stats-card--clickable:hover {
  @apply shadow-lg shadow-black/20;
}
</style>