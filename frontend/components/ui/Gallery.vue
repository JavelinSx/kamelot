<template>
  <div class="bg-gradient-to-b from-black to-white">
    <!-- Заголовок галереи -->
    <div v-if="title || description" class="text-center pt-8 pb-8 text-white">
      <h2 v-if="title" class="text-5xl font-bold text-gray-300 mb-12">{{ title }}</h2>
      <p v-if="description" class="text-xl text-gray-300 max-w-2xl mx-auto">{{ description }}</p>
    </div>

    <!-- Галерея -->
    <div ref="galleryContainer" class="masonry-container" :style="{ columnCount: columnCount, columnGap: gap + 'px' }">
      <div v-for="(image, index) in images" :key="index" class="masonry-item group cursor-pointer break-inside-avoid"
        :style="{ marginBottom: gap + 'px' }" @click="handleImageClick(image, index)">
        <!-- Контейнер изображения -->
        <div class="relative overflow-hidden bg-gray-900 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <!-- Изображение -->
          <img :src="image" :alt="`Gallery image ${index + 1}`"
            class="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy"
            @error="onImageError" />

          <!-- Простой overlay при hover -->
          <div
            class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div class="p-3 bg-black/50 text-white rounded-full">
              <UIcon name="i-heroicons-magnifying-glass-plus" class="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Кнопка "Показать еще" -->
    <div v-if="canLoadMore" class="text-center mt-8">
      <button @click="$emit('loadMore')" :disabled="loadingMore"
        class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50">
        <span v-if="!loadingMore">Показать еще</span>
        <span v-else class="flex items-center space-x-2">
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Загрузка...</span>
        </span>
      </button>
    </div>

    <!-- Lightbox модалка -->
    <Teleport to="body">
      <div v-if="lightboxImage" class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
        @click="closeLightbox" @keydown.esc="closeLightbox">
        <div class="relative max-w-7xl max-h-full p-4" @click.stop>
          <!-- Закрыть -->
          <button @click="closeLightbox"
            class="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors">
            <UIcon name="i-heroicons-x-mark" class="w-6 h-6" />
          </button>

          <!-- Навигация -->
          <button v-if="lightboxIndex > 0" @click="navigateLightbox(-1)"
            class="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors">
            <UIcon name="i-heroicons-chevron-left" class="w-6 h-6" />
          </button>

          <button v-if="lightboxIndex < images.length - 1" @click="navigateLightbox(1)"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors">
            <UIcon name="i-heroicons-chevron-right" class="w-6 h-6" />
          </button>

          <!-- Изображение -->
          <img :src="lightboxImage" :alt="`Gallery image ${lightboxIndex + 1}`"
            class="max-w-full max-h-full object-contain rounded-lg" />

          <!-- Счетчик изображений -->
          <div
            class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2">
            <span class="text-white font-medium">{{ lightboxIndex + 1 }} / {{ images.length }}</span>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'

interface Props {
  images: string[] // Просто массив URL изображений
  title?: string
  description?: string
  columns?: number
  gap?: number
  canLoadMore?: boolean
  loadingMore?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  columns: 0, // 0 = автоматически
  gap: 16,
  canLoadMore: false,
  loadingMore: false
})

interface Emits {
  imageClick: [imageUrl: string, index: number]
  loadMore: []
  lightboxOpen: [imageUrl: string, index: number]
  lightboxClose: []
}

const emit = defineEmits<Emits>()

// Реактивные данные
const galleryContainer = ref<HTMLElement>()
const lightboxImage = ref<string | null>(null)
const lightboxIndex = ref(-1)

// Адаптивные колонки
const columnCount = computed(() => {
  if (props.columns > 0) return props.columns

  // Автоматическое определение количества колонок
  if (typeof window !== 'undefined') {
    const width = window.innerWidth
    if (width < 640) return 1      // mobile
    if (width < 768) return 2      // tablet
    if (width < 1024) return 3     // desktop
    if (width < 1280) return 4     // large
    return 5                       // xl
  }
  return 3
})

// Методы
const handleImageClick = (imageUrl: string, index: number) => {
  openLightbox(imageUrl, index)
  emit('imageClick', imageUrl, index)
}

const openLightbox = (imageUrl: string, index: number) => {
  lightboxImage.value = imageUrl
  lightboxIndex.value = index
  document.body.style.overflow = 'hidden'
  emit('lightboxOpen', imageUrl, index)
}

const closeLightbox = () => {
  lightboxImage.value = null
  lightboxIndex.value = -1
  document.body.style.overflow = ''
  emit('lightboxClose')
}

const navigateLightbox = (direction: number) => {
  const newIndex = lightboxIndex.value + direction
  if (newIndex >= 0 && newIndex < props.images.length) {
    lightboxIndex.value = newIndex
    lightboxImage.value = props.images[newIndex]
  }
}

const onImageError = (event: Event) => {
  console.error('Failed to load image:', event)
  // Можно заменить на placeholder
  const img = event.target as HTMLImageElement
  img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='
}

// Обработчик клавиш для lightbox
const handleKeydown = (event: KeyboardEvent) => {
  if (!lightboxImage.value) return

  switch (event.key) {
    case 'Escape':
      closeLightbox()
      break
    case 'ArrowLeft':
      navigateLightbox(-1)
      break
    case 'ArrowRight':
      navigateLightbox(1)
      break
  }
}

// Обновление колонок при изменении размера окна
const handleResize = () => {
  nextTick(() => {
    if (galleryContainer.value) {
      galleryContainer.value.style.columnCount = columnCount.value.toString()
    }
  })
}

// Lifecycle
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', handleResize)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.masonry-container {
  column-fill: balance;
}

.masonry-item {
  display: inline-block;
  width: 100%;
  vertical-align: top;
  page-break-inside: avoid;
  break-inside: avoid;
}

/* Адаптивность */
@media (max-width: 640px) {
  .masonry-container {
    column-count: 1 !important;
  }
}

@media (max-width: 768px) {
  .masonry-container {
    column-count: 2 !important;
  }
}
</style>