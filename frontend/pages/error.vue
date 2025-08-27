<!-- error.vue -->
<template>
  <div class="min-h-screen bg-gray-950 flex items-center justify-center px-4">
    <div class="text-center">
      <div class="mb-8">
        <h1 class="text-6xl font-bold text-red-500 mb-4">{{ error.statusCode }}</h1>
        <h2 class="text-2xl font-semibold text-white mb-2">{{ pageTitle }}</h2>
        <p class="text-gray-400 max-w-md mx-auto">{{ pageDescription }}</p>
      </div>

      <div class="space-y-4">
        <UButton @click="handleError" size="lg" color="red" icon="i-heroicons-arrow-path">
          {{ error.statusCode === 404 ? 'На главную' : 'Попробовать снова' }}
        </UButton>

        <div class="text-sm text-gray-500">
          <NuxtLink to="/" class="hover:text-white transition-colors">
            Вернуться на главную
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  error: {
    statusCode: number;
    statusMessage: string;
    data?: any;
  };
}

const props = defineProps<Props>();

const pageTitle = computed(() => {
  const titles: Record<number, string> = {
    404: 'Страница не найдена',
    403: 'Доступ запрещен',
    500: 'Внутренняя ошибка сервера',
    502: 'Сервер недоступен',
    503: 'Сервис временно недоступен',
  };

  return titles[props.error.statusCode] || 'Произошла ошибка';
});

const pageDescription = computed(() => {
  const descriptions: Record<number, string> = {
    404: 'Запрашиваемая страница не существует или была перемещена.',
    403: 'У вас нет прав доступа к этой странице.',
    500: 'На сервере произошла ошибка. Мы уже работаем над ее устранением.',
    502: 'Сервер временно недоступен. Попробуйте позже.',
    503: 'Сервис находится на техническом обслуживании.',
  };

  return descriptions[props.error.statusCode] || 'Что-то пошло не так. Попробуйте еще раз.';
});

const handleError = () => {
  if (props.error.statusCode === 404) {
    navigateTo('/');
  } else {
    clearError({ redirect: '/' });
  }
};

// SEO
useHead({
  title: pageTitle.value,
  meta: [
    { name: 'robots', content: 'noindex' }
  ]
});
</script>