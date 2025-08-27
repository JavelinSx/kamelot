<!-- components/UserBookingCard.vue -->
<template>
  <div
    class="user-booking-card bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <!-- Основная информация -->
      <div class="flex-1">
        <div class="flex items-start gap-4">
          <!-- Аватар тренера -->
          <img :src="booking.scheduleItem.trainer.user.avatar" :alt="trainerName"
            class="w-12 h-12 rounded-full object-cover" />

          <div class="flex-1">
            <!-- Название тренировки -->
            <h4 class="text-lg font-semibold text-white mb-1">
              {{ workoutTypeLabel }}
            </h4>

            <!-- Тренер -->
            <p class="text-gray-300 mb-2">
              <span class="text-gray-400">Тренер:</span>
              {{ trainerName }}
            </p>

            <!-- Время и дата -->
            <div class="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <div class="flex items-center gap-1">
                <UIcon name="i-heroicons-calendar-days" class="w-4 h-4" />
                <span>{{ formatDate(booking.scheduleItem.startTime) }}</span>
              </div>

              <div class="flex items-center gap-1">
                <UIcon name="i-heroicons-clock" class="w-4 h-4" />
                <span>{{ formatTimeRange(booking.scheduleItem.startTime, booking.scheduleItem.endTime) }}</span>
              </div>

              <div class="flex items-center gap-1" v-if="booking.scheduleItem.location">
                <UIcon name="i-heroicons-map-pin" class="w-4 h-4" />
                <span>{{ booking.scheduleItem.location }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Статус и действия -->
      <div class="flex flex-col lg:items-end gap-3">
        <!-- Статус -->
        <UBadge :color="getStatusColor(booking.status)" :variant="getStatusVariant(booking.status)" size="lg">
          {{ getStatusLabel(booking.status) }}
        </UBadge>

        <!-- Действия -->
        <div class="flex gap-2">
          <!-- Отменить (только для будущих тренировок) -->
          <UButton v-if="canCancel" size="sm" color="red" variant="outline" icon="i-heroicons-x-mark"
            @click="$emit('cancel', booking)">
            Отменить
          </UButton>

          <!-- Перенести -->
          <UButton v-if="canReschedule" size="sm" variant="outline" icon="i-heroicons-arrow-path"
            @click="$emit('reschedule', booking)">
            Перенести
          </UButton>

          <!-- Оценить -->
          <UButton v-if="canReview" size="sm" color="green" variant="outline" icon="i-heroicons-star"
            @click="$emit('review', booking)">
            Оценить
          </UButton>

          <!-- Детали -->
          <UButton size="sm" variant="ghost" icon="i-heroicons-eye" @click="$emit('details', booking)">
            Детали
          </UButton>
        </div>
      </div>
    </div>

    <!-- Дополнительная информация -->
    <div v-if="booking.notes || showParticipants" class="mt-4 pt-4 border-t border-gray-700">
      <!-- Заметки -->
      <div v-if="booking.notes" class="mb-3">
        <p class="text-sm text-gray-400 mb-1">Заметки:</p>
        <p class="text-sm text-gray-300">{{ booking.notes }}</p>
      </div>

      <!-- Участники -->
      <div v-if="showParticipants" class="flex items-center gap-4 text-sm text-gray-400">
        <div class="flex items-center gap-1">
          <UIcon name="i-heroicons-users" class="w-4 h-4" />
          <span>
            {{ booking.scheduleItem.currentParticipants }}/{{ booking.scheduleItem.maxParticipants }} участников
          </span>
        </div>

        <div v-if="booking.scheduleItem.price" class="flex items-center gap-1">
          <UIcon name="i-heroicons-currency-dollar" class="w-4 h-4" />
          <span>{{ booking.scheduleItem.price }} ₽</span>
        </div>
      </div>
    </div>

    <!-- Прогресс до тренировки -->
    <div v-if="showCountdown && isUpcoming" class="mt-4 pt-4 border-t border-gray-700">
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-400">До тренировки:</span>
        <span class="text-white font-medium">{{ timeUntilWorkout }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Booking } from '@/types';
import { getWorkoutTypeLabel } from '~/types/martial-arts';

interface Props {
  booking: Booking;
  showParticipants?: boolean;
  showCountdown?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showParticipants: true,
  showCountdown: true
});

interface Emits {
  cancel: [booking: Booking];
  reschedule: [booking: Booking];
  review: [booking: Booking];
  details: [booking: Booking];
}

defineEmits<Emits>();

// Computed properties
const trainerName = computed(() => {
  const trainer = props.booking.scheduleItem.trainer.user;
  return `${trainer.firstName} ${trainer.lastName}`;
});

const workoutTypeLabel = computed(() => {
  return getWorkoutTypeLabel(props.booking.scheduleItem.workout.type);
});

const isUpcoming = computed(() => {
  return new Date(props.booking.scheduleItem.startTime) > new Date();
});

const isPast = computed(() => {
  return new Date(props.booking.scheduleItem.endTime) < new Date();
});

const canCancel = computed(() => {
  return isUpcoming.value &&
    props.booking.status === 'confirmed' &&
    new Date(props.booking.scheduleItem.startTime).getTime() - new Date().getTime() > 2 * 60 * 60 * 1000; // 2 часа до тренировки
});

const canReschedule = computed(() => {
  return isUpcoming.value &&
    props.booking.status === 'confirmed' &&
    new Date(props.booking.scheduleItem.startTime).getTime() - new Date().getTime() > 24 * 60 * 60 * 1000; // 24 часа до тренировки
});

const canReview = computed(() => {
  return isPast.value &&
    props.booking.status === 'completed' &&
    !props.booking.review;
});

const timeUntilWorkout = computed(() => {
  if (!isUpcoming.value) return '';

  const now = new Date();
  const start = new Date(props.booking.scheduleItem.startTime);
  const diff = start.getTime() - now.getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days}д ${hours}ч`;
  } else if (hours > 0) {
    return `${hours}ч ${minutes}м`;
  } else {
    return `${minutes}м`;
  }
});

// Методы - перенесены внутрь <script setup>
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatTimeRange = (start: string, end: string): string => {
  const startTime = new Date(start).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  });
  const endTime = new Date(end).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  });
  return `${startTime} - ${endTime}`;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed': return 'green' as const;
    case 'completed': return 'blue' as const;
    case 'cancelled': return 'red' as const;
    case 'pending': return 'yellow' as const;
    case 'no_show': return 'gray' as const;
    default: return 'gray' as const;
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'confirmed': return 'soft' as const;
    case 'completed': return 'soft' as const;
    case 'cancelled': return 'soft' as const;
    case 'pending': return 'soft' as const;
    case 'no_show': return 'soft' as const;
    default: return 'soft' as const;
  }
};

const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'confirmed': return 'Подтверждено';
    case 'completed': return 'Завершено';
    case 'cancelled': return 'Отменено';
    case 'pending': return 'Ожидает';
    case 'no_show': return 'Не явился';
    default: return 'Неизвестно';
  }
};
</script>

<style scoped>
.user-booking-card {
  transition: all 0.2s ease;
}

.user-booking-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>