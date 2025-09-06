<!-- components/blog/BlogFilter.vue -->
<template>
  <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-white font-bold text-lg">Фильтры</h3>
      <UButton @click="resetFilters" variant="ghost" size="sm" class="text-gray-400 hover:text-white">
        Сбросить
      </UButton>
    </div>

    <div class="space-y-6">
      <!-- Categories -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-3">
          Категории
        </label>
        <div class="space-y-2 max-h-48 overflow-y-auto scrollbar-custom">
          <label v-for="category in categories" :key="category.id"
            class="flex items-center justify-between cursor-pointer group">
            <div class="flex items-center space-x-3">
              <input v-model="selectedCategory" :value="category.slug" type="radio" name="category" class="form-radio">
              <span class="text-gray-300 group-hover:text-white transition-colors">
                {{ category.name }}
              </span>
            </div>
            <UBadge variant="soft" color="gray" size="sm">
              {{ category.postsCount }}
            </UBadge>
          </label>
        </div>
      </div>

      <!-- Popular Tags -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-3">
          Популярные теги
        </label>
        <div class="flex flex-wrap gap-2">
          <button v-for="tag in popularTags" :key="tag.name" @click="toggleTag(tag.name)"
            :class="getTagButtonClasses(tag.name)">
            #{{ tag.name }}
            <UBadge variant="soft" color="gray" size="xs" class="ml-1">
              {{ tag.count }}
            </UBadge>
          </button>
        </div>
      </div>

      <!-- Date Range -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-3">
          Дата публикации
        </label>
        <div class="space-y-2">
          <label v-for="period in datePeriods" :key="period.value" class="flex items-center space-x-3 cursor-pointer">
            <input v-model="selectedDateRange" :value="period.value" type="radio" name="dateRange" class="form-radio">
            <span class="text-gray-300">{{ period.label }}</span>
          </label>
        </div>
      </div>

      <!-- Sort By -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-3">
          Сортировка
        </label>
        <USelect v-model="selectedSort" :options="sortOptions" size="sm" />
      </div>

      <!-- Reading Time -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-3">
          Время чтения (минуты)
        </label>
        <div class="space-y-3">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-400">1 мин</span>
            <span class="text-gray-400">30+ мин</span>
          </div>
          <input v-model="maxReadTime" type="range" min="1" max="30" step="1"
            class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-red">
          <div class="text-center">
            <span class="text-red-400 font-medium">
              до {{ maxReadTime }} {{ getMinutesLabel(maxReadTime) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Apply Button -->
    <div class="mt-6 pt-6 border-t border-gray-800">
      <UButton @click="applyFilters" color="red" size="sm" class="w-full">
        Применить фильтры
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BlogCategory } from '@/types';

interface Props {
  categories: BlogCategory[]
  popularTags: { name: string; count: number }[]
  selectedCategory?: string
  selectedTags?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  selectedTags: () => []
})

const emit = defineEmits<{
  categoryChange: [category: string]
  tagsChange: [tags: string[]]
  dateRangeChange: [dateRange: string]
  sortChange: [sort: string]
  readTimeChange: [maxTime: number]
  reset: []
}>()

// Local state
const selectedCategory = ref(props.selectedCategory || '')
const selectedTagsList = ref([...props.selectedTags])
const selectedDateRange = ref('')
const selectedSort = ref('newest')
const maxReadTime = ref(30)

const datePeriods = [
  { value: '', label: 'Все время' },
  { value: 'today', label: 'Сегодня' },
  { value: 'week', label: 'Эта неделя' },
  { value: 'month', label: 'Этот месяц' },
  { value: 'year', label: 'Этот год' }
]

const sortOptions = [
  { label: 'Сначала новые', value: 'newest' },
  { label: 'Сначала старые', value: 'oldest' },
  { label: 'По популярности', value: 'popular' },
  { label: 'По количеству лайков', value: 'likes' },
  { label: 'По времени чтения', value: 'readTime' }
]

const toggleTag = (tag: string) => {
  const index = selectedTagsList.value.indexOf(tag)
  if (index > -1) {
    selectedTagsList.value.splice(index, 1)
  } else {
    selectedTagsList.value.push(tag)
  }
}

const getTagButtonClasses = (tag: string) => {
  const isSelected = selectedTagsList.value.includes(tag)
  return [
    'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-200',
    isSelected
      ? 'bg-red-600 text-white'
      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
  ]
}

const getMinutesLabel = (minutes: number) => {
  if (minutes === 1) return 'минуты'
  if (minutes < 5) return 'минут'
  return 'минут'
}

const resetFilters = () => {
  selectedCategory.value = ''
  selectedTagsList.value = []
  selectedDateRange.value = ''
  selectedSort.value = 'newest'
  maxReadTime.value = 30
  emit('reset')
}

const applyFilters = () => {
  emit('categoryChange', selectedCategory.value)
  emit('tagsChange', selectedTagsList.value)
  emit('dateRangeChange', selectedDateRange.value)
  emit('sortChange', selectedSort.value)
  emit('readTimeChange', maxReadTime.value)
}

// Watch for changes and auto-apply
watch([selectedCategory, selectedTagsList, selectedDateRange, selectedSort, maxReadTime], () => {
  applyFilters()
}, { deep: true })
</script>
