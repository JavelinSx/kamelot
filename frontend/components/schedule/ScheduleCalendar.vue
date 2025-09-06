<!-- components/ScheduleCalendar.vue -->
<template>
  <div class="schedule-calendar">
    <!-- Дни недели -->
    <div class="grid grid-cols-7 gap-px mb-4">
      <div v-for="day in weekDays" :key="day" class="text-center text-sm font-medium text-gray-400 py-2">
        {{ day }}
      </div>
    </div>

    <!-- Календарная сетка -->
    <div class="grid grid-cols-7 gap-px bg-gray-800 rounded-lg overflow-hidden">
      <div v-for="day in calendarDays" :key="day.dateKey" class="calendar-day" :class="getDayClasses(day)"
        @click="selectDate(day.date)">
        <!-- Номер дня -->
        <div class="text-sm font-medium mb-1">
          {{ day.date.getDate() }}
        </div>

        <!-- События дня -->
        <div class="space-y-1">
          <div v-for="event in day.events.slice(0, 3)" :key="event.id" class="event-item"
            :style="{ backgroundColor: getEventBackgroundColor(event) }" @click.stop="handleEventClick(event)">
            <div class="text-xs font-medium truncate text-white">
              {{ event.title }}
            </div>
            <div class="text-xs opacity-75 truncate text-white">
              {{ formatEventTime(event) }}
            </div>

            <!-- Индикаторы -->
            <div class="flex items-center justify-between mt-1">
              <div class="flex items-center space-x-1">
                <!-- Забронировано пользователем -->
                <span v-if="event.isBooked" class="text-xs text-green-300">✓</span>
                <!-- Приватная тренировка -->
                <span v-if="event.extendedProps?.scheduleItem?.isPrivate" class="text-xs text-yellow-300">🔒</span>
              </div>

              <!-- Доступные места -->
              <span v-if="!event.isBooked && event.availableSpots >= 0" class="text-xs opacity-75 text-white">
                {{ event.availableSpots }}/{{ event.maxSpots }}
              </span>
            </div>
          </div>

          <!-- Показать больше событий -->
          <div v-if="day.events.length > 3"
            class="text-xs text-gray-400 cursor-pointer hover:text-white transition-colors"
            @click.stop="selectDate(day.date)">
            +{{ day.events.length - 3 }} ещё
          </div>
        </div>
      </div>
    </div>

    <!-- Загрузка -->
    <div v-if="loading" class="flex justify-center py-8">
      <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin text-gray-400" />
    </div>

    <!-- Легенда -->
    <div class="mt-6 flex flex-wrap gap-4 text-sm">
      <div class="flex items-center space-x-2">
        <div class="w-3 h-3 bg-green-500 rounded"></div>
        <span class="text-gray-400">Забронировано</span>
      </div>
      <div class="flex items-center space-x-2">
        <div class="w-3 h-3 bg-yellow-500 rounded"></div>
        <span class="text-gray-400">Приватная тренировка</span>
      </div>
      <div class="flex items-center space-x-2">
        <div class="w-3 h-3 bg-blue-500 rounded"></div>
        <span class="text-gray-400">Доступна для записи</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CalendarEvent, User } from '@/types';

interface CalendarDay {
  date: Date;
  dateKey: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  events: CalendarEvent[];
}

interface Props {
  events: CalendarEvent[];
  selectedDate: Date;
  currentMonth: Date;
  loading?: boolean;
  user?: User | null;
}

interface Emits {
  (e: 'date-select', date: Date): void;
  (e: 'event-click', event: CalendarEvent): void;
  (e: 'book-event', event: CalendarEvent): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  user: null
});

const emit = defineEmits<Emits>();

// Дни недели
const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

// Генерация календарных дней
const calendarDays = computed((): CalendarDay[] => {
  const year = props.currentMonth.getFullYear();
  const month = props.currentMonth.getMonth();

  // Первый и последний день месяца
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Начинаем с понедельника предыдущей недели
  const startDate = new Date(firstDay);
  const dayOffset = (firstDay.getDay() + 6) % 7; // Понедельник = 0
  startDate.setDate(firstDay.getDate() - dayOffset);

  // Заканчиваем воскресеньем следующей недели
  const endDate = new Date(lastDay);
  const endOffset = (7 - (lastDay.getDay() + 6) % 7) % 7;
  endDate.setDate(lastDay.getDate() + endOffset);

  const days: CalendarDay[] = [];
  const currentDate = new Date(startDate);
  const today = new Date();

  while (currentDate <= endDate) {
    const dateKey = currentDate.toISOString().split('T')[0];
    const dayEvents = props.events.filter(event => {
      const eventDate = event.start.toISOString().split('T')[0];
      return eventDate === dateKey;
    });

    days.push({
      date: new Date(currentDate),
      dateKey,
      isCurrentMonth: currentDate.getMonth() === month,
      isToday: currentDate.toDateString() === today.toDateString(),
      isSelected: currentDate.toDateString() === props.selectedDate.toDateString(),
      events: dayEvents
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return days;
});

// Методы
const getDayClasses = (day: CalendarDay): string[] => {
  const classes = [
    'bg-gray-900 p-3 min-h-[120px] cursor-pointer hover:bg-gray-800 transition-colors border border-gray-800'
  ];

  if (!day.isCurrentMonth) {
    classes.push('opacity-40');
  }

  if (day.isToday) {
    classes.push('ring-2 ring-red-500');
  }

  if (day.isSelected) {
    classes.push('bg-gray-800');
  }

  return classes;
};

const getEventBackgroundColor = (event: CalendarEvent): string => {
  // Если забронировано пользователем - зеленый
  if (event.isBooked) {
    return '#10b981'; // green-500
  }

  // Если приватная тренировка - желтый
  if (event.extendedProps?.scheduleItem?.isPrivate) {
    return '#f59e0b'; // amber-500
  }

  // Иначе используем цвет типа тренировки
  return getEventBackgroundColorByType(event.type);
};

const getEventBackgroundColorByType = (type: string): string => {
  const colorMap: Record<string, string> = {
    'boxing': '#ef4444',      // red-500
    'kickboxing': '#f97316',  // orange-500
    'grappling': '#06b6d4',   // cyan-500
    'bjj': '#3b82f6',         // blue-500
    'wrestling': '#6366f1',   // indigo-500
    'mma': '#8b5cf6',         // violet-500
    'pankration': '#10b981'   // emerald-500
  };

  return colorMap[type] || '#6b7280'; // gray-500 fallback
};

const formatEventTime = (event: CalendarEvent): string => {
  return event.start.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const selectDate = (date: Date) => {
  emit('date-select', date);
};

const handleEventClick = (event: CalendarEvent) => {
  // Если пользователь не авторизован и тренировка приватная - показываем модалку авторизации
  if (!props.user && event.extendedProps?.scheduleItem?.isPrivate) {
    emit('book-event', event);
    return;
  }

  emit('event-click', event);
};
</script>

<style scoped>
.calendar-day {
  border-radius: 0;
}

.calendar-day:first-child {
  border-top-left-radius: 0.5rem;
}

.calendar-day:nth-child(7) {
  border-top-right-radius: 0.5rem;
}

.calendar-day:nth-last-child(7) {
  border-bottom-left-radius: 0.5rem;
}

.calendar-day:last-child {
  border-bottom-right-radius: 0.5rem;
}

.event-item {
  @apply rounded-md p-2 cursor-pointer hover:opacity-80 transition-all;
  font-size: 0.75rem;
  min-height: 2.5rem;
}

.event-item:hover {
  transform: scale(1.02);
}

/* Мобильная адаптация */
@media (max-width: 640px) {
  .calendar-day {
    min-height: 80px;
    padding: 0.5rem;
  }

  .event-item {
    padding: 0.25rem 0.5rem;
    font-size: 0.6875rem;
    min-height: 2rem;
  }
}
</style>