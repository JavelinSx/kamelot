<template>
  <div class="trainer-list">
    <!-- Заголовок и настройки отображения -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-white">Наши тренеры</h2>
        <p class="text-gray-400 mt-1">
          {{ totalCount }} {{ getTrainerCountLabel(totalCount) }} готовы помочь вам достичь целей
        </p>
      </div>

      <div class="flex items-center space-x-4">
        <!-- Переключатель вида -->
        <div class="flex rounded-lg bg-gray-800 p-1">
          <UButton :variant="variant === 'grid' ? 'solid' : 'ghost'" size="sm" icon="i-heroicons-squares-2x2"
            @click="changeVariant('grid')" />
          <UButton :variant="variant === 'list' ? 'solid' : 'ghost'" size="sm" icon="i-heroicons-list-bullet"
            @click="changeVariant('list')" />
        </div>

        <!-- Количество колонок для grid -->
        <div v-if="variant === 'grid'" class="flex items-center space-x-2">
          <span class="text-sm text-gray-400">Колонки:</span>
          <USelectMenu v-model="gridColumns" :options="columnOptions" @change="changeColumns" />
        </div>

        <!-- Сортировка -->
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-400">Сортировка:</span>
          <USelectMenu v-model="sortBy" :options="sortOptions" @change="handleSortChange" />
        </div>
      </div>
    </div>

    <!-- Фильтры (если показываем) -->
    <div v-if="showFilters" class="mb-6">
      <TrainerFilter :specializations="availableSpecializations" :selected-specializations="selectedSpecializations"
        :experience-range="experienceRange" :rating-min="ratingMin" :loading="loading" :results-count="totalCount"
        @specializations-change="handleSpecializationsChange" @experience-change="handleExperienceChange"
        @rating-change="handleRatingChange" @availability-change="handleAvailabilityChange" @apply="handleFiltersApply"
        @reset="handleFiltersReset" />
    </div>

    <!-- Быстрые фильтры -->
    <div class="flex flex-wrap gap-2 mb-6">
      <UButton v-for="filter in quickFilters" :key="filter.key"
        :variant="activeQuickFilters.includes(filter.key) ? 'solid' : 'outline'" :color="filter.color" size="xs"
        :icon="filter.icon" @click="toggleQuickFilter(filter.key)">
        {{ filter.label }}
      </UButton>

      <UButton v-if="activeQuickFilters.length > 0" variant="ghost" size="xs" icon="i-heroicons-x-mark"
        @click="clearQuickFilters">
        Очистить
      </UButton>
    </div>

    <!-- Загрузка -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
        <p class="text-gray-400">Загружаем тренеров...</p>
      </div>
    </div>

    <!-- Список тренеров -->
    <div v-else-if="displayedTrainers.length > 0">
      <!-- Grid вид -->
      <div v-if="variant === 'grid'" :class="[
        'grid gap-6',
        gridClasses
      ]">
        <TrainerCard v-for="trainer in displayedTrainers" :key="trainer.id" :trainer="trainer" :show-stats="true"
          :show-contact="false" :clickable="true" @view-profile="handleTrainerSelect" @book-session="handleBookSession"
          @message="handleMessage" @card-click="handleTrainerSelect" />
      </div>

      <!-- List вид -->
      <div v-else class="space-y-4">
        <div v-for="trainer in displayedTrainers" :key="trainer.id" class="trainer-list-item">
          <div
            class="flex items-start space-x-6 p-6 bg-gray-900 border border-gray-800 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer"
            @click="handleTrainerSelect(trainer)">
            <!-- Аватар -->
            <UAvatar :src="trainer.user.avatar" :alt="`${trainer.user.firstName} ${trainer.user.lastName}`" size="xl"
              :chip-color="trainer.isActive ? 'green' : 'gray'" chip-position="bottom-right" />

            <!-- Основная информация -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <!-- Имя и статус -->
                  <h3 class="text-xl font-semibold text-white">
                    {{ trainer.user.firstName }} {{ trainer.user.lastName }}
                  </h3>

                  <div class="flex items-center space-x-3 mt-2">
                    <UBadge :color="trainer.isActive ? 'green' : 'gray'" variant="soft" size="xs">
                      {{ trainer.isActive ? 'Активен' : 'Неактивен' }}
                    </UBadge>

                    <UBadge v-if="trainer.certifications?.length" color="blue" variant="soft" size="xs">
                      Сертифицирован
                    </UBadge>

                    <div class="flex items-center space-x-1">
                      <UIcon v-for="i in 5" :key="i" name="i-heroicons-star-solid"
                        :class="i <= trainer.rating ? 'text-yellow-400' : 'text-gray-600'" class="w-4 h-4" />
                      <span class="text-white font-medium ml-2">
                        {{ trainer.rating.toFixed(1) }}
                      </span>
                      <span class="text-gray-400">
                        ({{ trainer.reviewsCount }})
                      </span>
                    </div>
                  </div>

                  <!-- Специализации -->
                  <div class="flex flex-wrap gap-1 mt-3">
                    <UBadge v-for="specialization in trainer.specialization.slice(0, 4)" :key="specialization"
                      :color="getMartialArtColor(specialization)" variant="soft" size="xs">
                      {{ getWorkoutTypeLabel(specialization) }}
                    </UBadge>
                    <UBadge v-if="trainer.specialization.length > 4" color="gray" variant="soft" size="xs">
                      +{{ trainer.specialization.length - 4 }}
                    </UBadge>
                  </div>

                  <!-- Краткое описание -->
                  <p v-if="trainer.bio" class="text-gray-400 mt-3 line-clamp-2">
                    {{ trainer.bio }}
                  </p>
                </div>

                <!-- Статистика -->
                <div class="text-right space-y-2">
                  <div class="text-center p-2 bg-gray-800/30 rounded">
                    <p class="text-lg font-bold text-white">{{ trainer.experience }}</p>
                    <p class="text-xs text-gray-400">лет опыта</p>
                  </div>

                  <div class="text-center p-2 bg-gray-800/30 rounded">
                    <p class="text-lg font-bold text-white">{{ estimateClients(trainer) }}</p>
                    <p class="text-xs text-gray-400">клиентов</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Действия -->
            <div class="flex flex-col space-y-2">
              <UButton color="primary" size="sm" icon="i-heroicons-calendar-plus"
                @click.stop="handleBookSession(trainer)">
                Записаться
              </UButton>

              <UButton variant="outline" size="sm" icon="i-heroicons-chat-bubble-left"
                @click.stop="handleMessage(trainer)">
                Написать
              </UButton>

              <UButton variant="ghost" size="sm" icon="i-heroicons-eye" @click.stop="handleTrainerSelect(trainer)">
                Профиль
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Пустое состояние -->
    <div v-else-if="!loading" class="text-center py-12">
      <UIcon name="i-heroicons-user-group" class="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-white mb-2">Тренеры не найдены</h3>
      <p class="text-gray-400 mb-6">
        Попробуйте изменить параметры поиска или сбросить фильтры
      </p>
      <UButton variant="outline" icon="i-heroicons-arrow-path" @click="handleFiltersReset">
        Сбросить фильтры
      </UButton>
    </div>

    <!-- Пагинация -->
    <div v-if="totalPages > 1" class="flex justify-center mt-8">
      <UPagination v-model="currentPage" :total="totalCount" :page-size="pageSize" :max="5"
        @change="handlePageChange" />
    </div>

    <!-- Кнопка "Загрузить еще" -->
    <div v-if="canLoadMore" class="text-center mt-8">
      <UButton variant="outline" size="lg" :loading="loadingMore" @click="loadMore">
        Загрузить еще
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Trainer } from '~/types'
import {
  getMartialArtColor,
  getWorkoutTypeLabel,
  type BadgeColor
} from '~/types/martial-arts'

interface Props {
  trainers: Trainer[]
  loading?: boolean
  variant?: 'grid' | 'list'
  columns?: 1 | 2 | 3 | 4
  showFilters?: boolean
  totalCount?: number
  currentPage?: number
  pageSize?: number
  totalPages?: number
  canLoadMore?: boolean
  loadingMore?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  variant: 'grid',
  columns: 3,
  showFilters: false,
  totalCount: 0,
  currentPage: 1,
  pageSize: 12,
  totalPages: 1,
  canLoadMore: false,
  loadingMore: false
})

interface Emits {
  'trainer-select': [trainer: Trainer]
  'book-session': [trainer: Trainer]
  'message': [trainer: Trainer]
  'filters-change': [filters: any]
  'page-change': [page: number]
  'load-more': []
  'variant-change': [variant: 'grid' | 'list']
  'columns-change': [columns: number]
  'sort-change': [sortBy: string]
}

const emit = defineEmits<Emits>()

// Реактивные данные
const variant = ref(props.variant)
const gridColumns = ref(props.columns)
const sortBy = ref('rating')
const selectedSpecializations = ref<string[]>([])
const experienceRange = ref<[number, number]>([0, 20])
const ratingMin = ref(0)
const activeQuickFilters = ref<string[]>([])

// Константы
const columnOptions = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 }
]

const sortOptions = [
  { label: 'По рейтингу', value: 'rating' },
  { label: 'По опыту', value: 'experience' },
  { label: 'По популярности', value: 'popularity' },
  { label: 'Алфавитный порядок', value: 'name' },
  { label: 'Новые тренеры', value: 'newest' }
]

// Быстрые фильтры с правильной типизацией
const quickFilters = [
  { key: 'top-rated', label: 'Топ рейтинг', color: 'yellow' as BadgeColor, icon: 'i-heroicons-star' },
  { key: 'experienced', label: 'Опытные', color: 'blue' as BadgeColor, icon: 'i-heroicons-academic-cap' },
  { key: 'certified', label: 'Сертифицированные', color: 'green' as BadgeColor, icon: 'i-heroicons-check-badge' },
  { key: 'available-today', label: 'Доступны сегодня', color: 'purple' as BadgeColor, icon: 'i-heroicons-calendar' },
  { key: 'online', label: 'Онлайн тренировки', color: 'cyan' as BadgeColor, icon: 'i-heroicons-video-camera' }
]

// Вычисляемые свойства
const displayedTrainers = computed(() => {
  let filtered = [...props.trainers]

  // Применяем быстрые фильтры
  if (activeQuickFilters.value.includes('top-rated')) {
    filtered = filtered.filter(t => t.rating >= 4.5)
  }
  if (activeQuickFilters.value.includes('experienced')) {
    filtered = filtered.filter(t => t.experience >= 5)
  }
  if (activeQuickFilters.value.includes('certified')) {
    filtered = filtered.filter(t => t.certifications && t.certifications.length > 0)
  }
  if (activeQuickFilters.value.includes('available-today')) {
    // Логика для доступных сегодня
    filtered = filtered.filter(t => t.isActive)
  }
  if (activeQuickFilters.value.includes('online')) {
    // Логика для онлайн тренировок
    filtered = filtered.filter(t => t.isActive)
  }

  // Сортировка
  switch (sortBy.value) {
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating)
      break
    case 'experience':
      filtered.sort((a, b) => b.experience - a.experience)
      break
    case 'popularity':
      filtered.sort((a, b) => b.reviewsCount - a.reviewsCount)
      break
    case 'name':
      filtered.sort((a, b) => `${a.user.firstName} ${a.user.lastName}`.localeCompare(`${b.user.firstName} ${b.user.lastName}`))
      break
    case 'newest':
      filtered.sort((a, b) => new Date(b.user.createdAt || '').getTime() - new Date(a.user.createdAt || '').getTime())
      break
  }

  return filtered
})

const gridClasses = computed(() => {
  const classes = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }
  return classes[gridColumns.value]
})

const availableSpecializations = computed(() => {
  const specializations = new Set<string>()
  props.trainers.forEach(trainer => {
    trainer.specialization.forEach(spec => specializations.add(spec))
  })
  return Array.from(specializations)
})

// Методы
const handleTrainerSelect = (trainer: Trainer) => {
  emit('trainer-select', trainer)
}

const handleBookSession = (trainer: Trainer) => {
  emit('book-session', trainer)
}

const handleMessage = (trainer: Trainer) => {
  emit('message', trainer)
}

const changeVariant = (newVariant: 'grid' | 'list') => {
  variant.value = newVariant
  emit('variant-change', newVariant)
}

const changeColumns = (columns: number) => {
  gridColumns.value = columns as 1 | 2 | 3 | 4
  emit('columns-change', columns)
}

const handleSortChange = () => {
  emit('sort-change', sortBy.value)
}

const toggleQuickFilter = (filterKey: string) => {
  const index = activeQuickFilters.value.indexOf(filterKey)
  if (index > -1) {
    activeQuickFilters.value.splice(index, 1)
  } else {
    activeQuickFilters.value.push(filterKey)
  }
}

const clearQuickFilters = () => {
  activeQuickFilters.value = []
}

const handleSpecializationsChange = (specializations: string[]) => {
  selectedSpecializations.value = specializations
  emitFiltersChange()
}

const handleExperienceChange = (range: [number, number]) => {
  experienceRange.value = range
  emitFiltersChange()
}

const handleRatingChange = (rating: number) => {
  ratingMin.value = rating
  emitFiltersChange()
}

const handleAvailabilityChange = (availability: any) => {
  emitFiltersChange()
}

const handleFiltersApply = (filters: any) => {
  emit('filters-change', filters)
}

const handleFiltersReset = () => {
  selectedSpecializations.value = []
  experienceRange.value = [0, 20]
  ratingMin.value = 0
  activeQuickFilters.value = []
  emit('filters-change', {})
}

const handlePageChange = (page: number) => {
  emit('page-change', page)
}

const loadMore = () => {
  emit('load-more')
}

const emitFiltersChange = () => {
  const filters = {
    specializations: selectedSpecializations.value,
    experienceRange: experienceRange.value,
    ratingMin: ratingMin.value,
    quickFilters: activeQuickFilters.value
  }
  emit('filters-change', filters)
}

// Утилиты
const getTrainerCountLabel = (count: number) => {
  if (count === 1) return 'тренер'
  if (count >= 2 && count <= 4) return 'тренера'
  return 'тренеров'
}

const estimateClients = (trainer: Trainer) => {
  const base = trainer.experience * 15
  const bonus = trainer.rating * 8
  return Math.round(base + bonus)
}

// Отслеживание изменений пропсов
watch(() => props.variant, (newVariant) => {
  variant.value = newVariant
})

watch(() => props.columns, (newColumns) => {
  gridColumns.value = newColumns
})
</script>

<style scoped>
.trainer-list {
  @apply space-y-6;
}

.trainer-list-item {
  @apply transition-all duration-200;
}

.trainer-list-item:hover {
  @apply transform scale-[1.01];
}

/* Ограничение строк */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Анимации */
.trainer-grid-enter-active,
.trainer-grid-leave-active {
  transition: all 0.3s ease;
}

.trainer-grid-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.trainer-grid-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Адаптивность для мобильных */
@media (max-width: 768px) {
  .trainer-list-item .flex {
    @apply flex-col space-x-0 space-y-4;
  }

  .trainer-list-item .flex>div:last-child {
    @apply flex-row space-y-0 space-x-2 justify-center;
  }
}
</style>