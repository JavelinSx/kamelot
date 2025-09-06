<!-- components/ui/AppTabs.vue -->
<template>
  <div>
    <!-- Tab Navigation -->
    <div class="border-b border-gray-800">
      <nav class="flex space-x-8">
        <button v-for="tab in tabs" :key="tab.key" @click="selectTab(tab.key)" :disabled="tab.disabled"
          :class="getTabClasses(tab)">
          <component v-if="tab.icon" :is="tab.icon" class="w-4 h-4 mr-2" />
          {{ tab.label }}
          <span v-if="tab.badge" class="ml-2 px-2 py-0.5 bg-red-600 text-white text-xs rounded-full">
            {{ tab.badge }}
          </span>
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="mt-6">
      <slot :active-tab="activeTab" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TabItem } from '@/types';

interface Props {
  tabs: TabItem[]
  modelValue?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [key: string]
}>()

const activeTab = computed({
  get: () => props.modelValue || props.tabs[0]?.key || '',
  set: (value) => emit('update:modelValue', value)
})

const selectTab = (key: string) => {
  const tab = props.tabs.find(t => t.key === key)
  if (tab && !tab.disabled) {
    activeTab.value = key
    emit('change', key)
  }
}

const getTabClasses = (tab: TabItem) => [
  'flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors',
  tab.key === activeTab.value
    ? 'border-red-500 text-red-400'
    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600',
  tab.disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer'
]
</script>