<!-- components/ui/AppHeader.vue -->
<template>
  <header class="bg-black sticky top-0 z-50 backdrop-blur-md bg-black/95 relative">
    <!-- Основной хедер -->
    <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
      <div class="flex items-center justify-between h-14 sm:h-16">
        <!-- Лого - оптимизирован для мобильного -->
        <div class="flex items-center space-x-2 sm:space-x-3">
          <div class="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
            <img class="w-6 h-6 sm:w-8 sm:h-8 object-contain" :src="logo" alt="Камелот">
          </div>
          <div class="text-white min-w-0">
            <h1 class="text-base sm:text-xl font-bold tracking-tight truncate">КАМЕЛОТ</h1>
            <p class="text-xs text-gray-400 hidden xs:block truncate">Спортивная академия</p>
          </div>
        </div>

        <!-- Десктопная навигация -->
        <nav class="hidden lg:flex items-center space-x-6 xl:space-x-8">
          <NuxtLink v-for="link in navLinks" :key="link.to" :to="link.to"
            class="nav-link text-gray-300 hover:text-red-400 transition-colors px-3 py-2 text-sm font-medium whitespace-nowrap"
            active-class="text-red-400 bg-red-600/10 rounded-lg">
            {{ link.label }}
          </NuxtLink>
        </nav>

        <!-- Правая часть - адаптивная -->
        <div class="flex items-center space-x-2 sm:space-x-3">
          <!-- Поиск - скрыт на очень маленьких экранах -->
          <button v-if="showSearch" @click="toggleSearch"
            class="hidden xs:flex text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
            aria-label="Поиск">
            <UIcon name="i-heroicons-magnifying-glass" class="w-5 h-5" />
          </button>

          <!-- Уведомления - только для авторизованных -->
          <div v-if="user" class="relative hidden sm:block">
            <button @click="toggleNotifications"
              class="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
              aria-label="Уведомления">
              <UIcon name="i-heroicons-bell" class="w-5 h-5" />
              <span v-if="notifications > 0"
                class="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                {{ notifications > 9 ? '9+' : notifications }}
              </span>
            </button>
          </div>

          <!-- Профиль пользователя - компактный на мобильном -->
          <div v-if="user" ref="userMenuRef" class="flex items-center space-x-2 relative">
            <div class="hidden sm:flex items-center space-x-2">
              <span class="text-white text-sm font-medium truncate max-w-20 sm:max-w-none">
                {{ user.firstName }}
              </span>
            </div>
            <button @click="toggleUserMenu"
              class="flex items-center space-x-1 hover:bg-gray-800 rounded-lg p-1 transition-colors">
              <img :src="user.avatar || '/default-avatar.png'" :alt="user.firstName"
                class="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-gray-700 flex-shrink-0">
              <UIcon name="i-heroicons-chevron-down" class="w-4 h-4 text-gray-400 hidden sm:block" />
            </button>

            <!-- Dropdown меню пользователя -->
            <Transition enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95">
              <div v-if="userMenuOpen"
                class="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-50">
                <div class="py-1">
                  <NuxtLink to="/profile" @click="userMenuOpen = false"
                    class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                    <UIcon name="i-heroicons-user" class="w-4 h-4 inline mr-2" />
                    Профиль
                  </NuxtLink>
                  <button @click="handleLogout"
                    class="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-600/10 transition-colors">
                    <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-4 h-4 inline mr-2" />
                    Выйти
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Кнопки авторизации - компактные на мобильном -->
          <div v-else class="flex items-center space-x-1 sm:space-x-2">
            <NuxtLink to="/auth/login"
              class="text-gray-300 hover:text-white px-2 sm:px-3 py-1 text-sm font-medium transition-colors whitespace-nowrap">
              Вход
            </NuxtLink>
            <NuxtLink to="/auth/register"
              class="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
              <span class="hidden xs:inline">Регистрация</span>
              <span class="xs:hidden">Рег.</span>
            </NuxtLink>
          </div>

          <!-- Бургер-меню -->
          <button @click="toggleMobileMenu"
            class="lg:hidden text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Меню">
            <UIcon :name="mobileMenuOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'" class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Мобильное меню -->
    <Transition enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 transform -translate-y-2" enter-to-class="opacity-100 transform translate-y-0"
      leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 transform translate-y-0"
      leave-to-class="opacity-0 transform -translate-y-2">
      <div v-if="mobileMenuOpen" class="lg:hidden bg-black/95 backdrop-blur-md absolute top-12 left-0 w-full">
        <!-- Навигационные ссылки -->
        <div class="px-3 py-4 space-y-1">
          <NuxtLink v-for="link in navLinks" :key="link.to" :to="link.to" @click="closeMobileMenu"
            class="block px-4 py-3 text-base font-medium text-gray-300 hover:text-red-400 hover:bg-gray-800/50 rounded-lg transition-colors"
            active-class="text-red-400 bg-red-600/10">
            <UIcon v-if="link.icon" :name="link.icon" class="w-5 h-5 inline mr-3" />
            {{ link.label }}
          </NuxtLink>
        </div>

        <!-- Дополнительные действия в мобильном меню -->
        <div class="px-3 py-4 border-t border-gray-800">
          <!-- Поиск в мобильном меню -->
          <button v-if="showSearch" @click="handleMobileSearch"
            class="w-full flex items-center px-4 py-3 text-base font-medium text-gray-300 hover:text-red-400 hover:bg-gray-800/50 rounded-lg transition-colors">
            <UIcon name="i-heroicons-magnifying-glass" class="w-5 h-5 mr-3" />
            Поиск
          </button>

          <!-- Уведомления в мобильном меню -->
          <button v-if="user" @click="handleMobileNotifications"
            class="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-gray-300 hover:text-red-400 hover:bg-gray-800/50 rounded-lg transition-colors">
            <div class="flex items-center">
              <UIcon name="i-heroicons-bell" class="w-5 h-5 mr-3" />
              Уведомления
            </div>
            <span v-if="notifications > 0" class="px-2 py-1 bg-red-600 text-white text-xs rounded-full font-medium">
              {{ notifications > 99 ? '99+' : notifications }}
            </span>
          </button>

          <!-- Профиль в мобильном меню -->
          <div v-if="user" class="mt-4 pt-4 border-t border-gray-700">
            <div class="flex items-center px-4 py-2 mb-2">
              <img :src="user.avatar || '/default-avatar.png'" :alt="user.firstName"
                class="w-10 h-10 rounded-full border-2 border-gray-700 mr-3">
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-white truncate">
                  {{ user.firstName }} {{ user.lastName }}
                </p>
                <p class="text-xs text-gray-400 truncate">{{ user.email }}</p>
              </div>
            </div>

            <NuxtLink to="/profile" @click="closeMobileMenu"
              class="block w-full px-4 py-3 text-base font-medium text-gray-300 hover:text-red-400 hover:bg-gray-800/50 rounded-lg transition-colors">
              <UIcon name="i-heroicons-user" class="w-5 h-5 inline mr-3" />
              Профиль
            </NuxtLink>

            <button @click="handleLogout"
              class="block w-full text-left px-4 py-3 text-base font-medium text-red-400 hover:bg-red-600/10 rounded-lg transition-colors">
              <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-5 h-5 inline mr-3" />
              Выйти
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Overlay для закрытия меню при клике вне его -->
    <!-- <div v-if="mobileMenuOpen" @click="closeMobileMenu"
      class="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" aria-hidden="true" /> -->
  </header>
</template>

<script setup lang="ts">
import type { User } from '@/types'
import logo from '~/assets/images/logo-kamelot.jpg'

interface Props {
  user?: User
  notifications?: number
  showSearch?: boolean
  sticky?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  notifications: 0,
  showSearch: true,
  sticky: true
})

const emit = defineEmits<{
  'toggle-sidebar': []
  logout: []
  search: []
  'toggle-notifications': []
}>()

// Состояние компонента
const mobileMenuOpen = ref(false)
const userMenuOpen = ref(false)
const searchOpen = ref(false)
const notificationsOpen = ref(false)

// Навигационные ссылки
const navLinks = [
  { to: '/', label: 'Главная', icon: 'i-heroicons-home' },
  { to: '/schedule', label: 'Расписание', icon: 'i-heroicons-calendar' },
  { to: '/trainers', label: 'Тренеры', icon: 'i-heroicons-user-group' },
  { to: '/blog', label: 'Блог', icon: 'i-heroicons-document-text' }
]

// Методы
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value

  // Блокируем скролл при открытом меню
  if (mobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
  document.body.style.overflow = ''
}

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
}

const toggleSearch = () => {
  searchOpen.value = !searchOpen.value
  emit('search')
}

const toggleNotifications = () => {
  notificationsOpen.value = !notificationsOpen.value
  emit('toggle-notifications')
}

const handleMobileSearch = () => {
  closeMobileMenu()
  toggleSearch()
}

const handleMobileNotifications = () => {
  closeMobileMenu()
  toggleNotifications()
}

const handleLogout = () => {
  closeMobileMenu()
  emit('logout')
}

// Закрытие меню при изменении маршрута
const route = useRoute()
watch(() => route.path, () => {
  closeMobileMenu()
})

// Ссылка на элемент пользовательского меню
const userMenuRef = ref<HTMLElement>()

// Закрытие меню при клике вне его
onClickOutside(userMenuRef, () => {
  userMenuOpen.value = false
})

// Очистка overflow при размонтировании
onUnmounted(() => {
  document.body.style.overflow = ''
})

// Слушаем изменение размера экрана
onMounted(() => {
  const mediaQuery = window.matchMedia('(min-width: 1024px)')
  const handleResize = (e: MediaQueryListEvent) => {
    if (e.matches) {
      closeMobileMenu()
    }
  }
  mediaQuery.addListener(handleResize)

  onUnmounted(() => {
    mediaQuery.removeListener(handleResize)
  })
})
</script>

<style scoped>
/* Дополнительные стили для xs breakpoint */
@media (min-width: 475px) {
  .xs\:block {
    display: block;
  }

  .xs\:inline {
    display: inline;
  }

  .xs\:hidden {
    display: none;
  }

  .xs\:flex {
    display: flex;
  }
}

/* Анимации для мобильного меню */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease;
}

.mobile-menu-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Улучшенная типографика для мобильных */
@media (max-width: 640px) {
  .nav-link {
    @apply text-base;
  }
}

/* Hover эффекты только для устройств с мышью */
@media (hover: hover) {
  .hover\:bg-gray-800:hover {
    background-color: rgb(31 41 55);
  }

  .hover\:text-red-400:hover {
    color: rgb(248 113 113);
  }
}

/* Темная тема для системных элементов */
.backdrop-blur-md {
  backdrop-filter: blur(12px);
}
</style>