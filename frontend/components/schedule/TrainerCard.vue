<template>
  <div :class="[
    'relative bg-gradient-to-br from-gray-900 to-black border-2 border-red-600 shadow-xl overflow-hidden transition-all duration-300',
    {
      'cursor-pointer hover:border-red-500 hover:scale-[1.02] hover:shadow-red-600/40': clickable,
      'border-red-400 shadow-red-600/60': featured
    }
  ]" @click="handleCardClick">

    <!-- Основной контейнер -->
    <div class="flex flex-col md:flex-row">

      <!-- Левая секция: Информация -->
      <div
        class="flex-1 p-4 md:p-6 space-y-4 order-2 md:order-1 relative z-10 
                  before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-black/20 before:to-black/80 before:-z-10
                  md:before:bg-gradient-to-b md:before:from-transparent md:before:via-transparent md:before:to-black/90">

        <!-- Имя и звание -->
        <div class="text-left">
          <h3 class="text-lg font-bold text-white leading-tight font-heading drop-shadow-lg">
            {{ trainer.user.firstName }} {{ trainer.user.lastName }}
          </h3>
          <div class="mt-1 text-xs font-subheading font-semibold uppercase tracking-wider">
            <span class="text-red-500 font-bold drop-shadow-md">ВОИН</span>
            <span class="text-gray-300 ml-1 drop-shadow-sm">{{ getPrimarySpecialization(trainer.specialization)
              }}</span>
          </div>
        </div>

        <!-- Боевые дисциплины -->
        <div class="space-y-2">
          <h4
            class="flex items-center space-x-1 text-xs font-bold text-red-400 uppercase tracking-wider mb-2 font-subheading drop-shadow-sm">
            <UIcon name="i-heroicons-bolt" class="w-4 h-4" />
            <span>БОЕВЫЕ ДИСЦИПЛИНЫ</span>
          </h4>
          <div class="flex flex-wrap gap-1.5">
            <div v-for="specialization in displayedSpecializations" :key="specialization"
              class="px-2 py-1 bg-red-600/90 backdrop-blur-sm text-white text-xs font-bold border border-red-700/50 shadow-lg font-subheading uppercase">
              <span>{{ getWorkoutTypeLabel(specialization) }}</span>
            </div>
            <div v-if="trainer.specialization.length > maxDisplayedSpecializations"
              class="px-2 py-1 bg-gray-700/90 backdrop-blur-sm border border-gray-600/50 text-white text-xs font-bold font-subheading uppercase">
              +{{ trainer.specialization.length - maxDisplayedSpecializations }}
            </div>
          </div>
        </div>

        <!-- Статистика (компактная версия) -->
        <div v-if="showStats" class="grid grid-cols-3 gap-2">
          <div class="bg-gray-900/80 backdrop-blur-sm border border-red-600/50 p-2 text-center shadow-inner">
            <div class="flex flex-col items-center space-y-1">
              <UIcon name="i-heroicons-fire" class="w-3 h-3 text-red-500 drop-shadow-sm" />
              <span class="text-sm font-bold text-white font-heading drop-shadow-sm">{{ trainer.experience }}</span>
              <span
                class="text-xs text-gray-300 font-medium font-subheading uppercase text-center leading-tight">лет</span>
            </div>
          </div>

          <div class="bg-gray-900/80 backdrop-blur-sm border border-red-600/50 p-2 text-center shadow-inner">
            <div class="flex flex-col items-center space-y-1">
              <UIcon name="i-heroicons-star" class="w-3 h-3 text-yellow-500 drop-shadow-sm" />
              <span class="text-sm font-bold text-white font-heading drop-shadow-sm">{{ trainer.rating }}</span>
              <span
                class="text-xs text-gray-300 font-medium font-subheading uppercase text-center leading-tight">рейтинг</span>
            </div>
          </div>

          <div class="bg-gray-900/80 backdrop-blur-sm border border-red-600/50 p-2 text-center shadow-inner">
            <div class="flex flex-col items-center space-y-1">
              <UIcon name="i-heroicons-user-group" class="w-3 h-3 text-blue-500 drop-shadow-sm" />
              <span class="text-sm font-bold text-white font-heading drop-shadow-sm">{{ estimatedClients }}</span>
              <span
                class="text-xs text-gray-300 font-medium font-subheading uppercase text-center leading-tight">учеников</span>
            </div>
          </div>
        </div>

        <!-- Кнопки действий -->
        <div class="flex flex-col space-y-2">
          <button v-if="showBookButton" :class="[
            'flex items-center justify-center space-x-1.5 px-3 py-2 font-bold text-xs transition-all duration-200 font-subheading uppercase tracking-wider shadow-lg',
            'bg-red-600/90 backdrop-blur-sm text-white border border-red-700/50 hover:bg-red-700 hover:shadow-red-500/30 hover:-translate-y-0.5',
            { 'opacity-50 cursor-not-allowed': loading }
          ]" :disabled="loading" @click="handleBookClick">
            <UIcon name="i-heroicons-sword" class="w-4 h-4" />
            <span>В БОЙ</span>
          </button>

          <button
            class="flex items-center justify-center space-x-1.5 px-3 py-2 font-bold text-xs transition-all duration-200 font-subheading uppercase tracking-wider bg-transparent text-gray-300 border border-gray-600/50 hover:bg-gray-800/50 hover:text-white backdrop-blur-sm"
            @click="handleViewProfileClick">
            <UIcon name="i-heroicons-eye" class="w-4 h-4" />
            <span>ДОСЬЕ</span>
          </button>
        </div>
      </div>

      <!-- Правая секция: Фото с градиентным overlay -->
      <div class="w-full md:w-1/2 order-1 md:order-2 relative">
        <!-- Меню действий -->
        <UDropdown v-if="!compact" :items="dropdownItems" :popper="{ placement: 'bottom-start' }"
          class="absolute top-2 right-2 z-20">
          <div
            class="p-1.5 bg-gray-800/90 backdrop-blur-sm border border-red-600/50 cursor-pointer hover:bg-gray-700 transition-colors shadow-lg">
            <UIcon name="i-heroicons-ellipsis-vertical" class="w-4 h-4 text-white" />
          </div>
        </UDropdown>

        <div class="relative h-full min-h-[300px]">
          <!-- Фоновое изображение -->
          <img :src="trainer.user.avatar" :alt="`${trainer.user.firstName} ${trainer.user.lastName}`"
            class="w-full h-full object-cover" style="filter: contrast(1.1) brightness(0.95);" />

          <!-- Градиентные overlay для плавного перехода -->
          <div
            class="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/40 md:bg-gradient-to-t md:from-black/60 md:via-transparent md:to-transparent">
          </div>

          <!-- Дополнительный overlay для создания глубины -->
          <div class="absolute inset-0 bg-gradient-to-br from-red-900/10 via-transparent to-black/30"></div>

          <!-- Статус воина -->
          <div v-if="trainer.isActive"
            class="absolute top-2 left-2 bg-red-600/90 backdrop-blur-sm text-white text-xs px-1.5 py-0.5 transform rotate-12 shadow-lg font-bold tracking-wider font-subheading border border-red-500/30">
            <span>В БОЮ</span>
          </div>

          <!-- Корона чемпиона -->
          <div v-if="trainer.certifications?.length"
            class="absolute top-1 right-1 bg-red-600/90 backdrop-blur-sm rounded-full p-1 shadow-lg border border-red-500/30">
            <UIcon name="i-heroicons-star" class="w-5 h-5 text-yellow-400" />
          </div>

          <!-- Дополнительный градиент снизу для мобильных -->
          <div
            class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 via-black/40 to-transparent md:hidden">
          </div>
        </div>
      </div>
    </div>

    <!-- Дополнительные декоративные элементы -->
    <div
      class="absolute top-1 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-red-600/80 to-transparent">
    </div>
    <div class="absolute top-1 left-1 w-3 h-3 border-t border-l border-red-600/80"></div>
    <div class="absolute top-1 right-1 w-3 h-3 border-t border-r border-red-600/80"></div>

    <!-- Внутренняя рамка-свечение -->
    <div class="absolute inset-1 border border-red-500/20 pointer-events-none"></div>
  </div>
</template>

<script setup lang="ts">
import type { ScheduleItem, Trainer } from '~/types'
import { getWorkoutTypeLabel } from '~/types/martial-arts'

interface Props {
  trainer: Trainer
  showStats?: boolean
  showSchedule?: boolean
  showContact?: boolean
  showBookButton?: boolean
  compact?: boolean
  featured?: boolean
  clickable?: boolean
  upcomingSchedule?: ScheduleItem[]
  loading?: boolean
  maxDisplayedSpecializations?: number
  maxDisplayedCertifications?: number
}

const props = withDefaults(defineProps<Props>(), {
  showStats: true,
  showSchedule: false,
  showContact: true,
  showBookButton: true,
  compact: false,
  featured: false,
  clickable: true,
  upcomingSchedule: () => [],
  loading: false,
  maxDisplayedSpecializations: 3,
  maxDisplayedCertifications: 2
})

interface Emits {
  viewProfile: [trainer: Trainer]
  bookSession: [trainer: Trainer]
  message: [trainer: Trainer]
  cardClick: [trainer: Trainer]
  favorite: [trainer: Trainer]
  share: [trainer: Trainer]
}

const emit = defineEmits<Emits>()

// Вычисляемые свойства
const displayedSpecializations = computed(() =>
  props.trainer.specialization.slice(0, props.maxDisplayedSpecializations)
)

const estimatedClients = computed(() => {
  const base = props.trainer.experience * 10
  const bonus = props.trainer.rating * 5
  return Math.round(base + bonus)
})

const dropdownItems = computed(() => [
  [
    {
      label: 'Добавить в избранное',
      icon: 'i-heroicons-heart',
      click: () => emit('favorite', props.trainer)
    },
    {
      label: 'Поделиться',
      icon: 'i-heroicons-share',
      click: () => emit('share', props.trainer)
    }
  ],
  [
    {
      label: 'Пожаловаться',
      icon: 'i-heroicons-flag',
      click: () => handleReportClick()
    }
  ]
])

// Методы
const getPrimarySpecialization = (specializations: string[]) => {
  const labels = {
    boxing: 'БОКСА',
    kickboxing: 'КИКБОКСИНГА',
    mma: 'ММА',
    bjj: 'БЖЖ',
    grappling: 'ГРЭППЛИНГА',
    wrestling: 'БОРЬБЫ'
  }
  return labels[specializations[0] as keyof typeof labels] || 'ВОЙНЫ'
}

const handleViewProfileClick = (event: Event) => {
  event.stopPropagation()
  emit('viewProfile', props.trainer)
}

const handleBookClick = (event: Event) => {
  event.stopPropagation()
  emit('bookSession', props.trainer)
}

const handleCardClick = () => {
  if (props.clickable) {
    emit('cardClick', props.trainer)
  }
}

const handleReportClick = () => {
  console.log('Report trainer:', props.trainer.id)
}
</script>