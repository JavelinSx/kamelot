<!-- components/ui/AppAlert.vue -->
<template>
  <div v-if="show" :class="alertClasses">
    <div class="flex items-start">
      <!-- Icon -->
      <div class="flex-shrink-0">
        <component :is="iconComponent" class="h-5 w-5" />
      </div>

      <!-- Content -->
      <div class="ml-3 flex-1">
        <h3 v-if="title" :class="titleClasses">{{ title }}</h3>
        <div :class="messageClasses">
          <slot>{{ message }}</slot>
        </div>
      </div>

      <!-- Close Button -->
      <div v-if="closable" class="ml-4 flex-shrink-0">
        <button @click="handleClose" :class="closeButtonClasses">
          <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'

interface Props {
  type?: 'success' | 'warning' | 'error' | 'info'
  title?: string
  message?: string
  closable?: boolean
  modelValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  closable: false,
  modelValue: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const typeConfig = {
  success: {
    icon: CheckCircleIcon,
    bgClass: 'bg-green-900 border-green-800',
    iconClass: 'text-green-400',
    titleClass: 'text-green-300',
    messageClass: 'text-green-200',
    closeClass: 'text-green-400 hover:text-green-300'
  },
  warning: {
    icon: ExclamationTriangleIcon,
    bgClass: 'bg-yellow-900 border-yellow-800',
    iconClass: 'text-yellow-400',
    titleClass: 'text-yellow-300',
    messageClass: 'text-yellow-200',
    closeClass: 'text-yellow-400 hover:text-yellow-300'
  },
  error: {
    icon: XCircleIcon,
    bgClass: 'bg-red-900 border-red-800',
    iconClass: 'text-red-400',
    titleClass: 'text-red-300',
    messageClass: 'text-red-200',
    closeClass: 'text-red-400 hover:text-red-300'
  },
  info: {
    icon: InformationCircleIcon,
    bgClass: 'bg-blue-900 border-blue-800',
    iconClass: 'text-blue-400',
    titleClass: 'text-blue-300',
    messageClass: 'text-blue-200',
    closeClass: 'text-blue-400 hover:text-blue-300'
  }
}

const config = computed(() => typeConfig[props.type])

const alertClasses = computed(() => [
  'border rounded-lg p-4',
  config.value.bgClass
])

const iconComponent = computed(() => config.value.icon)

const titleClasses = computed(() => [
  'text-sm font-medium',
  config.value.titleClass
])

const messageClasses = computed(() => [
  'text-sm',
  config.value.messageClass,
  props.title ? 'mt-1' : ''
])

const closeButtonClasses = computed(() => [
  'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
  config.value.closeClass
])

const handleClose = () => {
  show.value = false
  emit('close')
}
</script>