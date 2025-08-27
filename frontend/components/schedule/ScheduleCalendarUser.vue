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

    <!-- NuxtUI Calendar -->
    <UCalendar v-model="selectedDate" :ui="calendarUI" :color="'primary'" @update:model-value="handleDateSelect">
      <!-- Кастомизация дня -->
      <template #day="{ day }">
        <div class="relative w-full h-full flex flex-col items-center justify-center p-1">
          <!-- Номер дня -->
          <div :class="getDayNumberClasses(day)">
            {{ day.day }}
          </div>

          <!-- Тренировки пользователя на этот день -->
          <div v-if="getUserWorkoutsForDay(day).length > 0" class="workouts-container mt-1 w-full">
            <div v-for="workout in getUserWorkoutsForDay(day).slice(0, 2)" :key="workout.id"
              :class="getWorkoutIndicatorClasses(workout)" @click.stop="selectWorkout(workout)">
              <div class="flex items-center justify-center">
                <UIcon :name="getWorkoutIcon(workout.type)" class="w-2 h-2" />
              </div>
            </div>

            <!-- Показать количество дополнительных тренировок -->
            <div v-if="getUserWorkoutsForDay(day).length > 2" class="text-xs text-gray-400 text-center mt-1">
              +{{ getUserWorkoutsForDay(day).length - 2 }}
            </div>
          </div>

          <!-- Индикатор сегодняшнего дня -->
          <div v-if="isToday(day)"
            class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-500 rounded-full"></div>
        </div>
      </template>
    </UCalendar>

    <!-- Детали выбранного дня -->
    <div v-if="selectedDayWorkouts.length > 0" class="selected-day-details mt-6">
      <UCard class="bg-gray-800">
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
                <UIcon :name="getWorkoutIcon(workout.type)" class="w-4 h-4" />
              </div>

              <div>
                <h4 class="font-medium text-white">{{ workout.workout.name }}</h4>
                <p class="text-sm text-gray-400">
                  {{ formatTime(workout.startTime) }} - {{ formatTime(workout.endTime) }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ workout.instructor?.firstName }} {{ workout.instructor?.lastName }}
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
      <UCard v-if="selectedWorkout">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">{{ selectedWorkout.workout.name }}</h3>
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
              <p>{{ formatDate(selectedWorkout.startTime) }}</p>
            </div>
            <div>
              <span class="text-gray-400">Время:</span>
              <p>{{ formatTime(selectedWorkout.startTime) }} - {{ formatTime(selectedWorkout.endTime) }}</p>
            </div>
            <div>
              <span class="text-gray-400">Инструктор:</span>
              <p>{{ selectedWorkout.instructor?.firstName }} {{ selectedWorkout.instructor?.lastName }}</p>
            </div>
            <div>
              <span class="text-gray-400">Длительность:</span>
              <p>{{ selectedWorkout.workout.duration }} мин</p>
            </div>
          </div>

          <div v-if="selectedWorkout.workout.description">
            <span class="text-gray-400">Описание:</span>
            <p class="mt-1">{{ selectedWorkout.workout.description }}</p>
          </div>

          <!-- Заметки пользователя -->
          <div v-if="selectedWorkout.userNotes">
            <span class="text-gray-400">Заметки:</span>
            <p class="mt-1 text-sm bg-gray-700 p-2 rounded">{{ selectedWorkout.userNotes }}</p>
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
import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date'
import type { ScheduleItem, WorkoutType } from '~/types'
import {
  getMartialArtColor,
  getWorkoutTypeLabel,
  type BadgeColor
} from '~/utils/martial-arts'

// Props
interface Props {
  userWorkouts: ScheduleItem[] // Только тренировки текущего пользователя
  selectedDate?: CalendarDate
  view?: 'month' | 'week'
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selectedDate: () => today(getLocalTimeZone()),
  view: 'month',
  loading: false
})

// Emits
interface Emits {
  'dateSelect': [date: CalendarDate]
  'workoutSelect': [workout: ScheduleItem]
  'viewChange': [view: string]
  'cancelWorkout': [workout: ScheduleItem]
}

const emit = defineEmits<Emits>()

// Reactive data
const selectedDate = ref(props.selectedDate)
const currentView = ref(props.view)
const workoutModalOpen = ref(false)
const selectedWorkout = ref<ScheduleItem | null>(null)

// Calendar UI customization для пользовательского календаря
const calendarUI = {
  root: 'bg-gray-900 border border-gray-700 rounded-lg p-4',
  heading: 'flex items-center justify-between mb-4',
  headCell: 'text-center text-sm font-medium text-gray-400 p-2',
  cellTrigger: [
    'w-full h-16 p-1 rounded-lg transition-all duration-200',
    'hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500',
    'data-[selected]:bg-blue-600 data-[selected]:text-white',
    'data-[today]:ring-2 data-[today]:ring-yellow-500'
  ].join(' ')
}

// Computed
const formatCurrentMonth = computed(() => {
  const date = selectedDate.value.toDate(getLocalTimeZone())
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long'
  })
})

const formatSelectedDate = computed(() => {
  const date = selectedDate.value.toDate(getLocalTimeZone())
  return date.toLocaleDateString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const selectedDayWorkouts = computed(() => {
  return getUserWorkoutsForDay(selectedDate.value)
})

// Methods
const handleDateSelect = (date: CalendarDate) => {
  selectedDate.value = date
  emit('dateSelect', date)
}

const previousMonth = () => {
  selectedDate.value = selectedDate.value.subtract({ months: 1 })
}

const nextMonth = () => {
  selectedDate.value = selectedDate.value.add({ months: 1 })
}

const goToToday = () => {
  selectedDate.value = today(getLocalTimeZone())
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
const isToday = (day: CalendarDate): boolean => {
  const todayDate = today(getLocalTimeZone())
  return day.compare(todayDate) === 0
}

const getUserWorkoutsForDay = (day: CalendarDate): ScheduleItem[] => {
  const dayDate = day.toDate(getLocalTimeZone())
  const dayStr = dayDate.toISOString().split('T')[0]

  return props.userWorkouts.filter(workout => {
    const workoutDate = new Date(workout.startTime).toISOString().split('T')[0]
    return workoutDate === dayStr
  })
}

const getDayNumberClasses = (day: CalendarDate): string => {
  const classes = ['day-number', 'font-medium', 'text-sm']

  if (isToday(day)) {
    classes.push('text-yellow-400')
  } else if (getUserWorkoutsForDay(day).length > 0) {
    classes.push('text-blue-400')
  } else {
    classes.push('text-gray-300')
  }

  return classes.join(' ')
}

const getWorkoutIndicatorClasses = (workout: ScheduleItem): string => {
  const baseClasses = ['workout-indicator', 'w-4', 'h-4', 'rounded-full', 'mb-1', 'flex', 'items-center', 'justify-center', 'cursor-pointer', 'transition-all', 'duration-200', 'hover:scale-110']

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
    completed: 'green',
    cancelled: 'red',
    'no-show': 'orange'
  }
  return statusColors[status] || 'gray'
}

const getStatusLabel = (status: string): string => {
  const statusLabels: Record<string, string> = {
    scheduled: 'Запланировано',
    completed: 'Завершено',
    cancelled: 'Отменено',
    'no-show': 'Не явился'
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
  selectedDate.value = newDate
})

watch(() => props.view, (newView) => {
  currentView.value = newView
})
</script>

<style scoped>
.user-schedule-calendar {
  @apply space-y-4;
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

/* Стили для календаря */
:deep([data-selected]) {
  @apply bg-blue-600 text-white;
}

:deep([data-today]) {
  @apply ring-2 ring-yellow-500;
}
</style>