<template>
  <div class="user-schedule-calendar">
    <!-- Заголовок календаря -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <h3 class="text-xl font-semibold text-white">
          {{ formatCurrentMonth }}
        </h3>
        <div class="flex gap-2">
          <UButton size="sm" variant="ghost" icon="i-heroicons-chevron-left" @click="previousMonth" />
          <UButton size="sm" variant="ghost" @click="goToToday">
            Сегодня
          </UButton>
          <UButton size="sm" variant="ghost" icon="i-heroicons-chevron-right" @click="nextMonth" />
        </div>
      </div>

      <!-- Переключатель вида -->
      <div class="flex gap-2">
        <UButton size="sm" :variant="currentView === 'month' ? 'solid' : 'ghost'" @click="changeView('month')">
          Месяц
        </UButton>
        <UButton size="sm" :variant="currentView === 'week' ? 'solid' : 'ghost'" @click="changeView('week')">
          Неделя
        </UButton>
      </div>
    </div>

    <!-- Легенда -->
    <div class="flex flex-wrap gap-4 mb-6 text-sm">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 bg-green-500 rounded-full"></div>
        <span class="text-gray-300">Завершено</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
        <span class="text-gray-300">Запланировано</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <span class="text-gray-300">Сегодня</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 bg-red-500 rounded-full"></div>
        <span class="text-gray-300">Отменено</span>
      </div>
    </div>

    <!-- Календарь на обычных Date (без @internationalized/date) -->
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

          <!-- Тренировки пользователя на этот день -->
          <div v-if="day.workouts.length > 0" class="workouts-container mt-1 w-full">
            <div v-for="workout in day.workouts.slice(0, 2)" :key="workout.id"
              :class="getWorkoutIndicatorClasses(workout)" @click.stop="selectWorkout(workout)">
              <div class="flex items-center justify-center">
                <UIcon :name="getWorkoutIcon(workout.workout.type)" class="w-2 h-2" />
              </div>
            </div>

            <!-- Показать количество дополнительных тренировок -->
            <div v-if="day.workouts.length > 2" class="text-xs text-gray-400 text-center mt-1">
              +{{ day.workouts.length - 2 }}
            </div>
          </div>

          <!-- Индикатор сегодняшнего дня -->
          <div v-if="day.isToday"
            class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-500 rounded-full"></div>
        </div>
      </div>
    </div>

    <!-- Детали выбранного дня -->
    <div v-if="selectedDayWorkouts.length > 0" class="selected-day-details mt-6">
      <UCard class="bg-gray-800 border-gray-700">
        <template #header>
          <h3 class="text-lg font-semibold text-white">
            Тренировки на {{ formatSelectedDate }}
          </h3>
        </template>

        <div class="space-y-3">
          <div v-for="workout in selectedDayWorkouts" :key="workout.id"
            class="workout-item flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
            @click="selectWorkout(workout)">
            <div class="flex items-center gap-3">
              <div :class="getWorkoutIconClasses(workout.status)">
                <UIcon :name="getWorkoutIcon(workout.workout.type)" class="w-4 h-4" />
              </div>

              <div>
                <h4 class="font-medium text-white">{{ workout.workout.name }}</h4>
                <p class="text-sm text-gray-400">
                  {{ formatTime(workout.startTime) }} - {{ formatTime(workout.endTime) }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ workout.trainer?.user.firstName }} {{ workout.trainer?.user.lastName }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <UBadge :color="getStatusColor(workout.status)" variant="soft" size="xs">
                {{ getStatusLabel(workout.status) }}
              </UBadge>

              <UBadge :color="getMartialArtColor(workout.workout.type)" variant="outline" size="xs">
                {{ getWorkoutTypeLabel(workout.workout.type) }}
              </UBadge>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Модалка с деталями тренировки -->
    <UModal v-model="workoutModalOpen">
      <UCard v-if="selectedWorkout" class="bg-gray-900 border-gray-700">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-white">{{ selectedWorkout.workout.name }}</h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" @click="workoutModalOpen = false" />
          </div>
        </template>

        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <UBadge :color="getMartialArtColor(selectedWorkout.workout.type)" variant="soft">
              {{ getWorkoutTypeLabel(selectedWorkout.workout.type) }}
            </UBadge>
            <UBadge :color="getStatusColor(selectedWorkout.status)" variant="outline">
              {{ getStatusLabel(selectedWorkout.status) }}
            </UBadge>
          </div>

          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-400">Дата:</span>
              <p class="text-white">{{ formatDate(selectedWorkout.startTime) }}</p>
            </div>
            <div>
              <span class="text-gray-400">Время:</span>
              <p class="text-white">{{ formatTime(selectedWorkout.startTime) }} - {{ formatTime(selectedWorkout.endTime)
                }}
              </p>
            </div>
            <div>
              <span class="text-gray-400">Инструктор:</span>
              <p class="text-white">{{ selectedWorkout.trainer?.user.firstName }} {{
                selectedWorkout.trainer?.user.lastName
                }}</p>
            </div>
            <div>
              <span class="text-gray-400">Длительность:</span>
              <p class="text-white">{{ selectedWorkout.workout.duration }} мин</p>
            </div>
          </div>

          <div v-if="selectedWorkout.workout.description">
            <span class="text-gray-400">Описание:</span>
            <p class="mt-1 text-white">{{ selectedWorkout.workout.description }}</p>
          </div>

          <!-- Заметки пользователя -->
          <div v-if="selectedWorkout.notes">
            <span class="text-gray-400">Заметки:</span>
            <p class="mt-1 text-sm bg-gray-700 p-2 rounded text-gray-300">{{ selectedWorkout.notes }}</p>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" @click="workoutModalOpen = false">
              Закрыть
            </UButton>
            <UButton v-if="selectedWorkout.status === 'scheduled' && canCancelWorkout(selectedWorkout)" color="red"
              variant="outline" @click="cancelWorkout">
              Отменить запись
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { ScheduleItem, WorkoutType } from '~/types'
import {
  getMartialArtColor,
  getWorkoutTypeLabel,
  type BadgeColor
} from '~/types/martial-arts'

// Props (используем обычные Date вместо CalendarDate)
interface Props {
  userWorkouts: ScheduleItem[] // Только тренировки текущего пользователя
  selectedDate?: Date
  view?: 'month' | 'week'
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selectedDate: () => new Date(),
  view: 'month',
  loading: false
})

// Emits (используем обычные Date)
interface Emits {
  'dateSelect': [date: Date]
  'workoutSelect': [workout: ScheduleItem]
  'viewChange': [view: string]
  'cancelWorkout': [workout: ScheduleItem]
}

const emit = defineEmits<Emits>()

// Reactive data
const selectedDate = ref(new Date(props.selectedDate))
const currentView = ref(props.view)
const workoutModalOpen = ref(false)
const selectedWorkout = ref<ScheduleItem | null>(null)

const weekDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

// Interface for calendar day
interface CalendarDay {
  date: Date
  dateString: string
  dayNumber: number
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  workouts: ScheduleItem[]
}

// Computed
const formatCurrentMonth = computed(() => {
  return selectedDate.value.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long'
  })
})

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
      workouts: getUserWorkoutsForDay(date)
    })

    currentDate.setDate(currentDate.getDate() + 1)
  }

  return days
})

const selectedDayWorkouts = computed(() => {
  return getUserWorkoutsForDay(selectedDate.value)
})

// Methods
const handleDateSelect = (date: Date) => {
  selectedDate.value = new Date(date)
  emit('dateSelect', date)
}

const selectDate = (date: Date) => {
  selectedDate.value = new Date(date)
  emit('dateSelect', date)
}

const previousMonth = () => {
  const newDate = new Date(selectedDate.value)
  newDate.setMonth(newDate.getMonth() - 1)
  selectedDate.value = newDate
}

const nextMonth = () => {
  const newDate = new Date(selectedDate.value)
  newDate.setMonth(newDate.getMonth() + 1)
  selectedDate.value = newDate
}

const goToToday = () => {
  selectedDate.value = new Date()
}

const changeView = (view: string) => {
  currentView.value = view as 'month' | 'week'
  emit('viewChange', view)
}

const selectWorkout = (workout: ScheduleItem) => {
  selectedWorkout.value = workout
  workoutModalOpen.value = true
  emit('workoutSelect', workout)
}

const cancelWorkout = () => {
  if (selectedWorkout.value) {
    emit('cancelWorkout', selectedWorkout.value)
    workoutModalOpen.value = false
  }
}

// Utility methods
const isToday = (date: Date): boolean => {
  const today = new Date()
  return isSameDay(date, today)
}

const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
}

const getUserWorkoutsForDay = (date: Date): ScheduleItem[] => {
  const dayStr = date.toISOString().split('T')[0]

  return props.userWorkouts.filter(workout => {
    const workoutDate = new Date(workout.startTime).toISOString().split('T')[0]
    return workoutDate === dayStr
  })
}

const getDayClasses = (day: CalendarDay): string => {
  const classes = [
    'calendar-day relative min-h-[60px] p-2 rounded-lg transition-all duration-200 cursor-pointer',
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
  const classes = ['day-number', 'font-medium', 'text-sm']

  if (day.isToday) {
    classes.push('text-yellow-400', 'font-bold')
  } else if (day.workouts.length > 0) {
    classes.push('text-blue-400')
  } else if (day.isCurrentMonth) {
    classes.push('text-white')
  } else {
    classes.push('text-gray-500')
  }

  return classes.join(' ')
}

const getWorkoutIndicatorClasses = (workout: ScheduleItem): string => {
  const baseClasses = [
    'workout-indicator', 'w-4', 'h-4', 'rounded-full', 'mb-1', 'flex',
    'items-center', 'justify-center', 'cursor-pointer', 'transition-all',
    'duration-200', 'hover:scale-110'
  ]

  switch (workout.status) {
    case 'completed':
      baseClasses.push('bg-green-500', 'text-white')
      break
    case 'scheduled':
      baseClasses.push('bg-blue-500', 'text-white')
      break
    case 'cancelled':
      baseClasses.push('bg-red-500', 'text-white')
      break
    default:
      baseClasses.push('bg-gray-500', 'text-white')
  }

  return baseClasses.join(' ')
}

const getWorkoutIconClasses = (status: string): string => {
  const baseClasses = ['w-8', 'h-8', 'rounded-full', 'flex', 'items-center', 'justify-center']

  switch (status) {
    case 'completed':
      baseClasses.push('bg-green-500/20', 'text-green-400')
      break
    case 'scheduled':
      baseClasses.push('bg-blue-500/20', 'text-blue-400')
      break
    case 'cancelled':
      baseClasses.push('bg-red-500/20', 'text-red-400')
      break
    default:
      baseClasses.push('bg-gray-500/20', 'text-gray-400')
  }

  return baseClasses.join(' ')
}

const getWorkoutIcon = (type: WorkoutType): string => {
  const icons: Record<WorkoutType, string> = {
    boxing: 'i-heroicons-hand-raised',
    kickboxing: 'i-heroicons-bolt',
    grappling: 'i-heroicons-arrows-pointing-in',
    bjj: 'i-heroicons-puzzle-piece',
    wrestling: 'i-heroicons-arrows-right-left',
    mma: 'i-heroicons-fire',
    pankration: 'i-heroicons-shield-check'
  }
  return icons[type] || 'i-heroicons-academic-cap'
}

const getStatusColor = (status: string): BadgeColor => {
  const statusColors: Record<string, BadgeColor> = {
    scheduled: 'blue',
    in_progress: 'blue',
    completed: 'green',
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

const canCancelWorkout = (workout: ScheduleItem): boolean => {
  // Можно отменить за 2 часа до начала
  const workoutStart = new Date(workout.startTime)
  const now = new Date()
  const hoursUntilWorkout = (workoutStart.getTime() - now.getTime()) / (1000 * 60 * 60)

  return hoursUntilWorkout > 2
}

const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Watch for prop changes
watch(() => props.selectedDate, (newDate) => {
  if (newDate) {
    selectedDate.value = new Date(newDate)
  }
})

watch(() => props.view, (newView) => {
  currentView.value = newView
})
</script>

<style scoped>
.user-schedule-calendar {
  @apply space-y-4;
}

.calendar-day {
  @apply relative;
}

.workouts-container {
  max-height: 40px;
  overflow: hidden;
}

.workout-indicator {
  font-size: 8px;
}

.workout-item {
  @apply transition-all duration-200;
}

.workout-item:hover {
  @apply transform scale-[1.02];
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

/* Адаптивность */
@media (max-width: 640px) {
  .calendar-day {
    min-height: 50px;
  }

  .workouts-container {
    max-height: 30px;
  }
}
</style>