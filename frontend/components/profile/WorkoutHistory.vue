<!-- components/profile/WorkoutHistory.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-white font-bold text-xl">История тренировок</h3>

      <div class="flex items-center space-x-3">
        <!-- Filter Toggle -->
        <UButton @click="showFilters = !showFilters" variant="outline" size="sm">
          <UIcon name="i-heroicons-funnel" class="w-4 h-4 mr-2" />
          Фильтры
        </UButton>

        <!-- View Toggle -->
        <div class="flex rounded-lg border border-gray-700 overflow-hidden">
          <button @click="viewMode = 'list'" :class="[
            'px-3 py-1 text-sm transition-colors',
            viewMode === 'list'
              ? 'bg-red-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          ]">
            Список
          </button>
          <button @click="viewMode = 'cards'" :class="[
            'px-3 py-1 text-sm transition-colors',
            viewMode === 'cards'
              ? 'bg-red-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          ]">
            Карточки
          </button>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div v-if="showFilters" class="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <USelectMenu v-model="filters.status" :options="statusOptions" placeholder="Все статусы" size="sm" />
        <USelectMenu v-model="filters.workoutType" :options="workoutTypeOptions" placeholder="Все единоборства"
          size="sm" />
        <UInput v-model="filters.search" placeholder="Поиск по названию..." size="sm"
          icon="i-heroicons-magnifying-glass" />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 5" :key="i" class="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div class="flex items-center space-x-4">
          <USkeleton class="w-12 h-12 rounded-lg" />
          <div class="flex-1 space-y-2">
            <USkeleton class="h-4 w-1/3" />
            <USkeleton class="h-3 w-1/2" />
          </div>
          <USkeleton class="w-20 h-8 rounded" />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredBookings.length === 0" class="text-center py-12">
      <div class="w-24 h-24 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
        <UIcon name="i-heroicons-calendar-x-mark" class="w-12 h-12 text-gray-600" />
      </div>
      <h3 class="text-white text-xl font-semibold mb-2">Тренировки не найдены</h3>
      <p class="text-gray-400">Начните тренироваться, чтобы увидеть историю</p>
    </div>

    <!-- Bookings List -->
    <div v-else :class="viewMode === 'cards' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'">
      <div v-for="booking in paginatedBookings" :key="booking.id"
        :class="viewMode === 'cards' ? 'bg-gray-900 border border-gray-800 rounded-xl p-6' : 'bg-gray-900 border border-gray-800 rounded-xl p-4'">

        <!-- Card View -->
        <div v-if="viewMode === 'cards'" class="space-y-4">
          <!-- Header -->
          <div class="flex items-start justify-between">
            <div class="flex items-center space-x-3">
              <div :class="getWorkoutTypeIconBackground(booking.scheduleItem.workout.type)"
                class="w-12 h-12 rounded-lg flex items-center justify-center">
                <UIcon :name="getWorkoutTypeIcon(booking.scheduleItem.workout.type)" class="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 class="text-white font-semibold">
                  {{ getWorkoutTypeLabel(booking.scheduleItem.workout.type) }}
                </h4>
                <p class="text-gray-400 text-sm">
                  {{ formatDateTime(booking.scheduleItem.startTime) }}
                </p>
              </div>
            </div>
            <UBadge :color="getStatusColor(booking.status)" size="sm">
              {{ getStatusLabel(booking.status) }}
            </UBadge>
          </div>

          <!-- Workout Details -->
          <div class="py-3 border-t border-gray-800">
            <p class="text-white font-medium mb-1">{{ booking.scheduleItem.workout.title }}</p>
            <p class="text-gray-400 text-sm">{{ booking.scheduleItem.workout.description }}</p>
            <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span>{{ booking.scheduleItem.workout.duration }} мин</span>
              <span>{{ getDifficultyLabel(booking.scheduleItem.workout.difficulty) }}</span>
              <span v-if="booking.scheduleItem.workout.maxParticipants">
                Макс. {{ booking.scheduleItem.workout.maxParticipants }} чел.
              </span>
            </div>
          </div>

          <!-- Trainer -->
          <div class="flex items-center space-x-3 py-3 border-t border-gray-800">
            <UAvatar :src="booking.scheduleItem.trainer.user.avatar"
              :alt="`${booking.scheduleItem.trainer.user.firstName} ${booking.scheduleItem.trainer.user.lastName}`"
              size="sm" />
            <div>
              <p class="text-white text-sm font-medium">
                {{ booking.scheduleItem.trainer.user.firstName }} {{ booking.scheduleItem.trainer.user.lastName }}
              </p>
              <p class="text-gray-400 text-xs">
                {{ booking.scheduleItem.trainer.experience }} лет опыта
              </p>
            </div>
          </div>

          <!-- Notes -->
          <div v-if="booking.notes" class="py-3 border-t border-gray-800">
            <p class="text-gray-400 text-xs mb-1">Заметки:</p>
            <p class="text-white text-sm">{{ booking.notes }}</p>
          </div>

          <!-- Rating -->
          <div v-if="booking.rating" class="py-3 border-t border-gray-800">
            <div class="flex items-center space-x-2">
              <span class="text-gray-400 text-xs">Оценка:</span>
              <div class="flex space-x-1">
                <UIcon v-for="i in 5" :key="i" name="i-heroicons-star-solid"
                  :class="i <= booking.rating ? 'text-yellow-500' : 'text-gray-600'" class="w-4 h-4" />
              </div>
              <span class="text-white text-sm">{{ booking.rating }}/5</span>
            </div>
            <p v-if="booking.review" class="text-gray-300 text-sm mt-1">{{ booking.review }}</p>
          </div>

          <!-- Actions -->
          <div class="flex space-x-3 pt-3 border-t border-gray-800">
            <UButton @click="handleViewDetails(booking)" variant="outline" size="sm" class="flex-1">
              Детали
            </UButton>
            <UButton v-if="booking.status === 'completed' && !booking.rating" @click="handleRateWorkout(booking)"
              color="primary" size="sm">
              Оценить
            </UButton>
            <UButton v-else-if="canCancel(booking)" @click="handleCancelBooking(booking)" color="red" variant="outline"
              size="sm">
              Отменить
            </UButton>
          </div>
        </div>

        <!-- List View -->
        <div v-else class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div :class="getWorkoutTypeIconBackground(booking.scheduleItem.workout.type)"
              class="w-10 h-10 rounded-lg flex items-center justify-center">
              <UIcon :name="getWorkoutTypeIcon(booking.scheduleItem.workout.type)" class="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 class="text-white font-medium">
                {{ getWorkoutTypeLabel(booking.scheduleItem.workout.type) }}
              </h4>
              <p class="text-gray-400 text-sm">
                {{ formatDateTime(booking.scheduleItem.startTime) }} •
                {{ booking.scheduleItem.trainer.user.firstName }} {{ booking.scheduleItem.trainer.user.lastName }}
              </p>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <UBadge :color="getStatusColor(booking.status)" size="sm">
              {{ getStatusLabel(booking.status) }}
            </UBadge>

            <div class="flex space-x-2">
              <UButton @click="handleViewDetails(booking)" variant="ghost" size="sm">
                Детали
              </UButton>
              <UButton v-if="booking.status === 'completed' && !booking.rating" @click="handleRateWorkout(booking)"
                color="primary" size="sm">
                Оценить
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && pagination.total > pagination.limit" class="flex justify-center">
      <UPagination v-model="currentPage" :page-count="pagination.limit" :total="pagination.total" :max="7" show-first
        show-last />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Booking, BookingStatus, WorkoutType } from '@/types'
import {
  BOOKING_STATUS_COLORS,
  BOOKING_STATUS_LABELS,
  DIFFICULTY_LABELS,
  WORKOUT_TYPE_ICONS,
  WORKOUT_TYPE_ICON_BACKGROUNDS,
  WORKOUT_TYPE_LABELS
} from '@/types/constants'

interface Props {
  bookings: Booking[]
  loading?: boolean
  pagination?: {
    page: number
    limit: number
    total: number
  }
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  viewDetails: [booking: Booking]
  rateWorkout: [booking: Booking]
  cancelBooking: [booking: Booking]
  pageChange: [page: number]
}>()

// Локальное состояние
const viewMode = ref<'cards' | 'list'>('cards')
const showFilters = ref(false)
const currentPage = ref(1)

const filters = reactive({
  status: '',
  workoutType: '',
  search: ''
})

// Опции для фильтров
const statusOptions = computed(() => [
  { label: 'Все статусы', value: '' },
  ...Object.entries(BOOKING_STATUS_LABELS).map(([key, value]) => ({
    label: value,
    value: key
  }))
])

const workoutTypeOptions = computed(() => [
  { label: 'Все единоборства', value: '' },
  ...Object.entries(WORKOUT_TYPE_LABELS).map(([key, value]) => ({
    label: value,
    value: key
  }))
])

// Вычисляемые свойства
const filteredBookings = computed(() => {
  let filtered = [...props.bookings]

  if (filters.status) {
    filtered = filtered.filter(booking => booking.status === filters.status)
  }

  if (filters.workoutType) {
    filtered = filtered.filter(booking =>
      booking.scheduleItem.workout.type === filters.workoutType
    )
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(booking =>
      getWorkoutTypeLabel(booking.scheduleItem.workout.type).toLowerCase().includes(searchLower) ||
      booking.scheduleItem.workout.title.toLowerCase().includes(searchLower) ||
      `${booking.scheduleItem.trainer.user.firstName} ${booking.scheduleItem.trainer.user.lastName}`.toLowerCase().includes(searchLower)
    )
  }

  return filtered.sort((a, b) =>
    new Date(b.scheduleItem.startTime).getTime() - new Date(a.scheduleItem.startTime).getTime()
  )
})

const paginatedBookings = computed(() => {
  if (!props.pagination) return filteredBookings.value

  const start = (currentPage.value - 1) * props.pagination.limit
  const end = start + props.pagination.limit
  return filteredBookings.value.slice(start, end)
})

// Методы-помощники
const getWorkoutTypeLabel = (type: WorkoutType): string => {
  return WORKOUT_TYPE_LABELS[type] || type
}

const getWorkoutTypeIcon = (type: WorkoutType): string => {
  return WORKOUT_TYPE_ICONS[type] || 'i-heroicons-academic-cap'
}

const getWorkoutTypeIconBackground = (type: WorkoutType): string => {
  return WORKOUT_TYPE_ICON_BACKGROUNDS[type] || 'bg-gray-600'
}

const getStatusColor = (status: BookingStatus): BadgeColor => {
  return BOOKING_STATUS_COLORS[status] || 'gray'
}

const getStatusLabel = (status: BookingStatus): string => {
  return BOOKING_STATUS_LABELS[status] || status
}

const getDifficultyLabel = (difficulty: string): string => {
  return DIFFICULTY_LABELS[difficulty as keyof typeof DIFFICULTY_LABELS] || difficulty
}

const formatDateTime = (dateTime: string): string => {
  return new Date(dateTime).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const canCancel = (booking: Booking): boolean => {
  if (!['confirmed', 'pending'].includes(booking.status)) return false

  const startTime = new Date(booking.scheduleItem.startTime)
  const now = new Date()
  const hoursUntilStart = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60)

  return hoursUntilStart > 2 // Можно отменить если больше 2 часов до начала
}

// Обработчики событий
const handleViewDetails = (booking: Booking) => {
  emit('viewDetails', booking)
}

const handleRateWorkout = (booking: Booking) => {
  emit('rateWorkout', booking)
}

const handleCancelBooking = (booking: Booking) => {
  emit('cancelBooking', booking)
}

// Следим за изменением страницы
watch(currentPage, (newPage) => {
  emit('pageChange', newPage)
})

// Сброс текущей страницы при изменении фильтров
watch([filters], () => {
  currentPage.value = 1
}, { deep: true })
</script>

<style scoped>
/* Стили для hover эффектов */
.hover\:bg-gray-700:hover {
  background-color: #374151;
}

/* Анимации */
.transition-colors {
  transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;
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

  .md\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>