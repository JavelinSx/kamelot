<template>
  <UCard class="trainer-booking">
    <template #header>
      <div class="flex items-start space-x-4">
        <UAvatar :src="trainer.user.avatar" :alt="`${trainer.user.firstName} ${trainer.user.lastName}`" size="lg" />

        <div class="flex-1">
          <h2 class="text-xl font-semibold text-white">
            Запись к {{ trainer.user.firstName }} {{ trainer.user.lastName }}
          </h2>
          <div class="flex items-center space-x-3 mt-2">
            <div class="flex items-center">
              <UIcon v-for="i in 5" :key="i" name="i-heroicons-star-solid"
                :class="i <= trainer.rating ? 'text-yellow-400' : 'text-gray-600'" class="w-4 h-4" />
            </div>
            <span class="text-sm text-gray-400">
              {{ trainer.rating.toFixed(1) }} ({{ trainer.reviewsCount }} отзывов)
            </span>
          </div>

          <!-- Специализации -->
          <div class="flex flex-wrap gap-1 mt-2">
            <UBadge v-for="specialization in trainer.specialization.slice(0, 3)" :key="specialization"
              :color="getMartialArtColor(specialization)" variant="soft" size="xs">
              {{ getWorkoutTypeLabel(specialization) }}
            </UBadge>
          </div>
        </div>
      </div>
    </template>

    <div class="space-y-6">
      <!-- Шаги бронирования -->
      <div class="flex items-center justify-between">
        <div v-for="(step, index) in bookingSteps" :key="step.key" class="flex items-center">
          <div :class="[
            'flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium',
            currentStep >= index + 1
              ? 'bg-primary-500 border-primary-500 text-white'
              : 'border-gray-600 text-gray-400'
          ]">
            <UIcon v-if="currentStep > index + 1" name="i-heroicons-check" class="w-4 h-4" />
            <span v-else>{{ index + 1 }}</span>
          </div>

          <span :class="[
            'ml-2 text-sm font-medium',
            currentStep >= index + 1 ? 'text-white' : 'text-gray-400'
          ]">
            {{ step.title }}
          </span>

          <div v-if="index < bookingSteps.length - 1" :class="[
            'w-16 h-0.5 mx-4',
            currentStep > index + 1 ? 'bg-primary-500' : 'bg-gray-600'
          ]"></div>
        </div>
      </div>

      <!-- Шаг 1: Выбор даты -->
      <div v-if="currentStep === 1" class="space-y-4">
        <h3 class="text-lg font-medium text-white">Выберите дату</h3>

        <!-- Календарь-выборщик -->
        <div class="grid grid-cols-7 gap-2">
          <!-- Дни недели -->
          <div v-for="day in weekDays" :key="day" class="text-center text-xs font-medium text-gray-400 p-2">
            {{ day }}
          </div>

          <!-- Даты -->
          <div v-for="date in availableDates" :key="date.dateString" :class="[
            'text-center p-2 rounded-lg cursor-pointer transition-colors',
            {
              'bg-primary-500 text-white': selectedDate === date.dateString,
              'bg-gray-800 text-white hover:bg-gray-700': date.available && selectedDate !== date.dateString,
              'text-gray-600 cursor-not-allowed': !date.available,
              'text-gray-500': date.isOtherMonth
            }
          ]" @click="selectDate(date)">
            <div class="text-sm">{{ date.day }}</div>
            <div v-if="date.slotsCount > 0" class="text-xs">
              {{ date.slotsCount }} слотов
            </div>
          </div>
        </div>

        <!-- Выбранная дата -->
        <div v-if="selectedDate" class="p-4 bg-gray-800/50 rounded-lg">
          <p class="text-white font-medium">
            Выбрана дата: {{ formatSelectedDate }}
          </p>
          <p class="text-sm text-gray-400 mt-1">
            Доступно {{ selectedDateSlots.length }} временных слотов
          </p>
        </div>
      </div>

      <!-- Шаг 2: Выбор времени -->
      <div v-if="currentStep === 2" class="space-y-4">
        <h3 class="text-lg font-medium text-white">Выберите время</h3>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <div v-for="slot in selectedDateSlots" :key="slot.scheduleItemId" :class="[
            'p-3 rounded-lg border cursor-pointer transition-all',
            {
              'border-primary-500 bg-primary-500/10': selectedSlot?.scheduleItemId === slot.scheduleItemId,
              'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50': selectedSlot?.scheduleItemId !== slot.scheduleItemId
            }
          ]" @click="selectTimeSlot(slot)">
            <div class="text-center">
              <div class="text-sm font-medium text-white">
                {{ formatTime(slot.time) }}
              </div>
              <div class="text-xs text-gray-400 mt-1">
                {{ slot.workoutName }}
              </div>
              <div class="text-xs text-gray-400">
                {{ slot.duration }} мин
              </div>
              <div v-if="slot.price" class="text-xs text-green-400 mt-1">
                {{ slot.price }} ₽
              </div>
            </div>
          </div>
        </div>

        <!-- Выбранное время -->
        <div v-if="selectedSlot" class="p-4 bg-gray-800/50 rounded-lg">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-white font-medium">{{ selectedSlot.workoutName }}</p>
              <p class="text-sm text-gray-400">
                {{ formatSelectedDate }} в {{ formatTime(selectedSlot.time) }}
              </p>
              <p class="text-sm text-gray-400">
                Длительность: {{ selectedSlot.duration }} минут
              </p>
            </div>
            <div class="text-right">
              <p class="text-lg font-semibold text-green-400">
                {{ selectedSlot.price }} ₽
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Шаг 3: Дополнительная информация -->
      <div v-if="currentStep === 3" class="space-y-4">
        <h3 class="text-lg font-medium text-white">Дополнительная информация</h3>

        <div class="space-y-4">
          <!-- Заметки -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Комментарий к тренировке (необязательно)
            </label>
            <UTextarea v-model="bookingNotes"
              placeholder="Укажите ваши пожелания, цели тренировки или другую важную информацию..." :rows="4" />
          </div>

          <!-- Контактная информация -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Телефон для связи
              </label>
              <UInput v-model="contactPhone" placeholder="+7 (999) 123-45-67" icon="i-heroicons-phone" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <UInput v-model="contactEmail" type="email" placeholder="email@example.com" icon="i-heroicons-envelope" />
            </div>
          </div>

          <!-- Опыт в боевых искусствах -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Ваш уровень подготовки
            </label>
            <USelectMenu v-model="experienceLevel" :options="experienceLevels" placeholder="Выберите уровень" />
          </div>

          <!-- Цели тренировки -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Основные цели (можно выбрать несколько)
            </label>
            <div class="grid grid-cols-2 gap-2">
              <label v-for="goal in trainingGoals" :key="goal.value" class="flex items-center space-x-2 cursor-pointer">
                <UCheckbox v-model="selectedGoals" :value="goal.value" />
                <span class="text-sm text-gray-300">{{ goal.label }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Шаг 4: Подтверждение -->
      <div v-if="currentStep === 4" class="space-y-6">
        <h3 class="text-lg font-medium text-white">Подтверждение записи</h3>

        <!-- Сводка бронирования -->
        <div class="p-6 bg-gray-800/50 rounded-lg space-y-4">
          <div class="flex items-start space-x-4">
            <UAvatar :src="trainer.user.avatar" :alt="`${trainer.user.firstName} ${trainer.user.lastName}`" size="md" />

            <div class="flex-1">
              <h4 class="font-semibold text-white">
                {{ trainer.user.firstName }} {{ trainer.user.lastName }}
              </h4>
              <p class="text-sm text-gray-400">
                {{trainer.specialization.map(s => getWorkoutTypeLabel(s)).join(', ')}}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
            <div>
              <p class="text-sm text-gray-400">Тренировка</p>
              <p class="text-white font-medium">{{ selectedSlot?.workoutName }}</p>
            </div>

            <div>
              <p class="text-sm text-gray-400">Дата и время</p>
              <p class="text-white font-medium">
                {{ formatSelectedDate }} в {{ formatTime(selectedSlot?.time || '') }}
              </p>
            </div>

            <div>
              <p class="text-sm text-gray-400">Длительность</p>
              <p class="text-white font-medium">{{ selectedSlot?.duration }} минут</p>
            </div>

            <div>
              <p class="text-sm text-gray-400">Стоимость</p>
              <p class="text-white font-medium text-lg">{{ selectedSlot?.price }} ₽</p>
            </div>
          </div>

          <div v-if="bookingNotes" class="pt-4 border-t border-gray-700">
            <p class="text-sm text-gray-400">Комментарий</p>
            <p class="text-white">{{ bookingNotes }}</p>
          </div>
        </div>

        <!-- Условия и соглашения -->
        <div class="space-y-3">
          <label class="flex items-start space-x-3 cursor-pointer">
            <UCheckbox v-model="agreeToTerms" />
            <span class="text-sm text-gray-300">
              Я соглашаюсь с
              <a href="#" class="text-primary-400 hover:text-primary-300">условиями бронирования</a>
              и
              <a href="#" class="text-primary-400 hover:text-primary-300">политикой отмены</a>
            </span>
          </label>

          <label class="flex items-start space-x-3 cursor-pointer">
            <UCheckbox v-model="agreeToNotifications" />
            <span class="text-sm text-gray-300">
              Согласен получать уведомления о тренировке по SMS и email
            </span>
          </label>
        </div>

        <!-- Информация об отмене -->
        <div class="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <div class="flex items-start space-x-2">
            <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-yellow-400 mt-0.5" />
            <div>
              <p class="text-sm text-yellow-300 font-medium">Условия отмены</p>
              <p class="text-xs text-yellow-200 mt-1">
                Бесплатная отмена за 24 часа до начала тренировки.
                При отмене менее чем за 24 часа взимается 50% стоимости.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Навигация -->
      <div class="flex items-center justify-between pt-6 border-t border-gray-800">
        <UButton v-if="currentStep > 1" variant="outline" icon="i-heroicons-arrow-left" @click="previousStep"
          :disabled="loading">
          Назад
        </UButton>

        <div v-else></div>

        <div class="flex space-x-3">
          <UButton variant="ghost" @click="$emit('cancel')" :disabled="loading">
            Отменить
          </UButton>

          <UButton v-if="currentStep < 4" color="primary" icon="i-heroicons-arrow-right" trailing @click="nextStep"
            :disabled="!canProceed || loading">
            Далее
          </UButton>

          <UButton v-else color="primary" icon="i-heroicons-check" :loading="loading" @click="confirmBooking"
            :disabled="!canConfirm">
            Подтвердить запись
          </UButton>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Trainer } from '~/types'
import { getMartialArtColor, getWorkoutTypeLabel } from '~/types/martial-arts'

interface TimeSlot {
  scheduleItemId: number
  time: string
  date: string
  workoutName: string
  duration: number
  price?: number
}

interface AvailableDate {
  dateString: string
  day: number
  month: number
  year: number
  available: boolean
  slotsCount: number
  isOtherMonth?: boolean
}

interface Props {
  trainer: Trainer
  availableSlots: TimeSlot[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

interface Emits {
  book: [data: { scheduleItemId: number; notes?: string; contactPhone?: string; contactEmail?: string }]
  cancel: []
}

const emit = defineEmits<Emits>()

// Реактивные данные
const currentStep = ref(1)
const selectedDate = ref<string>('')
const selectedSlot = ref<TimeSlot | null>(null)
const bookingNotes = ref('')
const contactPhone = ref('')
const contactEmail = ref('')
const experienceLevel = ref('')
const selectedGoals = ref<string[]>([])
const agreeToTerms = ref(false)
const agreeToNotifications = ref(true)

// Константы
const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const bookingSteps = [
  { key: 'date', title: 'Дата' },
  { key: 'time', title: 'Время' },
  { key: 'info', title: 'Информация' },
  { key: 'confirm', title: 'Подтверждение' }
]

const experienceLevels = [
  { label: 'Новичок', value: 'beginner' },
  { label: 'Любитель', value: 'intermediate' },
  { label: 'Продвинутый', value: 'advanced' },
  { label: 'Профессионал', value: 'professional' }
]

const trainingGoals = [
  { label: 'Изучение техники', value: 'technique' },
  { label: 'Физическая подготовка', value: 'fitness' },
  { label: 'Самооборона', value: 'self_defense' },
  { label: 'Соревнования', value: 'competition' },
  { label: 'Похудение', value: 'weight_loss' },
  { label: 'Набор мышечной массы', value: 'muscle_gain' }
]

// Вычисляемые свойства
const availableDates = computed(() => {
  // Генерируем календарь на следующие 30 дней
  const dates: AvailableDate[] = []
  const today = new Date()

  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)

    const dateString = date.toISOString().split('T')[0]
    const slotsForDate = props.availableSlots.filter(slot => slot.date === dateString)

    dates.push({
      dateString,
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      available: slotsForDate.length > 0,
      slotsCount: slotsForDate.length
    })
  }

  return dates
})

const selectedDateSlots = computed(() => {
  return props.availableSlots.filter(slot => slot.date === selectedDate.value)
})

const formatSelectedDate = computed(() => {
  if (!selectedDate.value) return ''
  return new Date(selectedDate.value).toLocaleDateString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1:
      return !!selectedDate.value
    case 2:
      return !!selectedSlot.value
    case 3:
      return true // Дополнительная информация необязательна
    default:
      return false
  }
})

const canConfirm = computed(() => {
  return agreeToTerms.value && selectedSlot.value
})

// Методы
const selectDate = (date: AvailableDate) => {
  if (date.available) {
    selectedDate.value = date.dateString
    selectedSlot.value = null // Сбрасываем выбранное время
  }
}

const selectTimeSlot = (slot: TimeSlot) => {
  selectedSlot.value = slot
}

const nextStep = () => {
  if (canProceed.value && currentStep.value < 4) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const confirmBooking = async () => {
  if (!selectedSlot.value || !canConfirm.value) return

  const bookingData = {
    scheduleItemId: selectedSlot.value.scheduleItemId,
    notes: bookingNotes.value || undefined,
    contactPhone: contactPhone.value || undefined,
    contactEmail: contactEmail.value || undefined
  }

  emit('book', bookingData)
}

// Утилиты форматирования
const formatTime = (timeString: string) => {
  if (!timeString) return ''
  return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.trainer-booking {
  @apply bg-gray-900 border-gray-800;
}

/* Анимации переходов между шагами */
.step-transition-enter-active,
.step-transition-leave-active {
  transition: all 0.3s ease;
}

.step-transition-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.step-transition-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>