<!-- components/profile/WorkoutHistory.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-white font-bold text-xl">История тренировок</h3>

      <div class="flex items-center space-x-3">
        <!-- Filter Toggle -->
        <UButton @click="showFilters = !showFilters" variant="outline" size="sm">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
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
        <AppSelect v-model="filters.status" label="Статус" :options="statusOptions" size="sm" />
        <AppSelect v-model="filters.workoutType" label="Тип единоборства" :options="workoutTypeOptions" size="sm" />
        <AppInput v-model="filters.search" label="Поиск" placeholder="Поиск по названию..." size="sm" />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 5" :key="i" class="bg-gray-900 border border-gray-800 rounded-xl p-6 animate-pulse">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-gray-700 rounded-lg"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-700 rounded w-1/3"></div>
            <div class="h-3 bg-gray-700 rounded w-1/2"></div>
          </div>
          <div class="w-20 h-8 bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredBookings.length === 0" class="text-center py-12">
      <div class="w-24 h-24 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
        <svg class="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
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
              <div class="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center text-2xl">
                {{ getWorkoutIcon(booking.scheduleItem.workout.type) }}
              </div>
              <div>
                <h4 class="text-white font-semibold">
                  {{ WORKOUT_TYPES[booking.scheduleItem.workout.type] }}
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

          <!-- Trainer -->
          <div class="flex items-center space-x-3 py-3 border-t border-gray-800">
            <img :src="booking.scheduleItem.trainer.user.avatar || '/default-avatar.png'"
              :alt="booking.scheduleItem.trainer.user.firstName" class="w-8 h-8 rounded-full border-2 border-gray-700">
            <div>
              <p class="text-white text-sm font-medium">
                {{ booking.scheduleItem.trainer.user.firstName }} {{ booking.scheduleItem.trainer.user.lastName }}
              </p>
              <p class="text-gray-400 text-xs">
                {{ booking.scheduleItem.trainer.experience }} лет опыта
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex space-x-3 pt-3 border-t border-gray-800">
            <UButton @click="handleViewDetails(booking)" variant="outline" size="sm" class="flex-1">
              Детали
            </UButton>
            <UButton v-if="booking.status === 'completed' && !booking.rating" @click="handleRateWorkout(booking)"
              color="red" size="sm">
              Оценить
            </UButton>
            <UButton v-else-if="canCancel(booking)" @click="handleCancelBooking(booking)" color="gray" variant="outline"
              size="sm">
              Отменить
            </UButton>
          </div>
        </div>

        <!-- List View -->
        <div v-else class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-lg">
              {{ getWorkoutIcon(booking.scheduleItem.workout.type) }}
            </div>
            <div>
              <h4 class="text-white font-medium">
                {{ WORKOUT_TYPES[booking.scheduleItem.workout.type] }}
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
                color="red" size="sm">
                Оценить
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && pagination.total > pagination.limit" class="flex justify-center">
      <div class="flex items-center space-x-2">
        <UButton @click="goToPage(pagination.page - 1)" :disabled="pagination.page <= 1" variant="outline" size="sm">
          Назад
        </UButton>

        <span class="text-gray-400 text-sm px-4">
          Страница {{ pagination.page }} из {{ Math.ceil(pagination.total / pagination.limit) }}
        </span>

        <UButton @click="goToPage(pagination.page + 1)"
          :disabled="pagination.page >= Math.ceil(pagination.total / pagination.limit)" variant="outline" size="sm">
          Вперед
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Booking, WorkoutType } from '@/types'
import { WORKOUT_TYPES } from '@/types'
import { MARTIAL_ARTS_CATEGORIES, getMartialArtsCategory } from '@/types/martial-arts'

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

const viewMode = ref<'cards' | 'list'>('cards')
const showFilters = ref(false)

const filters = reactive({
  status: '',
  workoutType: '',
  search: ''
})

const statusOptions = [
  { label: 'Все статусы', value: '' },
  { label: 'Забронировано', value: 'booked' },
  { label: 'Завершено', value: 'completed' },
  { label: 'Отменено', value: 'cancelled' },
  { label: 'Не явился', value: 'no_show' }
]

const workoutTypeOptions = computed(() => [
  { label: 'Все единоборства', value: '' },
  ...Object.entries(WORKOUT_TYPES).map(([key, value]) => ({
    label: value,
    value: key
  }))
])

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
      WORKOUT_TYPES[booking.scheduleItem.workout.type].toLowerCase().includes(searchLower) ||
      `${booking.scheduleItem.trainer.user.firstName} ${booking.scheduleItem.trainer.user.lastName}`.toLowerCase().includes(searchLower)
    )
  }

  return filtered.sort((a, b) =>
    new Date(b.scheduleItem.startTime).getTime() - new Date(a.scheduleItem.startTime).getTime()
  )
})

const paginatedBookings = computed(() => {
  if (!props.pagination) return filteredBookings.value

  const start = (props.pagination.page - 1) * props.pagination.limit
  const end = start + props.pagination.limit
  return filteredBookings.value.slice(start, end)
})

const getWorkoutIcon = (type: string) => {
  const category = getMartialArtsCategory(type as WorkoutType)
  return MARTIAL_ARTS_CATEGORIES[category].icon
}

const getStatusColor = (status: string) => {
  const colors = {
    booked: 'blue',
    completed: 'green',
    cancelled: 'red',
    no_show: 'yellow'
  }
  return (colors as any)[status] || 'gray'
}

const getStatusLabel = (status: string) => {
  const labels = {
    booked: 'Забронировано',
    completed: 'Завершено',
    cancelled: 'Отменено',
    no_show: 'Не явился'
  }
  return (labels as any)[status] || status
}

const formatDateTime = (dateTime: string) => {
  return new Date(dateTime).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const canCancel = (booking: Booking) => {
  if (booking.status !== 'booked') return false

  const startTime = new Date(booking.scheduleItem.startTime)
  const now = new Date()
  const hoursUntilStart = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60)

  return hoursUntilStart > 2 // Can cancel if more than 2 hours before start
}

const handleViewDetails = (booking: Booking) => {
  emit('viewDetails', booking)
}

const handleRateWorkout = (booking: Booking) => {
  emit('rateWorkout', booking)
}

const handleCancelBooking = (booking: Booking) => {
  emit('cancelBooking', booking)
}

const goToPage = (page: number) => {
  emit('pageChange', page)
}
</script>