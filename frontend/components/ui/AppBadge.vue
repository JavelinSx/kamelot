<!-- components/ui/AppBadge.vue -->
<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'solid' | 'soft' | 'outline'
  color?: 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'purple'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  rounded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'solid',
  color: 'gray',
  size: 'sm',
  rounded: true
})

const baseClasses = 'inline-flex items-center font-medium'

const sizeClasses = {
  xs: 'px-2 py-0.5 text-xs',
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base'
}

const colorClasses = {
  solid: {
    gray: 'bg-gray-700 text-white',
    red: 'bg-red-600 text-white',
    yellow: 'bg-yellow-500 text-black',
    green: 'bg-green-600 text-white',
    blue: 'bg-blue-600 text-white',
    purple: 'bg-purple-600 text-white'
  },
  soft: {
    gray: 'bg-gray-800 text-gray-300 border border-gray-700',
    red: 'bg-red-900 text-red-300 border border-red-800',
    yellow: 'bg-yellow-900 text-yellow-300 border border-yellow-800',
    green: 'bg-green-900 text-green-300 border border-green-800',
    blue: 'bg-blue-900 text-blue-300 border border-blue-800',
    purple: 'bg-purple-900 text-purple-300 border border-purple-800'
  },
  outline: {
    gray: 'border border-gray-600 text-gray-400',
    red: 'border border-red-600 text-red-400',
    yellow: 'border border-yellow-500 text-yellow-400',
    green: 'border border-green-600 text-green-400',
    blue: 'border border-blue-600 text-blue-400',
    purple: 'border border-purple-600 text-purple-400'
  }
}

const badgeClasses = computed(() => [
  baseClasses,
  sizeClasses[props.size],
  colorClasses[props.variant][props.color],
  props.rounded ? 'rounded-full' : 'rounded-md'
])
</script>
