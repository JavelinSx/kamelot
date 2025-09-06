<template>
  <div class="trainer-profile">
    <!-- Шапка профиля -->
    <div class="profile-header">
      <div class="relative">
        <!-- Фоновое изображение -->
        <div class="h-48 bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-t-xl overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div
            class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8cGF0aCBkPSJNIDIwIDAgTCAwIDAgMCAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzc0MTUxIiBzdHJva2Utd2lkdGg9IjEiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgb3BhY2l0eT0iMC4xIi8+Cjwvc3ZnPg==')] opacity-20">
          </div>
        </div>

        <!-- Информация профиля -->
        <div class="absolute bottom-0 left-0 right-0 p-6">
          <div class="flex items-end space-x-6">
            <!-- Аватар -->
            <div class="relative">
              <UAvatar :src="trainer.user.avatar" :alt="`${trainer.user.firstName} ${trainer.user.lastName}`" size="2xl"
                :chip-color="trainer.isActive ? 'green' : 'gray'" chip-position="bottom-right"
                class="ring-4 ring-black" />

              <!-- Верификация -->
              <div v-if="trainer.certifications?.length" class="absolute -top-1 -right-1">
                <UIcon name="i-heroicons-check-badge-solid" class="w-8 h-8 text-blue-400" />
              </div>
            </div>

            <!-- Основная информация -->
            <div class="flex-1 min-w-0 pb-2">
              <div class="flex items-start justify-between">
                <div>
                  <h1 class="text-3xl font-bold text-white">
                    {{ trainer.user.firstName }} {{ trainer.user.lastName }}
                  </h1>

                  <div class="flex items-center space-x-3 mt-2">
                    <UBadge :color="trainer.isActive ? 'green' : 'gray'" variant="soft">
                      {{ trainer.isActive ? 'Активен' : 'Неактивен' }}
                    </UBadge>

                    <UBadge v-if="trainer.certifications?.length" color="blue" variant="soft">
                      Сертифицирован
                    </UBadge>

                    <div class="flex items-center space-x-1">
                      <UIcon v-for="i in 5" :key="i" name="i-heroicons-star-solid"
                        :class="i <= trainer.rating ? 'text-yellow-400' : 'text-gray-600'" class="w-5 h-5" />
                      <span class="text-white font-medium ml-2">
                        {{ trainer.rating.toFixed(1) }}
                      </span>
                      <span class="text-gray-400">
                        ({{ trainer.reviewsCount }} отзывов)
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Действия -->
                <div v-if="!editable" class="flex space-x-2">
                  <UButton color="primary" icon="i-heroicons-calendar-plus" @click="$emit('bookSession')">
                    Записаться на тренировку
                  </UButton>

                  <UButton variant="outline" icon="i-heroicons-chat-bubble-left" @click="$emit('message')">
                    Написать
                  </UButton>

                  <UDropdown :items="profileActions">
                    <UButton variant="ghost" icon="i-heroicons-ellipsis-vertical" />
                  </UDropdown>
                </div>

                <UButton v-else variant="outline" icon="i-heroicons-pencil" @click="$emit('edit')">
                  Редактировать
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Контент профиля -->
    <div class="profile-content p-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Основная информация -->
        <div class="lg:col-span-2 space-y-8">
          <!-- О тренере -->
          <UCard>
            <template #header>
              <h2 class="text-xl font-semibold text-white">О тренере</h2>
            </template>

            <div class="space-y-6">
              <!-- Описание -->
              <div v-if="trainer.bio">
                <p class="text-gray-300 leading-relaxed">
                  {{ trainer.bio }}
                </p>
              </div>

              <!-- Специализации -->
              <div>
                <h3 class="text-lg font-medium text-white mb-3">Специализации</h3>
                <div class="flex flex-wrap gap-2">
                  <UBadge v-for="specialization in trainer.specializations" :key="specialization"
                    :color="getWorkoutTypeColor(specialization)" variant="soft">
                    {{ getWorkoutTypeLabel(specialization) }}
                  </UBadge>
                </div>
              </div>

              <!-- Сертификаты -->
              <div v-if="trainer.certifications?.length">
                <h3 class="text-lg font-medium text-white mb-3">Сертификаты и достижения</h3>
                <div class="space-y-3">
                  <div v-for="cert in trainer.certifications" :key="cert"
                    class="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                    <UIcon name="i-heroicons-academic-cap" class="w-5 h-5 text-blue-400" />
                    <span class="text-gray-300">{{ cert }}</span>
                  </div>
                </div>
              </div>
            </div>
          </UCard>

          <!-- Статистика -->
          <UCard v-if="showStats">
            <template #header>
              <h2 class="text-xl font-semibold text-white">Статистика</h2>
            </template>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatsCard title="Опыт работы" :value="trainer.experience" :unit="getExperienceLabel(trainer.experience)"
                icon="i-heroicons-calendar-days" color="blue" />

              <StatsCard title="Рейтинг" :value="trainer.rating.toFixed(1)" unit="из 5" icon="i-heroicons-star"
                color="yellow" />

              <StatsCard title="Отзывы" :value="trainer.reviewsCount" icon="i-heroicons-chat-bubble-left-right"
                color="green" />

              <StatsCard title="Клиенты" :value="estimatedClients" icon="i-heroicons-users" color="purple" />
            </div>
          </UCard>

          <!-- Расписание -->
          <UCard v-if="showSchedule">
            <template #header>
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold text-white">Расписание</h2>
                <UButton variant="ghost" size="sm" icon="i-heroicons-calendar"
                  @click="showFullSchedule = !showFullSchedule">
                  {{ showFullSchedule ? 'Скрыть' : 'Показать все' }}
                </UButton>
              </div>
            </template>

            <div class="space-y-4">
              <!-- Рабочие часы -->
              <div v-if="trainer.workingHours">
                <h3 class="text-lg font-medium text-white mb-3">Рабочие часы</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div v-for="(day, index) in weekDays" :key="day"
                    class="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                    <span class="text-gray-300">{{ day }}</span>
                    <span class="text-sm text-gray-400">
                      {{ formatWorkingHours(trainer.workingHours, index) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Ближайшие тренировки -->
              <div v-if="upcomingWorkouts.length">
                <h3 class="text-lg font-medium text-white mb-3">Ближайшие тренировки</h3>
                <div class="space-y-2">
                  <div v-for="workout in displayedWorkouts" :key="workout.id"
                    class="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer"
                    @click="selectWorkout(workout)">
                    <div class="flex items-center space-x-3">
                      <UBadge :color="getWorkoutTypeColor(workout.workout.type)" variant="soft" size="xs">
                        {{ getWorkoutTypeLabel(workout.workout.type) }}
                      </UBadge>
                      <span class="text-white">{{ workout.workout.title }}</span>
                    </div>

                    <div class="text-right">
                      <div class="text-sm text-white">
                        {{ formatDate(workout.startTime) }}
                      </div>
                      <div class="text-xs text-gray-400">
                        {{ formatTime(workout.startTime) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </UCard>

          <!-- Отзывы -->
          <UCard v-if="showReviews">
            <template #header>
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold text-white">Отзывы</h2>
                <UButton variant="outline" size="sm" icon="i-heroicons-plus" @click="showAddReview = true">
                  Оставить отзыв
                </UButton>
              </div>
            </template>

            <div class="space-y-4">
              <!-- Сводка рейтингов -->
              <div class="flex items-center space-x-6 p-4 bg-gray-800/30 rounded-lg">
                <div class="text-center">
                  <div class="text-3xl font-bold text-white">{{ trainer.rating.toFixed(1) }}</div>
                  <div class="flex items-center justify-center mt-1">
                    <UIcon v-for="i in 5" :key="i" name="i-heroicons-star-solid"
                      :class="i <= trainer.rating ? 'text-yellow-400' : 'text-gray-600'" class="w-4 h-4" />
                  </div>
                  <div class="text-xs text-gray-400 mt-1">{{ trainer.reviewsCount }} отзывов</div>
                </div>

                <div class="flex-1">
                  <div v-for="rating in [5, 4, 3, 2, 1]" :key="rating" class="flex items-center space-x-2 mb-1">
                    <span class="text-xs text-gray-400 w-3">{{ rating }}</span>
                    <UProgress :value="getRatingPercentage(rating)" color="yellow" class="flex-1 h-2" />
                    <span class="text-xs text-gray-400 w-8">{{ getRatingCount(rating) }}</span>
                  </div>
                </div>
              </div>

              <!-- Список отзывов -->
              <div class="space-y-4">
                <div v-for="review in mockReviews.slice(0, showAllReviews ? undefined : 3)" :key="review.id"
                  class="p-4 bg-gray-800/30 rounded-lg">
                  <div class="flex items-start space-x-3">
                    <UAvatar :src="review.user.avatar" :alt="review.user.name" size="sm" />

                    <div class="flex-1">
                      <div class="flex items-center justify-between mb-2">
                        <div>
                          <p class="font-medium text-white">{{ review.user.name }}</p>
                          <div class="flex items-center space-x-2 mt-1">
                            <div class="flex items-center">
                              <UIcon v-for="i in 5" :key="i" name="i-heroicons-star-solid"
                                :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-600'" class="w-3 h-3" />
                            </div>
                            <span class="text-xs text-gray-400">
                              {{ formatDate(review.date) }}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p class="text-gray-300 text-sm">{{ review.comment }}</p>

                      <div v-if="review.workout" class="mt-2">
                        <UBadge :color="getWorkoutTypeColor(review.workout)" variant="soft" size="xs">
                          {{ getWorkoutTypeLabel(review.workout) }}
                        </UBadge>
                      </div>
                    </div>
                  </div>
                </div>

                <UButton v-if="mockReviews.length > 3 && !showAllReviews" variant="ghost" @click="showAllReviews = true"
                  class="w-full">
                  Показать все отзывы ({{ mockReviews.length }})
                </UButton>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Боковая панель -->
        <div class="space-y-6">
          <!-- Контактная информация -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold text-white">Контакты</h3>
            </template>

            <div class="space-y-3">
              <div v-if="trainer.user.phone" class="flex items-center space-x-3">
                <UIcon name="i-heroicons-phone" class="w-5 h-5 text-gray-400" />
                <span class="text-gray-300">{{ formatPhone(trainer.user.phone) }}</span>
              </div>

              <div class="flex items-center space-x-3">
                <UIcon name="i-heroicons-envelope" class="w-5 h-5 text-gray-400" />
                <span class="text-gray-300">{{ trainer.user.email }}</span>
              </div>

              <div class="flex items-center space-x-3">
                <UIcon name="i-heroicons-clock" class="w-5 h-5 text-gray-400" />
                <span class="text-gray-300">
                  Тренер с {{ formatDate(trainer.user.createdAt || '') }}
                </span>
              </div>
            </div>
          </UCard>

          <!-- Быстрые действия -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold text-white">Действия</h3>
            </template>

            <div class="space-y-3">
              <UButton color="primary" icon="i-heroicons-calendar-plus" @click="$emit('bookSession')" class="w-full">
                Записаться на тренировку
              </UButton>

              <UButton variant="outline" icon="i-heroicons-chat-bubble-left" @click="$emit('message')" class="w-full">
                Написать сообщение
              </UButton>

              <UButton variant="ghost" icon="i-heroicons-heart" @click="toggleFavorite"
                :color="isFavorite ? 'red' : 'gray'" class="w-full">
                {{ isFavorite ? 'Убрать из избранного' : 'Добавить в избранное' }}
              </UButton>
            </div>
          </UCard>

          <!-- Похожие тренеры -->
          <UCard v-if="similarTrainers.length">
            <template #header>
              <h3 class="text-lg font-semibold text-white">Похожие тренеры</h3>
            </template>

            <div class="space-y-3">
              <div v-for="similar in similarTrainers.slice(0, 3)" :key="similar.id"
                class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer"
                @click="$router.push(`/trainers/${similar.id}`)">
                <UAvatar :src="similar.user.avatar" :alt="`${similar.user.firstName} ${similar.user.lastName}`"
                  size="sm" />

                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-white truncate">
                    {{ similar.user.firstName }} {{ similar.user.lastName }}
                  </p>
                  <div class="flex items-center space-x-1 mt-1">
                    <UIcon name="i-heroicons-star-solid" class="w-3 h-3 text-yellow-400" />
                    <span class="text-xs text-gray-400">{{ similar.rating.toFixed(1) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  WORKOUT_TYPE_COLORS,
  WORKOUT_TYPE_LABELS,
  type BadgeColor
} from '@/types/constants';
import type { ScheduleItem, Trainer, WorkoutType } from '~/types';

interface MockReview {
  id: number
  user: { name: string; avatar?: string }
  rating: number
  comment: string
  date: string
  workout?: string
}

interface Props {
  trainer: Trainer
  showSchedule?: boolean
  showReviews?: boolean
  showStats?: boolean
  editable?: boolean
  upcomingWorkouts?: ScheduleItem[]
  similarTrainers?: Trainer[]
}

const props = withDefaults(defineProps<Props>(), {
  showSchedule: true,
  showReviews: true,
  showStats: true,
  editable: false,
  upcomingWorkouts: () => [],
  similarTrainers: () => []
})

defineEmits<{
  edit: []
  bookSession: []
  message: []
}>()

// Реактивные данные
const showFullSchedule = ref(false)
const showAllReviews = ref(false)
const showAddReview = ref(false)
const isFavorite = ref(false)

// Дни недели
const weekDays = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']

// Моковые данные для отзывов
const mockReviews = ref<MockReview[]>([
  {
    id: 1,
    user: { name: 'Алексей Петров' },
    rating: 5,
    comment: 'Отличный тренер! Очень профессиональный подход, индивидуальная программа тренировок.',
    date: '2024-01-15',
    workout: 'boxing'
  },
  {
    id: 2,
    user: { name: 'Мария Иванова' },
    rating: 4,
    comment: 'Хороший специалист, помог освоить базовые техники бокса.',
    date: '2024-01-10',
    workout: 'boxing'
  },
  {
    id: 3,
    user: { name: 'Дмитрий Сидоров' },
    rating: 5,
    comment: 'Лучший тренер! Быстро вышел на новый уровень благодаря его методикам.',
    date: '2024-01-05',
    workout: 'mma'
  }
])

// Вычисляемые свойства
const estimatedClients = computed(() => {
  const base = props.trainer.experience * 15
  const bonus = props.trainer.rating * 8
  return Math.round(base + bonus)
})

const displayedWorkouts = computed(() => {
  return showFullSchedule.value
    ? props.upcomingWorkouts
    : props.upcomingWorkouts.slice(0, 5)
})

const profileActions = computed(() => [
  [
    {
      label: 'Поделиться',
      icon: 'i-heroicons-share',
      click: () => shareProfile()
    },
    {
      label: 'Пожаловаться',
      icon: 'i-heroicons-flag',
      click: () => reportProfile()
    }
  ]
])

// Утилитарные функции
const getWorkoutTypeLabel = (type: string): string => {
  return WORKOUT_TYPE_LABELS[type as WorkoutType] || type
}

const getWorkoutTypeColor = (type: string): BadgeColor => {
  return WORKOUT_TYPE_COLORS[type as WorkoutType] || 'gray'
}

// Методы
const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
}

const selectWorkout = (workout: ScheduleItem) => {
  // Логика выбора тренировки
  console.log('Selected workout:', workout)
}

const shareProfile = () => {
  // Логика поделиться профилем
  console.log('Share profile')
}

const reportProfile = () => {
  // Логика жалобы на профиль
  console.log('Report profile')
}

const getRatingPercentage = (rating: number) => {
  // Примерное распределение рейтингов
  const distribution = { 5: 60, 4: 25, 3: 10, 2: 3, 1: 2 }
  return distribution[rating as keyof typeof distribution] || 0
}

const getRatingCount = (rating: number) => {
  const percentage = getRatingPercentage(rating)
  return Math.round((props.trainer.reviewsCount * percentage) / 100)
}

// Утилиты форматирования
const formatPhone = (phone: string) => {
  return phone.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 ($2) $3-$4-$5')
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatWorkingHours = (workingHours: any, dayIndex: number) => {
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const dayName = dayNames[dayIndex]
  const hours = workingHours[dayName]

  if (!hours || hours.length === 0) {
    return 'Выходной'
  }

  return hours.map((slot: any) => `${slot.start}-${slot.end}`).join(', ')
}

const getExperienceLabel = (years: number) => {
  if (years === 1) return 'год'
  if (years >= 2 && years <= 4) return 'года'
  return 'лет'
}
</script>

<style scoped>
.trainer-profile {
  @apply bg-gray-900 rounded-xl overflow-hidden;
}

.profile-header {
  @apply relative;
}

.profile-content {
  @apply bg-gray-900;
}

/* Анимации */
.trainer-profile {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>