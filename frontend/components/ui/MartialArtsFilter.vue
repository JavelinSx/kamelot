<template>
  <div class="martial-arts-filter">
    <!-- Заголовок -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-white">
        {{ title }}
      </h3>
      <UButton v-if="showReset && hasActiveFilters" variant="ghost" size="sm" icon="i-heroicons-x-mark"
        @click="resetFilters">
        Сбросить
      </UButton>
    </div>

    <!-- Поиск -->
    <div v-if="showSearch" class="mb-6">
      <UInput v-model="searchQuery" placeholder="Поиск боевых искусств..." icon="i-heroicons-magnifying-glass"
        :loading="loading" @input="handleSearch" />
    </div>

    <!-- Вид отображения -->
    <div class="flex items-center justify-between mb-4">
      <span class="text-sm text-gray-400">Вид:</span>
      <div class="flex rounded-lg bg-gray-800 p-1">
        <UButton :variant="viewMode === 'grid' ? 'solid' : 'ghost'" size="xs" icon="i-heroicons-squares-2x2"
          @click="viewMode = 'grid'" />
        <UButton :variant="viewMode === 'list' ? 'solid' : 'ghost'" size="xs" icon="i-heroicons-list-bullet"
          @click="viewMode = 'list'" />
      </div>
    </div>

    <!-- Фильтры -->
    <div class="space-y-6">
      <!-- Выбор боевых искусств -->
      <div>
        <h4 class="text-sm font-medium text-gray-300 mb-3">Типы тренировок</h4>
        <div :class="viewMode === 'grid' ? 'grid grid-cols-2 gap-2' : 'space-y-2'">
          <div v-for="martialArt in filteredMartialArts" :key="martialArt.value" :class="[
            'martial-art-item',
            {
              'martial-art-item--selected': selectedMartialArts.includes(martialArt.value),
              'martial-art-item--grid': viewMode === 'grid',
              'martial-art-item--list': viewMode === 'list'
            }
          ]" @click="toggleMartialArt(martialArt.value)">
            <div class="flex items-center space-x-3">
              <!-- Иконка -->
              <div :class="[
                'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
                getMartialArtStyle(martialArt.value).background
              ]">
                <UIcon :name="martialArt.icon || 'i-heroicons-sparkles'"
                  :class="getMartialArtStyle(martialArt.value).icon" class="w-4 h-4" />
              </div>

              <!-- Информация -->
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-white truncate">
                  {{ martialArt.label }}
                </p>
                <p v-if="martialArt.description && viewMode === 'list'" class="text-xs text-gray-400 truncate">
                  {{ martialArt.description }}
                </p>
              </div>

              <!-- Счетчик -->
              <div v-if="martialArt.count !== undefined" class="flex-shrink-0">
                <UBadge :color="selectedMartialArts.includes(martialArt.value) ? 'white' : 'gray'" variant="soft"
                  size="xs">
                  {{ martialArt.count }}
                </UBadge>
              </div>

              <!-- Чекбокс -->
              <div class="flex-shrink-0">
                <UCheckbox :model-value="selectedMartialArts.includes(martialArt.value)" :disabled="loading"
                  @change="toggleMartialArt(martialArt.value)" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Уровень сложности -->
      <div v-if="showDifficulty">
        <h4 class="text-sm font-medium text-gray-300 mb-3">Уровень сложности</h4>
        <div class="space-y-2">
          <div v-for="difficulty in difficultyLevels" :key="difficulty.value"
            class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer"
            @click="toggleDifficulty(difficulty.value)">
            <UCheckbox :model-value="selectedDifficulties.includes(difficulty.value)" :disabled="loading"
              @change="toggleDifficulty(difficulty.value)" />
            <UBadge :color="getDifficultyColor(difficulty.value)" variant="soft" size="xs">
              {{ difficulty.label }}
            </UBadge>
            <span class="text-sm text-gray-300 flex-1">{{ difficulty.label }}</span>
            <span v-if="difficulty.count !== undefined" class="text-xs text-gray-400">
              {{ difficulty.count }}
            </span>
          </div>
        </div>
      </div>

      <!-- Диапазон длительности -->
      <div v-if="showDuration">
        <h4 class="text-sm font-medium text-gray-300 mb-3">Длительность (мин)</h4>
        <div class="space-y-4">
          <URange :model-value="durationLimits.min" :min="durationLimits.min" :max="durationLimits.max" :step="15"
            :disabled="loading" @update:model-value="handleDurationChange" />
          <div class="flex items-center justify-between text-xs text-gray-400">
            <span>{{ durationRange[0] }} мин</span>
            <span>{{ durationRange[1] }} мин</span>
          </div>
        </div>
      </div>

      <!-- Оборудование -->
      <div v-if="showEquipment">
        <h4 class="text-sm font-medium text-gray-300 mb-3">Оборудование</h4>
        <div class="space-y-2">
          <div v-for="equipment in equipmentOptions" :key="equipment.value"
            class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer"
            @click="toggleEquipment(equipment.value)">
            <UCheckbox :model-value="selectedEquipment.includes(equipment.value)" :disabled="loading"
              @change="toggleEquipment(equipment.value)" />
            <span class="text-sm text-gray-300 flex-1">{{ equipment.label }}</span>
            <span v-if="equipment.count !== undefined" class="text-xs text-gray-400">
              {{ equipment.count }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Действия -->
    <div v-if="showActions" class="mt-6 pt-6 border-t border-gray-800">
      <div class="flex space-x-3">
        <UButton color="primary" :loading="loading" @click="applyFilters" class="flex-1">
          Применить фильтры
        </UButton>
        <UButton variant="outline" :disabled="loading" @click="resetFilters">
          Сбросить
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import type { WorkoutType } from '~/types'

interface MartialArt {
  value: WorkoutType
  label: string
  description?: string
  icon?: string
  count?: number
}

interface DifficultyLevel {
  value: 'easy' | 'medium' | 'hard'
  label: string
  count?: number
}

interface Equipment {
  value: string
  label: string
  count?: number
}

interface Props {
  title?: string
  martialArts?: MartialArt[]
  difficultyLevels?: DifficultyLevel[]
  equipmentOptions?: Equipment[]
  selectedMartialArts?: WorkoutType[]
  selectedDifficulties?: string[]
  selectedEquipment?: string[]
  durationRange?: [number, number]
  showSearch?: boolean
  showDifficulty?: boolean
  showDuration?: boolean
  showEquipment?: boolean
  showReset?: boolean
  showActions?: boolean
  durationLimits?: { min: number; max: number }
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Фильтры',
  martialArts: () => [],
  difficultyLevels: () => [
    { value: 'easy', label: 'Легкий' },
    { value: 'medium', label: 'Средний' },
    { value: 'hard', label: 'Сложный' }
  ],
  equipmentOptions: () => [],
  selectedMartialArts: () => [],
  selectedDifficulties: () => [],
  selectedEquipment: () => [],
  durationRange: () => [30, 120],
  showSearch: true,
  showDifficulty: true,
  showDuration: true,
  showEquipment: true,
  showReset: true,
  showActions: true,
  durationLimits: () => ({ min: 15, max: 180 }),
  loading: false
})

interface Emits {
  'update:selectedMartialArts': [value: WorkoutType[]]
  'update:selectedDifficulties': [value: string[]]
  'update:selectedEquipment': [value: string[]]
  'update:durationRange': [value: [number, number]]
  'apply': [filters: any]
  'reset': []
  'search': [query: string]
}

const emit = defineEmits<Emits>()

const searchQuery = ref('')
const viewMode = ref<'grid' | 'list'>('grid')

const filteredMartialArts = computed(() => {
  if (!searchQuery.value) return props.martialArts

  const query = searchQuery.value.toLowerCase()
  return props.martialArts.filter(ma =>
    ma.label.toLowerCase().includes(query) ||
    ma.description?.toLowerCase().includes(query)
  )
})

const hasActiveFilters = computed(() => {
  return props.selectedMartialArts.length > 0 ||
    props.selectedDifficulties.length > 0 ||
    props.selectedEquipment.length > 0 ||
    (props.durationRange[0] !== props.durationLimits.min ||
      props.durationRange[1] !== props.durationLimits.max)
})

const toggleMartialArt = (value: WorkoutType) => {
  const current = [...props.selectedMartialArts]
  const index = current.indexOf(value)

  if (index > -1) {
    current.splice(index, 1)
  } else {
    current.push(value)
  }

  emit('update:selectedMartialArts', current)
}

const toggleDifficulty = (value: string) => {
  const current = [...props.selectedDifficulties]
  const index = current.indexOf(value)

  if (index > -1) {
    current.splice(index, 1)
  } else {
    current.push(value)
  }

  emit('update:selectedDifficulties', current)
}

const toggleEquipment = (value: string) => {
  const current = [...props.selectedEquipment]
  const index = current.indexOf(value)

  if (index > -1) {
    current.splice(index, 1)
  } else {
    current.push(value)
  }

  emit('update:selectedEquipment', current)
}

const handleDurationChange = (value: [number, number]) => {
  emit('update:durationRange', value)
}

const handleSearch = useDebounceFn(() => {
  emit('search', searchQuery.value)
}, 300)

const applyFilters = () => {
  emit('apply', {
    martialArts: props.selectedMartialArts,
    difficulties: props.selectedDifficulties,
    equipment: props.selectedEquipment,
    duration: props.durationRange,
    search: searchQuery.value
  })
}

const resetFilters = () => {
  searchQuery.value = ''
  emit('update:selectedMartialArts', [])
  emit('update:selectedDifficulties', [])
  emit('update:selectedEquipment', [])
  emit('update:durationRange', [props.durationLimits.min, props.durationLimits.max])
  emit('reset')
}

const getMartialArtStyle = (value: WorkoutType) => {
  const baseStyles = {
    karate: { background: 'bg-orange-500/10', icon: 'text-orange-400' },
    boxing: { background: 'bg-red-500/10', icon: 'text-red-400' },
    mma: { background: 'bg-purple-500/10', icon: 'text-purple-400' },
    kickboxing: { background: 'bg-pink-500/10', icon: 'text-pink-400' },
    judo: { background: 'bg-blue-500/10', icon: 'text-blue-400' },
    taekwondo: { background: 'bg-cyan-500/10', icon: 'text-cyan-400' },
    muay_thai: { background: 'bg-yellow-500/10', icon: 'text-yellow-400' },
    bjj: { background: 'bg-indigo-500/10', icon: 'text-indigo-400' },
    wrestling: { background: 'bg-green-500/10', icon: 'text-green-400' },
    fitness: { background: 'bg-gray-500/10', icon: 'text-gray-400' }
  } as const

  type BaseStyleKey = keyof typeof baseStyles

  if (value in baseStyles) {
    return baseStyles[value as BaseStyleKey]
  }

  const categoryStyles = {
    kyokushin: { background: 'bg-orange-600/10', icon: 'text-orange-500' },
    wing_chun: { background: 'bg-amber-500/10', icon: 'text-amber-400' },
    savate: { background: 'bg-rose-500/10', icon: 'text-rose-400' },
    lethwei: { background: 'bg-red-600/10', icon: 'text-red-500' },
    sanda: { background: 'bg-orange-700/10', icon: 'text-orange-600' },
    sambo: { background: 'bg-blue-600/10', icon: 'text-blue-500' },
    krav_maga: { background: 'bg-gray-600/10', icon: 'text-gray-500' },
    systema: { background: 'bg-slate-500/10', icon: 'text-slate-400' },
    crossfit: { background: 'bg-emerald-500/10', icon: 'text-emerald-400' },
    yoga: { background: 'bg-teal-500/10', icon: 'text-teal-400' },
    pilates: { background: 'bg-violet-500/10', icon: 'text-violet-400' }
  }

  return categoryStyles[value as keyof typeof categoryStyles] || baseStyles.fitness
}

const getDifficultyColor = (difficulty: string) => {
  const colors = {
    easy: 'green',
    medium: 'yellow',
    hard: 'red'
  } as const

  return colors[difficulty as keyof typeof colors] || 'gray'
}
</script>

<style scoped>
.martial-arts-filter {
  @apply bg-gray-900 rounded-lg p-6;
}

.martial-art-item {
  @apply p-3 rounded-lg border border-gray-800 cursor-pointer transition-all duration-200;
}

.martial-art-item:hover {
  @apply bg-gray-800/50 border-gray-700;
}

.martial-art-item--selected {
  @apply bg-blue-500/10 border-blue-500/30;
}

.martial-art-item--grid {
  @apply text-center;
}

.martial-art-item--list {
  @apply flex items-center space-x-3;
}
</style>