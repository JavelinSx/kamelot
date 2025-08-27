<!-- app.vue -->
<template>
  <div id="app">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// Global error handling
const handleError = (error: any) => {
  console.error('Global error:', error);

  const toast = useToast();
  toast.add({
    title: 'Произошла ошибка',
    description: 'Что-то пошло не так. Попробуйте еще раз.',
    color: 'red'
  });
};

// Initialize stores
const authStore = useAuthStore();

// Расширяем тип Performance для TypeScript
declare global {
  interface Performance {
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
  }
}

// Функция мониторинга памяти для разработки
const startMemoryMonitoring = () => {
  if (process.dev && import.meta.client) {
    // Метод 1: Используем performance.memory (только в Chrome/Edge)
    if ('memory' in performance) {
      setInterval(() => {
        const memory = performance.memory;
        if (memory) {
          const used = Math.round(memory.usedJSHeapSize / 1048576);
          const total = Math.round(memory.totalJSHeapSize / 1048576);
          const limit = Math.round(memory.jsHeapSizeLimit / 1048576);

          console.log(
            `%c Memory: ${used}MB / ${total}MB (limit: ${limit}MB)`,
            `color: ${used > 300 ? 'red' : used > 200 ? 'orange' : 'green'}`
          );

          // Предупреждение при высоком использовании памяти
          if (used > 400) {
            console.warn('⚠️ High memory usage detected! Consider refreshing the page.');
          }
        }
      }, 5000);
    } else {
      console.log('Memory monitoring not available in this browser');
    }

    // Метод 2: Мониторинг через Node.js API (для SSR)
    if (process.server) {
      setInterval(() => {
        const usage = process.memoryUsage();
        console.log({
          rss: `${Math.round(usage.rss / 1048576)}MB`,
          heapTotal: `${Math.round(usage.heapTotal / 1048576)}MB`,
          heapUsed: `${Math.round(usage.heapUsed / 1048576)}MB`,
          external: `${Math.round(usage.external / 1048576)}MB`
        });
      }, 10000);
    }
  }
};

// Check authentication on app start
onMounted(async () => {
  try {
    await authStore.fetchUser();

    // Запускаем мониторинг памяти только в dev режиме
    startMemoryMonitoring();

  } catch (error) {
    console.log('User not authenticated');
  }
});

// Global error handler with cleanup
let errorHandler: ((event: ErrorEvent) => void) | null = null;
let unhandledRejectionHandler: ((event: PromiseRejectionEvent) => void) | null = null;

if (import.meta.client) {
  errorHandler = (event: ErrorEvent) => handleError(event.error);
  unhandledRejectionHandler = (event: PromiseRejectionEvent) => handleError(event.reason);

  window.addEventListener('error', errorHandler);
  window.addEventListener('unhandledrejection', unhandledRejectionHandler);
}

// Cleanup on unmount
onBeforeUnmount(() => {
  if (import.meta.client && errorHandler && unhandledRejectionHandler) {
    window.removeEventListener('error', errorHandler);
    window.removeEventListener('unhandledrejection', unhandledRejectionHandler);
  }
});

// SEO and meta
useHead({
  htmlAttrs: {
    lang: 'ru'
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'format-detection', content: 'telephone=no' }
  ]
});

useSeoMeta({
  titleTemplate: '%s - Kamelot Fight Club',
  description: 'Спортивная академия Камелот - профессиональные тренировки по ММА, боксу, грэпплингу и другим боевым искусствам',
  ogDescription: 'Спортивная академия Камелот - профессиональные тренировки по ММА, боксу, грэпплингу и другим боевым искусствам',
  ogTitle: 'Kamelot Fight Club',
  ogImage: '/og-image.jpg',
  twitterCard: 'summary_large_image'
});
</script>

<style>
/* Глобальные стили уже в assets/css/main.css */
</style>