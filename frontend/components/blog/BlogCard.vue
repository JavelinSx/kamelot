<!-- components/blog/BlogCard.vue -->
<template>
  <article
    class="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-red-600 transition-all duration-300 group hover-lift">
    <!-- Featured Image -->
    <div class="relative h-48 overflow-hidden">
      <img :src="post.featuredImage || '/default-blog-image.jpg'" :alt="post.title"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105">

      <!-- Category Badge -->
      <div class="absolute top-4 left-4">
        <UBadge :color="getCategoryColor(post.category)" size="sm" class="font-medium">
          {{ post.category.name }}
        </UBadge>
      </div>

      <!-- Read Time -->
      <div v-if="showReadTime && post.readTime" class="absolute top-4 right-4">
        <div class="bg-black bg-opacity-50 backdrop-blur-sm rounded-full px-3 py-1">
          <span class="text-white text-xs">{{ post.readTime }} мин</span>
        </div>
      </div>

      <!-- Like Button -->
      <button v-if="showLikeButton" @click="handleLike"
        class="absolute bottom-4 right-4 bg-black bg-opacity-50 backdrop-blur-sm rounded-full p-2 hover:bg-red-600 transition-colors">
        <svg class="w-5 h-5" :class="post.isLiked ? 'text-red-400' : 'text-white'" fill="currentColor"
          viewBox="0 0 20 20">
          <path fill-rule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clip-rule="evenodd" />
        </svg>
      </button>
    </div>

    <!-- Content -->
    <div class="p-6">
      <!-- Title -->
      <h3 class="text-white font-bold text-xl mb-3 line-clamp-2 group-hover:text-red-400 transition-colors">
        {{ post.title }}
      </h3>

      <!-- Excerpt -->
      <p v-if="showExcerpt" class="text-gray-300 text-sm mb-4 line-clamp-3">
        {{ post.excerpt }}
      </p>

      <!-- Tags -->
      <div v-if="post.tags.length > 0" class="flex flex-wrap gap-2 mb-4">
        <span v-for="tag in post.tags.slice(0, 3)" :key="tag.id"
          class="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded-md hover:bg-gray-700 transition-colors cursor-pointer">
          #{{ tag }}
        </span>
        <span v-if="post.tags.length > 3" class="text-gray-500 text-xs">
          +{{ post.tags.length - 3 }}
        </span>
      </div>

      <!-- Author & Date -->
      <div class="flex items-center justify-between">
        <div v-if="showAuthor" class="flex items-center space-x-3">
          <img :src="post.author.avatar || '/default-avatar.png'" :alt="post.author.firstName"
            class="w-8 h-8 rounded-full border-2 border-gray-700">
          <div>
            <p class="text-white text-sm font-medium">
              {{ post.author.firstName }} {{ post.author.lastName }}
            </p>
            <p class="text-gray-400 text-xs">
              {{ formatDate(post.publishedAt || '') }}
            </p>
          </div>
        </div>

        <!-- Stats -->
        <div class="flex items-center space-x-4 text-gray-400 text-xs">
          <div class="flex items-center space-x-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{{ post.views }}</span>
          </div>
          <div class="flex items-center space-x-1">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clip-rule="evenodd" />
            </svg>
            <span>{{ post.likes }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="px-6 pb-6">
      <div class="flex space-x-3">
        <UButton @click="handleRead" color="red" size="sm" class="flex-1">
          Читать
        </UButton>
        <UButton v-if="showShareButton" @click="handleShare" variant="outline" color="gray" size="sm">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          Поделиться
        </UButton>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { BadgeColor, BlogPost } from '~/types'

interface Props {
  post: BlogPost
  variant?: 'default' | 'compact' | 'featured'
  showAuthor?: boolean
  showCategory?: boolean
  showExcerpt?: boolean
  showReadTime?: boolean
  showLikeButton?: boolean
  showShareButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  showAuthor: true,
  showCategory: true,
  showExcerpt: true,
  showReadTime: true,
  showLikeButton: true,
  showShareButton: true
})

const emit = defineEmits<{
  read: [post: BlogPost]
  like: [post: BlogPost]
  share: [post: BlogPost]
}>()

const getCategoryColor = (category: any): BadgeColor => {
  // Используем типобезопасные цвета BadgeColor
  const colors: BadgeColor[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan', 'indigo', 'teal']

  // Генерируем консистентный цвет на основе ID или названия категории
  const index = category.id ? category.id % colors.length :
    category.name ? category.name.length % colors.length : 0

  return colors[index] || 'gray'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const handleRead = () => {
  emit('read', props.post)
}

const handleLike = () => {
  emit('like', props.post)
}

const handleShare = () => {
  emit('share', props.post)
}
</script>

<style scoped>
.hover-lift:hover {
  transform: translateY(-2px);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>