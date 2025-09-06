<!-- pages/schedule.vue -->
<template>
  <div class="min-h-screen bg-gray-950">
    <!-- Хедер страницы -->
    <div class="bg-gradient-to-r from-gray-900 via-black to-gray-900 py-12">
      <div class="container mx-auto px-4">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-white mb-4">
            Расписание тренировок
          </h1>
          <p class="text-xl text-gray-300 max-w-2xl mx-auto">
            {{ user ? 'Ваши тренировки и общее расписание' : 'Общее расписание тренировок' }}
          </p>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- Призыв к регистрации для неавторизованных -->
      <div v-if="!user"
        class="mb-8 bg-gradient-to-r from-red-900/20 to-transparent rounded-xl p-6 border border-red-600/30">
        <div class="flex flex-col md:flex-row items-center justify-between">
          <div class="mb-4 md:mb-0">
            <h3 class="text-xl font-bold text-white mb-2">Хотите записаться на тренировку?</h3>
            <p class="text-gray-300">Зарегистрируйтесь, чтобы видеть приватные тренировки и бронировать места</p>
          </div>
          <div class="flex gap-3">
            <UButton to="/auth/register" color="red" size="lg">
              Регистрация
            </UButton>
            <UButton to="/auth/login" variant="outline" size="lg">
              Войти
            </UButton>
          </div>
        </div>
      </div>

      <!-- Календарь -->
      <div class="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-white">
            {{ currentMonthYear }}
          </h2>
          <div class="flex items-center space-x-2">
            <UButton icon="i-heroicons-chevron-left" variant="ghost" @click="previousMonth" :disabled="loading" />
            <UButton variant="outline" @click="goToToday" :disabled="loading">
              Сегодня
            </UButton>
            <UButton icon="i-heroicons-chevron-right" variant="ghost" @click="nextMonth" :disabled="loading" />
          </div>
        </div>

        <ScheduleCalendar :events="calendarEvents" :selected-date="selectedDate" :current-month="currentDate"
          :loading="loading" :user="user" @date-select="handleDateSelect" @event-click="handleEventClick"
          @book-event="handleBookEvent" />
      </div>
    </div>

    <!-- Модалка деталей тренировки -->
    <WorkoutModal v-model="showWorkoutModal" :event="selectedEvent" :user="user" @book="handleBookWorkout"
      @cancel="handleCancelWorkout" @close="closeWorkoutModal" />
  </div>
</template>

<script setup lang="ts">
import type { ScheduleItem } from '@/types';
import type { CalendarEvent } from '@/types/calendar';
import { getWorkoutTypeColor } from '@/types/martial-arts';

// Meta
useHead({
  title: 'Расписание тренировок',
  meta: [
    { name: 'description', content: 'Расписание тренировок в спортивной академии Камелот' }
  ]
});

// Auth
const { user } = useAuth();

// Реактивные данные
const loading = ref(false);
const currentDate = ref(new Date());
const selectedDate = ref(new Date());
const selectedEvent = ref<CalendarEvent | null>(null);
const showWorkoutModal = ref(false);

// Данные из API
const scheduleItems = ref<ScheduleItem[]>([]);
const userBookings = ref<any[]>([]);

// Вычисляемые свойства
const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString('ru-RU', {
    month: 'long',
    year: 'numeric'
  });
});

// Преобразование данных для календаря
const calendarEvents = computed((): CalendarEvent[] => {
  return scheduleItems.value.map(item => {
    const isBooked = userBookings.value.some(booking =>
      booking.scheduleItem.id === item.id && booking.status === 'confirmed'
    );

    return {
      id: item.id,
      title: item.workout.title,
      start: new Date(item.startTime),
      end: new Date(item.endTime),
      type: item.workout.type,
      trainer: `${item.trainer.user.firstName} ${item.trainer.user.lastName}`,
      status: item.status,
      isBooked: isBooked,
      availableSpots: item.maxParticipants - item.currentParticipants,
      maxSpots: item.maxParticipants,
      color: getWorkoutTypeColor(item.workout.type),
      extendedProps: {
        scheduleItem: item,
        canBook: !isBooked && item.currentParticipants < item.maxParticipants,
        canCancel: isBooked,
        description: item.workout.description,
        location: item.location,
        price: item.price
      }
    };
  });
});

// Методы навигации по календарю
const previousMonth = () => {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(newDate.getMonth() - 1);
  currentDate.value = newDate;
  loadScheduleData();
};

const nextMonth = () => {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(newDate.getMonth() + 1);
  currentDate.value = newDate;
  loadScheduleData();
};

const goToToday = () => {
  currentDate.value = new Date();
  selectedDate.value = new Date();
  loadScheduleData();
};

// Обработчики событий
const handleDateSelect = (date: Date) => {
  selectedDate.value = date;
};

const handleEventClick = (event: CalendarEvent) => {
  selectedEvent.value = event;
  showWorkoutModal.value = true;
};

const handleBookEvent = async (event: CalendarEvent) => {
  if (!user.value) {
    await navigateTo('/auth/login');
    return;
  }

  selectedEvent.value = event;
  showWorkoutModal.value = true;
};

const handleBookWorkout = async (eventId: number) => {
  if (!user.value) return;

  try {
    loading.value = true;

    await $fetch(`/api/schedule/${eventId}/book`, {
      method: 'POST'
    });

    const toast = useToast();
    toast.add({
      title: 'Успешно',
      description: 'Тренировка забронирована',
      color: 'green'
    });

    closeWorkoutModal();
    await loadUserBookings();
    await loadScheduleData();

  } catch (error) {
    console.error('Error booking workout:', error);

    const toast = useToast();
    toast.add({
      title: 'Ошибка',
      description: 'Не удалось забронировать тренировку',
      color: 'red'
    });
  } finally {
    loading.value = false;
  }
};

const handleCancelWorkout = async (eventId: number) => {
  if (!user.value) return;

  try {
    loading.value = true;

    // Находим бронирование для отмены
    const booking = userBookings.value.find(booking =>
      booking.scheduleItem.id === eventId && booking.status === 'confirmed'
    );

    if (!booking) {
      throw new Error('Бронирование не найдено');
    }

    await $fetch(`/api/bookings/${booking.id}`, {
      method: 'DELETE'
    });

    const toast = useToast();
    toast.add({
      title: 'Успешно',
      description: 'Бронирование отменено',
      color: 'green'
    });

    closeWorkoutModal();
    await loadUserBookings();
    await loadScheduleData();

  } catch (error) {
    console.error('Error cancelling booking:', error);

    const toast = useToast();
    toast.add({
      title: 'Ошибка',
      description: 'Не удалось отменить бронирование',
      color: 'red'
    });
  } finally {
    loading.value = false;
  }
};

const closeWorkoutModal = () => {
  showWorkoutModal.value = false;
  selectedEvent.value = null;
};

// Загрузка данных
const loadScheduleData = async () => {
  try {
    loading.value = true;

    const startOfMonth = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1);
    const endOfMonth = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0);

    const params = new URLSearchParams({
      start: startOfMonth.toISOString(),
      end: endOfMonth.toISOString(),
      includePrivate: user.value ? 'true' : 'false'
    });

    scheduleItems.value = await $fetch(`/api/schedule?${params}`);

  } catch (error) {
    console.error('Error loading schedule:', error);

    const toast = useToast();
    toast.add({
      title: 'Ошибка загрузки',
      description: 'Не удалось загрузить расписание',
      color: 'red'
    });
  } finally {
    loading.value = false;
  }
};

const loadUserBookings = async () => {
  if (!user.value) return;

  try {
    userBookings.value = await $fetch('/api/user/bookings');
  } catch (error) {
    console.error('Error loading user bookings:', error);
  }
};

// Lifecycle
onMounted(async () => {
  await loadScheduleData();

  if (user.value) {
    await loadUserBookings();
  }
});

// Отслеживание изменений пользователя
watch(user, async (newUser) => {
  if (newUser) {
    await loadUserBookings();
  } else {
    userBookings.value = [];
  }
  await loadScheduleData();
});
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>