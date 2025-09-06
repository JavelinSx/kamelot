<!-- components/profile/ProfileForm.vue -->
<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Avatar Section -->
    <div class="flex items-center space-x-6">
      <div class="relative">
        <UAvatar :src="formData.avatar || '/default-avatar.png'" :alt="`${formData.firstName} ${formData.lastName}`"
          size="2xl" class="ring-4 ring-gray-700" />
        <UButton v-if="!readonly" @click="triggerFileUpload" icon="i-heroicons-camera" color="red" variant="solid"
          size="sm" class="absolute bottom-0 right-0" />
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
      <UFormGroup label="Имя" required>
        <UInput v-model="formData.firstName" type="text" placeholder="Введите имя" :disabled="readonly"
          :error="!!errors.firstName" />
        <template v-if="errors.firstName" #error>
          <span class="text-red-400 text-sm">{{ errors.firstName }}</span>
        </template>
      </UFormGroup>

      <UFormGroup label="Фамилия" required>
        <UInput v-model="formData.lastName" type="text" placeholder="Введите фамилию" :disabled="readonly"
          :error="!!errors.lastName" />
        <template v-if="errors.lastName" #error>
          <span class="text-red-400 text-sm">{{ errors.lastName }}</span>
        </template>
      </UFormGroup>

      <UFormGroup label="Email" required>
        <UInput v-model="formData.email" type="email" placeholder="example@mail.com" :disabled="readonly"
          :error="!!errors.email" />
        <template v-if="errors.email" #error>
          <span class="text-red-400 text-sm">{{ errors.email }}</span>
        </template>
      </UFormGroup>

      <UFormGroup label="Телефон">
        <UInput v-model="formData.phone" type="tel" placeholder="+7 (999) 123-45-67" :disabled="readonly"
          :error="!!errors.phone" />
        <template v-if="errors.phone" #error>
          <span class="text-red-400 text-sm">{{ errors.phone }}</span>
        </template>
      </UFormGroup>

      <UFormGroup label="Дата рождения">
        <UInput v-model="formData.dateOfBirth" type="date" :disabled="readonly" :error="!!errors.dateOfBirth" />
        <template v-if="errors.dateOfBirth" #error>
          <span class="text-red-400 text-sm">{{ errors.dateOfBirth }}</span>
        </template>
      </UFormGroup>

      <UFormGroup label="Пол">
        <USelectMenu v-model="formData.gender" :options="genderOptions" placeholder="Выберите пол"
          :disabled="readonly" />
      </UFormGroup>
    </div>

    <!-- Fitness Information -->
    <div class="space-y-6">
      <h4 class="text-white font-semibold text-lg border-b border-gray-800 pb-2">
        Информация о тренировках
      </h4>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UFormGroup label="Уровень подготовки" required>
          <USelectMenu v-model="formData.fitnessLevel" :options="fitnessLevelOptions" placeholder="Выберите уровень"
            :disabled="readonly" :error="!!errors.fitnessLevel" />
          <template v-if="errors.fitnessLevel" #error>
            <span class="text-red-400 text-sm">{{ errors.fitnessLevel }}</span>
          </template>
        </UFormGroup>

        <div class="md:col-span-2">
          <UFormGroup label="Цели тренировок">
            <UTextarea v-model="formData.goals" :rows="3" placeholder="Опишите ваши цели в боевых искусствах..."
              :disabled="readonly" :maxlength="500" />
            <template #hint>
              <div class="flex justify-between text-xs text-gray-400">
                <span>Опишите, чего хотите достичь</span>
                <span>{{ formData.goals?.length || 0 }}/500</span>
              </div>
            </template>
          </UFormGroup>
        </div>
      </div>
    </div>

    <!-- Favorite Workout Types -->
    <div class="space-y-4">
      <h4 class="text-white font-semibold text-lg border-b border-gray-800 pb-2">
        Интересующие единоборства
      </h4>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <div v-for="(label, key) in WORKOUT_TYPE_LABELS" :key="key" class="group">
          <UCheckbox v-model="formData.preferredWorkoutTypes" :value="key" :disabled="readonly" :label="label"
            class="text-sm" />
        </div>
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
import type { FitnessLevel, User } from '@/types'
import { WORKOUT_TYPE_LABELS } from '@/types/constants'

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

// Form data (используем только поля из актуального типа User)
const formData = reactive({
  firstName: props.user.firstName || '',
  lastName: props.user.lastName || '',
  email: props.user.email || '',
  phone: props.user.phone || '',
  dateOfBirth: props.user.dateOfBirth || '',
  gender: props.user.gender || '',
  fitnessLevel: props.user.fitnessLevel || 'beginner' as FitnessLevel,
  avatar: props.user.avatar || '',
  // Расширенные поля (не из User, но полезные для формы)
  goals: '',
  preferredWorkoutTypes: [] as string[]
})

// Form validation
const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  fitnessLevel: ''
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
    // Подготавливаем данные только с полями из типа User
    const userData: Partial<User> = {}

    // Проверяем изменения только для полей User
    const userFields: (keyof User)[] = [
      'firstName', 'lastName', 'email', 'phone',
      'dateOfBirth', 'gender', 'fitnessLevel', 'avatar'
    ]

    userFields.forEach(field => {
      const formValue = formData[field as keyof typeof formData]
      const userValue = props.user[field]

      if (formValue !== userValue) {
        (userData as any)[field] = formValue || undefined
      }
    })

    // Можем добавить дополнительные поля как метаданные
    const submitData = {
      ...userData,
      // Дополнительные поля для расширенной функциональности
      ...(formData.goals && { goals: formData.goals }),
      ...(formData.preferredWorkoutTypes.length > 0 && {
        preferredWorkoutTypes: formData.preferredWorkoutTypes
      })
    }

    emit('submit', submitData)
  }
}

const resetForm = () => {
  // Сброс к исходным значениям пользователя
  formData.firstName = props.user.firstName || ''
  formData.lastName = props.user.lastName || ''
  formData.email = props.user.email || ''
  formData.phone = props.user.phone || ''
  formData.dateOfBirth = props.user.dateOfBirth || ''
  formData.gender = props.user.gender || ''
  formData.fitnessLevel = props.user.fitnessLevel || 'beginner'
  formData.avatar = props.user.avatar || ''

  // Сброс расширенных полей
  formData.goals = ''
  formData.preferredWorkoutTypes = []

  // Очистка ошибок
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

<style scoped>
/* Form styles specific to profile form */
.form-checkbox {
  @apply rounded border-gray-300 text-red-600 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50;
}
</style>