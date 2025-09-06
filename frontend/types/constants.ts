// types/constants.ts - Константы и енумы (интегрированная версия)

import type {
  BookingStatus,
  FitnessLevel,
  ScheduleStatus,
  WorkoutDifficulty,
  WorkoutType,
} from "./index";

// ========================================
// ТИПЫ ЦВЕТОВ ДЛЯ NUXT UI
// ========================================

export type BadgeColor =
  | "primary"
  | "red"
  | "orange"
  | "amber"
  | "yellow"
  | "lime"
  | "green"
  | "emerald"
  | "teal"
  | "cyan"
  | "sky"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "fuchsia"
  | "pink"
  | "rose";

// ========================================
// КОНСТАНТЫ ДЛЯ ТРЕНИРОВОК
// ========================================

export const WORKOUT_TYPE_LABELS: Record<WorkoutType, string> = {
  boxing: "Бокс",
  kickboxing: "Кикбоксинг",
  grappling: "Грэпплинг",
  bjj: "Джиу-джитсу",
  wrestling: "Борьба",
  mma: "ММА",
  pankration: "Панкратион",
} as const;

export const WORKOUT_TYPE_COLORS: Record<WorkoutType, BadgeColor> = {
  boxing: "red",
  kickboxing: "orange",
  grappling: "blue",
  bjj: "cyan",
  wrestling: "indigo",
  mma: "purple",
  pankration: "emerald",
} as const;

export const WORKOUT_TYPE_ICONS: Record<WorkoutType, string> = {
  boxing: "i-heroicons-hand-raised",
  kickboxing: "i-heroicons-bolt",
  grappling: "i-heroicons-link",
  bjj: "i-heroicons-arrows-right-left",
  wrestling: "i-heroicons-arrow-path-rounded-square",
  mma: "i-heroicons-shield-exclamation",
  pankration: "i-heroicons-academic-cap",
} as const;

export const WORKOUT_TYPE_EMOJI: Record<WorkoutType, string> = {
  boxing: "🥊",
  kickboxing: "🦵",
  grappling: "🤼",
  bjj: "🥋",
  wrestling: "🤼‍♂️",
  mma: "⚔️",
  pankration: "🏛️",
} as const;

export const WORKOUT_TYPE_ICON_BACKGROUNDS: Record<WorkoutType, string> = {
  boxing: "bg-red-600",
  kickboxing: "bg-orange-600",
  grappling: "bg-cyan-600",
  bjj: "bg-blue-600",
  wrestling: "bg-indigo-600",
  mma: "bg-purple-600",
  pankration: "bg-emerald-600",
} as const;

// ========================================
// КАТЕГОРИИ ЕДИНОБОРСТВ
// ========================================

export const MARTIAL_ARTS_CATEGORIES = {
  striking: {
    label: "Ударные единоборства",
    types: ["boxing", "kickboxing"] as const,
    description:
      "Боевые искусства, основанные на ударной технике руками и ногами",
    icon: "👊",
    color: "red" as BadgeColor,
  },
  grappling: {
    label: "Борьба и грэпплинг",
    types: ["grappling", "bjj", "wrestling"] as const,
    description:
      "Единоборства, основанные на захватах, бросках и борьбе в партере",
    icon: "🤼",
    color: "blue" as BadgeColor,
  },
  mixed: {
    label: "Смешанные единоборства",
    types: ["mma", "pankration"] as const,
    description: "Комбинация ударной техники, борьбы и других дисциплин",
    icon: "🥊",
    color: "purple" as BadgeColor,
  },
} as const;

// Создаем тип для категорий
export type MartialArtsCategoryKey = keyof typeof MARTIAL_ARTS_CATEGORIES;

export const ALL_WORKOUT_TYPES = Object.values(MARTIAL_ARTS_CATEGORIES).flatMap(
  (category) => [...category.types]
);

// ========================================
// УРОВНИ СЛОЖНОСТИ
// ========================================

export const DIFFICULTY_LABELS: Record<WorkoutDifficulty, string> = {
  beginner: "Начальный",
  intermediate: "Средний",
  advanced: "Продвинутый",
} as const;

export const DIFFICULTY_COLORS: Record<WorkoutDifficulty, BadgeColor> = {
  beginner: "green",
  intermediate: "yellow",
  advanced: "red",
} as const;

export const DIFFICULTY_LEVELS = {
  beginner: { label: "Начальный", color: "green" as BadgeColor, stars: 1 },
  intermediate: { label: "Средний", color: "yellow" as BadgeColor, stars: 2 },
  advanced: { label: "Продвинутый", color: "red" as BadgeColor, stars: 3 },
} as const;

// ========================================
// КОНСТАНТЫ ДЛЯ РАСПИСАНИЯ
// ========================================

export const SCHEDULE_STATUS_LABELS: Record<ScheduleStatus, string> = {
  scheduled: "Запланирована",
  in_progress: "Идёт",
  completed: "Завершена",
  cancelled: "Отменена",
  postponed: "Отложена",
} as const;

export const SCHEDULE_STATUS_COLORS: Record<ScheduleStatus, BadgeColor> = {
  scheduled: "blue",
  in_progress: "yellow",
  completed: "green",
  cancelled: "red",
  postponed: "orange",
} as const;

export const SCHEDULE_STATUSES = {
  scheduled: { label: "Запланирована", color: "blue" as BadgeColor },
  in_progress: { label: "Идёт", color: "yellow" as BadgeColor },
  completed: { label: "Завершена", color: "green" as BadgeColor },
  cancelled: { label: "Отменена", color: "red" as BadgeColor },
  postponed: { label: "Отложена", color: "orange" as BadgeColor },
} as const;

// ========================================
// КОНСТАНТЫ ДЛЯ БРОНИРОВАНИЙ
// ========================================

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Ожидает",
  confirmed: "Подтверждено",
  completed: "Завершено",
  cancelled: "Отменено",
  no_show: "Не явился",
  waiting_list: "Лист ожидания",
} as const;

export const BOOKING_STATUS_COLORS: Record<BookingStatus, BadgeColor> = {
  pending: "yellow",
  confirmed: "blue",
  completed: "green",
  cancelled: "red",
  no_show: "orange",
  waiting_list: "emerald",
} as const;

export const BOOKING_STATUSES = {
  pending: { label: "Ожидает", color: "yellow" as BadgeColor },
  confirmed: { label: "Подтверждено", color: "blue" as BadgeColor },
  completed: { label: "Завершено", color: "green" as BadgeColor },
  cancelled: { label: "Отменено", color: "red" as BadgeColor },
  no_show: { label: "Не явился", color: "orange" as BadgeColor },
  waiting_list: { label: "Лист ожидания", color: "gray" as BadgeColor },
} as const;

// ========================================
// КОНСТАНТЫ ДЛЯ ПОЛЬЗОВАТЕЛЕЙ
// ========================================

export const FITNESS_LEVEL_LABELS: Record<FitnessLevel, string> = {
  beginner: "Начинающий",
  intermediate: "Средний",
  advanced: "Продвинутый",
} as const;

export const FITNESS_LEVEL_DESCRIPTIONS: Record<FitnessLevel, string> = {
  beginner: "Новичок в фитнесе",
  intermediate: "Есть опыт тренировок",
  advanced: "Опытный спортсмен",
} as const;

// ========================================
// ВРЕМЕННЫЕ КОНСТАНТЫ
// ========================================

export const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export const DAYS_OF_WEEK_LABELS: Record<
  (typeof DAYS_OF_WEEK)[number],
  string
> = {
  monday: "Понедельник",
  tuesday: "Вторник",
  wednesday: "Среда",
  thursday: "Четверг",
  friday: "Пятница",
  saturday: "Суббота",
  sunday: "Воскресенье",
} as const;

export const DAYS_OF_WEEK_SHORT: Record<(typeof DAYS_OF_WEEK)[number], string> =
  {
    monday: "Пн",
    tuesday: "Вт",
    wednesday: "Ср",
    thursday: "Чт",
    friday: "Пт",
    saturday: "Сб",
    sunday: "Вс",
  } as const;

export const MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
] as const;

export const MONTHS_LABELS: Record<(typeof MONTHS)[number], string> = {
  january: "Январь",
  february: "Февраль",
  march: "Март",
  april: "Апрель",
  may: "Май",
  june: "Июнь",
  july: "Июль",
  august: "Август",
  september: "Сентябрь",
  october: "Октябрь",
  november: "Ноябрь",
  december: "Декабрь",
} as const;

// ========================================
// БИЗНЕС КОНСТАНТЫ
// ========================================

export const BUSINESS_HOURS = {
  start: "08:00",
  end: "22:00",
  workingDays: [1, 2, 3, 4, 5, 6], // Понедельник-Суббота
} as const;

export const TIME_SLOTS = {
  duration: 60, // минут
  breakBetween: 15, // минут между тренировками
} as const;

export const BOOKING_RULES = {
  cancellationDeadline: 2, // часов до начала
  maxAdvanceBooking: 30, // дней вперёд
  maxBookingsPerUser: 5, // активных бронирований
} as const;

// ========================================
// UI КОНСТАНТЫ
// ========================================

export const NOTIFICATION_TIMEOUT = {
  success: 5000,
  info: 5000,
  warning: 8000,
  error: 10000,
} as const;

export const PAGINATION_LIMITS = [10, 20, 50, 100] as const;

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 20,
} as const;

// ========================================
// ВАЛИДАЦИЯ
// ========================================

export const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
  },
  name: {
    minLength: 2,
    maxLength: 50,
  },
} as const;

// ========================================
// ФАЙЛЫ
// ========================================

export const FILE_UPLOAD_LIMITS = {
  avatar: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
  },
  document: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
  },
} as const;

// ========================================
// РОЛИ И РАЗРЕШЕНИЯ
// ========================================

export const USER_ROLES = {
  user: "user",
  trainer: "trainer",
  admin: "admin",
} as const;

export const PERMISSIONS = {
  CREATE_SCHEDULE: "create_schedule",
  EDIT_SCHEDULE: "edit_schedule",
  DELETE_SCHEDULE: "delete_schedule",
  MANAGE_USERS: "manage_users",
  VIEW_ANALYTICS: "view_analytics",
} as const;

export const ROLE_PERMISSIONS: Record<keyof typeof USER_ROLES, string[]> = {
  user: [],
  trainer: ["create_schedule", "edit_schedule"],
  admin: [
    "create_schedule",
    "edit_schedule",
    "delete_schedule",
    "manage_users",
    "view_analytics",
  ],
} as const;
