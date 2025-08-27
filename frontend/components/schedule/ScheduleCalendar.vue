<template>
  <div class="schedule-calendar">
    <!-- Заголовок календаря -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-4">
        <h2 class="text-xl font-bold text-white">
          {{ headerTitle }}
        </h2>
        <div class="flex items-center space-x-2">
          <UButton variant="ghost" icon="i-heroicons-chevron-left" size="sm" @click="navigatePrevious"
            :disabled="loading" />
          <UButton variant="ghost" icon="i-heroicons-chevron-right" size="sm" @click="navigateNext"
            :disabled="loading" />
          <UButton variant="outline" size="sm" @click="goToToday" :disabled="loading">
            Сегодня
          </UButton>
        </div>
      </div>

      <!-- Переключатель видов -->
      <div class="flex items-center space-x-2">
        <div class="flex rounded-lg bg-gray-800 p-1">
          <UButton v-for="viewOption in viewOptions" :key="viewOption.value"
            :variant="currentView === viewOption.value ? 'solid' : 'ghost'" size="xs" :icon="viewOption.icon"
            @click="changeView(viewOption.value as CalendarView)" :disabled="loading">
            {{ viewOption.label }}
          </UButton>
        </div>
      </div>
    </div>

    <!-- Быстрые фильтры -->
    <div class="flex flex-wrap gap-2 mb-6">
      <UButton v-for="filter in quickFilters" :key="filter.key"
        :variant="activeQuickFilters.includes(filter.key) ? 'solid' : 'outline'" :color="filter.color" size="xs"
        :icon="filter.icon" @click="toggleQuickFilter(filter.key)">
        {{ filter.label }}
      </UButton>
    </div>

    <!-- Легенда -->
    <div class="flex flex-wrap gap-4 mb-6 text-sm">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 bg-green-500 rounded-full"></div>
        <span class="text-gray-300">Доступно</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
        <span class="text-gray-300">Идет занятие</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <span class="text-gray-300">Сегодня</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 bg-orange-500 rounded-full"></div>
        <span class="text-gray-300">Заполнено</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 bg-red-500 rounded-full"></div>
        <span class="text-gray-300">Отменено</span>
      </div>
    </div>

    <!-- Основной календарь -->
    <div class="calendar-container bg-gray-900 rounded-lg p-4 border border-gray-700">
      <!-- Заголовки дней недели -->
      <div class="grid grid-cols-7 gap-1 mb-2">
        <div v-for="day in weekDays" :key="day" class="text-center text-sm font-medium text-gray-400 p-2">
          {{ day }}
        </div>
      </div>

      <!-- Дни месяца -->
      <div class="grid grid-cols-7 gap-1">
        <div v-for="day in calendarDays" :key="day.dateString" :class="getDayClasses(day)"
          @click="selectDate(day.date)">
          <!-- Номер дня -->
          <div :class="getDayNumberClasses(day)">
            {{ day.dayNumber }}
          </div>

          <!-- События дня -->
          <div v-if="day.events.length > 0" class="events-container mt-1 space-y-1">
            <div v-for="(event, index) in day.events.slice(0, 3)" :key="event.id" :class="getEventClasses(event)"
              @click.stop="selectEvent(event)">
              <div class="flex items-center gap-1 text-xs">
                <span class="event-time">{{ formatEventTime(event.startTime) }}</span>
                <span class="event-title truncate flex-1">{{ event.workout.name }}</span>
              </div>
              <!-- Индикатор заполненности -->
              <div v-if="event.currentParticipants > 0" class="absolute -top-0.5 -right-0.5 w-1 h-1 rounded-full"
                :class="getCapacityIndicatorClass(event)"></div>
            </div>

            <!-- Показать количество дополнительных событий -->
            <div v-if="day.events.length > 3"
              class="text-xs text-gray-400 text-center cursor-pointer hover:text-gray-300 transition-colors"
              @click.stop="selectDate(day.date)">
              +{{ day.events.length - 3 }} еще
            </div>
          </div>

          <!-- Индикаторы состояний -->
          <div class="absolute bottom-1 right-1 flex gap-0.5">
            <div v-if="day.isToday" class="w-1 h-1 bg-yellow-500 rounded-full"></div>
            <div v-if="day.events.length > 0" class="w-1 h-1 bg-blue-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Детали выбранного дня -->
    <div v-if="selectedDayEvents.length > 0" class="selected-day-details mt-6">
      <UCard class="bg-gray-800 border-gray-700">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-white">
              События на {{ formatSelectedDate }}
            </h3>
            <UBadge color="blue" variant="soft">
              {{ selectedDayEvents.length }} {{ selectedDayEvents.length === 1 ? 'событие' : 'событий' }}
            </UBadge>
          </div>
        </template>

        <div class="space-y-3">
          <UCard v-for="event in selectedDayEvents" :key="event.id" :class="[
            'event-card cursor-pointer transition-all duration-200',
            'hover:shadow-lg hover:scale-[1.02]',
            getEventCardClasses(event)
          ]" @click="selectEvent(event)">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <!-- Бейджи статуса и типа -->
                <div class="flex items-center gap-2 mb-2">
                  <UBadge :color="getMartialArtColor(event.workout.type)" variant="soft" size="xs">
                    {{ getWorkoutTypeLabel(event.workout.type) }}
                  </UBadge>
                  <UBadge :color="getStatusColor(event.status)" variant="outline" size="xs">
                    {{ getStatusLabel(event.status) }}
                  </UBadge>
                </div>

                <!-- Информация о тренировке -->
                <h4 class="font-semibold text-white mb-1">{{ event.workout.name }}</h4>
                <p class="text-sm text-gray-400 mb-1 flex items-center gap-1">
                  <UIcon name="i-heroicons-clock" class="w-3 h-3" />
                  {{ formatEventTimeRange(event.startTime, event.endTime) }}
                </p>
                <p class="text-sm text-gray-400 flex items-center gap-1">
                  <UIcon name="i-heroicons-user" class="w-3 h-3" />
                  {{ event.trainer.user.firstName }} {{ event.trainer.user.lastName }}
                </p>
              </div>

              <!-- Информация о заполненности и кнопки -->
              <div class="text-right">
                <p class="text-sm text-gray-400 mb-2">
                  {{ event.currentParticipants }}/{{ event.maxParticipants }} мест
                </p>

                <!-- Прогресс бар заполненности -->
                <UProgress :value="getEventProgressPercentage(event)" :color="getProgressColor(event)" size="xs"
                  class="mb-2 w-16" />

                <!-- Кнопки действий -->
                <UButton v-if="canBookEvent(event)" color="green" size="sm" @click.stop="bookEvent(event)">
                  Записаться
                </UButton>
                <UButton v-else-if="event.status === 'in_progress'" color="blue" variant="soft" size="sm" disabled>
                  Идет занятие
                </UButton>
                <UButton v-else-if="event.currentParticipants >= event.maxParticipants" color="orange" variant="soft"
                  size="sm" disabled>
                  Заполнено
                </UButton>
                <UButton v-else color="gray" variant="soft" size="sm" disabled>
                  Недоступно
                </UButton>
              </div>
            </div>
          </UCard>
        </div>
      </UCard>
    </div>

    <!-- Модалка с деталями события -->
    <UModal v-model="eventModalOpen">
      <UCard v-if="selectedEvent" class="bg-gray-900 border-gray-700">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-white">{{ selectedEvent.workout.name }}</h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" @click="eventModalOpen = false" />
          </div>
        </template>

        <div class="space-y-4">
          <!-- Бейджи -->
          <div class="flex items-center gap-4">
            <UBadge :color="getMartialArtColor(selectedEvent.workout.type)" variant="soft">
              {{ getWorkoutTypeLabel(selectedEvent.workout.type) }}
            </UBadge>
            <UBadge :color="getStatusColor(selectedEvent.status)" variant="outline">
              {{ getStatusLabel(selectedEvent.status) }}
            </UBadge>
          </div>

          <!-- Основная информация -->
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-400">Время:</span>
              <p class="text-white">{{ formatEventTimeRange(selectedEvent.startTime, selectedEvent.endTime) }}</p>
            </div>
            <div>
              <span class="text-gray-400">Тренер:</span>
              <p class="text-white">{{ selectedEvent.trainer.user.firstName }} {{ selectedEvent.trainer.user.lastName }}
              </p>
            </div>
            <div>
              <span class="text-gray-400">Участники:</span>
              <p class="text-white">{{ selectedEvent.currentParticipants }}/{{ selectedEvent.maxParticipants }}</p>
            </div>
            <div>
              <span class="text-gray-400">Длительность:</span>
              <p class="text-white">{{ selectedEvent.workout.duration }} мин</p>
            </div>
          </div>

          <!-- Описание -->
          <div v-if="selectedEvent.workout.description">
            <span class="text-gray-400">Описание:</span>
            <p class="mt-1 text-white">{{ selectedEvent.workout.description }}</p>
          </div>

          <!-- Заметки -->
          <div v-if="selectedEvent.notes">
            <span class="text-gray-400">Заметки:</span>
            <p class="mt-1 text-sm bg-gray-700 p-2 rounded text-gray-300">{{ selectedEvent.notes }}</p>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" @click="eventModalOpen = false">
              Закрыть
            </UButton>
            <UButton v-if="canBookEvent(selectedEvent)" color="green" @click="bookEventFromModal">
              Записаться
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { useScheduleCalendar } from '~/composables/useScheduleCalendar'
import type { ScheduleItem, WorkoutType } from '~/types'
import {
  getMartialArtColor,
  getWorkoutTypeLabel,
  type BadgeColor
} from '~/types/martial-arts'

// Props
interface Props {
  scheduleItems: ScheduleItem[]
  selectedDate?: Date
  view?: 'month' | 'week' | 'day'
  loading?: boolean
  minDate?: Date
  maxDate?: Date
  businessHours?: {
    start: string
    end: string
    days: number[]
  }
  timeSlotDuration?: number
  showWeekends?: boolean
  eventColors?: Record<WorkoutType, string>
}

const props = withDefaults(defineProps<Props>(), {
  selectedDate: () => new Date(),
  view: 'month',
  loading: false,
  businessHours: () => ({
    start: '08:00',
    end: '22:00',
    days: [1, 2, 3, 4, 5, 6, 0]
  }),
  timeSlotDuration: 60,
  showWeekends: true
})

// Emits
interface Emits {
  'dateSelect': [date: Date]
  'eventClick': [event: ScheduleItem]
  'viewChange': [view: string]
  'book': [event: ScheduleItem]
}

const emit = defineEmits<Emits>()

// Используем composable для календаря
const {
  selectedDate,
  currentView,
  isLoading,
  error,
  scheduleItems,
  activeQuickFilters,
  headerTitle,
  selectedDayEvents,
  navigatePrevious,
  navigateNext,
  goToToday,
  changeView,
  filterEvents,
  getEventsForDay,
  formatTime: formatEventTime,
  formatTimeRange: formatEventTimeRange,
  canBookEvent,
  getEventStatusColor,
  getEventProgressPercentage,
  isToday,
  bookEvent: handleBookEvent
} = useScheduleCalendar()

// Локальное состояние
const eventModalOpen = ref(false)
const selectedEvent = ref<ScheduleItem | null>(null)

// View options
const viewOptions = [
  { value: 'month', label: 'Месяц', icon: 'i-heroicons-calendar' },
  { value: 'week', label: 'Неделя', icon: 'i-heroicons-calendar-days' },
  { value: 'day', label: 'День', icon: 'i-heroicons-clock' }
]

// Quick filters
const quickFilters = [
  { key: 'available', label: 'Доступные', color: 'green' as BadgeColor, icon: 'i-heroicons-check-circle' },
  { key: 'full', label: 'Заполнено', color: 'orange' as BadgeColor, icon: 'i-heroicons-user-group' },
  { key: 'in-progress', label: 'Идет занятие', color: 'blue' as BadgeColor, icon: 'i-heroicons-play' },
  { key: 'today', label: 'Сегодня', color: 'yellow' as BadgeColor, icon: 'i-heroicons-calendar-days' }
]

const weekDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

// Interface for calendar day
interface CalendarDay {
  date: Date
  dateString: string
  dayNumber: number
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  events: ScheduleItem[]
}

// Computed
const formatSelectedDate = computed(() => {
  return selectedDate.value.toLocaleDateString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const calendarDays = computed((): CalendarDay[] => {
  const year = selectedDate.value.getFullYear()
  const month = selectedDate.value.getMonth()
  const today = new Date()

  // Первый день месяца
  const firstDay = new Date(year, month, 1)

  // Начинаем с воскресенья предыдущей недели
  const startDate = new Date(firstDay)
  startDate.setDate(firstDay.getDate() - firstDay.getDay())

  const days: CalendarDay[] = []
  const currentDate = new Date(startDate)

  // Генерируем 42 дня (6 недель)
  for (let i = 0; i < 42; i++) {
    const date = new Date(currentDate)
    const dateString = date.toISOString().split('T')[0]

    days.push({
      date,
      dateString,
      dayNumber: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
      isToday: isSameDay(date, today),
      isSelected: isSameDay(date, selectedDate.value),
      events: getEventsForDay(date)
    })

    currentDate.setDate(currentDate.getDate() + 1)
  }

  return days
})

// Methods
const selectDate = (date: Date) => {
  selectedDate.value = new Date(date)
  emit('dateSelect', date)
}

const selectEvent = (event: ScheduleItem) => {
  selectedEvent.value = event
  eventModalOpen.value = true
  emit('eventClick', event)
}

const handleViewChange = (view: string) => {
  const validView = view as 'month' | 'week' | 'day'
  changeView(validView)
  emit('viewChange', view)
}

const bookEvent = async (event: ScheduleItem) => {
  const success = await handleBookEvent(event.id)
  if (success) {
    emit('book', event)
  }
}

const bookEventFromModal = async () => {
  if (selectedEvent.value) {
    await bookEvent(selectedEvent.value)
    eventModalOpen.value = false
  }
}

const toggleQuickFilter = (filterKey: string) => {
  const index = activeQuickFilters.value.indexOf(filterKey)
  if (index > -1) {
    activeQuickFilters.value.splice(index, 1)
  } else {
    activeQuickFilters.value.push(filterKey)
  }
  filterEvents(activeQuickFilters.value)
}

// Utility methods
const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
}

const getDayClasses = (day: CalendarDay): string => {
  const classes = [
    'calendar-day relative min-h-[80px] p-2 rounded-lg transition-all duration-200 cursor-pointer',
    'hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500'
  ]

  if (day.isCurrentMonth) {
    classes.push('bg-gray-800')
  } else {
    classes.push('bg-gray-850 opacity-50')
  }

  if (day.isSelected) {
    classes.push('ring-2 ring-blue-500 bg-blue-900/20')
  }

  if (day.isToday) {
    classes.push('ring-2 ring-yellow-500')
  }

  return classes.join(' ')
}

const getDayNumberClasses = (day: CalendarDay): string => {
  const classes = ['day-number text-sm font-medium mb-1']

  if (day.isToday) {
    classes.push('text-yellow-400 font-bold')
  } else if (day.isCurrentMonth) {
    classes.push('text-white')
  } else {
    classes.push('text-gray-500')
  }

  return classes.join(' ')
}

const getEventClasses = (event: ScheduleItem): string => {
  const baseClasses = [
    'relative p-1 rounded text-xs cursor-pointer transition-all duration-200',
    'hover:scale-105 border-l-2'
  ]

  if (canBookEvent(event)) {
    baseClasses.push('bg-green-500/20 text-green-300 border-green-500')
  } else if (event.status === 'in_progress') {
    baseClasses.push('bg-blue-500/20 text-blue-300 border-blue-500')
  } else if (event.status === 'cancelled') {
    baseClasses.push('bg-red-500/20 text-red-300 border-red-500')
  } else if (event.currentParticipants >= event.maxParticipants) {
    baseClasses.push('bg-orange-500/20 text-orange-300 border-orange-500')
  } else {
    baseClasses.push('bg-gray-500/20 text-gray-300 border-gray-500')
  }

  return baseClasses.join(' ')
}

const getEventCardClasses = (event: ScheduleItem): string => {
  const classes = []

  if (canBookEvent(event)) {
    classes.push('border-l-4 border-green-500 hover:border-green-400')
  } else if (event.status === 'in_progress') {
    classes.push('border-l-4 border-blue-500 hover:border-blue-400')
  } else if (event.status === 'cancelled') {
    classes.push('border-l-4 border-red-500 hover:border-red-400')
  } else if (event.currentParticipants >= event.maxParticipants) {
    classes.push('border-l-4 border-orange-500 hover:border-orange-400')
  }

  return classes.join(' ')
}

const getCapacityIndicatorClass = (event: ScheduleItem): string => {
  const percentage = (event.currentParticipants / event.maxParticipants) * 100

  if (percentage >= 100) return 'bg-red-500'
  if (percentage >= 80) return 'bg-orange-500'
  if (percentage >= 50) return 'bg-yellow-500'
  return 'bg-green-500'
}

const getStatusColor = (status: string): BadgeColor => {
  const statusColors: Record<string, BadgeColor> = {
    scheduled: 'green',
    in_progress: 'blue',
    completed: 'gray',
    cancelled: 'red',
    postponed: 'yellow'
  }
  return statusColors[status] || 'gray'
}

const getStatusLabel = (status: string): string => {
  const statusLabels: Record<string, string> = {
    scheduled: 'Запланировано',
    in_progress: 'Идет занятие',
    completed: 'Завершено',
    cancelled: 'Отменено',
    postponed: 'Отложено'
  }
  return statusLabels[status] || status
}

const getProgressColor = (event: ScheduleItem): 'primary' | 'red' | 'orange' | 'yellow' | 'green' => {
  const percentage = (event.currentParticipants / event.maxParticipants) * 100
  if (percentage >= 100) return 'red'
  if (percentage >= 80) return 'orange'
  if (percentage >= 50) return 'yellow'
  return 'green'
}

// Инициализируем данные календаря из пропсов
watch(() => props.scheduleItems, (newItems) => {
  scheduleItems.value = newItems
}, { immediate: true })

// Синхронизируем selectedDate с пропом
watch(() => props.selectedDate, (newDate) => {
  if (newDate) {
    selectedDate.value = new Date(newDate)
  }
}, { immediate: true })

// Синхронизируем view с пропом
watch(() => props.view, (newView) => {
  currentView.value = newView
}, { immediate: true })
</script>

<style scoped>
.schedule-calendar {
  @apply space-y-4;
}

.calendar-day {
  @apply relative;
}

.events-container {
  max-height: 60px;
  overflow: hidden;
}

.event-card {
  @apply transition-all duration-200;
}

.event-card:hover {
  @apply transform;
}

.selected-day-details {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Улучшаем адаптивность */
@media (max-width: 640px) {
  .calendar-day {
    min-height: 60px;
  }

  .events-container {
    max-height: 40px;
  }
}
</style>