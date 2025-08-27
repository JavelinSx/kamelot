<!-- components/AppFooter.vue -->
<template>
  <footer class=" relative z-20">
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Logo and Description -->
        <div class="space-y-4">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center">
              <UIcon name="i-heroicons-fire" class="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-white">Kamelot</h3>
              <p class="text-xs text-gray-400 -mt-1">Fight Club</p>
            </div>
          </div>
          <p class="text-gray-400 text-sm">
            Профессиональные тренировки по боевым искусствам.
            Развиваем силу, технику и характер бойца.
          </p>
          <div class="flex space-x-4">
            <UButton variant="ghost" size="sm" icon="i-heroicons-phone" to="tel:+7(495)123-45-67">
              +7 (495) 123-45-67
            </UButton>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">
            Навигация
          </h4>
          <ul class="space-y-2">
            <li v-for="link in navigationLinks" :key="link.path">
              <NuxtLink :to="link.path" class="text-gray-400 hover:text-white text-sm transition-colors">
                {{ link.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Training Programs -->
        <div>
          <h4 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">
            Программы
          </h4>
          <ul class="space-y-2">
            <li v-for="program in trainingPrograms" :key="program.slug">
              <NuxtLink :to="`/programs/${program.slug}`"
                class="text-gray-400 hover:text-white text-sm transition-colors">
                {{ program.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Contact & Social -->
        <div>
          <h4 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">
            Контакты
          </h4>
          <div class="space-y-3">
            <div class="flex items-start space-x-2">
              <UIcon name="i-heroicons-map-pin" class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <p class="text-gray-400 text-sm">
                Москва, ул. Примерная, д. 123<br>
                ТЦ "Спортивный", 2 этаж
              </p>
            </div>

            <div class="flex items-center space-x-2">
              <UIcon name="i-heroicons-envelope" class="w-4 h-4 text-gray-400" />
              <a href="mailto:info@kamelot-club.ru" class="text-gray-400 hover:text-white text-sm transition-colors">
                info@kamelot-club.ru
              </a>
            </div>

            <div class="pt-2">
              <h5 class="text-xs font-medium text-gray-300 mb-2">Социальные сети</h5>
              <div class="flex space-x-2">
                <UButton v-for="social in socialLinks" :key="social.platform" :to="social.url" variant="ghost" size="xs"
                  :icon="social.icon" target="_blank" rel="noopener noreferrer" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="mt-8 pt-8 border-t border-gray-800">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <!-- Copyright -->
          <p class="text-gray-400 text-sm">
            © {{ currentYear }} Kamelot Fight Club. Все права защищены.
          </p>

          <!-- Schedule and Contact -->
          <div class="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm">
            <div class="flex items-center space-x-2 text-gray-400">
              <UIcon name="i-heroicons-clock" class="w-4 h-4" />
              <span>Пн-Вс: {{ workingHours }}</span>
            </div>

            <div class="flex space-x-4">
              <NuxtLink to="/privacy" class="text-gray-400 hover:text-white transition-colors">
                Политика конфиденциальности
              </NuxtLink>
              <NuxtLink to="/terms" class="text-gray-400 hover:text-white transition-colors">
                Условия использования
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Current year
const currentYear = new Date().getFullYear();

// Working hours
const workingHours = '08:00 - 22:00';

// Navigation links
const navigationLinks = [
  { name: 'Главная', path: '/' },
  { name: 'Расписание', path: '/schedule' },
  { name: 'Тренеры', path: '/trainers' },
  { name: 'Блог', path: '/blog' },
  { name: 'О клубе', path: '/about' },
  { name: 'Контакты', path: '/contacts' },
];

// Training programs
const trainingPrograms = [
  { name: 'ММА для начинающих', slug: 'mma-beginners' },
  { name: 'Профессиональный бокс', slug: 'pro-boxing' },
  { name: 'Бразильское джиу-джитсу', slug: 'bjj' },
  { name: 'Муай тай', slug: 'muay-thai' },
  { name: 'Грэпплинг', slug: 'grappling' },
  { name: 'Детские группы', slug: 'kids' },
];

// Social media links
const socialLinks = [
  {
    platform: 'Instagram',
    url: 'https://instagram.com/kamelot_fight_club',
    icon: 'i-simple-icons-instagram'
  },
  {
    platform: 'YouTube',
    url: 'https://youtube.com/@kamelot_fight_club',
    icon: 'i-simple-icons-youtube'
  },
  {
    platform: 'VK',
    url: 'https://vk.com/kamelot_fight_club',
    icon: 'i-simple-icons-vk'
  },
  {
    platform: 'Telegram',
    url: 'https://t.me/kamelot_fight_club',
    icon: 'i-simple-icons-telegram'
  },
];
</script>