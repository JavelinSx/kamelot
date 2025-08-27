<template>
  <div class="background-video-container" :class="{ 'loaded': isVideoLoaded }">
    <!-- Плейсхолдер-изображение -->
    <div v-if="!isVideoLoaded || isLoading" class="video-placeholder"
      :style="{ backgroundImage: `url(${posterImage})` }">
      <div class="loading-overlay">
        <UIcon name="i-heroicons-play-circle" class="loading-icon animate-pulse" />
        <p class="loading-text">Загрузка видео...</p>
      </div>
    </div>

    <!-- Видео элемент -->
    <video ref="videoRef" :class="['background-video', { 'visible': isVideoLoaded && !isLoading }]"
      :poster="posterImage" autoplay muted loop playsinline preload="metadata" @loadstart="handleLoadStart"
      @loadedmetadata="handleLoadedMetadata" @loadeddata="handleLoadedData" @canplay="handleCanPlay"
      @canplaythrough="handleCanPlayThrough" @error="handleError" @progress="handleProgress">
      <source v-for="source in videoSources" :key="source.src" :src="source.src" :type="source.type">
      Ваш браузер не поддерживает видео.
    </video>

    <!-- Прогресс-бар загрузки -->
    <div v-if="isLoading && showProgress" class="progress-container">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${loadingProgress}%` }"></div>
      </div>
      <p class="progress-text">{{ Math.round(loadingProgress) }}%</p>
    </div>

    <!-- Оверлей контента -->
    <div class="video-overlay">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface VideoSource {
  src: string;
  type: string;
}

interface Props {
  videoSources: VideoSource[];
  posterImage: string;
  showProgress?: boolean;
  priority?: 'high' | 'medium' | 'low';
  enableStreaming?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showProgress: true,
  priority: 'medium',
  enableStreaming: true
});

const videoRef = ref<HTMLVideoElement | null>(null);
const isVideoLoaded = ref(false);
const isLoading = ref(true);
const loadingProgress = ref(0);
const hasError = ref(false);

// Composables
const { $toast } = useNuxtApp();

// Метрики производительности
const videoMetrics = reactive({
  loadStartTime: 0,
  firstFrameTime: 0,
  totalLoadTime: 0,
  bufferHealth: 0
});

// Обработчики событий видео
const handleLoadStart = () => {
  videoMetrics.loadStartTime = performance.now();
  isLoading.value = true;
  console.log('🎥 Видео: начало загрузки');
};

const handleLoadedMetadata = () => {
  console.log('🎥 Видео: метаданные загружены');
  if (videoRef.value) {
    // Принудительная загрузка первых секунд
    videoRef.value.currentTime = 0.1;
  }
};

const handleLoadedData = () => {
  console.log('🎥 Видео: данные первого кадра загружены');
  videoMetrics.firstFrameTime = performance.now();
};

const handleCanPlay = () => {
  console.log('🎥 Видео: можно начать воспроизведение');

  // Плавное появление видео
  setTimeout(() => {
    isVideoLoaded.value = true;
    isLoading.value = false;
    videoMetrics.totalLoadTime = performance.now() - videoMetrics.loadStartTime;

    console.log(`🎥 Видео загружено за ${Math.round(videoMetrics.totalLoadTime)}ms`);
  }, 300); // Небольшая задержка для плавности
};

const handleCanPlayThrough = () => {
  console.log('🎥 Видео: полностью готово к воспроизведению');
  loadingProgress.value = 100;
};

const handleProgress = () => {
  if (!videoRef.value) return;

  const video = videoRef.value;
  if (video.buffered.length > 0) {
    const bufferedEnd = video.buffered.end(video.buffered.length - 1);
    const duration = video.duration;

    if (duration > 0) {
      loadingProgress.value = (bufferedEnd / duration) * 100;
      videoMetrics.bufferHealth = loadingProgress.value;
    }
  }
};

const handleError = (event: Event) => {
  console.error('🎥 Ошибка загрузки видео:', event);
  hasError.value = true;
  isLoading.value = false;
};

// Intersection Observer для ленивой загрузки
const { stop: stopIntersectionObserver } = useIntersectionObserver(
  videoRef,
  ([{ isIntersecting }]) => {
    if (isIntersecting && videoRef.value) {
      console.log('🎥 Видео в области видимости, начинаем загрузку');
      videoRef.value.load();
      stopIntersectionObserver();
    }
  },
  {
    threshold: 0.1,
    rootMargin: '50px'
  }
);

// Оптимизация для мобильных устройств
const isMobile = computed(() => {
  if (process.client) {
    return window.innerWidth < 768 ||
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  return false;
});

// Управление качеством видео на основе соединения
const adjustVideoQuality = () => {
  if (!process.client) return;

  const connection = (navigator as any).connection;
  if (connection) {
    const { effectiveType, downlink } = connection;

    // Логика выбора качества видео
    if (effectiveType === '4g' && downlink > 5) {
      console.log('🎥 Высокое качество сети - HD видео');
    } else if (effectiveType === '3g' || downlink < 2) {
      console.log('🎥 Низкое качество сети - сжатое видео');
    }
  }
};

// Предзагрузка видео с приоритетом
const preloadVideo = async () => {
  if (!process.client || !videoRef.value) return;

  try {
    // Установка приоритета загрузки
    if ('importance' in HTMLVideoElement.prototype) {
      (videoRef.value as any).importance = props.priority;
    }

    // Для критически важных видео
    if (props.priority === 'high') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'video';
      link.href = props.videoSources[0]?.src;
      document.head.appendChild(link);
    }

  } catch (error) {
    console.warn('🎥 Предзагрузка видео недоступна:', error);
  }
};

// Мониторинг производительности
const monitorPerformance = () => {
  if (!process.client) return;

  // Отслеживание FPS (если поддерживается)
  if ('requestVideoFrameCallback' in HTMLVideoElement.prototype && videoRef.value) {
    const video = videoRef.value as any;

    const measureFPS = () => {
      const start = performance.now();
      video.requestVideoFrameCallback(() => {
        const frameDuration = performance.now() - start;
        const fps = 1000 / frameDuration;

        if (fps < 24) {
          console.warn('🎥 Низкий FPS:', Math.round(fps));
        }

        // Продолжаем мониторинг
        measureFPS();
      });
    };

    video.addEventListener('play', measureFPS);
  }
};

// Lifecycle
onMounted(() => {
  adjustVideoQuality();
  preloadVideo();
  monitorPerformance();
});

onUnmounted(() => {
  if (videoRef.value) {
    videoRef.value.pause();
    videoRef.value.src = '';
    videoRef.value.load();
  }
});

// Expose для родительского компонента
defineExpose({
  videoRef,
  isLoaded: readonly(isVideoLoaded),
  progress: readonly(loadingProgress),
  metrics: readonly(videoMetrics)
});
</script>

<style scoped>
.background-video-container {
  @apply relative w-full h-screen overflow-hidden bg-gray-900;
}

.video-placeholder {
  @apply absolute inset-0 bg-cover bg-center bg-no-repeat;
  transition: opacity 0.5s ease-in-out;
}

.background-video-container.loaded .video-placeholder {
  @apply opacity-0 pointer-events-none;
}

.loading-overlay {
  @apply absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50;
}

.loading-icon {
  @apply w-16 h-16 text-white mb-4;
}

.loading-text {
  @apply text-white text-lg font-medium;
}

.background-video {
  @apply absolute inset-0 w-full h-full object-cover opacity-0;
  transition: opacity 0.8s ease-in-out;
}

.background-video.visible {
  @apply opacity-100;
}

.progress-container {
  @apply absolute bottom-8 left-1/2 transform -translate-x-1/2 w-64;
}

.progress-bar {
  @apply w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-2;
}

.progress-fill {
  @apply h-full bg-red-600 rounded-full transition-all duration-300;
  background: linear-gradient(90deg, #dc2626 0%, #ef4444 50%, #f87171 100%);
}

.progress-text {
  @apply text-center text-white text-sm font-medium;
}

.video-overlay {
  @apply relative z-10 h-full flex items-center justify-center;
}

/* Адаптивность */
@media (max-width: 768px) {
  .loading-icon {
    @apply w-12 h-12;
  }

  .loading-text {
    @apply text-base;
  }

  .progress-container {
    @apply w-48 bottom-4;
  }
}

/* Оптимизация для слабых устройств */
@media (prefers-reduced-motion: reduce) {

  .background-video,
  .video-placeholder,
  .progress-fill {
    transition: none !important;
  }

  .loading-icon {
    animation: none !important;
  }
}
</style>