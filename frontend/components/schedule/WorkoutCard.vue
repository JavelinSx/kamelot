<template>
  <UCard :class="[
    'workout-card',
    {
      'workout-card--compact': compact,
      'workout-card--booked': booked,
      'workout-card--disabled': disabled,
      'workout-card--clickable': clickable
    }
  ]" @click="handleCardClick">
    <!-- Заголовок карточки -->
    <template #header>
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center space-x-2 mb-1">
            <!-- Тип тренировки -->
            <UBadge :color="getMartialArtColor(workout.type)" variant="soft" size="xs">
              {{ getWorkoutTypeLabel(workout.type) }}
            </UBadge>

            <!-- Уровень сложности -->
            <UBadge :color="getDifficultyColor(workout.difficulty)" variant="soft" size="xs">
              {{ getDifficultyLabel(workout.difficulty) }}
            </UBadge>

            <!-- Статус расписания -->
            <UBadge v-if="scheduleItem && !compact" :color="getStatusColor(scheduleItem.status)" variant="soft"
              size="xs">
              {{ getStatusLabel(scheduleItem.status) }}
            </UBadge>
          </div>

          <!-- Название тренировки -->
          <h3 class="text-lg font-semibold text-white truncate">
            {{ workout.name }}
          </h3>
        </div>

        <!-- Меню действий -->
        <UDropdown v-if="!compact && !disabled" :items="dropdownItems" :popper="{ placement: 'bottom-start' }">
          <UButton variant="ghost" icon="i-heroicons-ellipsis-vertical" size="sm" :disabled="loading" />
        </UDropdown>
      </div>
    </template>

    <!-- Основное содержимое -->
    <div class="space-y-4">
      <!-- Описание -->
      <p v-if="workout.description && !compact" class="text-sm text-gray-400 line-clamp-2">
        {{ workout.description }}
      </p>

      <!-- Основная информация -->
      <div class="grid grid-cols-2 gap-4">
        <!-- Длительность -->
        <div class="flex items-center space-x-2">
          <UIcon name="i-heroicons-clock" class="w-4 h-4 text-gray-400" />
          <span class="text-sm text-gray-300">{{ workout.duration }} мин</span>
        </div>

        <!-- Участники -->
        <div v-if="scheduleItem" class="flex items-center space-x-2">
          <UIcon name="i-heroicons-users" class="w-4 h-4 text-gray-400" />
          <span class="text-sm text-gray-300">
            {{ scheduleItem.currentParticipants }}/{{ scheduleItem.maxParticipants }}
          </span>
        </div>

        <!-- Цена -->
        <div v-if="scheduleItem?.price && !compact" class="flex items-center space-x-2">
          <UIcon name="i-heroicons-currency-dollar" class="w-4 h-4 text-gray-400" />
          <span class="text-sm text-gray-300">{{ scheduleItem.price }} ₽</span>
        </div>
      </div>

      <!-- Информация о тренере -->
      <div v-if="showTrainer && scheduleItem?.trainer"
        class="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
        <UAvatar :src="scheduleItem.trainer.user.avatar"
          :alt="`${scheduleItem.trainer.user.firstName} ${scheduleItem.trainer.user.lastName}`" size="sm" />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-white truncate">
            {{ scheduleItem.trainer.user.firstName }} {{ scheduleItem.trainer.user.lastName }}
          </p>
          <div class="flex items-center space-x-2 mt-1">
            <div class="flex items-center">
              <UIcon v-for="i in 5" :key="i" name="i-heroicons-star-solid"
                :class="i <= scheduleItem.trainer.rating ? 'text-yellow-400' : 'text-gray-600'" class="w-3 h-3" />
            </div>
            <span class="text-xs text-gray-400">
              ({{ scheduleItem.trainer.reviewsCount }} отзывов)
            </span>
          </div>
        </div>
      </div>

      <!-- Время и дата (для расписания) -->
      <div v-if="scheduleItem && showScheduleInfo"
        class="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
        <div class="flex items-center space-x-2">
          <UIcon name="i-heroicons-calendar-days" class="w-4 h-4 text-gray-400" />
          <span class="text-sm text-gray-300">
            {{ formatDate(scheduleItem.startTime) }}
          </span>
        </div>
        <div class="flex items-center space-x-2">
          <UIcon name="i-heroicons-clock" class="w-4 h-4 text-gray-400" />
          <span class="text-sm text-gray-300">
            {{ formatTime(scheduleItem.startTime) }} - {{ formatTime(scheduleItem.endTime) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Футер с действиями -->
    <template #footer>
      <div class="flex items-center justify-between pt-4">
        <!-- Статус бронирования -->
        <div v-if="booked" class="flex items-center space-x-2">
          <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-400" />
          <span class="text-sm text-green-400 font-medium">Забронировано</span>
        </div>

        <!-- Доступность -->
        <div v-else-if="scheduleItem" class="flex items-center space-x-2">
          <UIcon :name="isAvailable ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'"
            :class="isAvailable ? 'text-green-400' : 'text-red-400'" class="w-4 h-4" />
          <span :class="isAvailable ? 'text-green-400' : 'text-red-400'" class="text-sm font-medium">
            {{ isAvailable ? 'Доступно' : 'Занято' }}
          </span>
        </div>

        <div v-else class="flex-1"></div>

        <!-- Кнопки действий -->
        <div class="flex space-x-2">
          <UButton v-if="showDetails" variant="ghost" size="sm" icon="i-heroicons-information-circle"
            @click="handleDetailsClick" :disabled="loading">
            Подробнее
          </UButton>

          <UButton v-if="showBookButton && scheduleItem && !booked && isAvailable" color="primary" size="sm"
            icon="i-heroicons-calendar-plus" :loading="loading" @click="handleBookClick">
            Записаться
          </UButton>

          <UButton v-else-if="booked" variant="outline" color="red" size="sm" icon="i-heroicons-x-mark"
            :loading="loading" @click="handleCancelClick">
            Отменить
          </UButton>
        </div>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { ScheduleItem, Workout } from '~/types'
import {
  getDifficultyColor,
  getDifficultyLabel,
  getMartialArtColor,
  getStatusColor,
  getStatusLabel,
  getWorkoutTypeLabel
} from '~/types/martial-arts'

interface Props {
  workout: Workout
  scheduleItem?: ScheduleItem

  // Настройки отображения
  showTrainer?: boolean
  showBookButton?: boolean
  showDetails?: boolean
  showScheduleInfo?: boolean
  compact?: boolean

  // Состояние
  disabled?: boolean
  booked?: boolean
  loading?: boolean
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showTrainer: true,
  showBookButton: true,
  showDetails: true,
  showScheduleInfo: true,
  compact: false,
  disabled: false,
  booked: false,
  loading: false,
  clickable: true
})

interface Emits {
  book: [scheduleItem: ScheduleItem]
  cancel: [scheduleItem: ScheduleItem]
  details: [workout: Workout]
  trainerClick: [trainer: any]
  cardClick: [workout: Workout, scheduleItem?: ScheduleItem]
}

const emit = defineEmits<Emits>()

// Вычисляемые свойства
const isAvailable = computed(() => {
  if (!props.scheduleItem) return false
  return props.scheduleItem.currentParticipants < props.scheduleItem.maxParticipants &&
    props.scheduleItem.status === 'scheduled'
})

const dropdownItems = computed(() => [
  [
    {
      label: 'Подробнее',
      icon: 'i-heroicons-information-circle',
      click: () => handleDetailsClick()
    },
    {
      label: 'Поделиться',
      icon: 'i-heroicons-share',
      click: () => handleShareClick()
    }
  ],
  [
    {
      label: 'В избранное',
      icon: 'i-heroicons-heart',
      click: () => handleFavoriteClick()
    }
  ]
])

// Методы обработки событий
const handleBookClick = (event: Event) => {
  event.stopPropagation()
  if (props.scheduleItem && !props.booked && isAvailable.value) {
    emit('book', props.scheduleItem)
  }
}

const handleCancelClick = (event: Event) => {
  event.stopPropagation()
  if (props.scheduleItem && props.booked) {
    emit('cancel', props.scheduleItem)
  }
}

const handleDetailsClick = (event?: Event) => {
  event?.stopPropagation()
  emit('details', props.workout)
}

const handleCardClick = () => {
  if (props.clickable && !props.disabled) {
    emit('cardClick', props.workout, props.scheduleItem)
  }
}

const handleShareClick = () => {
  // Логика поделиться
  console.log('Share workout:', props.workout.name)
}

const handleFavoriteClick = () => {
  // Логика добавления в избранное
  console.log('Add to favorites:', props.workout.name)
}

// Утилиты форматирования
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short'
  })
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.workout-card {
  @apply bg-gray-900 border-gray-800 transition-all duration-200;
}

.workout-card--clickable {
  @apply cursor-pointer hover:bg-gray-800/50 hover:border-gray-700;
}

.workout-card--compact {
  @apply text-sm;
}

.workout-card--booked {
  @apply ring-2 ring-green-500/20 border-green-500/30;
}

.workout-card--disabled {
  @apply opacity-50 cursor-not-allowed;
}

.workout-card--clickable:hover {
  @apply shadow-lg shadow-black/10;
}

/* Ограничение строк */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>