<!-- components/ui/AppCard.vue -->
<template>
  <div :class="cardClasses" @click="handleClick">
    <!-- Header -->
    <div v-if="title || $slots.header" :class="headerClasses">
      <slot name="header">
        <h3 class="text-lg font-semibold text-white">{{ title }}</h3>
        <p v-if="subtitle" class="text-sm text-gray-400 mt-1">{{ subtitle }}</p>
      </slot>
    </div>

    <!-- Body -->
    <div :class="bodyClasses">
      <slot />
    </div>

    <!-- Footer -->
    <div v-if="$slots.footer" :class="footerClasses">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outlined' | 'elevated'
  hover?: boolean
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'md',
  variant: 'default',
  hover: false,
  clickable: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const baseClasses = 'bg-gray-900 rounded-xl overflow-hidden transition-all duration-200'

const variantClasses = {
  default: 'border border-gray-800',
  outlined: 'border-2 border-gray-700',
  elevated: 'border border-gray-800 shadow-2xl'
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
}

// ИСПРАВЛЕНО: убираем объекты с булевыми ключами
const cardClasses = computed(() => [
  baseClasses,
  variantClasses[props.variant],
  // Используем тернарные операторы вместо объектов
  props.hover ? 'hover:border-red-600 hover:shadow-lg' : '',
  props.clickable ? 'cursor-pointer' : ''
])

const headerClasses = computed(() => [
  'border-b border-gray-800',
  paddingClasses[props.padding],
  'pb-4'
])

const bodyClasses = computed(() => [
  paddingClasses[props.padding]
])

const footerClasses = computed(() => [
  'border-t border-gray-800',
  paddingClasses[props.padding],
  'pt-4'
])

const handleClick = (event: MouseEvent) => {
  if (props.clickable) {
    emit('click', event)
  }
}
</script>