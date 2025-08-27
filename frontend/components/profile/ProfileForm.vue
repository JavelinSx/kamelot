<!-- components/profile/ProfileForm.vue -->
<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Avatar Section -->
    <div class="flex items-center space-x-6">
      <div class="relative">
        <img :src="formData.avatar || '/default-avatar.png'" :alt="`${formData.firstName} ${formData.lastName}`"
          class="w-24 h-24 rounded-full border-4 border-gray-700 object-cover">
        <button v-if="!readonly" type="button" @click="triggerFileUpload"
          class="absolute bottom-0 right-0 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleAvatarUpload">
      </div>

      <div>
        <h3 class="text-white text-lg font-semibold">Фото профиля</h3>
        <p class="text-gray-400 text-sm">Загрузите фото для вашего профиля</p>
        <p class="text-gray-500 text-xs mt-1">JPG, PNG до 5МБ</p>
      </div>
    </div>

    <!-- Personal Information -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <AppInput v-model="formData.firstName" label="Имя" type="text" required :readonly="readonly"
        :error="errors.firstName" />

      <AppInput v-model="formData.lastName" label="Фамилия" type="text" required :readonly="readonly"
        :error="errors.lastName" />

      <AppInput v-model="formData.email" label="Email" type="email" required :readonly="readonly"
        :error="errors.email" />

      <AppInput v-model="formData.phone" label="Телефон" type="tel" :readonly="readonly" :error="errors.phone"
        placeholder="+7 (999) 123-45-67" />

      <AppInput v-model="formData.dateOfBirth" label="Дата рождения" type="date" :readonly="readonly"
        :error="errors.dateOfBirth" />

      <AppSelect v-model="formData.gender" label="Пол" :options="genderOptions" :disabled="readonly"
        :error="errors.gender" />
    </div>

    <!-- Fitness Information -->
    <div class="space-y-6">
      <h4 class="text-white font-semibold text-lg border-b border-gray-800 pb-2">
        Информация о тренировках
      </h4>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AppSelect v-model="formData.fitnessLevel" label="Уровень подготовки" :options="fitnessLevelOptions" required
          :disabled="readonly" :error="errors.fitnessLevel" />

        <div class="md:col-span-2">
          <AppTextarea v-model="formData.fitnessGoals" label="Цели тренировок" :rows="3" :readonly="readonly"
            :error="errors.fitnessGoals" placeholder="Опишите ваши цели в боевых искусствах..." />
        </div>
      </div>
    </div>

    <!-- Favorite Martial Arts -->
    <div class="space-y-4">
      <h4 class="text-white font-semibold text-lg border-b border-gray-800 pb-2">
        Любимые единоборства
      </h4>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <label v-for="(martialArt, key) in WORKOUT_TYPES" :key="key"
          class="flex items-center space-x-2 cursor-pointer group">
          <input v-model="formData.favoriteMartialArts" :value="key" type="checkbox" class="form-checkbox"
            :disabled="readonly">
          <span class="text-gray-300 text-sm group-hover:text-white transition-colors">
            {{ martialArt }}
          </span>
        </label>
      </div>
    </div>

    <!-- Actions -->
    <div v-if="!readonly" class="flex justify-end space-x-4 pt-6 border-t border-gray-800">
      <UButton type="button" variant="outline" @click="resetForm" :disabled="loading">
        Сбросить
      </UButton>
      <UButton type="submit" color="red" :loading="loading" :disabled="!isFormValid">
        Сохранить изменения
      </UButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { User } from '@/types'
import { WORKOUT_TYPES } from '@/types'

interface Props {
  user: User
  loading?: boolean
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  readonly: false
})

const emit = defineEmits<{
  submit: [data: Partial<User>]
  avatarChange: [file: File]
}>()

const fileInput = ref<HTMLInputElement>()

// Form data
const formData = reactive({
  firstName: props.user.firstName || '',
  lastName: props.user.lastName || '',
  email: props.user.email || '',
  phone: props.user.phone || '',
  dateOfBirth: props.user.dateOfBirth || '',
  gender: props.user.gender || '',
  fitnessLevel: props.user.fitnessLevel || 'beginner',
  fitnessGoals: props.user.fitnessGoals || '',
  avatar: props.user.avatar || '',
  favoriteMartialArts: props.user.favoriteMartialArts || []
})

// Form validation
const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: '',
  fitnessLevel: '',
  fitnessGoals: ''
})

// Options
const genderOptions = [
  { label: 'Не указан', value: '' },
  { label: 'Мужской', value: 'male' },
  { label: 'Женский', value: 'female' },
  { label: 'Другой', value: 'other' }
]

const fitnessLevelOptions = [
  { label: 'Начинающий', value: 'beginner' },
  { label: 'Средний уровень', value: 'intermediate' },
  { label: 'Продвинутый', value: 'advanced' }
]

// Computed
const isFormValid = computed(() => {
  return formData.firstName.trim() &&
    formData.lastName.trim() &&
    formData.email.trim() &&
    formData.fitnessLevel &&
    !Object.values(errors).some(error => error)
})

// Methods
const validateForm = () => {
  // Reset errors
  Object.keys(errors).forEach(key => (errors as any)[key] = '')

  // Validate required fields
  if (!formData.firstName.trim()) {
    errors.firstName = 'Имя обязательно для заполнения'
  }

  if (!formData.lastName.trim()) {
    errors.lastName = 'Фамилия обязательна для заполнения'
  }

  if (!formData.email.trim()) {
    errors.email = 'Email обязателен для заполнения'
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Некорректный формат email'
  }

  if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
    errors.phone = 'Некорректный формат телефона'
  }

  return !Object.values(errors).some(error => error)
}

const handleSubmit = () => {
  if (validateForm()) {
    const changedData = {}

    // Only include changed fields
    Object.entries(formData).forEach(([key, value]) => {
      const typedKey = key as keyof typeof formData
      const userValue = props.user[typedKey as keyof User]

      if (value !== userValue) {
        // Используем type assertion для присвоения
        (changedData as any)[key] = value
      }
    })

    emit('submit', changedData)
  }
}

const resetForm = () => {
  Object.assign(formData, {
    firstName: props.user.firstName || '',
    lastName: props.user.lastName || '',
    email: props.user.email || '',
    phone: props.user.phone || '',
    dateOfBirth: props.user.dateOfBirth || '',
    gender: props.user.gender || '',
    fitnessLevel: props.user.fitnessLevel || 'beginner',
    fitnessGoals: props.user.fitnessGoals || '',
    avatar: props.user.avatar || '',
    favoriteMartialArts: props.user.favoriteMartialArts || []
  })

  Object.keys(errors).forEach(key => (errors as any)[key] = '')
}

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleAvatarUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    // Validate file
    if (file.size > 5 * 1024 * 1024) { // 5MB
      alert('Файл слишком большой. Максимальный размер: 5МБ')
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('Можно загружать только изображения')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      formData.avatar = e.target?.result as string
    }
    reader.readAsDataURL(file)

    emit('avatarChange', file)
  }
}

// Watch for user changes
watch(() => props.user, (newUser) => {
  if (newUser) {
    resetForm()
  }
}, { deep: true })
</script>