<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <!-- Header -->
    <AppHeader :user="user" :notifications="notificationsCount" @toggle-sidebar="toggleSidebar"
      @logout="handleLogout" />

    <!-- Main Layout Container -->
    <div class="flex min-h-[calc(100vh-4rem)]">
      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col">
        <!-- Page Content -->
        <main class="flex-1">
          <div class="container bg-white text-slate-800 min-h-full">
            <slot />
          </div>
        </main>

        <!-- Footer - теперь внутри main content area -->
        <AppFooter v-if="showFooter" />
      </div>
    </div>

    <!-- Global Modals -->
    <UNotifications />

    <!-- Loading Overlay -->
    <div v-if="globalLoading"
      class="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-50 flex items-center justify-center">
      <div class="text-center">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-red-500 mx-auto mb-4" />
        <p class="text-white">Загрузка...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';
import { useUIStore } from '~/stores/ui';

// Пропсы лейаута
interface Props {
  showSidebar?: boolean;
  showFooter?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showSidebar: true,
  showFooter: true,
});

// Используем composable напрямую
const { user, fetchUser } = useAuth();
const uiStore = useUIStore();

// Reactive data
const sidebarCollapsed = ref(false);
const notificationsCount = ref(0);

// Computed
const currentRoute = computed(() => useRoute().path);
const showSidebar = computed(() => {
  const route = useRoute();
  return props.showSidebar && !route.path.startsWith('/auth');
});

const globalLoading = computed(() => uiStore.loading.global);

// Methods
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
  uiStore.setSidebarCollapsed(sidebarCollapsed.value);
};

const handleNavigate = (path: string) => {
  navigateTo(path);
};

const handleLogout = async () => {
  try {
    const { logout } = useAuth();
    await logout();
    await navigateTo('/auth/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// Lifecycle
onMounted(async () => {
  sidebarCollapsed.value = uiStore.sidebar.collapsed;

  // Пытаемся загрузить пользователя
  try {
    await fetchUser();
    if (user.value) {
      loadNotifications();
    }
  } catch (error) {
    console.log('User not authenticated');
  }
});

const loadNotifications = async () => {
  try {
    notificationsCount.value = 3; // Заглушка
  } catch (error) {
    console.error('Failed to load notifications:', error);
  }
};

// Meta
useHead({
  titleTemplate: '%s - Kamelot Fight Club',
  meta: [
    { name: 'description', content: 'Спортивная академия Камелот - боевые единоборства, ММА, тренировки' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
  ]
});
</script>

<style scoped>
.container {
  max-width: 1920px;
  margin: 0 auto;
}
</style>