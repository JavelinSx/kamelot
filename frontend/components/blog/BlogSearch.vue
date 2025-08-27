<!-- components/blog/BlogSearch.vue -->
<template>
  <div class="relative">
    <!-- Search Input -->
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <input v-model="searchQuery" type="text" :placeholder="placeholder"
        class="block w-full pl-10 pr-10 py-3 border-0 bg-gray-800 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
        @input="handleInput" @focus="showSuggestions = true" @blur="hideSuggestions" @keydown.enter="handleSearch"
        @keydown.arrow-down="navigateSuggestions(1)" @keydown.arrow-up="navigateSuggestions(-1)"
        @keydown.escape="hideSuggestions">

      <!-- Loading Spinner -->
      <div v-if="loading" class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <svg class="animate-spin h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
      </div>

      <!-- Clear Button -->
      <button v-if="searchQuery && !loading" @click="clearSearch"
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors">
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Suggestions Dropdown -->
    <div v-if="showSuggestions && (suggestions.length > 0 || searchQuery)"
      class="absolute z-50 w-full mt-2 bg-gray-900 border border-gray-800 rounded-lg shadow-lg max-h-80 overflow-y-auto scrollbar-custom">
      <!-- Current Search -->
      <div v-if="searchQuery" class="border-b border-gray-800">
        <button @click="handleSearch"
          class="w-full px-4 py-3 text-left hover:bg-gray-800 transition-colors flex items-center space-x-3">
          <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span class="text-white">Найти "<span class="text-red-400">{{ searchQuery }}</span>"</span>
        </button>
      </div>

      <!-- Suggestions -->
      <div v-if="suggestions.length > 0">
        <div class="px-4 py-2 text-xs text-gray-500 font-medium uppercase tracking-wider border-b border-gray-800">
          Предложения
        </div>
        <button v-for="(suggestion, index) in suggestions" :key="suggestion" @click="selectSuggestion(suggestion)"
          :class="[
            'w-full px-4 py-2 text-left hover:bg-gray-800 transition-colors text-gray-300 text-sm',
            index === selectedSuggestionIndex ? 'bg-gray-800' : ''
          ]">
          {{ suggestion }}
        </button>
      </div>

      <!-- No Results -->
      <div v-if="searchQuery && suggestions.length === 0 && !loading" class="px-4 py-3 text-gray-500 text-sm">
        Предложений не найдено
      </div>
    </div>

    <!-- Search Results Summary -->
    <div v-if="results" class="mt-4 text-sm text-gray-400">
      <div class="flex items-center justify-between">
        <span>
          Найдено {{ results.total }} {{ getResultsLabel(results.total) }} по запросу
          "<span class="text-red-400">{{ results.query }}</span>"
        </span>
        <span v-if="results.took">
          за {{ results.took }}мс
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  placeholder?: string
  loading?: boolean
  suggestions?: string[]
  results?: {
    query: string
    total: number
    took: number
  }
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Поиск статей...',
  loading: false,
  suggestions: () => []
})

const emit = defineEmits<{
  search: [query: string]
  suggestionClick: [suggestion: string]
}>()

const searchQuery = ref('')
const showSuggestions = ref(false)
const selectedSuggestionIndex = ref(-1)

const handleInput = useDebounceFn(() => {
  if (searchQuery.value.length >= 2) {
    emit('search', searchQuery.value)
  }
}, 300)

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    emit('search', searchQuery.value.trim())
    hideSuggestions()
  }
}

const selectSuggestion = (suggestion: string) => {
  searchQuery.value = suggestion
  emit('suggestionClick', suggestion)
  hideSuggestions()
}

const clearSearch = () => {
  searchQuery.value = ''
  emit('search', '')
}

const hideSuggestions = () => {
  setTimeout(() => {
    showSuggestions.value = false
    selectedSuggestionIndex.value = -1
  }, 150)
}

const navigateSuggestions = (direction: number) => {
  const maxIndex = props.suggestions.length - 1
  selectedSuggestionIndex.value = Math.max(
    -1,
    Math.min(maxIndex, selectedSuggestionIndex.value + direction)
  )

  if (selectedSuggestionIndex.value >= 0) {
    const suggestion = props.suggestions[selectedSuggestionIndex.value]
    if (suggestion) {
      searchQuery.value = suggestion
    }
  }
}

const getResultsLabel = (count: number) => {
  if (count === 1) return 'результат'
  if (count < 5) return 'результата'
  return 'результатов'
}

</script>