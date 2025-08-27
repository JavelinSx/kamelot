<template>
  <div class="trainer-sections-container">
    <!-- Секция для каждого тренера -->
    <TrainerFullSection v-for="(trainer, index) in trainers" :key="trainer.id" :trainer="trainer" :current-index="index"
      :total-trainers="trainers.length" :is-even="index % 2 === 1" @view-profile="handleViewProfile"
      @book-session="handleBookSession" @next-trainer="scrollToTrainer(index + 1)"
      @previous-trainer="scrollToTrainer(index - 1)" />
  </div>
</template>

<script setup lang="ts">
import type { Trainer } from '~/types';

interface Props {
  trainers: Trainer[]
}

const props = defineProps<Props>()

interface Emits {
  viewProfile: [trainer: Trainer]
  bookSession: [trainer: Trainer]
}

const emit = defineEmits<Emits>()

// Методы
const handleViewProfile = (trainer: Trainer) => {
  emit('viewProfile', trainer)
}

const handleBookSession = (trainer: Trainer) => {
  emit('bookSession', trainer)
}

const scrollToTrainer = (index: number) => {
  if (index < 0 || index >= props.trainers.length) return

  const sections = document.querySelectorAll('.trainer-full-section')
  if (sections[index]) {
    sections[index].scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
}

// Для использования в других компонентах
defineExpose({
  scrollToTrainer
})
</script>

<style scoped>
.trainer-sections-container {
  position: relative;
}

/* Убираем стандартные отступы между секциями */
.trainer-sections-container>*+* {
  margin-top: 0;
}
</style>