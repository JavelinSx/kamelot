<!-- components/blog/BlogList.vue -->
<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden animate-pulse">
        <div class="h-48 bg-gray-700"></div>
        <div class="p-6 space-y-3">
          <div class="h-4 bg-gray-700 rounded w-3/4"></div>
          <div class="h-3 bg-gray-700 rounded w-full"></div>
          <div class="h-3 bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    </div>

    <!-- Posts Grid -->
    <div v-else-if="posts.length > 0" :class="gridClasses">
      <BlogCard v-for="post in posts" :key="post.id" :post="post" :show-author="showAuthor" :show-excerpt="showExcerpt"
        @read="handlePostRead" @like="handlePostLike" @share="handlePostShare" />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="w-24 h-24 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
        <svg class="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      </div>
      <h3 class="text-white text-xl font-semibold mb-2">Статьи не найдены</h3>
      <p class="text-gray-400">Попробуйте изменить параметры поиска</p>
    </div>

    <!-- Pagination -->
    <div v-if="showPagination && pagination" class="flex justify-center mt-8">
      <div class="flex items-center space-x-2">
        <UButton @click="goToPage(pagination.page - 1)" :disabled="pagination.page <= 1" variant="outline" size="sm">
          Назад
        </UButton>

        <div class="flex items-center space-x-1">
          <UButton v-for="page in visiblePages" :key="page" @click="goToPage(page)"
            :variant="page === pagination.page ? 'solid' : 'ghost'" :color="page === pagination.page ? 'red' : 'gray'"
            size="sm" class="min-w-[40px]">
            {{ page }}
          </UButton>
        </div>

        <UButton @click="goToPage(pagination.page + 1)" :disabled="pagination.page >= pagination.totalPages"
          variant="outline" size="sm">
          Вперед
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BlogPost } from '@/types'

interface Props {
  posts: BlogPost[]
  loading?: boolean
  variant?: 'grid' | 'list'
  columns?: 1 | 2 | 3 | 4
  showPagination?: boolean
  showAuthor?: boolean
  showExcerpt?: boolean
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  variant: 'grid',
  columns: 3,
  showPagination: true,
  showAuthor: true,
  showExcerpt: true
})

const emit = defineEmits<{
  postClick: [post: BlogPost]
  pageChange: [page: number]
  like: [post: BlogPost]
  share: [post: BlogPost]
}>()

const gridClasses = computed(() => {
  if (props.variant === 'list') {
    return 'space-y-6'
  }

  const columnClasses = {
    1: 'grid grid-cols-1 gap-6',
    2: 'grid grid-cols-1 md:grid-cols-2 gap-6',
    3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
  }

  return columnClasses[props.columns]
})

const visiblePages = computed(() => {
  if (!props.pagination) return []

  const { page, totalPages } = props.pagination
  const delta = 2
  const range = []
  const rangeWithDots = []

  for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
    range.push(i)
  }

  if (page - delta > 2) {
    rangeWithDots.push(1, '...')
  } else {
    rangeWithDots.push(1)
  }

  rangeWithDots.push(...range)

  if (page + delta < totalPages - 1) {
    rangeWithDots.push('...', totalPages)
  } else if (totalPages > 1) {
    rangeWithDots.push(totalPages)
  }

  return rangeWithDots
})

const handlePostRead = (post: BlogPost) => {
  emit('postClick', post)
}

const handlePostLike = (post: BlogPost) => {
  emit('like', post)
}

const handlePostShare = (post: BlogPost) => {
  emit('share', post)
}

const goToPage = (page: number | string) => {
  if (typeof page === 'string') return
  if (props.pagination && page >= 1 && page <= props.pagination.totalPages) {
    emit('pageChange', page)
  }
}
</script>