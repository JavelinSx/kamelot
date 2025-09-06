<!-- components/UserBookingCard.vue -->
<template>
  <UCard :class="[
    'user-booking-card',
    {
      'border-green-500/30 bg-green-900/10': booking.status === 'confirmed',
      'border-yellow-500/30 bg-yellow-900/10': booking.status === 'pending',
      'border-red-500/30 bg-red-900/10': booking.status === 'cancelled',
      'border-blue-500/30 bg-blue-900/10': booking.status === 'completed'
    }
  ]">
    <div class="flex items-start justify-between">
      <!-- Основная информация о тренировке -->
      <div class="flex-1 space-y-3">
        <!-- Заголовок -->
        <div class="flex items-center space-x-3">
          <!-- Иконка типа тренировки -->
          <div class="p-2 rounded-lg" :class="getWorkoutTypeIconBg(booking.scheduleItem.workout.type)">
            <UIcon :name="getWorkoutTypeIcon(booking.scheduleItem.workout.type)" class="w-5 h-5 text-white" />
          </div>

          <!-- Название и статус -->
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-1">
              <h3 class="text-lg font-semibold text-white">
                {{ booking.scheduleItem.workout.type }}
              </h3>
            </div>

            <div class="flex items-center space-x-2">
              <UBadge :color="getMartialArtColor(booking.scheduleItem.workout.type)" variant="soft" size="xs">
                {{ getWorkoutTypeLabel(booking.scheduleItem.workout.type) }}
              </UBadge>

            </div>
          </div>
        </div>

        <!-- Детали тренировки -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <!-- Дата и время -->
          <div class="space-y-1">
            <div class="flex items-center space-x-2">
              <UIcon name="i-heroicons-calendar-days" class="w-4 h-4 text-blue-400" />
              <span class="text-blue-400 font-medium">Дата и время</span>
            </div>
            <div class="ml-6 space-y-1">
              <p class="text-white">{{ formatDate(booking.scheduleItem.startTime) }}</p>
              <p class="text-gray-300">
                {{ formatTime(booking.scheduleItem.startTime) }} -
                {{ formatTime(booking.scheduleItem.endTime) }}
              </p>
              <p v-if="timeUntilWorkout" class="text-xs" :class="getTimeUntilColor(timeUntilWorkout)">
                {{ timeUntilWorkout }}
              </p>
            </div>
          </div>

          <!-- Тренер -->
          <div class="space-y-1">
            <div class="flex items-center space-x-2">
              <UIcon name="i-heroicons-user" class="w-4 h-4 text-purple-400" />
              <span class="text-purple-400 font-medium">Тренер</span>
            </div>
            <div class="ml-6">
              <p class="text-white font-medium">
                {{ booking.scheduleItem.trainer.user.firstName }} {{ booking.scheduleItem.trainer.user.lastName }}
              </p>
              <div class="flex items-center space-x-1 mt-1">
                <UIcon name="i-heroicons-star-solid" class="w-3 h-3 text-yellow-400" />
                <span class="text-xs text-gray-300">{{ booking.scheduleItem.trainer.rating || 'Новый' }}</span>
              </div>
            </div>
          </div>

          <!-- Дополнительная информация -->
          <div class="space-y-1">
            <div class="flex items-center space-x-2">
              <UIcon name="i-heroicons-information-circle" class="w-4 h-4 text-green-400" />
              <span class="text-green-400 font-medium">Детали</span>
            </div>
            <div class="ml-6 space-y-1">
              <p class="text-gray-300">{{ booking.scheduleItem.workout.duration }} минут</p>
              <p class="text-gray-300">
                {{ booking.scheduleItem.currentParticipants }}/{{ booking.scheduleItem.maxParticipants }} участников
              </p>
            </div>
          </div>
        </div>

        <!-- Заметки к бронированию -->
        <div v-if="booking.notes" class="p-3 bg-gray-800/30 rounded-lg border-l-4 border-blue-500">
          <div class="flex items-start space-x-2">
            <UIcon name="i-heroicons-chat-bubble-left-ellipsis" class="w-4 h-4 text-blue-400 mt-0.5" />
            <div>
              <p class="text-blue-400 text-xs font-medium mb-1">Ваша заметка:</p>
              <p class="text-gray-300 text-sm">{{ booking.notes }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Действия -->
      <div class="flex flex-col space-y-2 ml-4">
        <!-- Основные действия в зависимости от статуса -->
        <template v-if="booking.status === 'confirmed'">
          <!-- Если тренировка в будущем -->
          <template v-if="isUpcoming">
            <UButton color="red" variant="outline" size="sm" icon="i-heroicons-x-mark"
              @click="$emit('cancel', booking)">
              Отменить
            </UButton>

            <UButton variant="ghost" size="sm" icon="i-heroicons-arrow-path" @click="$emit('reschedule', booking)">
              Перенести
            </UButton>
          </template>

        </template>

        <template v-else-if="booking.status === 'pending'">
          <UButton color="red" variant="outline" size="sm" icon="i-heroicons-x-mark" @click="$emit('cancel', booking)">
            Отменить
          </UButton>
        </template>

        <!-- Дополнительные действия -->
        <UDropdown :items="dropdownItems" :popper="{ placement: 'bottom-end' }">
          <UButton variant="ghost" icon="i-heroicons-ellipsis-vertical" size="sm" />
        </UDropdown>
      </div>
    </div>

    <!-- Прогресс до тренировки (для подтвержденных будущих тренировок) -->
    <div v-if="booking.status === 'confirmed' && isUpcoming && daysUntil <= 7"
      class="mt-4 pt-4 border-t border-gray-800">
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-400">До тренировки:</span>
        <span class="text-white font-medium">{{ timeUntilWorkout }}</span>
      </div>
      <UProgress :value="progressValue" :color="progressColor" size="sm" class="mt-2" />
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Booking } from '~/types';
import {
  getWorkoutTypeIcon,
  getWorkoutTypeIconBg,
  getWorkoutTypeLabel
} from '~/types/martial-arts';

interface Props {
  booking: Booking
}

const props = defineProps<Props>()

interface Emits {
  cancel: [booking: Booking]
  reschedule: [booking: Booking]
  review: [booking: Booking]
}

const emit = defineEmits<Emits>()

// Вычисляемые свойства для времени
const now = new Date()
const workoutStart = computed(() => new Date(props.booking.scheduleItem.startTime))
const workoutEnd = computed(() => new Date(props.booking.scheduleItem.endTime))

const isUpcoming = computed(() => workoutStart.value > now)
const isPast = computed(() => workoutEnd.value < now)
const isInProgress = computed(() => workoutStart.value <= now && workoutEnd.value >= now)

const daysUntil = computed(() => {
  if (!isUpcoming.value) return 0
  return Math.ceil((workoutStart.value.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
})

const timeUntilWorkout = computed(() => {
  if (!isUpcoming.value) return null

  const diffMs = workoutStart.value.getTime() - now.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  if (diffDays > 0) {
    return `через ${diffDays} ${getDaysWord(diffDays)}`
  } else if (diffHours > 0) {
    return `через ${diffHours} ${getHoursWord(diffHours)}`
  } else if (diffMinutes > 0) {
    return `через ${diffMinutes} ${getMinutesWord(diffMinutes)}`
  } else {
    return 'скоро начнется'
  }
})

// Прогресс до тренировки
const progressValue = computed(() => {
  if (!isUpcoming.value || daysUntil.value > 7) return 0
  return 100 - (daysUntil.value / 7 * 100)
})

const progressColor = computed(() => {
  if (daysUntil.value <= 1) return 'red'
  if (daysUntil.value <= 3) return 'orange'
  return 'blue'
})

// Цвет для отображения времени до тренировки
const getTimeUntilColor = (timeText: string) => {
  if (timeText.includes('скоро') || timeText.includes('минут')) return 'text-red-400'
  if (timeText.includes('час')) return 'text-orange-400'
  if (timeText.includes('1 день') || timeText.includes('2 дня')) return 'text-yellow-400'
  return 'text-green-400'
}

// Статусы бронирования
const getStatusColor = (status: string) => {
  const colors = {
    'confirmed': 'green',
    'pending': 'yellow',
    'cancelled': 'red',
    'completed': 'blue'
  }
  return colors[status as keyof typeof colors] || 'gray'
}

const getStatusLabel = (status: string) => {
  const labels = {
    'confirmed': 'Подтверждено',
    'pending': 'Ожидает',
    'cancelled': 'Отменено',
    'completed': 'Завершено'
  }
  return labels[status as keyof typeof labels] || status
}

// Меню дополнительных действий
const dropdownItems = computed(() => {
  const items = []

  items.push([{
    label: 'Подробности тренировки',
    icon: 'i-heroicons-information-circle',
    click: () => console.log('Show workout details')
  }])

  if (props.booking.status === 'confirmed' || props.booking.status === 'completed') {
    items.push([{
      label: 'Добавить в календарь',
      icon: 'i-heroicons-calendar-plus',
      click: () => console.log('Add to calendar')
    }])
  }

  items.push([{
    label: 'Поделиться',
    icon: 'i-heroicons-share',
    click: () => console.log('Share booking')
  }])

  return items
})

// Утилиты форматирования
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatShortDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short'
  })
}

// Склонения
const getDaysWord = (count: number) => {
  const forms = ['день', 'дня', 'дней']
  return getWordForm(count, forms)
}

const getHoursWord = (count: number) => {
  const forms = ['час', 'часа', 'часов']
  return getWordForm(count, forms)
}

const getMinutesWord = (count: number) => {
  const forms = ['минуту', 'минуты', 'минут']
  return getWordForm(count, forms)
}

const getWordForm = (count: number, forms: string[]) => {
  const lastDigit = count % 10
  const lastTwoDigits = count % 100

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return forms[2]
  } else if (lastDigit === 1) {
    return forms[0]
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    return forms[1]
  } else {
    return forms[2]
  }
}
</script>

<style scoped>
.user-booking-card {
  @apply bg-gray-900 border-gray-800 transition-all duration-200;
}
</style>