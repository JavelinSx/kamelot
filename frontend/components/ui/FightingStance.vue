<!-- components/ui/FightingStance.vue -->
<template>
  <div class="relative w-24 h-32 mx-auto">
    <!-- Фигурка бойца -->
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="relative">
        <!-- Голова -->
        <div class="w-4 h-4 bg-gray-400 rounded-full mx-auto mb-1"></div>

        <!-- Тело -->
        <div class="w-6 h-8 bg-gray-400 rounded-lg mx-auto relative">
          <!-- Руки в боевой стойке -->
          <div class="absolute -left-2 top-1 w-1 h-3 bg-gray-400 rounded transform" :class="leftArmPosition"></div>
          <div class="absolute -right-2 top-1 w-1 h-3 bg-gray-400 rounded transform" :class="rightArmPosition"></div>
        </div>

        <!-- Ноги -->
        <div class="flex justify-center space-x-1 mt-1">
          <div class="w-1 h-6 bg-gray-400 rounded transform" :class="leftLegPosition"></div>
          <div class="w-1 h-6 bg-gray-400 rounded transform" :class="rightLegPosition"></div>
        </div>
      </div>
    </div>

    <!-- Название стойки -->
    <div class="absolute -bottom-6 left-0 right-0 text-center">
      <span class="text-xs text-gray-400">{{ stanceName }}</span>
    </div>

    <!-- Анимация при наведении -->
    <div v-if="isAnimated"
      class="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300">
      <div class="w-full h-full border-2 border-red-600 rounded-lg animate-pulse"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  stance: 'orthodox' | 'southpaw' | 'fighting' | 'guard' | 'ready'
  martialArt?: string
  isAnimated?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isAnimated: false
})

const stanceConfig = {
  orthodox: {
    name: 'Правосторонняя',
    leftArm: 'rotate-12',
    rightArm: '-rotate-12',
    leftLeg: 'translate-x-0',
    rightLeg: 'translate-x-1'
  },
  southpaw: {
    name: 'Левосторонняя',
    leftArm: '-rotate-12',
    rightArm: 'rotate-12',
    leftLeg: 'translate-x-1',
    rightLeg: 'translate-x-0'
  },
  fighting: {
    name: 'Боевая стойка',
    leftArm: 'rotate-45',
    rightArm: '-rotate-45',
    leftLeg: 'translate-x-0',
    rightLeg: 'translate-x-2'
  },
  guard: {
    name: 'Защитная стойка',
    leftArm: 'rotate-90',
    rightArm: '-rotate-90',
    leftLeg: 'translate-x-0',
    rightLeg: 'translate-x-0'
  },
  ready: {
    name: 'Готовность',
    leftArm: 'rotate-0',
    rightArm: 'rotate-0',
    leftLeg: 'translate-x-0',
    rightLeg: 'translate-x-0'
  }
}

const currentStance = computed(() => stanceConfig[props.stance])

const stanceName = computed(() => currentStance.value.name)
const leftArmPosition = computed(() => currentStance.value.leftArm)
const rightArmPosition = computed(() => currentStance.value.rightArm)
const leftLegPosition = computed(() => currentStance.value.leftLeg)
const rightLegPosition = computed(() => currentStance.value.rightLeg)
</script>