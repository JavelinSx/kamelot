<!-- components/ui/AppInput.vue -->
<template>
  <div class="space-y-2">
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-gray-300">
      {{ label }}
      <span v-if="required" class="text-red-400">*</span>
    </label>

    <div class="relative">
      <!-- Icon Before -->
      <div v-if="iconBefore" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <component :is="iconBefore" class="h-5 w-5 text-gray-400" />
      </div>

      <input :id="inputId" v-model="inputValue" :type="type" :placeholder="placeholder" :disabled="disabled"
        :readonly="readonly" :class="inputClasses" v-bind="$attrs" @focus="handleFocus" @blur="handleBlur" />

      <!-- Icon After -->
      <div v-if="iconAfter || error" class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <component v-if="iconAfter && !error" :is="iconAfter" class="h-5 w-5 text-gray-400" />
        <svg v-if="error" class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd" />
        </svg>
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="error" class="text-sm text-red-400">{{ error }}</p>

    <!-- Help Text -->
    <p v-if="help && !error" class="text-sm text-gray-500">{{ help }}</p>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'time'
  label?: string
  placeholder?: string
  error?: string
  help?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
  iconBefore?: Component | string
  iconAfter?: Component | string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
  disabled: false,
  readonly: false,
  required: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)
const focused = ref(false)

const inputValue = computed({
  get: () => props.modelValue || '',
  set: (value: string) => {
    if (props.type === 'number') {
      const numValue = parseFloat(value)
      emit('update:modelValue', isNaN(numValue) ? value : numValue)
    } else {
      emit('update:modelValue', value)
    }
  }
})

const baseClasses = 'block w-full rounded-lg border-0 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors'

const sizeClasses = {
  sm: 'py-2 px-3 text-sm',
  md: 'py-3 px-4 text-base',
  lg: 'py-4 px-5 text-lg'
} as const

const inputClasses = computed(() => {
  const classes = [
    baseClasses,
    sizeClasses[props.size], // Правильный доступ к размеру
    {
      'pl-10': props.iconBefore,
      'pr-10': props.iconAfter || props.error,
      'border-red-500 ring-red-500': props.error,
      'border-gray-700': !props.error,
      'opacity-50 cursor-not-allowed': props.disabled,
      'cursor-default': props.readonly
    }
  ]

  return classes
})

const handleFocus = (event: FocusEvent) => {
  focused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  focused.value = false
  emit('blur', event)
}

defineOptions({
  inheritAttrs: false
})
</script>

<style scoped>
input:focus {
  outline: none;
}

input[type="number"] {
  appearance: textfield;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  appearance: none;
  margin: 0;
}
</style>