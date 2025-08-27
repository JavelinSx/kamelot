<!-- pages/schedule.vue -->
<template>
  <div class="schedule-page">
    <!-- Page Header -->
    <div class="bg-gradient-to-r from-gray-900 via-black to-gray-900 py-12">
      <div class="container mx-auto px-4">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-700 mb-4">
            {{ user ? 'Мое расписание' : 'Расписание тренировок' }}
          </h1>
          <p class="text-xl text-gray-300 max-w-2xl mx-auto">
            {{
              user
                ? 'Управляйте своими тренировками и отслеживайте прогресс'
                : 'Выберите подходящую тренировку и начните свой путь воина'
            }}
          </p>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- Для авторизованных пользователей -->
      <div v-if="user" class="space-y-8">
        <!-- Вкладки -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <UTabs v-model="activeTab" :items="tabs" class="w-full sm:w-auto" />

          <!-- Быстрые действия -->
          <div class="flex gap-2">
            <UButton icon="i-heroicons-plus" color="red" @click="openBookingModal">
              Записаться на тренировку
            </UButton>
            <UButton icon="i-heroicons-calendar-days" variant="outline" @click="exportCalendar">
              Экспорт
            </UButton>
          </div>
        </div>

        <!-- Вкладка "Мои тренировки" -->
        <div v-if="activeTab === 1" class="space-y-6">
          <!-- Статистика -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div class="flex items-center">
                <div class="p-3 bg-blue-600 rounded-lg">
                  <UIcon name="i-heroicons-calendar-days" class="w-6 h-6 text-gray-700" />
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-400">Запланировано</p>
                  <p class="text-2xl font-bold text-gray-700">{{ userScheduleStats.upcoming }}</p>
                </div>
              </div>
            </div>

            <div class="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div class="flex items-center">
                <div class="p-3 bg-green-600 rounded-lg">
                  <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-gray-700" />
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-400">Завершено</p>
                  <p class="text-2xl font-bold text-gray-700">{{ userScheduleStats.completed }}</p>
                </div>
              </div>
            </div>

            <div class="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div class="flex items-center">
                <div class="p-3 bg-purple-600 rounded-lg">
                  <UIcon name="i-heroicons-fire" class="w-6 h-6 text-gray-700" />
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-400">Серия</p>
                  <p class="text-2xl font-bold text-gray-700">{{ userScheduleStats.streak }} дней</p>
                </div>
              </div>
            </div>

            <div class="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div class="flex items-center">
                <div class="p-3 bg-orange-600 rounded-lg">
                  <UIcon name="i-heroicons-clock" class="w-6 h-6 text-gray-700" />
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-400">Часов в месяц</p>
                  <p class="text-2xl font-bold text-gray-700">{{ userScheduleStats.monthlyHours }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Ближайшие тренировки -->
          <div class="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-bold text-gray-700">Ближайшие тренировки</h3>
              <UButton variant="ghost" size="sm" icon="i-heroicons-arrow-path" @click="refreshUserSchedule"
                :loading="loadingUserSchedule">
                Обновить
              </UButton>
            </div>

            <div v-if="userBookings.length" class="space-y-4">
              <UserBookingCard v-for="booking in userBookings" :key="booking.id" :booking="booking"
                @cancel="handleCancelBooking" @reschedule="handleRescheduleBooking" @review="handleReviewWorkout" />
            </div>

            <div v-else class="text-center py-12">
              <UIcon name="i-heroicons-calendar-x-mark" class="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h4 class="text-lg font-medium text-gray-400 mb-2">Нет запланированных тренировок</h4>
              <p class="text-gray-500 mb-6">Запишитесь на тренировку, чтобы начать тренироваться</p>
              <UButton color="red" @click="activeTab = 1">
                Найти тренировку
              </UButton>
            </div>
          </div>

          <!-- Календарь пользователя -->
          <div class="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 class="text-xl font-bold text-gray-700 mb-6">Календарь тренировок</h3>
            <UserScheduleCalendar :bookings="userBookings" :selected-date="selectedDate" @date-select="handleDateSelect"
              @booking-click="handleBookingClick" />
          </div>
        </div>

        <!-- Вкладка "Все тренировки" -->
        <div v-if="activeTab === 0">
          <!-- Фильтры для авторизованных пользователей -->
          <ScheduleFilters v-model="filters" :trainers="trainers" :loading="loadingSchedule" show-booking-filters
            @reset="resetFilters" />

          <!-- Календарь с возможностью бронирования -->
          <div class="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <ScheduleCalendar :schedule-items="filteredScheduleItems" :selected-date="selectedDate"
              :loading="loadingSchedule" :user-bookings="userBookings" show-book-buttons @date-select="handleDateSelect"
              @event-click="handleEventClick" @book="handleBookWorkout" />
          </div>
        </div>
      </div>

      <!-- Для неавторизованных пользователей -->
      <div v-else class="space-y-8">
        <!-- Призыв к регистрации -->
        <div class="bg-gradient-to-r from-red-900/20 to-transparent rounded-xl p-6 border border-red-600/30">
          <div class="flex flex-col md:flex-row items-center justify-between">
            <div class="mb-4 md:mb-0">
              <h3 class="text-xl font-bold text-gray-700 mb-2">Хотите записаться на тренировку?</h3>
              <p class="text-gray-300">Зарегистрируйтесь, чтобы бронировать тренировки и отслеживать прогресс</p>
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

        <!-- Общие фильтры -->
        <ScheduleFilters v-model="filters" :trainers="trainers" :loading="loadingSchedule" @reset="resetFilters" />

        <!-- Общий календарь без возможности бронирования -->
        <div class="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-700">Расписание тренировок</h3>
            <div class="text-sm text-gray-400">
              Войдите в аккаунт для записи на тренировки
            </div>
          </div>

          <ScheduleCalendar :schedule-items="filteredScheduleItems" :selected-date="selectedDate"
            :loading="loadingSchedule" @date-select="handleDateSelect" @event-click="handleEventClick" />
        </div>

        <!-- Популярные тренировки -->
        <div class="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 class="text-xl font-bold text-gray-700 mb-6">Популярные тренировки</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <WorkoutPreviewCard v-for="workout in popularWorkouts" :key="workout.id" :workout="workout"
              :show-login-prompt="true" @click="handleWorkoutPreview" />
          </div>
        </div>
      </div>
    </div>

    <!-- Модальные окна -->
    <WorkoutDetailsModal v-if="selectedWorkout" :workout="selectedWorkout" :schedule-item="selectedScheduleItem"
      :is-open="showWorkoutModal" :show-book-button="!!user" @close="closeWorkoutModal" @book="handleBookWorkout" />

    <BookingModal v-if="user" :is-open="showBookingModal" :schedule-item="selectedScheduleItem"
      @close="closeBookingModal" @confirm="handleConfirmBooking" />
  </div>
</template>

<script setup lang="ts">
import type {
  Booking,
  ScheduleFilter,
  ScheduleItem,
  Trainer,
  Workout
} from '@/types';
import { useAuth } from '~/composables/useAuth';

// Meta
useHead({
  title: 'Расписание тренировок',
  meta: [
    { name: 'description', content: 'Расписание тренировок в спортивной академии Камелот' }
  ]
});

// Auth
const { user } = useAuth();

// Reactive data
const activeTab = ref(0);
const selectedDate = ref(new Date());
const selectedWorkout = ref<Workout | null>(null);
const selectedScheduleItem = ref<ScheduleItem | null>(null);
const showWorkoutModal = ref(false);
const showBookingModal = ref(false);
const loadingSchedule = ref(false);
const loadingUserSchedule = ref(false);

// Данные расписания
const scheduleItems = ref<ScheduleItem[]>([]);
const userBookings = ref<Booking[]>([]);
const trainers = ref<Trainer[]>([]);
const popularWorkouts = ref<Workout[]>([]);

// Фильтры
const filters = ref<ScheduleFilter>({
  date: '',
  trainerId: [],
  workoutType: [],
  difficulty: [],
  availableOnly: true
});

// Статистика пользователя
const userScheduleStats = computed(() => ({
  upcoming: userBookings.value.filter(b =>
    new Date(b.scheduleItem.startTime) > new Date()
  ).length,
  completed: userBookings.value.filter(b =>
    b.status === 'completed'
  ).length,
  streak: 7, // Получать с API
  monthlyHours: 24 // Получать с API
}));

// Вкладки для авторизованных пользователей
const tabs = computed(() => [
  {
    key: 'my-schedule',
    label: 'Мои тренировки',
    icon: 'i-heroicons-user-circle'
  },
  {
    key: 'all-schedule',
    label: 'Все тренировки',
    icon: 'i-heroicons-calendar-days'
  }
]);

// Отфильтрованные элементы расписания
const filteredScheduleItems = computed(() => {
  let items = scheduleItems.value;

  if (filters.value.trainerId?.length) {
    items = items.filter(item =>
      filters.value.trainerId!.includes(item.trainer.id)
    );
  }

  if (filters.value.workoutType?.length) {
    items = items.filter(item =>
      filters.value.workoutType!.includes(item.workout.type)
    );
  }

  if (filters.value.availableOnly) {
    items = items.filter(item =>
      item.currentParticipants < item.maxParticipants
    );
  }

  return items;
});

// Methods
const loadScheduleData = async () => {
  try {
    loadingSchedule.value = true;

    // Загрузка общего расписания
    scheduleItems.value = await $fetch('/api/schedule');

    // Загрузка тренеров
    trainers.value = await $fetch('/api/trainers');

    // Загрузка популярных тренировок для неавторизованных
    if (!user.value) {
      popularWorkouts.value = await $fetch('/api/workouts/popular');
    }

  } catch (error) {
    console.error('Error loading schedule data:', error);

    const toast = useToast();
    toast.add({
      title: 'Ошибка загрузки',
      description: 'Не удалось загрузить расписание',
      color: 'red'
    });
  } finally {
    loadingSchedule.value = false;
  }
};

const loadUserSchedule = async () => {
  if (!user.value) return;

  try {
    loadingUserSchedule.value = true;
    userBookings.value = await $fetch('/api/user/bookings');
  } catch (error) {
    console.error('Error loading user schedule:', error);
  } finally {
    loadingUserSchedule.value = false;
  }
};

const refreshUserSchedule = () => {
  loadUserSchedule();
};

const handleDateSelect = (date: Date) => {
  selectedDate.value = date;
};

const handleEventClick = (scheduleItem: ScheduleItem) => {
  selectedScheduleItem.value = scheduleItem;
  selectedWorkout.value = scheduleItem.workout;
  showWorkoutModal.value = true;
};

const handleWorkoutPreview = (workout: Workout) => {
  selectedWorkout.value = workout;
  showWorkoutModal.value = true;
};

const openBookingModal = () => {
  showBookingModal.value = true;
};

const closeBookingModal = () => {
  showBookingModal.value = false;
  selectedScheduleItem.value = null;
};

const closeWorkoutModal = () => {
  showWorkoutModal.value = false;
  selectedWorkout.value = null;
  selectedScheduleItem.value = null;
};

const handleBookWorkout = async (scheduleItem: ScheduleItem) => {
  if (!user.value) {
    await navigateTo('/auth/login');
    return;
  }

  selectedScheduleItem.value = scheduleItem;
  showBookingModal.value = true;
};

const handleConfirmBooking = async (bookingData: any) => {
  try {
    await $fetch('/api/bookings', {
      method: 'POST',
      body: {
        scheduleItemId: selectedScheduleItem.value?.id,
        ...bookingData
      }
    });

    const toast = useToast();
    toast.add({
      title: 'Успешно',
      description: 'Тренировка забронирована',
      color: 'green'
    });

    closeBookingModal();
    await loadUserSchedule();

  } catch (error) {
    console.error('Error booking workout:', error);

    const toast = useToast();
    toast.add({
      title: 'Ошибка',
      description: 'Не удалось забронировать тренировку',
      color: 'red'
    });
  }
};

const handleCancelBooking = async (booking: Booking) => {
  try {
    await $fetch(`/api/bookings/${booking.id}`, {
      method: 'DELETE'
    });

    const toast = useToast();
    toast.add({
      title: 'Успешно',
      description: 'Бронирование отменено',
      color: 'green'
    });

    await loadUserSchedule();

  } catch (error) {
    console.error('Error cancelling booking:', error);
  }
};

const handleRescheduleBooking = async (booking: Booking) => {
  // Логика переноса тренировки
  console.log('Reschedule booking:', booking);
};

const handleReviewWorkout = async (booking: Booking) => {
  // Логика оценки тренировки
  console.log('Review workout:', booking);
};

const handleBookingClick = (booking: Booking) => {
  selectedScheduleItem.value = booking.scheduleItem;
  selectedWorkout.value = booking.scheduleItem.workout;
  showWorkoutModal.value = true;
};

const resetFilters = () => {
  filters.value = {
    date: '',
    trainerId: [],
    workoutType: [],
    difficulty: [],
    availableOnly: true
  };
};

const exportCalendar = () => {
  // Логика экспорта календаря
  console.log('Export calendar');
};

// Lifecycle
onMounted(async () => {
  await loadScheduleData();

  if (user.value) {
    await loadUserSchedule();
  }
});

// Watch for auth changes
watch(user, async (newUser) => {
  if (newUser) {
    activeTab.value = 0;
    await loadUserSchedule();
  } else {
    activeTab.value = 1;
    userBookings.value = [];
  }
});
</script>

<style scoped>
.schedule-page {
  min-height: 100vh;
}

.container {
  max-width: 1400px;
}
</style>