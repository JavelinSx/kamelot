<template>
  <section :class="[
    'trainer-full-section relative w-full min-h-screen overflow-hidden transition-all duration-500 pb-6 pt-6 sm:pb-8 sm:pt-8',
    {
      'bg-gradient-to-br from-gray-900 via-black to-red-900/20': !isEven,
      'bg-gradient-to-bl from-black via-gray-900 to-red-900/20': isEven
    }
  ]">

    <!-- Фоновое изображение тренера -->
    <div class="absolute inset-0">
      <img :src="trainer.user.avatar" :alt="`${trainer.user.firstName} ${trainer.user.lastName}`"
        class="w-full h-full object-cover object-center sm:object-top"
        :class="isEven ? 'sm:object-left' : 'sm:object-right'"
        style="filter: contrast(1.1) brightness(0.3) saturate(0.8);" />

      <!-- Дополнительный красный overlay -->
      <div
        class="absolute inset-0 bg-gradient-to-b from-red-900/30 via-transparent to-black/80 sm:from-red-900/20 sm:to-black/60">
      </div>
    </div>

    <!-- Контент -->
    <div class="relative z-10 min-h-screen flex items-center">
      <div class="container mx-auto px-3 sm:px-6 lg:px-8">
        <div :class="[
          'grid gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-16 items-center',
          { 'lg:grid-flow-col-dense': isEven }
        ]">

          <!-- Информационная часть -->
          <div :class="[
            'space-y-4 sm:space-y-6 md:space-y-8',
            isEven ? 'lg:col-start-1' : 'lg:col-start-1'
          ]">

            <!-- Заголовок -->
            <div class="space-y-2 sm:space-y-3">
              <div class="flex items-center space-x-2 sm:space-x-3">
                <div class="w-8 sm:w-12 h-0.5 bg-gradient-to-r from-red-600 to-transparent"></div>
                <span class="text-red-500 font-bold text-xs sm:text-sm uppercase tracking-widest font-subheading">
                  Тренер {{ trainer.id }}
                </span>
              </div>

              <h2 class="text-2xl sm:text-4xl md:text-5xl xl:text-6xl font-bold text-white leading-tight font-heading">
                {{ trainer.user.firstName }}
                <br>
                <span class="text-red-500">{{ trainer.user.lastName }}</span>
              </h2>

              <p class="text-sm sm:text-lg md:text-xl text-white leading-relaxed max-w-2xl">
                {{ trainer.bio }}
              </p>
            </div>

            <!-- Специализации -->
            <div class="space-y-3 sm:space-y-4">
              <h3
                class="flex items-center space-x-2 text-red-400 font-bold uppercase tracking-wider text-xs sm:text-sm font-subheading">
                <UIcon name="i-heroicons-bolt" class="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Боевые дисциплины</span>
              </h3>

              <div class="flex flex-wrap gap-2 sm:gap-3">
                <div v-for="specialization in trainer.specialization" :key="specialization"
                  class="rounded-lg px-2 py-1 sm:px-4 sm:py-2 bg-red-600/90 text-white text-xs sm:text-sm font-bold border border-red-700/50 shadow-lg uppercase tracking-wide">
                  {{ getWorkoutTypeLabel(specialization) }}
                </div>
              </div>
            </div>

            <!-- Достижения (первые 3) -->
            <div class="space-y-3 sm:space-y-4">
              <h3
                class="flex items-center space-x-2 text-orange-400 font-bold uppercase tracking-wider text-xs sm:text-sm font-subheading">
                <UIcon name="i-heroicons-trophy" class="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Главные достижения</span>
              </h3>

              <div class="grid gap-2 sm:gap-3">
                <div v-for="achievement in trainer.achievements?.slice(0, 3)" :key="achievement"
                  class="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 bg-orange-400/20  border border-orange-400 rounded-lg">
                  <span class="text-white text-sm sm:text-base leading-relaxed">{{ achievement }}</span>
                </div>
              </div>
            </div>

            <!-- Статистика -->
            <div class="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <div class="text-center p-3 sm:p-4 bg-gray-900/60 backdrop-blur-sm border border-red-600/30 rounded-lg">
                <div class="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">{{ trainer.experience }}</div>
                <div class="text-xs text-white uppercase font-medium">{{ getExperienceLabel(trainer.experience) }}
                </div>
              </div>

              <div class="text-center p-3 sm:p-4 bg-gray-900/60 backdrop-blur-sm border border-red-600/30 rounded-lg">
                <div class="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">{{ trainer.stats?.totalStudents
                  || 0 }}
                </div>
                <div class="text-xs text-white uppercase font-medium">Учеников</div>
              </div>
            </div>

            <!-- Кнопки действий -->
            <div class="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:gap-4 pt-3 sm:pt-4">
              <button
                class="rounded-lg w-full sm:flex-1 sm:flex-initial px-4 py-3 sm:px-8 sm:py-4 bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base font-bold uppercase tracking-wider transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-red-500/30 border border-red-700 active:scale-95"
                @click="$emit('bookSession', trainer)">
                Записаться на тренировку
              </button>

              <button
                class="rounded-lg w-full sm:flex-1 sm:flex-initial px-4 py-3 sm:px-8 sm:py-4 bg-transparent border-2 border-red-600 text-red-400 hover:bg-red-600 hover:text-white text-sm sm:text-base font-bold uppercase tracking-wider transition-all duration-200 active:scale-95"
                @click="$emit('viewProfile', trainer)">
                Полное досье
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Декоративные элементы - скрыты на мобильных -->
    <div class="hidden sm:block absolute top-18 left-8 w-16 h-16 border-l-2 border-t-2 border-red-600/30"></div>
    <div class="hidden sm:block absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-red-600/30"></div>

    <!-- Мобильные декоративные элементы -->
    <div class="sm:hidden absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-red-600/40"></div>
    <div class="sm:hidden absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-red-600/40"></div>

  </section>
</template>

<script setup lang="ts">
import type { Trainer } from '~/types'
import { getWorkoutTypeLabel } from '~/types/martial-arts'

interface Props {
  trainer: Trainer
  currentIndex: number
  totalTrainers: number
  isEven?: boolean
}

const props = defineProps<Props>()

interface Emits {
  viewProfile: [trainer: Trainer]
  bookSession: [trainer: Trainer]
  nextTrainer: []
  previousTrainer: []
}

const emit = defineEmits<Emits>()

// Вычисляемые свойства
const isFirst = computed(() => props.currentIndex === 0)
const isLast = computed(() => props.currentIndex === props.totalTrainers - 1)

const getExperienceLabel = (years: number) => {
  if (years === 1) return 'ГОД ОПЫТА'
  if (years >= 2 && years <= 4) return 'ГОДА ОПЫТА'
  return 'ЛЕТ ОПЫТА'
}
</script>

<style scoped>
/* Контейнер с адаптивными размерами */
.container {
  max-width: 1400px;
}

/* Улучшенная типографика для мобильных */
@media (max-width: 640px) {
  .container {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
}

/* Анимации появления контента с учетом производительности на мобильных */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Применяем анимации только на больших экранах для производительности */
@media (min-width: 768px) {

  .space-y-4>*,
  .space-y-6>*,
  .space-y-8>* {
    animation: slideInLeft 0.6s ease-out forwards;
  }

  .space-y-4>*:nth-child(2),
  .space-y-6>*:nth-child(2),
  .space-y-8>*:nth-child(2) {
    animation-delay: 0.1s;
  }

  .space-y-4>*:nth-child(3),
  .space-y-6>*:nth-child(3),
  .space-y-8>*:nth-child(3) {
    animation-delay: 0.2s;
  }

  .space-y-4>*:nth-child(4),
  .space-y-6>*:nth-child(4),
  .space-y-8>*:nth-child(4) {
    animation-delay: 0.3s;
  }
}

/* Улучшенное касание для мобильных устройств */
@media (max-width: 768px) {
  button {
    min-height: 44px;
    -webkit-tap-highlight-color: transparent;
  }

  button:active {
    transform: scale(0.95);
  }
}

/* Оптимизация для производительности на мобильных */
@media (max-width: 768px) {
  .backdrop-blur-sm {
    backdrop-filter: none;
    background-color: rgba(0, 0, 0, 0.8);
  }

  .shadow-lg {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
}

/* Улучшенная читаемость на маленьких экранах */
@media (max-width: 480px) {
  .tracking-wider {
    letter-spacing: 0.05em;
  }

  .tracking-widest {
    letter-spacing: 0.1em;
  }
}
</style>