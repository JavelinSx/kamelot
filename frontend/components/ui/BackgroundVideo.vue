<template>
  <div class="background-video-container" :class="{ loaded: isVideoPlayable }">
    <!-- Плейсхолдер (показывается до начала воспроизведения) -->
    <div v-if="placeholder" class="video-placeholder" :style="{ backgroundImage: `url(${placeholder})` }" />

    <!-- Индикатор загрузки (теперь показывается только в начале) -->
    <div v-if="showInitialLoader" class="loading-overlay">
      <UIcon name="i-heroicons-play-circle" class="loading-icon animate-pulse" />
      <p class="loading-text">Подготовка видео...</p>

      <!-- Прогресс первоначальной буферизации -->
      <div v-if="showProgress && initialBufferProgress > 0" class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${initialBufferProgress}%` }" />
        </div>
        <p class="progress-text">{{ Math.round(initialBufferProgress) }}% буферизовано</p>
      </div>
    </div>

    <!-- Основное видео -->
    <video ref="videoRef" class="background-video" :class="{ visible: isVideoPlayable }" :poster="placeholder"
      :autoplay="autoplay" :muted="true" :loop="loop" :playsinline="true" :preload="streamingMode ? 'metadata' : 'auto'"
      @loadstart="handleLoadStart" @loadedmetadata="handleLoadedMetadata" @loadeddata="handleLoadedData"
      @canplay="handleCanPlay" @canplaythrough="handleCanPlayThrough" @progress="handleProgress"
      @playing="handlePlaying" @waiting="handleWaiting" @stalled="handleStalled" @error="handleError">
      <source v-for="source in videoSources" :key="source.src" :src="source.src" :type="source.type" />
      Ваш браузер не поддерживает видео.
    </video>

    <!-- Индикатор буферизации во время воспроизведения -->
    <div v-if="isBuffering && isVideoPlayable" class="buffering-indicator">
      <div class="buffering-spinner">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-white animate-spin" />
      </div>
      <p class="text-white text-sm mt-2">Буферизация...</p>
    </div>

    <!-- Слот для контента поверх видео -->
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
  placeholder?: string;
  autoplay?: boolean;
  loop?: boolean;
  showProgress?: boolean;
  // Новый режим - потоковое воспроизведение
  streamingMode?: boolean;
  // Минимальный процент буферизации перед началом воспроизведения
  minBufferPercent?: number;
  priority?: 'high' | 'medium' | 'low';
}

const props = withDefaults(defineProps<Props>(), {
  showProgress: true,
  streamingMode: true,
  minBufferPercent: 10, // Начинаем воспроизведение при 10% буфера
  priority: 'medium',
  autoplay: true,
  loop: true
});

const videoRef = ref<HTMLVideoElement | null>(null);
const toast = useToast()
// Состояния для потокового воспроизведения
const isVideoPlayable = ref(false);  // Можно ли начать воспроизведение
const showInitialLoader = ref(true);  // Показывать ли начальный лоадер
const isBuffering = ref(false);       // Идёт ли буферизация во время воспроизведения
const hasStartedPlaying = ref(false); // Началось ли воспроизведение хотя бы раз

// Прогресс загрузки
const initialBufferProgress = ref(0);
const totalLoadProgress = ref(0);
const hasError = ref(false);

// Метрики производительности
const videoMetrics = reactive({
  loadStartTime: 0,
  firstPlayableTime: 0,
  firstFrameTime: 0,
  bufferHealth: 0,
  stallCount: 0
});

// Composables
const { $toast } = useNuxtApp();

// Обработчики событий видео
const handleLoadStart = () => {
  videoMetrics.loadStartTime = performance.now();
  console.log('🎥 Видео: начало загрузки');
};

const handleLoadedMetadata = () => {
  console.log('🎥 Видео: метаданные загружены');
  // Принудительная загрузка первых секунд для потокового режима
  if (props.streamingMode && videoRef.value) {
    videoRef.value.currentTime = 0.1;
  }
};

const handleLoadedData = () => {
  console.log('🎥 Видео: данные первого кадра загружены');
  videoMetrics.firstFrameTime = performance.now();
};

const handleCanPlay = () => {
  console.log('🎥 Видео: готово к воспроизведению');

  if (props.streamingMode) {
    // В потоковом режиме проверяем минимальный буфер
    checkMinimumBuffer();
  } else {
    // В обычном режиме ждём полной готовности
    startVideoPlayback();
  }
};

const handleCanPlayThrough = () => {
  console.log('🎥 Видео: полностью готово к воспроизведению');
  totalLoadProgress.value = 100;

  if (!props.streamingMode) {
    startVideoPlayback();
  }
};

// Ключевая функция - проверка минимального буфера для потокового режима
const checkMinimumBuffer = () => {
  if (!videoRef.value || !props.streamingMode) return;

  const video = videoRef.value;

  if (video.buffered.length > 0) {
    const bufferedEnd = video.buffered.end(video.buffered.length - 1);
    const duration = video.duration;

    if (duration > 0) {
      const bufferPercent = (bufferedEnd / duration) * 100;
      initialBufferProgress.value = bufferPercent;

      // Начинаем воспроизведение при достижении минимального буфера
      if (bufferPercent >= props.minBufferPercent && !hasStartedPlaying.value) {
        console.log(`🎥 Достаточно буфера (${Math.round(bufferPercent)}%), начинаем воспроизведение`);
        startVideoPlayback();
      }
    }
  }
};

// Запуск воспроизведения
const startVideoPlayback = async () => {
  if (!videoRef.value || hasStartedPlaying.value) return;

  try {
    videoMetrics.firstPlayableTime = performance.now();

    // Плавное появление видео
    isVideoPlayable.value = true;
    hasStartedPlaying.value = true;

    // Скрываем начальный лоадер с задержкой для плавности
    setTimeout(() => {
      showInitialLoader.value = false;
    }, 500);

    // Автовоспроизведение если включено
    if (props.autoplay) {
      await videoRef.value.play();
      console.log('🎥 Видео начато');

      // Отправляем событие о начале воспроизведения
      emit('video-started', {
        loadTime: videoMetrics.firstPlayableTime - videoMetrics.loadStartTime,
        bufferPercent: initialBufferProgress.value
      });
    }
  } catch (error) {
    console.error('🎥 Ошибка автовоспроизведения:', error);
    handlePlaybackError(error);
  }
};

const handleProgress = () => {
  if (!videoRef.value) return;

  const video = videoRef.value;

  if (video.buffered.length > 0) {
    const bufferedEnd = video.buffered.end(video.buffered.length - 1);
    const duration = video.duration || 1;
    const currentProgress = (bufferedEnd / duration) * 100;

    videoMetrics.bufferHealth = currentProgress;

    if (props.streamingMode) {
      // В потоковом режиме обновляем прогресс начальной буферизации
      if (!hasStartedPlaying.value) {
        initialBufferProgress.value = currentProgress;
        checkMinimumBuffer();
      }
    } else {
      // В обычном режиме обновляем общий прогресс
      totalLoadProgress.value = currentProgress;
    }
  }
};

const handlePlaying = () => {
  console.log('🎥 Видео: воспроизводится');
  isBuffering.value = false;
};

const handleWaiting = () => {
  console.log('🎥 Видео: ожидание буферизации');
  isBuffering.value = true;
};

const handleStalled = () => {
  console.log('🎥 Видео: остановлено из-за сети');
  videoMetrics.stallCount++;
  isBuffering.value = true;

  // Уведомление пользователя при частых остановках
  if (videoMetrics.stallCount > 3) {
    toast.add({
      title: 'Проблемы с сетью',
      description: 'Видео может воспроизводиться с задержками',
      color: 'orange',
      timeout: 3000
    });
  }
};

const handleError = (event: Event) => {
  console.error('🎥 Ошибка видео:', event);
  hasError.value = true;
  showInitialLoader.value = false;
  isVideoPlayable.value = false;

  handlePlaybackError(event);
};

const handlePlaybackError = (error: any) => {
  toast.add({
    title: 'Ошибка загрузки видео',
    description: 'Попробуйте обновить страницу',
    color: 'red',
    timeout: 5000
  });

  emit('video-error', error);
};

// События для родительского компонента
const emit = defineEmits<{
  'video-started': [payload: { loadTime: number; bufferPercent: number }]
  'video-error': [error: any]
  'buffering-changed': [isBuffering: boolean]
}>();

// Следим за изменениями буферизации
watch(isBuffering, (newValue) => {
  emit('buffering-changed', newValue);
});

// Intersection Observer для ленивой загрузки
const { stop: stopIntersectionObserver } = useIntersectionObserver(
  videoRef,
  ([{ isIntersecting }]) => {
    if (isIntersecting && videoRef.value && !hasStartedPlaying.value) {
      console.log('🎥 Видео в области видимости, начинаем загрузку');

      // В потоковом режиме устанавливаем preload='metadata' и загружаем
      if (props.streamingMode) {
        videoRef.value.preload = 'metadata';
      }

      videoRef.value.load();
      stopIntersectionObserver();
    }
  },
  {
    threshold: 0.1,
    rootMargin: '100px' // Начинаем загрузку чуть раньше появления в viewport
  }
);

// Адаптивная настройка качества
const adjustVideoQualityForStreaming = () => {
  if (!process.client) return;

  const connection = (navigator as any).connection;
  if (connection) {
    const { effectiveType, downlink } = connection;

    // Для потокового режима снижаем требования к сети
    if (effectiveType === '3g' || downlink < 2) {
      console.log('🎥 Медленная сеть - используем низкое качество для стриминга');
      // Здесь можно выбрать источник с низким разрешением
    } else if (effectiveType === '4g' && downlink > 5) {
      console.log('🎥 Быстрая сеть - используем высокое качество');
    }
  }
};

// Функция для ручного управления воспроизведением
const playVideo = async () => {
  if (!videoRef.value || hasStartedPlaying.value) return;

  try {
    await videoRef.value.play();
    console.log('🎥 Ручной запуск воспроизведения');
  } catch (error) {
    console.error('🎥 Ошибка ручного воспроизведения:', error);
    handlePlaybackError(error);
  }
};

const pauseVideo = () => {
  if (videoRef.value && !videoRef.value.paused) {
    videoRef.value.pause();
    console.log('🎥 Видео поставлено на паузу');
  }
};

// Lifecycle
onMounted(() => {
  adjustVideoQualityForStreaming();
});

onUnmounted(() => {
  if (videoRef.value) {
    videoRef.value.pause();
    videoRef.value.src = '';
    videoRef.value.load();
  }
});

// Expose API для родительского компонента
defineExpose({
  videoRef,
  isPlayable: readonly(isVideoPlayable),
  isBuffering: readonly(isBuffering),
  bufferProgress: readonly(initialBufferProgress),
  totalProgress: readonly(totalLoadProgress),
  hasStarted: readonly(hasStartedPlaying),
  metrics: readonly(videoMetrics),
  playVideo,
  pauseVideo
});
</script>

<style scoped>
.background-video-container {
  @apply relative w-full h-screen overflow-hidden bg-gray-900;
}

.video-placeholder {
  @apply absolute inset-0 bg-cover bg-center bg-no-repeat;
  transition: opacity 0.5s ease-in-out;
  z-index: 1;
}

/* Плейсхолдер исчезает когда видео готово к воспроизведению */
.background-video-container.loaded .video-placeholder {
  @apply opacity-0 pointer-events-none;
}

.loading-overlay {
  @apply absolute inset-0 flex flex-col items-center justify-center;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: 2;
  transition: opacity 0.3s ease-out;
}

.loading-icon {
  @apply w-16 h-16 text-white mb-4;
}

.loading-text {
  @apply text-white text-lg font-medium mb-4;
}

.background-video {
  @apply absolute inset-0 w-full h-full object-cover;
  opacity: 0;
  transition: opacity 0.6s ease-in-out;
  z-index: 0;
}

/* Видео становится видимым как только готово к воспроизведению */
.background-video.visible {
  opacity: 1;
}

/* Индикатор буферизации во время воспроизведения */
.buffering-indicator {
  @apply absolute top-4 right-4 flex flex-col items-center;
  background: rgba(0, 0, 0, 0.6);
  @apply rounded-lg p-3;
  backdrop-filter: blur(8px);
  z-index: 3;
}

.buffering-spinner {
  @apply flex items-center justify-center;
}

.progress-container {
  @apply w-64 mt-4;
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
    @apply w-48;
  }

  .buffering-indicator {
    @apply top-2 right-2 p-2;
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

/* Оптимизация для экономии батареи */
@media (prefers-reduced-motion: reduce) {
  .buffering-indicator {
    display: none;
  }
}
</style>