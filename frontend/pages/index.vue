<!-- pages/index.vue -->
<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden h-[100svh] min-h-[600px] md:h-[800px] flex flex-col justify-center">
      <!-- Фоновое видео -->
      <div class="absolute inset-0 w-full h-full">
        <video ref="heroVideoRef"
          class="absolute inset-0 w-full h-full object-cover will-change-transform scale-[1.8] sm:scale-[2.4]" autoplay
          muted loop playsinline preload="metadata" :poster="heroPoster" @loadstart="onVideoLoadStart"
          @canplay="onVideoCanPlay" @error="onVideoError">
          <source :src="headerVideo" type="video/mp4">
        </video>

        <!-- Затемняющий оверлей -->
        <div class="absolute inset-0 bg-black/50 sm:bg-black/40"></div>

        <!-- Плейсхолдер пока видео загружается -->
        <div v-show="!videoLoaded"
          class="absolute inset-0 bg-cover bg-center bg-no-repeat flex items-center justify-center"
          :style="{ backgroundImage: `url(${heroPoster})` }">
          <div class="text-center text-white">
            <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 sm:w-8 sm:h-8 animate-spin mx-auto mb-2" />
            <p class="text-xs sm:text-sm">Загрузка видео...</p>
          </div>
        </div>
      </div>

      <div class="relative px-4 py-8 sm:px-8 sm:py-16 lg:px-12 lg:py-24 z-10">
        <div class="text-center max-w-5xl mx-auto">
          <h1 class="text-2xl xs:text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white leading-tight">
            Спортивная академия
            <span class="text-red-600 block xs:inline">Камелот</span>
          </h1>
          <p
            class="text-sm xs:text-base sm:text-lg lg:text-xl text-white mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-2">
            Откройте в себе силу воина. Тренируйтесь с лучшими мастерами боевых искусств
            и достигайте новых высот в ММА, боксе, грэпплинге и других дисциплинах.
          </p>
          <div class="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <UButton to="/schedule" size="lg" color="red" icon="i-heroicons-calendar"
              class="w-full xs:w-auto text-sm sm:text-base">
              Записаться на тренировку
            </UButton>
            <UButton to="/trainers" size="lg" icon="i-heroicons-user-group" color="white"
              class="w-full xs:w-auto text-sm sm:text-base">
              Наши тренеры
            </UButton>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Stats -->
    <section v-if="user" class="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div class="bg-gray-900 rounded-lg sm:rounded-xl p-3 sm:p-6 border border-gray-800">
            <div class="flex items-center">
              <div class="p-2 sm:p-3 bg-red-600 rounded-md sm:rounded-lg flex-shrink-0">
                <UIcon name="i-heroicons-fire" class="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div class="ml-2 sm:ml-4 min-w-0">
                <p class="text-xs sm:text-sm text-gray-400 truncate">Тренировок</p>
                <p class="text-lg sm:text-2xl font-bold text-white">{{ userStats.totalWorkouts }}</p>
              </div>
            </div>
          </div>

          <div class="bg-gray-900 rounded-lg sm:rounded-xl p-3 sm:p-6 border border-gray-800">
            <div class="flex items-center">
              <div class="p-2 sm:p-3 bg-blue-600 rounded-md sm:rounded-lg flex-shrink-0">
                <UIcon name="i-heroicons-clock" class="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div class="ml-2 sm:ml-4 min-w-0">
                <p class="text-xs sm:text-sm text-gray-400 truncate">Часов тренировок</p>
                <p class="text-lg sm:text-2xl font-bold text-white">{{ userStats.totalHours }}</p>
              </div>
            </div>
          </div>

          <div class="bg-gray-900 rounded-lg sm:rounded-xl p-3 sm:p-6 border border-gray-800">
            <div class="flex items-center">
              <div class="p-2 sm:p-3 bg-green-600 rounded-md sm:rounded-lg flex-shrink-0">
                <UIcon name="i-heroicons-trophy" class="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div class="ml-2 sm:ml-4 min-w-0">
                <p class="text-xs sm:text-sm text-gray-400">Streak</p>
                <p class="text-lg sm:text-2xl font-bold text-white">{{ userStats.currentStreak }} дней</p>
              </div>
            </div>
          </div>

          <div class="bg-gray-900 rounded-lg sm:rounded-xl p-3 sm:p-6 border border-gray-800">
            <div class="flex items-center">
              <div class="p-2 sm:p-3 bg-purple-600 rounded-md sm:rounded-lg flex-shrink-0">
                <UIcon name="i-heroicons-star" class="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div class="ml-2 sm:ml-4 min-w-0">
                <p class="text-xs sm:text-sm text-gray-400">Уровень</p>
                <p class="text-lg sm:text-2xl font-bold text-white capitalize">{{ user.fitnessLevel }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Upcoming Workouts -->
    <section v-if="user" class="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center justify-between mb-4 sm:mb-6">
          <h2 class="text-xl sm:text-2xl font-bold text-white">Ближайшие тренировки</h2>
          <UButton to="/schedule" variant="ghost" icon="i-heroicons-arrow-right" size="sm">
            <span class="hidden sm:inline">Все тренировки</span>
            <span class="sm:hidden">Все</span>
          </UButton>
        </div>

        <div v-if="upcomingWorkouts.length" class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <WorkoutCard v-for="workout in upcomingWorkouts" :key="workout.id" :schedule-item="workout"
            :workout="workout.workout" show-trainer show-book-button @book="handleBookWorkout" />
        </div>

        <div v-else class="text-center py-8 sm:py-12">
          <UIcon name="i-heroicons-calendar-x-mark"
            class="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-3 sm:mb-4" />
          <h3 class="text-base sm:text-lg font-medium text-gray-400 mb-2">Нет запланированных тренировок</h3>
          <p class="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6 px-4">Запишитесь на тренировку, чтобы начать свой
            путь воина</p>
          <UButton to="/schedule" color="red" size="lg">
            Найти тренировку
          </UButton>
        </div>
      </div>
    </section>

    <!-- Martial Arts Categories -->
    <section class="relative bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div class="grid grid-cols-1 md:grid-cols-3">
        <div v-for="category in martialArtsCategories" :key="category.key"
          class="group relative min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[800px] overflow-hidden cursor-pointer"
          @click="navigateTo(`/schedule?category=${category.key}`)">
          <!-- Видео-фон -->
          <video v-if="category.video"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-700" autoplay muted loop
            playsinline :poster="category.poster">
            <source :src="category.video" type="video/mp4">
          </video>

          <!-- Fallback изображение если нет видео -->
          <div v-else class="absolute inset-0 w-full h-full bg-gradient-to-br from-red-900 to-gray-900"></div>

          <!-- Glass эффект -->
          <div class="absolute inset-0 backdrop-blur-md bg-white/10 border border-white/20 
            group-hover:backdrop-blur-none group-hover:bg-transparent group-hover:border-transparent 
            transition-all duration-500"></div>

          <!-- Градиентный overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent
            group-hover:from-black/60 transition-all duration-500"></div>

          <!-- Дополнительный overlay для эффекта -->
          <div class="absolute inset-0 bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          </div>

          <!-- Контент карточки -->
          <div class="relative z-10 h-full flex flex-col justify-center p-4 sm:p-6">
            <!-- Иконка сверху -->


            <!-- Информация снизу -->
            <div class="text-center">
              <h3 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 
                group-hover:text-red-400 transition-colors duration-300 leading-tight">
                {{ category.label }}
              </h3>
              <p class="text-base sm:text-lg lg:text-2xl text-white mb-3 sm:mb-4 opacity-90 leading-relaxed">
                {{ category.description }}
              </p>

              <!-- Бейджи с типами единоборств -->
              <div class="flex flex-wrap gap-1 sm:gap-2 justify-center">
                <UBadge v-for="type in category.types" :key="type" size="sm" variant="soft"
                  :color="getMartialArtColor(type)" class="backdrop-blur-sm bg-white/10 text-xs sm:text-sm">
                  {{ getWorkoutTypeLabel(type) }}
                </UBadge>
              </div>
            </div>

            <!-- Индикатор hover -->
            <div
              class="absolute top-3 right-3 sm:top-4 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div class="w-6 h-6 sm:w-8 sm:h-8 bg-red-600 rounded-full flex items-center justify-center">
                <UIcon name="i-heroicons-arrow-right" class="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Trainers -->
    <section class="">
      <div v-if="featuredTrainers.length === 0" class="text-center py-8">
        <p class="text-gray-400">Загрузка тренеров...</p>
      </div>

      <div v-else class="space-y-0">
        <TrainerFullSection v-for="(trainer, index) in featuredTrainers" :key="trainer.id" :trainer="trainer"
          :current-index="index" :total-trainers="featuredTrainers.length" :is-even="index % 2 === 1"
          @view-profile="handleViewProfile" @book-session="handleBookSession" @next-trainer="scrollToTrainer(index + 1)"
          @previous-trainer="scrollToTrainer(index - 1)" />
      </div>
    </section>

    <!-- Gallery Section -->
    <section class="">
      <Gallery :images="galleryImages" title="Галерея нашей академии"
        description="Моменты тренировок, соревнований и жизни нашей академии" :columns="0" :gap="2"
        :can-load-more="false" @image-click="handleGalleryClick" />
    </section>


    <!-- Call to Action -->
    <section v-if="!user" class="py-8 sm:py-12 lg:py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-gradient-to-r from-red-900/20 to-transparent rounded-xl sm:rounded-2xl 
          p-6 sm:p-8 text-center border border-red-600/30">
          <h2 class="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Готовы начать?</h2>
          <p class="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
            Присоединяйтесь к нашему сообществу бойцов и начните свой путь к совершенству
          </p>
          <div class="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto">
            <UButton to="/auth/register" size="lg" color="red" variant="solid" class="w-full xs:w-auto">
              Регистрация
            </UButton>
            <UButton to="/auth/login" size="lg" variant="outline" color="red" class="w-full xs:w-auto">
              Войти
            </UButton>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { BlogPost, ScheduleItem, Trainer } from '@/types';
import BJJ from '~/assets/video/bjj.mp4';
import BOX from '~/assets/video/box.mp4';
import headerVideo from '~/assets/video/header-video.mp4';
import MMA from '~/assets/video/mma.mp4';
import { useAuth } from '~/composables/useAuth';
import { getMartialArtColor, getWorkoutTypeLabel, MARTIAL_ARTS_CATEGORIES } from '~/types/martial-arts';
import { FAKE_TRAINERS } from '~/utils/fake-trainers';

// Meta
useHead({
  title: 'Главная',
  meta: [
    { name: 'description', content: 'Спортивная академия Камелот - тренировки по ММА, боксу, грэпплингу и другим боевым искусствам' }
  ]
});

// Auth
const { user } = useAuth();

// Reactive data
const loading = ref(true);
const userStats = ref({
  totalWorkouts: 0,
  totalHours: 0,
  currentStreak: 0,
});

// Видео refs
const heroVideoRef = ref<HTMLVideoElement>();
const videoLoaded = ref(false);

// Путь к видео файлам
const heroVideoSrc = '/videos/hero-background.mp4';
const heroPoster = '/images/hero-poster.jpg';

// Обработчики видео
const onVideoLoadStart = () => {
  console.log('🎥 Начало загрузки видео');
  videoLoaded.value = true
};

const onVideoCanPlay = () => {
  console.log('🎥 Видео готово к воспроизведению');
  videoLoaded.value = true;

  if (heroVideoRef.value) {
    heroVideoRef.value.play().catch(console.warn);
  }
};

const onVideoError = (error: Event) => {
  console.error('🎥 Ошибка загрузки видео:', error);
  videoLoaded.value = true;
};

const { loadGalleryImages } = useGallery();
const upcomingWorkouts = ref<ScheduleItem[]>([]);
const featuredTrainers = ref<Trainer[]>(FAKE_TRAINERS);
const latestPosts = ref<BlogPost[]>([]);
const selectedTrainer = ref<Trainer | null>(null);
const galleryImages = ref<string[]>([]);

const handleGalleryClick = (image: any, index: number) => {
  console.log('Gallery image clicked:', image, index);
};

// Martial Arts Categories с видео
const martialArtsCategories = computed(() => [
  {
    key: 'striking',
    label: 'Ударные единоборства',
    description: 'Бокс, кикбоксинг, муай-тай',
    icon: '👊',
    types: MARTIAL_ARTS_CATEGORIES.striking.types,
    video: BOX,
    poster: '/images/striking-poster.jpg'
  },
  {
    key: 'grappling',
    label: 'Борьба и грэпплинг',
    description: 'БЖЖ, борьба, грэпплинг',
    icon: '🤼',
    types: MARTIAL_ARTS_CATEGORIES.grappling.types,
    video: BJJ,
    poster: '/images/grappling-poster.jpg'
  },
  {
    key: 'mixed',
    label: 'Смешанные единоборства',
    description: 'ММА, панкратион',
    icon: '🥊',
    types: MARTIAL_ARTS_CATEGORIES.mixed.types,
    video: MMA,
    poster: '/images/mixed-poster.jpg'
  }
]);

// Methods
const loadGalleryImagesData = async () => {
  try {
    galleryImages.value = await loadGalleryImages();
  } catch (error) {
    console.error('Error loading gallery images:', error);
    galleryImages.value = [];
  }
};

const loadData = async () => {
  try {
    loading.value = true;
    await Promise.all([
      loadUserStats(),
      loadUpcomingWorkouts(),
      loadFeaturedTrainers(),
      loadLatestPosts(),
      loadGalleryImagesData()
    ]);
  } catch (error) {
    console.error('Error loading home data:', error);
    const toast = useToast();
    toast.add({
      title: 'Ошибка загрузки',
      description: 'Не удалось загрузить данные. Попробуйте обновить страницу.',
      color: 'red'
    });
  } finally {
    loading.value = false;
  }
};

const loadUserStats = async () => {
  if (!user.value) return;
  try {
    userStats.value = {
      totalWorkouts: 42,
      totalHours: 85,
      currentStreak: 7,
    };
  } catch (error) {
    console.error('Error loading user stats:', error);
  }
};

const loadUpcomingWorkouts = async () => {
  if (!user.value) return;
  try {
    upcomingWorkouts.value = [];
  } catch (error) {
    console.error('Error loading upcoming workouts:', error);
  }
};

const loadFeaturedTrainers = async () => {
  try {
    featuredTrainers.value = FAKE_TRAINERS
    console.log('Featured trainers loaded:', featuredTrainers.value);
  } catch (error) {
    console.error('Error loading featured trainers:', error);
  }
};

const loadLatestPosts = async () => {
  try {
    latestPosts.value = [];
  } catch (error) {
    console.error('Error loading latest posts:', error);
  }
};

const handleViewProfile = (trainer: Trainer) => {
  console.log('View profile:', trainer);
  selectedTrainer.value = trainer;
  navigateTo(`/trainers/${trainer.id}`);
};

const handleBookWorkout = async (scheduleItem: ScheduleItem) => {
  try {
    console.log('Booking workout:', scheduleItem);
    const toast = useToast();
    toast.add({
      title: 'Тренировка забронирована',
      description: 'Вы успешно записались на тренировку',
      color: 'green'
    });
  } catch (error) {
    console.error('Error booking workout:', error);
    const toast = useToast();
    toast.add({
      title: 'Ошибка бронирования',
      description: 'Не удалось записаться на тренировку. Попробуйте еще раз.',
      color: 'red'
    });
  }
};

const handleBookSession = async (trainer: Trainer) => {
  try {
    await navigateTo(`/trainers/${trainer.id}?action=book`);
  } catch (error) {
    console.error('Error navigating to booking:', error);
  }
};

const scrollToTrainer = (index: number) => {
  if (index < 0 || index >= featuredTrainers.value.length) return
  const sections = document.querySelectorAll('.trainer-full-section')
  if (sections[index]) {
    sections[index].scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
}

// Lifecycle
onMounted(() => {
  loadData();
  onVideoLoadStart()
  console.log('Index page mounted. Featured trainers:', featuredTrainers.value);
});

// Watch for auth changes
watch(user, (newUser) => {
  if (newUser) {
    loadUserStats();
    loadUpcomingWorkouts();
  }
});
</script>

<style scoped>
/* Дополнительные стили для xs breakpoint */
@media (min-width: 475px) {
  .xs\:text-3xl {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }

  .xs\:flex-row {
    flex-direction: row;
  }

  .xs\:w-auto {
    width: auto;
  }

  .xs\:inline {
    display: inline;
  }
}

/* Viewport height для мобильных Safari */
.h-\[100svh\] {
  height: 100svh;
  height: 100vh;
  /* fallback */
}

/* Улучшенные hover эффекты */
@media (hover: hover) {
  .group:hover video {
    filter: brightness(1.1) contrast(1.05);
  }
}

/* Оптимизация видео для мобильных */
video {
  transition: transform 0.7s ease;
}

.container {
  max-width: 1400px;
}

/* Плавная прокрутка */
html {
  scroll-behavior: smooth;
}
</style>