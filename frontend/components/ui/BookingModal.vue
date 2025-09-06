<!-- components/BookingModal.vue -->
<template>
  <UModal v-model="internalOpen" :ui="{
    width: 'sm:max-w-2xl',
    height: 'sm:max-h-[90vh]'
  }">
    <UCard>
      <!-- Заголовок -->
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div v-if="scheduleItem" class="p-2 rounded-lg" :class="getWorkoutTypeIconBg(scheduleItem.workout.type)">
              <UIcon :name="getWorkoutTypeIcon(scheduleItem.workout.type)" class="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">Запись на тренировку</h3>
              <p v-if="scheduleItem" class="text-gray-400 text-sm">{{ scheduleItem.workout.title }}</p>
            </div>
          </div>

          <UButton variant="ghost" icon="i-heroicons-x-mark" @click="close" />
        </div>
      </template>

      <!-- Содержимое -->
      <div v-if="scheduleItem" class="space-y-6">
        <!-- Информация о тренировке -->
        <div class="bg-gray-800/30 rounded-lg p-4">
          <h4 class="text-lg font-semibold text-white mb-4">Детали тренировки</h4>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Дата и время -->
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <UIcon name="i-heroicons-calendar-days" class="w-4 h-4 text-blue-400" />
                <span class="text-blue-400 font-medium">Дата и время</span>
              </div>
              <div class="ml-6">
                <p class="text-white font-medium">{{ formatDate(scheduleItem.startTime) }}</p>
                <p class="text-gray-300">{{ formatTime(scheduleItem.startTime) }} - {{ formatTime(scheduleItem.endTime)
                }}</p>
              </div>
            </div>

            <!-- Тренер -->
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <UIcon name="i-heroicons-user" class="w-4 h-4 text-purple-400" />
                <span class="text-purple-400 font-medium">Тренер</span>
              </div>
              <div class="ml-6">
                <p class="text-white font-medium">
                  {{ scheduleItem.trainer.user.firstName }} {{ scheduleItem.trainer.user.lastName }}
                </p>
                <div class="flex items-center space-x-1 mt-1">
                  <UIcon name="i-heroicons-star-solid" class="w-3 h-3 text-yellow-400" />
                  <span class="text-xs text-gray-300">{{ scheduleItem.trainer.rating || 'Новый тренер' }}</span>
                </div>
              </div>
            </div>

            <!-- Продолжительность -->
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <UIcon name="i-heroicons-clock" class="w-4 h-4 text-green-400" />
                <span class="text-green-400 font-medium">Продолжительность</span>
              </div>
              <div class="ml-6">
                <p class="text-white font-medium">{{ scheduleItem.workout.duration }} минут</p>
              </div>
            </div>

            <!-- Участники -->
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <UIcon name="i-heroicons-users" class="w-4 h-4 text-orange-400" />
                <span class="text-orange-400 font-medium">Участники</span>
              </div>
              <div class="ml-6">
                <p class="text-white font-medium">
                  {{ scheduleItem.currentParticipants + 1 }} / {{ scheduleItem.maxParticipants }}
                  <span class="text-gray-400 text-sm">(включая вас)</span>
                </p>
              </div>
            </div>
          </div>

          <!-- Тип и уровень сложности -->
          <div class="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-700">
            <UBadge :color="getWorkoutTypeColor(scheduleItem.workout.type)" variant="soft">
              {{ getWorkoutTypeLabel(scheduleItem.workout.type) }}
            </UBadge>
            <UBadge :color="getDifficultyColor(scheduleItem.workout.difficulty)" variant="soft">
              {{ getDifficultyLabel(scheduleItem.workout.difficulty) }}
            </UBadge>
          </div>
        </div>

        <!-- Форма бронирования -->
        <UForm :validate="validate" :state="formData" @submit="handleSubmit" class="space-y-4">
          <!-- Заметки к бронированию -->
          <UFormGroup label="Заметки к бронированию" hint="Дополнительная информация для тренера (опционально)">
            <UTextarea v-model="formData.notes" :rows="3"
              placeholder="Например: первый раз на этом типе тренировки, есть травма колена..." :maxlength="500" />
            <template #hint>
              <div class="flex justify-between text-xs">
                <span>Опционально. Поможет тренеру лучше подготовиться к занятию</span>
                <span class="text-gray-400">{{ formData.notes?.length || 0 }}/500</span>
              </div>
            </template>
          </UFormGroup>

          <!-- Уведомления -->
          <UFormGroup label="Уведомления">
            <div class="space-y-3">
              <UCheckbox v-model="formData.notifications.email" label="Email уведомления"
                help="Получать напоминания о тренировке на email" />
              <UCheckbox v-model="formData.notifications.sms" label="SMS уведомления"
                help="Получать SMS напоминания за час до тренировки" />
            </div>
          </UFormGroup>

          <!-- Согласие с правилами -->
          <UFormGroup>
            <UCheckbox v-model="formData.acceptTerms" :required="true" class="text-sm">
              <template #label>
                <span>
                  Я ознакомился с
                  <UButton variant="link" size="sm" @click="showRules = true" class="p-0 h-auto">
                    правилами посещения тренировок
                  </UButton>
                  и принимаю их
                </span>
              </template>
            </UCheckbox>
          </UFormGroup>
        </UForm>

        <!-- Предупреждения и информация -->
        <div class="space-y-3">
          <!-- Предупреждение о времени до начала -->
          <UAlert v-if="isLastMinuteBooking" icon="i-heroicons-exclamation-triangle" color="orange" variant="soft"
            title="Поздняя запись"
            :description="`До начала тренировки менее ${hoursUntilWorkout} часов. Убедитесь, что успеете прийти вовремя.`" />

          <!-- Информация об отмене -->
          <UAlert icon="i-heroicons-information-circle" color="blue" variant="soft" title="Условия отмены"
            description="Вы можете отменить бронирование не позднее чем за 2 часа до начала тренировки." />

          <!-- Предупреждение о переполненности -->
          <UAlert v-if="isNearlyFull" icon="i-heroicons-users" color="yellow" variant="soft"
            title="Почти все места заняты"
            description="На этой тренировке остались последние места. Запишитесь сейчас, чтобы не пропустить!" />
        </div>

        <!-- Стоимость (если есть) -->
        <div v-if="scheduleItem.price" class="bg-gray-800/30 rounded-lg p-4">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-lg font-semibold text-white">Стоимость</h4>
              <p class="text-gray-400 text-sm">Разовое посещение</p>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold text-white">{{ scheduleItem.price }} ₽</p>
              <p class="text-gray-400 text-sm">с учетом всех скидок</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Футер с кнопками -->
      <template #footer>
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2 text-sm text-gray-400">
            <UIcon name="i-heroicons-shield-check" class="w-4 h-4" />
            <span>Ваши данные защищены</span>
          </div>

          <div class="flex space-x-3">
            <UButton variant="outline" @click="close">
              Отменить
            </UButton>

            <UButton color="red" icon="i-heroicons-calendar-plus" :loading="loading" :disabled="!canSubmit"
              @click="handleSubmit">
              Записаться на тренировку
            </UButton>
          </div>
        </div>
      </template>
    </UCard>

    <!-- Модальное окно с правилами -->
    <UModal v-model="showRules" :ui="{ width: 'sm:max-w-4xl' }">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold text-white">Правила посещения тренировок</h3>
            <UButton variant="ghost" icon="i-heroicons-x-mark" @click="showRules = false" />
          </div>
        </template>

        <div class="space-y-6">
          <!-- Основные правила -->
          <div>
            <h4 class="text-lg font-semibold text-white mb-3">Основные правила</h4>
            <ul class="space-y-2 text-gray-300">
              <li class="flex items-start space-x-2">
                <UIcon name="i-heroicons-check" class="w-4 h-4 text-green-400 mt-0.5" />
                <span>Приходите на тренировку за 10-15 минут до начала</span>
              </li>
              <li class="flex items-start space-x-2">
                <UIcon name="i-heroicons-check" class="w-4 h-4 text-green-400 mt-0.5" />
                <span>Имейте при себе сменную обувь и форму для тренировок</span>
              </li>
              <li class="flex items-start space-x-2">
                <UIcon name="i-heroicons-check" class="w-4 h-4 text-green-400 mt-0.5" />
                <span>Сообщите тренеру о травмах или ограничениях</span>
              </li>
              <li class="flex items-start space-x-2">
                <UIcon name="i-heroicons-check" class="w-4 h-4 text-green-400 mt-0.5" />
                <span>Соблюдайте дисциплину и уважайте других участников</span>
              </li>
            </ul>
          </div>

          <!-- Отмена и перенос -->
          <div>
            <h4 class="text-lg font-semibold text-white mb-3">Отмена и перенос</h4>
            <ul class="space-y-2 text-gray-300">
              <li class="flex items-start space-x-2">
                <UIcon name="i-heroicons-clock" class="w-4 h-4 text-blue-400 mt-0.5" />
                <span>Отмена без штрафа — не позднее чем за 2 часа до начала</span>
              </li>
              <li class="flex items-start space-x-2">
                <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 text-purple-400 mt-0.5" />
                <span>Перенос тренировки возможен при наличии свободных мест</span>
              </li>
              <li class="flex items-start space-x-2">
                <UIcon name="i-heroicons-exclamation-triangle" class="w-4 h-4 text-yellow-400 mt-0.5" />
                <span>При опоздании более чем на 15 минут допуск на тренировку не гарантируется</span>
              </li>
            </ul>
          </div>

          <!-- Безопасность -->
          <div>
            <h4 class="text-lg font-semibold text-white mb-3">Безопасность</h4>
            <ul class="space-y-2 text-gray-300">
              <li class="flex items-start space-x-2">
                <UIcon name="i-heroicons-shield-check" class="w-4 h-4 text-green-400 mt-0.5" />
                <span>Следуйте инструкциям тренера для избежания травм</span>
              </li>
              <li class="flex items-start space-x-2">
                <UIcon name="i-heroicons-heart" class="w-4 h-4 text-red-400 mt-0.5" />
                <span>При плохом самочувствии сообщите тренеру немедленно</span>
              </li>
              <li class="flex items-start space-x-2">
                <UIcon name="i-heroicons-hand-raised" class="w-4 h-4 text-orange-400 mt-0.5" />
                <span>Тренировки проходят под вашу личную ответственность</span>
              </li>
            </ul>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end">
            <UButton @click="showRules = false">
              Понятно
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </UModal>
</template>

<script setup lang="ts">
import type { ScheduleItem } from '~/types';

interface Props {
  isOpen: boolean
  scheduleItem?: ScheduleItem
}

const props = defineProps<Props>()

interface Emits {
  close: []
  confirm: [data: BookingFormData]
}

const emit = defineEmits<Emits>()

interface BookingFormData {
  notes?: string
  notifications: {
    email: boolean
    sms: boolean
  }
  acceptTerms: boolean
}

// Состояние модального окна
const internalOpen = computed({
  get: () => props.isOpen,
  set: (value) => {
    if (!value) {
      emit('close')
    }
  }
})

// Состояние формы
const loading = ref(false)
const showRules = ref(false)

const formData = reactive<BookingFormData>({
  notes: '',
  notifications: {
    email: true,
    sms: false
  },
  acceptTerms: false
})


// Вычисляемые свойства
const hoursUntilWorkout = computed(() => {
  if (!props.scheduleItem) return 0
  const diffMs = new Date(props.scheduleItem.startTime).getTime() - new Date().getTime()
  return Math.floor(diffMs / (1000 * 60 * 60))
})

const isLastMinuteBooking = computed(() => hoursUntilWorkout.value < 4)

const isNearlyFull = computed(() => {
  if (!props.scheduleItem) return false
  const occupancyRate = (props.scheduleItem.currentParticipants + 1) / props.scheduleItem.maxParticipants
  return occupancyRate >= 0.8
})

const canSubmit = computed(() => {
  return formData.acceptTerms && !loading.value
})

// Методы
const close = () => {
  emit('close')
}

const handleSubmit = async () => {
  if (!canSubmit.value) return

  try {
    loading.value = true
    emit('confirm', { ...formData })
  } catch (error) {
    console.error('Error submitting booking:', error)
  } finally {
    loading.value = false
  }
}

// Валидация формы
const validate = (state: BookingFormData) => {
  const errors: any[] = []

  if (!state.acceptTerms) {
    errors.push({
      path: 'acceptTerms',
      message: 'Необходимо принять правила посещения'
    })
  }

  if (state.notes && state.notes.length > 500) {
    errors.push({
      path: 'notes',
      message: 'Заметка слишком длинная (максимум 500 символов)'
    })
  }

  return errors
}

// Утилиты форматирования
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Сброс формы при закрытии
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    // Сброс формы при закрытии
    setTimeout(() => {
      formData.notes = ''
      formData.notifications.email = true
      formData.notifications.sms = false
      formData.acceptTerms = false
      showRules.value = false
    }, 200)
  }
})
</script>

<style scoped>
/* Дополнительные стили при необходимости */
</style>