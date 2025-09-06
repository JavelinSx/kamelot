<!-- components/WorkoutModal.vue -->
<template>
  <UModal v-model="isOpen" :ui="{ width: 'w-full max-w-md' }">
    <div v-if="event" class="p-6">
      <!-- Заголовок -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-white">
          {{ event.title }}
        </h3>
        <UButton icon="i-heroicons-x-mark" variant="ghost" @click="closeModal" />
      </div>

      <!-- Детали тренировки -->
      <div class="space-y-4 mb-6">
        <!-- Тип тренировки -->
        <div class="flex items-center space-x-3">
          <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: getWorkoutColor(event.type) }" />
          <span class="text-gray-300">{{ getWorkoutTypeLabel(event.type) }}</span>
        </div>

        <!-- Время -->
        <div class="flex items-center space-x-3">
          <UIcon name="i-heroicons-clock" class="w-4 h-4 text-gray-400" />
          <span class="text-gray-300">
            {{ formatEventDateTime(event) }}
          </span>
        </div>

        <!-- Тренер -->
        <div class="flex items-center space-x-3">
          <UIcon name="i-heroicons-user" class="w-4 h-4 text-gray-400" />
          <span class="text-gray-300">{{ event.trainer }}</span>
        </div>

        <!-- Места -->
        <div class="flex items-center space-x-3">
          <UIcon name="i-heroicons-users" class="w-4 h-4 text-gray-400" />
          <span class="text-gray-300">
            Свободно мест: {{ event.availableSpots }} из {{ event.maxSpots }}
          </span>
        </div>

        <!-- Локация -->
        <div v-if="event.extendedProps?.location" class="flex items-center space-x-3">
          <UIcon name="i-heroicons-map-pin" class="w-4 h-4 text-gray-400" />
          <span class="text-gray-300">{{ event.extendedProps.location }}</span>
        </div>

        <!-- Цена -->
        <div v-if="event.extendedProps?.price" class="flex items-center space-x-3">
          <UIcon name="i-heroicons-currency-dollar" class="w-4 h-4 text-gray-400" />
          <span class="text-gray-300">{{ event.extendedProps.price }} ₽</span>
        </div>

        <!-- Приватная тренировка -->
        <div v-if="event.extendedProps?.scheduleItem?.isPrivate" class="flex items-center space-x-3">
          <UIcon name="i-heroicons-lock-closed" class="w-4 h-4 text-yellow-400" />
          <span class="text-yellow-300">Приватная тренировка</span>
        </div>

        <!-- Уже забронировано -->
        <div v-if="event.isBooked" class="flex items-center space-x-3">
          <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-400" />
          <span class="text-green-300">Вы записаны на эту тренировку</span>
        </div>

        <!-- Описание -->
        <div v-if="event.extendedProps?.description" class="pt-2 border-t border-gray-700">
          <p class="text-sm text-gray-400">{{ event.extendedProps.description }}</p>
        </div>
      </div>

      <!-- Действия -->
      <div class="flex space-x-3">
        <UButton v-if="!user" color="red" class="flex-1" @click="goToAuth">
          Войти для записи
        </UButton>

        <template v-else>
          <UButton v-if="!event.isBooked && event.availableSpots > 0" color="red" class="flex-1" @click="bookWorkout"
            :loading="booking">
            Записаться
          </UButton>

          <UButton v-else-if="event.isBooked" variant="outline" class="flex-1" @click="cancelBooking"
            :loading="booking">
            Отменить запись
          </UButton>

          <UButton v-else variant="outline" class="flex-1" disabled>
            Мест нет
          </UButton>
        </template>

        <UButton variant="ghost" @click="closeModal">
          Закрыть
        </UButton>
      </div>
    </div>
  </UModal>
</template>

<script setup lang="ts">
import type { CalendarEvent, User } from '@/types';
import { getWorkoutTypeLabel } from '@/types/martial-arts';

interface Props {
  modelValue: boolean;
  event: CalendarEvent | null;
  user?: User | null;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'book', eventId: number): void;
  (e: 'cancel', eventId: number): void;
  (e: 'close'): void;
}

const props = withDefaults(defineProps<Props>(), {
  user: null
});

const emit = defineEmits<Emits>();

// Реактивные данные
const booking = ref(false);

// Вычисляемые свойства
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Методы
const getWorkoutColor = (type: string) => {
  const colorMap: Record<string, string> = {
    'boxing': '#ef4444',      // red-500
    'kickboxing': '#f97316',  // orange-500
    'grappling': '#06b6d4',   // cyan-500
    'bjj': '#3b82f6',         // blue-500
    'wrestling': '#6366f1',   // indigo-500
    'mma': '#8b5cf6',         // violet-500
    'pankration': '#10b981'   // emerald-500
  };

  return colorMap[type] || '#6b7280';
};

const formatEventDateTime = (event: CalendarEvent) => {
  const date = event.start.toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  const timeStart = event.start.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const timeEnd = event.end.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return `${date}, ${timeStart} - ${timeEnd}`;
};

const closeModal = () => {
  isOpen.value = false;
  emit('close');
};

const goToAuth = async () => {
  closeModal();
  await navigateTo('/auth/login');
};

const bookWorkout = async () => {
  if (!props.event) return;

  booking.value = true;
  try {
    emit('book', props.event.id);
    closeModal();
  } catch (error) {
    console.error('Error booking workout:', error);
  } finally {
    booking.value = false;
  }
};

const cancelBooking = async () => {
  if (!props.event) return;

  booking.value = true;
  try {
    emit('cancel', props.event.id);
    closeModal();
  } catch (error) {
    console.error('Error cancelling booking:', error);
  } finally {
    booking.value = false;
  }
};
</script>