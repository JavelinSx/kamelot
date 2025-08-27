<!-- components/profile/ProgressChart.vue -->
<template>
  <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-white font-bold text-lg">{{ chartTitle }}</h3>
        <p class="text-gray-400 text-sm">{{ chartDescription }}</p>
      </div>

      <div class="flex items-center space-x-2">
        <UButton v-for="periodOption in periodOptions" :key="periodOption.value"
          @click="handlePeriodChange(periodOption.value)" :variant="period === periodOption.value ? 'solid' : 'ghost'"
          :color="period === periodOption.value ? 'red' : 'gray'" size="sm">
          {{ periodOption.label }}
        </UButton>
      </div>
    </div>

    <!-- Chart Container -->
    <div class="relative h-80">
      <canvas ref="chartCanvas" class="w-full h-full" :style="{ height: `${height}px` }"></canvas>

      <!-- Loading State -->
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && (!data || data.length === 0)"
        class="absolute inset-0 flex flex-col items-center justify-center">
        <div class="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h4 class="text-white font-medium mb-2">Нет данных</h4>
        <p class="text-gray-400 text-sm text-center">
          Начните тренироваться, чтобы увидеть прогресс
        </p>
      </div>
    </div>

    <!-- Chart Legend -->
    <div v-if="showLegend && !loading && hasData" class="mt-6 flex flex-wrap gap-4">
      <div v-for="(dataset, index) in chartDatasets" :key="index" class="flex items-center space-x-2">
        <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: dataset.borderColor }"></div>
        <span class="text-gray-300 text-sm">{{ dataset.label }}</span>
      </div>
    </div>

    <!-- Stats Summary -->
    <div v-if="!loading && hasData" class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="text-center">
        <p class="text-2xl font-bold text-white">{{ formatValue(currentValue) }}</p>
        <p class="text-gray-400 text-xs">Текущий</p>
      </div>
      <div class="text-center">
        <p class="text-2xl font-bold text-green-400">{{ formatValue(maxValue) }}</p>
        <p class="text-gray-400 text-xs">Максимум</p>
      </div>
      <div class="text-center">
        <p class="text-2xl font-bold text-blue-400">{{ formatValue(averageValue) }}</p>
        <p class="text-gray-400 text-xs">Среднее</p>
      </div>
      <div class="text-center">
        <p class="text-2xl font-bold" :class="trendClass">{{ formatValue(trendValue) }}</p>
        <p class="text-gray-400 text-xs">Тренд</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

interface ChartDataPoint {
  date: string
  value: number
  label?: string
}

interface Props {
  data: ChartDataPoint[]
  metric: 'workouts' | 'hours' | 'weight' | 'strength'
  period: 'week' | 'month' | 'year'
  height?: number
  showGrid?: boolean
  animated?: boolean
  showLegend?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  height: 320,
  showGrid: true,
  animated: true,
  showLegend: true,
  loading: false
})

const emit = defineEmits<{
  periodChange: [period: string]
}>()

// Refs
const chartCanvas = ref<HTMLCanvasElement>()
let chartInstance: Chart | null = null

// Chart destroy function - КРИТИЧНО для предотвращения утечек
const destroyChart = () => {
  if (chartInstance) {
    try {
      chartInstance.destroy()
    } catch (error) {
      console.warn('Error destroying chart:', error)
    } finally {
      chartInstance = null
    }
  }
}

// Configuration
const periodOptions = [
  { value: 'week', label: 'Неделя' },
  { value: 'month', label: 'Месяц' },
  { value: 'year', label: 'Год' }
]

const metricConfig = {
  workouts: {
    title: 'Количество тренировок',
    description: 'Динамика ваших тренировок',
    color: '#dc2626',
    unit: '',
    format: (value: number) => value.toString()
  },
  hours: {
    title: 'Часы тренировок',
    description: 'Время, проведенное на тренировках',
    color: '#2563eb',
    unit: 'ч',
    format: (value: number) => value.toFixed(1)
  },
  weight: {
    title: 'Вес',
    description: 'Изменение веса тела',
    color: '#059669',
    unit: 'кг',
    format: (value: number) => value.toFixed(1)
  },
  strength: {
    title: 'Силовые показатели',
    description: 'Рост силовых показателей',
    color: '#7c3aed',
    unit: 'кг',
    format: (value: number) => value.toFixed(0)
  }
}

// Computed properties
const hasData = computed(() => props.data && props.data.length > 0)
const chartTitle = computed(() => metricConfig[props.metric].title)
const chartDescription = computed(() => metricConfig[props.metric].description)

const chartDatasets = computed(() => {
  if (!hasData.value) return []

  return [{
    label: metricConfig[props.metric].title,
    data: props.data.map(point => point.value),
    borderColor: metricConfig[props.metric].color,
    backgroundColor: metricConfig[props.metric].color + '20',
    fill: true,
    tension: 0.4,
    pointBackgroundColor: metricConfig[props.metric].color,
    pointBorderColor: '#ffffff',
    pointBorderWidth: 2,
    pointRadius: 4,
    pointHoverRadius: 6
  }]
})

// Stats
const currentValue = computed(() => {
  if (!hasData.value) return 0
  return props.data[props.data.length - 1].value
})

const maxValue = computed(() => {
  if (!hasData.value) return 0
  return Math.max(...props.data.map(point => point.value))
})

const averageValue = computed(() => {
  if (!hasData.value) return 0
  const sum = props.data.reduce((acc, point) => acc + point.value, 0)
  return sum / props.data.length
})

const trendValue = computed(() => {
  if (!hasData.value || props.data.length < 2) return 0
  const firstHalf = props.data.slice(0, Math.floor(props.data.length / 2))
  const secondHalf = props.data.slice(Math.floor(props.data.length / 2))

  const firstAvg = firstHalf.reduce((acc, point) => acc + point.value, 0) / firstHalf.length
  const secondAvg = secondHalf.reduce((acc, point) => acc + point.value, 0) / secondHalf.length

  return secondAvg - firstAvg
})

const trendClass = computed(() => {
  if (trendValue.value > 0) return 'text-green-400'
  if (trendValue.value < 0) return 'text-red-400'
  return 'text-gray-400'
})

// Methods
const formatValue = (value: number) => {
  return metricConfig[props.metric].format(value) + metricConfig[props.metric].unit
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)

  switch (props.period) {
    case 'week':
      return date.toLocaleDateString('ru-RU', { weekday: 'short' })
    case 'month':
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
    case 'year':
      return date.toLocaleDateString('ru-RU', { month: 'short' })
    default:
      return date.toLocaleDateString('ru-RU')
  }
}

const handlePeriodChange = (newPeriod: string) => {
  emit('periodChange', newPeriod)
}

// Chart initialization - с улучшенной очисткой памяти
const initChart = () => {
  // ВСЕГДА уничтожаем предыдущий экземпляр
  destroyChart()

  if (!chartCanvas.value || !hasData.value || props.loading) return

  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return

  try {
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: props.data.map(point => formatDate(point.date)),
        datasets: chartDatasets.value
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#1f2937',
            titleColor: '#ffffff',
            bodyColor: '#d1d5db',
            borderColor: '#374151',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              label: (context: any) => {
                return `${context.dataset.label}: ${formatValue(context.parsed.y)}`
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: props.showGrid,
              color: '#374151'
            },
            ticks: {
              color: '#9ca3af'
            }
          },
          y: {
            grid: {
              display: props.showGrid,
              color: '#374151'
            },
            ticks: {
              color: '#9ca3af',
              callback: (value: any) => formatValue(Number(value))
            }
          }
        },
        animation: {
          duration: props.animated ? 1000 : 0,
          easing: 'easeInOutQuart'
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    })
  } catch (error) {
    console.error('Error creating chart:', error)
  }
}

// Debounced chart update - предотвращает частые пересоздания
const debouncedInitChart = useDebounceFn(initChart, 300)

// Lifecycle hooks
onMounted(() => {
  nextTick(() => {
    if (hasData.value && !props.loading) {
      initChart()
    }
  })
})

onBeforeUnmount(() => {
  // Обязательно уничтожаем chart при размонтировании
  destroyChart()
})

// Watchers - КРИТИЧНО: убираем deep watch и оптимизируем
watch(
  [() => props.data?.length, () => props.period, () => props.loading],
  ([dataLength, period, loading]) => {
    if (!loading && dataLength && dataLength > 0) {
      debouncedInitChart()
    } else {
      destroyChart()
    }
  }
)

// Отдельный watcher для изменения данных (без deep)
watch(
  () => props.data?.map(item => item.value).join(','),
  () => {
    if (hasData.value && !props.loading && chartInstance) {
      debouncedInitChart()
    }
  }
)
</script>

<style scoped>
/* Убираем лишние стили для оптимизации */
canvas {
  max-height: 100%;
}
</style>