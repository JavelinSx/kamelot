<template>
  <UButton :variant="variant" :color="color" :size="size" :loading="loading" :disabled="disabled" :icon="icon"
    :trailing="trailing" :to="to" :type="type" :block="block" :square="square" :truncate="truncate" :padded="padded"
    @click="handleClick" :class="[
      'app-button',
      {
        'app-button--martial-arts': martialArts,
        'app-button--full-width': fullWidth
      },
      customClass
    ]">
    <slot />
  </UButton>
</template>

<script setup lang="ts">
interface Props {
  // Основные свойства
  variant?: 'solid' | 'outline' | 'soft' | 'ghost' | 'link'
  color?: 'primary' | 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald' | 'teal' | 'cyan' | 'sky' | 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia' | 'pink' | 'rose' | 'gray' | 'white' | 'black'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'

  // Состояния
  loading?: boolean
  disabled?: boolean

  // Иконки
  icon?: string
  trailing?: boolean

  // Навигация
  to?: string | object

  // HTML атрибуты
  type?: 'button' | 'submit' | 'reset'

  // Стили
  block?: boolean
  square?: boolean
  truncate?: boolean
  padded?: boolean
  fullWidth?: boolean

  // Кастомные классы
  customClass?: string

  // Специальная тема для боевых искусств
  martialArts?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'solid',
  color: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  trailing: false,
  type: 'button',
  block: false,
  square: false,
  truncate: false,
  padded: true,
  fullWidth: false,
  martialArts: false
})

interface Emits {
  click: [event: MouseEvent]
}

const emit = defineEmits<Emits>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.app-button {
  @apply transition-all duration-200 ease-in-out;
}

.app-button--martial-arts {
  @apply bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-lg hover:shadow-red-500/25 border-0;
}

.app-button--martial-arts[data-variant="outline"] {
  @apply bg-transparent border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white bg-gradient-to-r hover:from-red-600 hover:to-orange-600;
}

.app-button--martial-arts[data-variant="ghost"] {
  @apply bg-transparent text-red-600 hover:bg-red-600/10 hover:text-red-700;
}

.app-button--full-width {
  @apply w-full;
}

/* Анимация для загрузки */
.app-button[data-loading="true"] {
  @apply cursor-not-allowed opacity-75;
}

/* Hover эффекты для боевых искусств */
.app-button--martial-arts:not([data-loading="true"]):not([disabled]):hover {
  @apply transform scale-105 shadow-lg;
}

/* Focus states */
.app-button:focus-visible {
  @apply ring-2 ring-offset-2 ring-offset-gray-900;
}

.app-button--martial-arts:focus-visible {
  @apply ring-red-500;
}
</style>