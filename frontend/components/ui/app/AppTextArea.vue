<!-- components/ui/AppTextarea.vue -->
<template>
  <div class="space-y-2">
    <label v-if="label" :for="textareaId" class="block text-sm font-medium text-gray-300">
      {{ label }}
      <span v-if="required" class="text-red-400">*</span>
    </label>

    <div class="relative">
      <textarea :id="textareaId" v-model="textareaValue" :placeholder="placeholder" :disabled="disabled"
        :readonly="readonly" :rows="rows" :class="textareaClasses" v-bind="$attrs" @focus="handleFocus"
        @blur="handleBlur" />

      <!-- Character Count -->
      <div v-if="maxLength" class="absolute bottom-2 right-2 text-xs text-gray-500">
        {{ textareaValue.length }}/{{ maxLength }}
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="error" class="text-sm text-red-400">{{ error }}</p>

    <!-- Help Text -->
    <p v-if="help && !error" class="text-sm text-gray-500">{{ help }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  error?: string
  help?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  rows?: number
  maxLength?: number
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

const props = withDefaults(defineProps<Props>(), {
  rows: 4,
  resize: 'vertical',
  disabled: false,
  readonly: false,
  required: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const textareaId = `textarea-${Math.random().toString(36).substr(2, 9)}`

const textareaValue = computed({
  get: () => props.modelValue || '',
  set: (value) => {
    if (props.maxLength && value.length > props.maxLength) {
      return
    }
    emit('update:modelValue', value)
  }
})

const resizeClasses = {
  none: 'resize-none',
  vertical: 'resize-y',
  horizontal: 'resize-x',
  both: 'resize'
}

const textareaClasses = computed(() => [
  'block w-full rounded-lg border-0 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors py-3 px-4',
  resizeClasses[props.resize],
  props.error ? 'border-red-500 ring-red-500' : 'border-gray-700',
  props.disabled ? 'opacity-50 cursor-not-allowed' : '',
  props.readonly ? 'cursor-default' : '',
  props.maxLength ? 'pb-8' : ''
])

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}
</script>