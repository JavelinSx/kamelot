<template>
  <UCard class="trainer-filter">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-white">Фильтры тренеров</h3>
        <UButton v-if="hasActiveFilters" variant="ghost" size="sm" icon="i-heroicons-x-mark" @click="resetFilters">
          Сбросить
        </UButton>
      </div>
    </template>

    <div class="space-y-6">
      <!-- Поиск -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          Поиск тренеров
        </label>
        <UInput v-model="searchQuery" placeholder="Имя тренера, специализация..." icon="i-heroicons-magnifying-glass"
          @input="handleSearch" />
      </div>

      <!-- Специализации -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-3">
          Специализации
        </label>
        <div class="space-y-2">
          <div v-for="specialization in specializations" :key="specialization"
            class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer"
            @click="toggleSpecialization(specialization)">
            <UCheckbox :model-value="selectedSpecializations.includes(specialization)"
              @change="toggleSpecialization(specialization)" />
            <UBadge :color="getSpecializationColor(specialization)" variant="soft" size="xs">
              {{ getSpecializationLabel(specialization) }}
            </UBadge>
            <span class="text-sm text-gray-300 flex-1">
              {{ getSpecializationLabel(specialization) }}
            </span>
            <span class="text-xs text-gray-400">
              {{ getSpecializationCount(specialization) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Опыт работы -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-3">
          Опыт работы (лет)
        </label>
        <div class="space-y-4">
          <URange v-model="experienceMin" :min="0" :max="20" :step="1" @change="handleExperienceChange" />
          <div class="flex items-center justify-between text-xs text-gray-400">
            <span>{{ experienceRange[0] }} лет</span>
            <span>{{ experienceRange[1] }}+ лет</span>
          </div>
        </div>
      </div>

      <!-- Рейтинг -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-3">
          Минимальный рейтинг
        </label>
        <div class="space-y-3">
          <div v-for="rating in ratingOptions" :key="rating.value"
            class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer"
            @click="selectRating(rating.value)">
            <URadio :model-value="ratingMin" :value="rating.value" @change="selectRating(rating.value)" />
            <div class="flex items-center space-x-2">
              <div class="flex items-center">
                <UIcon v-for="i in 5" :key="i" name="i-heroicons-star-solid"
                  :class="i <= rating.value ? 'text-yellow-400' : 'text-gray-600'" class="w-4 h-4" />
              </div>
              <span class="text-sm text-gray-300">и выше</span>
            </div>
            <span class="text-xs text-gray-400 ml-auto">
              {{ getRatingCount(rating.value) }} тренеров
            </span>
          </div>
        </div>
      </div>

      <!-- Доступность -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-3">
          Доступность
        </label>
        <div class="space-y-3">
          <!-- Выбор даты -->
          <div>
            <label class="block text-xs text-gray-400 mb-1">Дата</label>
            <UInput v-model="availabilityDate" type="date" @change="handleAvailabilityChange" />
          </div>

          <!-- Выбор времени -->
          <div>
            <label class="block text-xs text-gray-400 mb-1">Время</label>
            <USelectMenu v-model="availabilityTime" :options="timeOptions" placeholder="Любое время"
              @change="handleAvailabilityChange" />
          </div>

          <!-- Только доступные -->
          <label class="flex items-center space-x-3 cursor-pointer">
            <UCheckbox v-model="onlyAvailable" @change="handleAvailabilityChange" />
            <span class="text-sm text-gray-300">
              Показывать только доступных тренеров
            </span>
          </label>
        </div>
      </div>

      <!-- Статус тренера -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-3">
          Статус
        </label>
        <div class="space-y-2">
          <label class="flex items-center space-x-3 cursor-pointer">
            <UCheckbox v-model="onlyCertified" @change="handleStatusChange" />
            <span class="text-sm text-gray-300">
              Только сертифицированные
            </span>
          </label>

          <label class="flex items-center space-x-3 cursor-pointer">
            <UCheckbox v-model="onlyVerified" @change="handleStatusChange" />
            <span class="text-sm text-gray-300">
              Только проверенные тренеры
            </span>
          </label>
        </div>
      </div>

      <!-- Цена -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-3">
          Стоимость тренировки (₽)
        </label>
        <div class="space-y-4">
          <URange v-model="priceMin" :min="500" :max="5000" :step="100" @change="handlePriceChange" />
          <div class="flex items-center justify-between text-xs text-gray-400">
            <span>{{ priceRange[0] }} ₽</span>
            <span>{{ priceRange[1] }} ₽</span>
          </div>
        </div>
      </div>

      <!-- Местоположение -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-3">
          Местоположение
        </label>
        <div class="space-y-3">
          <USelectMenu v-model="selectedLocation" :options="locationOptions" placeholder="Выберите район"
            @change="handleLocationChange" />

          <div class="flex items-center space-x-3">
            <UInput v-model="maxDistance" type="number" placeholder="10" class="flex-1" />
            <span class="text-sm text-gray-400">км от меня</span>
          </div>
        </div>
      </div>

      <!-- Язык общения -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-3">
          Язык общения
        </label>
        <div class="space-y-2">
          <div v-for="language in languages" :key="language.value"
            class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer"
            @click="toggleLanguage(language.value)">
            <UCheckbox :model-value="selectedLanguages.includes(language.value)"
              @change="toggleLanguage(language.value)" />
            <span class="text-sm text-gray-300">{{ language.label }}</span>
            <span class="text-xs text-gray-400 ml-auto">
              {{ getLanguageCount(language.value) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Дополнительные услуги -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-3">
          Дополнительные услуги
        </label>
        <div class="space-y-2">
          <label class="flex items-center space-x-3 cursor-pointer">
            <UCheckbox v-model="offersPlan" @change="handleServicesChange" />
            <span class="text-sm text-gray-300">
              Составление плана тренировок
            </span>
          </label>

          <label class="flex items-center space-x-3 cursor-pointer">
            <UCheckbox v-model="offersNutrition" @change="handleServicesChange" />
            <span class="text-sm text-gray-300">
              Консультации по питанию
            </span>
          </label>

          <label class="flex items-center space-x-3 cursor-pointer">
            <UCheckbox v-model="offersOnline" @change="handleServicesChange" />
            <span class="text-sm text-gray-300">
              Онлайн тренировки
            </span>
          </label>

          <label class="flex items-center space-x-3 cursor-pointer">
            <UCheckbox v-model="offersGroup" @change="handleServicesChange" />
            <span class="text-sm text-gray-300">
              Групповые занятия
            </span>
          </label>
        </div>
      </div>

      <!-- Сортировка -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-3">
          Сортировка
        </label>
        <USelectMenu v-model="sortBy" :options="sortOptions" @change="handleSortChange" />
      </div>

      <!-- Кнопки действий -->
      <div class="flex space-x-3 pt-4 border-t border-gray-800">
        <UButton color="primary" @click="applyFilters" class="flex-1" :loading="loading">
          Применить фильтры
        </UButton>

        <UButton variant="outline" @click="resetFilters" :disabled="!hasActiveFilters || loading">
          Сбросить
        </UButton>
      </div>

      <!-- Количество результатов -->
      <div v-if="resultsCount !== undefined" class="text-center py-2">
        <p class="text-sm text-gray-400">
          Найдено {{ resultsCount }} {{ getTrainerCountLabel(resultsCount) }}
        </p>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface Props {
  specializations: string[]
  selectedSpecializations?: string[]
  experienceRange?: [number, number]
  ratingMin?: number
  availability?: {
    date?: string
    time?: string
  }
  loading?: boolean
  resultsCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  selectedSpecializations: () => [],
  experienceRange: () => [0, 20],
  ratingMin: 0,
  availability: () => ({}),
  loading: false
})

interface Emits {
  'specializationsChange': [specializations: string[]]
  'experienceChange': [range: [number, number]]
  'ratingChange': [rating: number]
  'availabilityChange': [availability: { date?: string; time?: string; onlyAvailable?: boolean }]
  'reset': []
  'apply': [filters: any]
}

const emit = defineEmits<Emits>()

// Реактивные данные
const searchQuery = ref('')
const selectedSpecializations = ref([...props.selectedSpecializations])
const experienceRange = ref<[number, number]>([...props.experienceRange])
const ratingMin = ref(props.ratingMin)
const availabilityDate = ref(props.availability.date || '')
const availabilityTime = ref(props.availability.time || '')
const onlyAvailable = ref(false)
const onlyActive = ref(true)
const onlyCertified = ref(false)
const onlyVerified = ref(false)
const priceRange = ref<[number, number]>([500, 5000])
const priceMin = ref(500)
const experienceMin = ref(0)
const selectedLocation = ref('')
const maxDistance = ref(10)
const selectedLanguages = ref<string[]>(['ru'])
const offersPlan = ref(false)
const offersNutrition = ref(false)
const offersOnline = ref(false)
const offersGroup = ref(false)
const sortBy = ref('rating')

// Опции
const ratingOptions = [
  { value: 5, label: '5 звезд' },
  { value: 4, label: '4+ звезды' },
  { value: 3, label: '3+ звезды' },
  { value: 2, label: '2+ звезды' },
  { value: 1, label: '1+ звезда' }
]

const timeOptions = [
  { label: 'Утром (6:00-12:00)', value: 'morning' },
  { label: 'Днем (12:00-18:00)', value: 'afternoon' },
  { label: 'Вечером (18:00-22:00)', value: 'evening' },
  { label: 'Ночью (22:00-6:00)', value: 'night' }
]

const locationOptions = [
  { label: 'Центральный район', value: 'center' },
  { label: 'Северный район', value: 'north' },
  { label: 'Южный район', value: 'south' },
  { label: 'Восточный район', value: 'east' },
  { label: 'Западный район', value: 'west' }
]

const languages = [
  { label: 'Русский', value: 'ru' },
  { label: 'Английский', value: 'en' },
  { label: 'Китайский', value: 'zh' },
  { label: 'Японский', value: 'ja' },
  { label: 'Корейский', value: 'ko' }
]

const sortOptions = [
  { label: 'По рейтингу', value: 'rating' },
  { label: 'По опыту', value: 'experience' },
  { label: 'По цене (возрастание)', value: 'price_asc' },
  { label: 'По цене (убывание)', value: 'price_desc' },
  { label: 'По популярности', value: 'popularity' },
  { label: 'По дате регистрации', value: 'newest' }
]

// Вычисляемые свойства
const hasActiveFilters = computed(() => {
  return selectedSpecializations.value.length > 0 ||
    experienceRange.value[0] > 0 || experienceRange.value[1] < 20 ||
    ratingMin.value > 0 ||
    availabilityDate.value !== '' ||
    availabilityTime.value !== '' ||
    onlyAvailable.value ||
    !onlyActive.value ||
    onlyCertified.value ||
    onlyVerified.value ||
    priceRange.value[0] > 500 || priceRange.value[1] < 5000 ||
    selectedLocation.value !== '' ||
    selectedLanguages.value.length > 1 ||
    offersPlan.value ||
    offersNutrition.value ||
    offersOnline.value ||
    offersGroup.value ||
    sortBy.value !== 'rating' ||
    searchQuery.value !== ''
})

// Методы
const toggleSpecialization = (specialization: string) => {
  const index = selectedSpecializations.value.indexOf(specialization)
  if (index > -1) {
    selectedSpecializations.value.splice(index, 1)
  } else {
    selectedSpecializations.value.push(specialization)
  }
  emit('specializationsChange', selectedSpecializations.value)
}

const handleExperienceChange = (value: [number, number]) => {
  experienceRange.value = value
  emit('experienceChange', value)
}

const selectRating = (rating: number) => {
  ratingMin.value = rating
  emit('ratingChange', rating)
}

const handleAvailabilityChange = () => {
  emit('availabilityChange', {
    date: availabilityDate.value || undefined,
    time: availabilityTime.value || undefined,
    onlyAvailable: onlyAvailable.value
  })
}

const handleStatusChange = () => {
  // Логика изменения статуса
}

const handlePriceChange = (value: [number, number]) => {
  priceRange.value = value
}

const handleLocationChange = () => {
  // Логика изменения местоположения
}

const toggleLanguage = (language: string) => {
  const index = selectedLanguages.value.indexOf(language)
  if (index > -1) {
    selectedLanguages.value.splice(index, 1)
  } else {
    selectedLanguages.value.push(language)
  }
}

const handleServicesChange = () => {
  // Логика изменения услуг
}

const handleSortChange = () => {
  // Логика изменения сортировки
}

const handleSearch = useDebounceFn(() => {
  // Логика поиска
}, 300)

const applyFilters = () => {
  const filters = {
    search: searchQuery.value,
    specializations: selectedSpecializations.value,
    experienceRange: experienceRange.value,
    ratingMin: ratingMin.value,
    availability: {
      date: availabilityDate.value || undefined,
      time: availabilityTime.value || undefined,
      onlyAvailable: onlyAvailable.value
    },
    status: {
      onlyActive: onlyActive.value,
      onlyCertified: onlyCertified.value,
      onlyVerified: onlyVerified.value
    },
    priceRange: priceRange.value,
    location: {
      area: selectedLocation.value || undefined,
      maxDistance: maxDistance.value
    },
    languages: selectedLanguages.value,
    services: {
      offersPlan: offersPlan.value,
      offersNutrition: offersNutrition.value,
      offersOnline: offersOnline.value,
      offersGroup: offersGroup.value
    },
    sortBy: sortBy.value
  }

  emit('apply', filters)
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedSpecializations.value = []
  experienceRange.value = [0, 20]
  ratingMin.value = 0
  availabilityDate.value = ''
  availabilityTime.value = ''
  onlyAvailable.value = false
  onlyActive.value = true
  onlyCertified.value = false
  onlyVerified.value = false
  priceRange.value = [500, 5000]
  selectedLocation.value = ''
  maxDistance.value = 10
  selectedLanguages.value = ['ru']
  offersPlan.value = false
  offersNutrition.value = false
  offersOnline.value = false
  offersGroup.value = false
  sortBy.value = 'rating'

  emit('reset')
}

// Утилиты
const getSpecializationColor = (specialization: string) => {
  const colors = {
    karate: 'orange',
    boxing: 'red',
    mma: 'purple',
    kickboxing: 'pink',
    judo: 'blue',
    taekwondo: 'cyan',
    muay_thai: 'yellow',
    bjj: 'indigo',
    wrestling: 'green',
    fitness: 'gray'
  } as const

  return colors[specialization as keyof typeof colors] || 'gray'
}

const getSpecializationLabel = (specialization: string) => {
  const labels = {
    karate: 'Каратэ',
    boxing: 'Бокс',
    mma: 'ММА',
    kickboxing: 'Кикбоксинг',
    judo: 'Дзюдо',
    taekwondo: 'Тхэквондо',
    muay_thai: 'Муай Тай',
    bjj: 'БЖЖ',
    wrestling: 'Борьба',
    fitness: 'Фитнес'
  }

  const key = specialization.toLowerCase().replace(/\s+/g, '_')
  return labels[key as keyof typeof labels] || specialization
}

const getSpecializationCount = (specialization: string) => {
  // Моковые данные для количества тренеров по специализации
  const counts = {
    karate: 15,
    boxing: 23,
    mma: 18,
    kickboxing: 12,
    judo: 8,
    taekwondo: 6,
    muay_thai: 10,
    bjj: 14,
    wrestling: 9,
    fitness: 45
  }

  const key = specialization.toLowerCase().replace(/\s+/g, '_')
  return counts[key as keyof typeof counts] || 0
}

const getRatingCount = (rating: number) => {
  // Моковые данные для количества тренеров по рейтингу
  const counts = { 5: 25, 4: 45, 3: 68, 2: 82, 1: 95 }
  return counts[rating as keyof typeof counts] || 0
}

const getLanguageCount = (language: string) => {
  // Моковые данные для языков
  const counts = { ru: 95, en: 45, zh: 12, ja: 8, ko: 5 }
  return counts[language as keyof typeof counts] || 0
}

const getTrainerCountLabel = (count: number) => {
  if (count === 1) return 'тренер'
  if (count >= 2 && count <= 4) return 'тренера'
  return 'тренеров'
}
</script>

<style scoped>
.trainer-filter {
  @apply bg-gray-900 border-gray-800;
}

/* Улучшения для range slider */
.range-slider {
  @apply w-full;
}

/* Анимация для фильтров */
.filter-section {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>