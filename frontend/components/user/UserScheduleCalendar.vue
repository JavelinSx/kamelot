<!-- components/UserScheduleCalendar.vue -->
<template>
  <div class="user-schedule-calendar">
    <!-- Заголовок календаря -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <h3 class="text-xl font-semibold text-white">
          {{ currentMonthYear }}
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
        <span class="text-gray-300">Подтверждено</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <span class="text-gray-300">Ожидает</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 bg-red-500 rounded-full"></div>
        <span class="text-gray-300">Отменено</span>
      </div>
    </div>

    <!-- Календарь месяца -->
    <div v-if="currentView === 'month'" class="month-view">
      <!-- Дни недели -->
      <div class="grid grid-cols-7 gap-1 mb-2">
        <div v-for="day in weekDayLabels" :key="day" class="text-center text-sm font-medium text-gray-400 py-2">
          {{ day }}
        </div>
      </div>

      <!-- Дни месяца -->
      <div class="grid grid-cols-7 gap-1">
        <div v-for="day in calendarDays" :key="`${day.date.getTime()}`" :class="[
          'calendar-day p-2 min-h-[80px] cursor-pointer transition-colors',
          {
            'bg-gray-800 hover:bg-gray-700': day.isCurrentMonth,
            'bg-gray-800/50 text-gray-500': !day.isCurrentMonth,
            'bg-blue-500/20 border border-blue-500/50': isSelectedDay(day.date),
            'ring-2 ring-yellow-500': isToday(day.date)
          }
        ]" @click="selectDay(day.date)">
          <div class="font-medium text-white mb-1">
            {{ day.date.getDate() }}
          </div>

          <!-- События дня -->
          <div class="space-y-1">
            <div v-for="booking in getBookingsForDay(day.date)" :key="booking.id" :class="[
              'booking-event px-2 py-1 rounded text-xs cursor-pointer',
              getBookingEventClass(booking)
            ]" @click.stop="selectBooking(booking)">
              <div class="font-medium truncate">
                {{ formatBookingTime(booking) }}
              </div>
              <div class="truncate opacity-90">
                {{ getWorkoutTypeLabel(booking.scheduleItem.workout.type) }}
              </div>
            </div>

            <!-- Показать больше событий -->
            <div v-if="getBookingsForDay(day.date).length > 2"
              class="text-xs text-gray-400 hover:text-gray-300 cursor-pointer" @click.stop="selectDay(day.date)">
              +{{ getBookingsForDay(day.date).length - 2 }} еще
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Календарь недели -->
    <div v-else-if="currentView === 'week'" class="week-view">
      <div class="grid grid-cols-8 gap-1">
        <!-- Временные слоты -->
        <div class="space-y-1">
          <div class="h-12"></div> <!-- Пустое место для заголовков дней -->
          <div v-for="hour in businessHours" :key="hour"
            class="h-12 text-sm text-gray-400 text-right pr-2 flex items-center justify-end">
            {{ formatHour(hour) }}
          </div>
        </div>

        <!-- Дни недели -->
        <div v-for="day in weekDays" :key="day.date.getTime()" class="week-day">
          <!-- Заголовок дня -->
          <div :class="[
            'text-center py-2 mb-1 rounded',
            {
              'bg-blue-500/20 text-blue-300': isSelectedDay(day.date),
              'bg-yellow-500/20 text-yellow-300': isToday(day.date),
              'text-gray-300': !isToday(day.date) && !isSelectedDay(day.date)
            }
          ]">
            <div class="text-sm font-medium">{{ day.shortName }}</div>
            <div class="text-lg font-bold">{{ day.date.getDate() }}</div>
          </div>

          <!-- События дня -->
          <div class="relative" style="height: 576px;"> <!-- 24 hours * 24px -->
            <div v-for="booking in getBookingsForDay(day.date)" :key="booking.id" :class="[
              'absolute left-0 right-0 mx-1 rounded p-2 cursor-pointer',
              getBookingEventClass(booking)
            ]" :style="getBookingPosition(booking)" @click="selectBooking(booking)">
              <div class="text-xs font-medium truncate">
                {{ formatBookingTime(booking) }}
              </div>
              <div class="text-xs truncate opacity-90">
                {{ getWorkoutTypeLabel(booking.scheduleItem.workout.type) }}
              </div>
              <div class="text-xs truncate opacity-75">
                {{ booking.scheduleItem.trainer.user.firstName }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Детали выбранного дня -->
    <div v-if="selectedDayBookings.length" class="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
      <h4 class="font-semibold text-white mb-3">
        Тренировки на {{ formatSelectedDate }}
      </h4>
      <div class="space-y-3">
        <div v-for="booking in selectedDayBookings" :key="booking.id"
          class="flex items-center justify-between p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
          @click="selectBooking(booking)">
          <div>
            <div class="font-medium text-white">
              {{ getWorkoutTypeLabel(booking.scheduleItem.workout.type) }}
            </div>
            <div class="text-sm text-gray-300">
              {{ formatBookingTimeRange(booking) }} • {{ booking.scheduleItem.trainer.user.firstName }}
            </div>
          </div>
          <UBadge :color="getStatusColor(booking.status)" variant="soft">
            {{ getStatusLabel(booking.status) }}
          </UBadge>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Booking, BookingStatus, WorkoutType } from '@/types';
import {
  BOOKING_STATUS_COLORS,
  BOOKING_STATUS_LABELS,
  WORKOUT_TYPE_LABELS,
  type BadgeColor
} from '@/types/constants';

interface Props {
  bookings: Booking[];
  selectedDate?: Date;
}

const props = withDefaults(defineProps<Props>(), {
  selectedDate: () => new Date()
});

interface Emits {
  dateSelect: [date: Date];
  bookingClick: [booking: Booking];
}

const emit = defineEmits<Emits>();

// Reactive data
const currentDate = ref(new Date(props.selectedDate));
const currentView = ref<'month' | 'week'>('month');

// Computed properties
const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString('ru-RU', {
    month: 'long',
    year: 'numeric'
  });
});

const weekDayLabels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const weekDays = computed(() => {
  const start = getStartOfWeek(currentDate.value);
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    return {
      date,
      shortName: date.toLocaleDateString('ru-RU', { weekday: 'short' })
    };
  });
});

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Начинаем с понедельника
  const startDate = new Date(firstDay);
  const dayOfWeek = (firstDay.getDay() + 6) % 7;
  startDate.setDate(firstDay.getDate() - dayOfWeek);

  const endDate = new Date(lastDay);
  const endDayOfWeek = (lastDay.getDay() + 6) % 7;
  endDate.setDate(lastDay.getDate() + (6 - endDayOfWeek));

  const days = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    days.push({
      date: new Date(current),
      isCurrentMonth: current.getMonth() === month
    });
    current.setDate(current.getDate() + 1);
  }

  return days;
});

const businessHours = computed(() => {
  return Array.from({ length: 14 }, (_, i) => i + 8); // 8:00 - 21:00
});

const selectedDayBookings = computed(() => {
  return getBookingsForDay(currentDate.value);
});

const formatSelectedDate = computed(() => {
  return currentDate.value.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
});

// Helper methods
const getWorkoutTypeLabel = (type: WorkoutType): string => {
  return WORKOUT_TYPE_LABELS[type] || type
}

const getStatusColor = (status: BookingStatus): BadgeColor => {
  return BOOKING_STATUS_COLORS[status] || 'gray'
}

const getStatusLabel = (status: BookingStatus): string => {
  return BOOKING_STATUS_LABELS[status] || status
}

// Navigation methods
const previousMonth = () => {
  if (currentView.value === 'month') {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1);
  } else {
    const newDate = new Date(currentDate.value);
    newDate.setDate(newDate.getDate() - 7);
    currentDate.value = newDate;
  }
};

const nextMonth = () => {
  if (currentView.value === 'month') {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1);
  } else {
    const newDate = new Date(currentDate.value);
    newDate.setDate(newDate.getDate() + 7);
    currentDate.value = newDate;
  }
};

const goToToday = () => {
  currentDate.value = new Date();
};

const changeView = (view: 'month' | 'week') => {
  currentView.value = view;
};

const selectDay = (date: Date) => {
  currentDate.value = new Date(date);
  emit('dateSelect', date);
};

const selectBooking = (booking: Booking) => {
  emit('bookingClick', booking);
};

// Date utility methods
const isToday = (date: Date): boolean => {
  const today = new Date();
  return isSameDay(date, today);
};

const isSelectedDay = (date: Date): boolean => {
  return isSameDay(date, currentDate.value);
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();
};

const getBookingsForDay = (date: Date): Booking[] => {
  return props.bookings.filter(booking => {
    const bookingDate = new Date(booking.scheduleItem.startTime);
    return isSameDay(bookingDate, date);
  });
};

const getStartOfWeek = (date: Date): Date => {
  const start = new Date(date);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1);
  start.setDate(diff);
  return start;
};

// Formatting methods
const formatBookingTime = (booking: Booking): string => {
  return new Date(booking.scheduleItem.startTime).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatBookingTimeRange = (booking: Booking): string => {
  const start = new Date(booking.scheduleItem.startTime);
  const end = new Date(booking.scheduleItem.endTime);
  return `${start.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
};

const formatHour = (hour: number): string => {
  return `${hour.toString().padStart(2, '0')}:00`;
};

// Styling methods
const getBookingEventClass = (booking: Booking): string => {
  switch (booking.status) {
    case 'completed':
      return 'bg-green-500/20 text-green-300 border border-green-500/30';
    case 'confirmed':
      return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
    case 'cancelled':
      return 'bg-red-500/20 text-red-300 border border-red-500/30';
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30';
    case 'no_show':
      return 'bg-orange-500/20 text-orange-300 border border-orange-500/30';
    case 'waiting_list':
      return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
    default:
      return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
  }
};

const getBookingPosition = (booking: Booking) => {
  const startTime = new Date(booking.scheduleItem.startTime);
  const endTime = new Date(booking.scheduleItem.endTime);

  const startHour = startTime.getHours() + startTime.getMinutes() / 60;
  const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

  const businessStart = 8; // 8:00
  const top = (startHour - businessStart) * 24; // 24px per hour
  const height = duration * 24;

  return {
    top: `${top}px`,
    height: `${height}px`
  };
};

// Watch for prop changes
watch(() => props.selectedDate, (newDate) => {
  if (newDate) {
    currentDate.value = new Date(newDate);
  }
});
</script>

<style scoped>
.calendar-day {
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.booking-event {
  transition: all 0.2s ease;
}

.booking-event:hover {
  transform: scale(1.02);
}

.week-day {
  min-height: 600px;
}

.user-schedule-calendar {
  @apply text-white;
}
</style>