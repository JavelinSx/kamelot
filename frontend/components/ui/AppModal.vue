<!-- components/ui/AppModal.vue -->
<template>
  <Teleport to="body">
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto" @click="handleOverlayClick">
        <!-- Overlay -->
        <div class="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm"></div>

        <!-- Modal Container -->
        <div class="flex min-h-screen items-center justify-center p-4">
          <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
            <div v-if="modelValue" :class="modalClasses" @click.stop>
              <!-- Header -->
              <div v-if="title || $slots.header" class="flex items-center justify-between p-6 border-b border-gray-800">
                <div>
                  <slot name="header">
                    <h3 class="text-lg font-semibold text-white">{{ title }}</h3>
                  </slot>
                </div>
                <button v-if="showCloseButton" @click="close" class="text-gray-400 hover:text-white transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Body -->
              <div class="p-6">
                <slot />
              </div>

              <!-- Footer -->
              <div v-if="$slots.footer" class="px-6 pb-6 border-t border-gray-800 pt-4">
                <slot name="footer" />
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  persistent?: boolean
  showCloseButton?: boolean
  maxHeight?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  persistent: false,
  showCloseButton: true,
  maxHeight: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4'
}

const modalClasses = computed(() => [
  'relative bg-gray-900 border border-gray-800 rounded-xl shadow-2xl w-full',
  sizeClasses[props.size],
  props.maxHeight ? 'max-h-[90vh] overflow-y-auto' : ''
])

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleOverlayClick = () => {
  if (!props.persistent) {
    close()
  }
}

// Close on Escape key
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue && !props.persistent) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>