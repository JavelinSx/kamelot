<!-- components/ui/AppSelect.vue -->
<template>
  <div class="space-y-2">
    <label v-if="label" :for="selectId" class="block text-sm font-medium text-gray-300">
      {{ label }}
      <span v-if="required" class="text-red-400">*</span>
    </label>

    <div class="relative">
      <select :id="selectId" v-model="selectValue" :disabled="disabled" :class="selectClasses" @change="handleChange">
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option v-for="option in options" :key="option.value" :value="option.value" :disabled="option.disabled">
          {{ option.label }}
        </option>
      </select>

      <!-- Dropdown Icon -->
      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
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
import type { SelectOption } from '@/types'

interface Props {
  modelValue?: string | number
  options: SelectOption[]
  label?: string
  placeholder?: string
  error?: string
  help?: string
  disabled?: boolean
  required?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  disabled: false,
  required: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [value: string | number]
}>()

const selectId = `select-${Math.random().toString(36).substr(2, 9)}`

const selectValue = computed({
  get: () => props.modelValue || '',
  set: (value) => emit('update:modelValue', value)
})

const sizeClasses = {
  sm: 'py-2 px-3 text-sm',
  md: 'py-3 px-4 text-base',
  lg: 'py-4 px-5 text-lg'
}

const selectClasses = computed(() => [
  'block w-full rounded-lg border-0 bg-gray-800 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors appearance-none pr-10',
  sizeClasses[props.size],
  props.error ? 'border-red-500 ring-red-500' : 'border-gray-700',
  props.disabled ? 'opacity-50 cursor-not-allowed' : ''
])

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('change', target.value)
}
</script>