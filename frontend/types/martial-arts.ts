// utils/martial-arts.ts - ЦЕНТРАЛЬНОЕ МЕСТО ДЛЯ ВСЕХ УТИЛИТ ЕДИНОБОРСТВ
import type { WorkoutType } from "~/types";

// Типы цветов для UBadge в NuxtUI
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
  | "rose"
  | "gray"
  | "white"
  | "black";

// ========================================
// ОСНОВНЫЕ КОНСТАНТЫ (ТОЛЬКО ТО ЧТО НУЖНО)
// ========================================

export const MARTIAL_ARTS_CATEGORIES = {
  // Ударные единоборства
  striking: {
    label: "Ударные единоборства",
    types: ["boxing", "kickboxing"] as const,
    description:
      "Боевые искусства, основанные на ударной технике руками и ногами",
    icon: "👊",
    color: "red" as BadgeColor,
  },

  // Борьба и грэпплинг
  grappling: {
    label: "Борьба и грэпплинг",
    types: ["grappling", "bjj", "wrestling"] as const,
    description:
      "Единоборства, основанные на захватах, бросках и борьбе в партере",
    icon: "🤼",
    color: "blue" as BadgeColor,
  },

  // Смешанные единоборства
  mixed: {
    label: "Смешанные единоборства",
    types: ["mma", "pankration"] as const,
    description: "Комбинация ударной техники, борьбы и других дисциплин",
    icon: "🥊",
    color: "purple" as BadgeColor,
  },
} as const;

// Плоский список всех типов
export const ALL_WORKOUT_TYPES = Object.values(MARTIAL_ARTS_CATEGORIES).flatMap(
  (category) => category.types
);

// Маппинг типов к лейблам
export const WORKOUT_TYPE_LABELS: Record<WorkoutType, string> = {
  boxing: "Бокс",
  kickboxing: "Кикбоксинг",
  grappling: "Грэпплинг",
  bjj: "БЖЖ",
  wrestling: "Борьба",
  mma: "ММА",
  pankration: "Панкратион",
};

// Маппинг типов к цветам категорий (ИСПРАВЛЕНО - возвращает BadgeColor)
export const WORKOUT_TYPE_COLORS: Record<WorkoutType, BadgeColor> = {
  boxing: "red",
  kickboxing: "red",
  grappling: "blue",
  bjj: "blue",
  wrestling: "blue",
  mma: "purple",
  pankration: "purple",
};

// Уровни сложности
export const DIFFICULTY_LEVELS = {
  easy: { label: "Легкий", color: "green" as BadgeColor },
  medium: { label: "Средний", color: "yellow" as BadgeColor },
  hard: { label: "Сложный", color: "red" as BadgeColor },
} as const;

// Статусы расписания
export const SCHEDULE_STATUSES = {
  scheduled: { label: "Запланирована", color: "blue" as BadgeColor },
  in_progress: { label: "Идет", color: "yellow" as BadgeColor },
  completed: { label: "Завершена", color: "green" as BadgeColor },
  cancelled: { label: "Отменена", color: "red" as BadgeColor },
} as const;

/**
 * Получить цвет для типа единоборства (гибкая версия)
 */
export const getMartialArtColor = (type: string): BadgeColor => {
  return WORKOUT_TYPE_COLORS[type as WorkoutType] || "gray";
};

/**
 * Получить лейбл для типа тренировки (гибкая версия)
 */
export const getWorkoutTypeLabel = (type: string): string => {
  return WORKOUT_TYPE_LABELS[type as WorkoutType] || type;
};

/**
 * Получить лейбл для уровня сложности
 */
export const getDifficultyLabel = (difficulty: string): string => {
  return (
    DIFFICULTY_LEVELS[difficulty as keyof typeof DIFFICULTY_LEVELS]?.label ||
    difficulty
  );
};

/**
 * Получить цвет для уровня сложности
 */
export const getDifficultyColor = (difficulty: string): BadgeColor => {
  return (
    DIFFICULTY_LEVELS[difficulty as keyof typeof DIFFICULTY_LEVELS]?.color ||
    "gray"
  );
};

/**
 * Получить лейбл для статуса расписания
 */
export const getStatusLabel = (status: string): string => {
  return (
    SCHEDULE_STATUSES[status as keyof typeof SCHEDULE_STATUSES]?.label || status
  );
};

/**
 * Получить цвет для статуса расписания
 */
export const getStatusColor = (status: string): BadgeColor => {
  return (
    SCHEDULE_STATUSES[status as keyof typeof SCHEDULE_STATUSES]?.color || "gray"
  );
};

/**
 * Получить категорию для типа тренировки
 */
export const getCategoryForWorkoutType = (type: WorkoutType) => {
  // Просто проверяем в каждой категории напрямую
  if (MARTIAL_ARTS_CATEGORIES.striking.types.includes(type as any)) {
    return {
      key: "striking",
      ...MARTIAL_ARTS_CATEGORIES.striking,
    };
  }

  if (MARTIAL_ARTS_CATEGORIES.grappling.types.includes(type as any)) {
    return {
      key: "grappling",
      ...MARTIAL_ARTS_CATEGORIES.grappling,
    };
  }

  if (MARTIAL_ARTS_CATEGORIES.mixed.types.includes(type as any)) {
    return {
      key: "mixed",
      ...MARTIAL_ARTS_CATEGORIES.mixed,
    };
  }

  return null;
};

/**
 * Получить все типы тренировок по категории
 */
export const getWorkoutTypesByCategory = (
  categoryKey: keyof typeof MARTIAL_ARTS_CATEGORIES
) => {
  return MARTIAL_ARTS_CATEGORIES[categoryKey]?.types || [];
};

/**
 * Проверить, относится ли тип к ударным единоборствам
 */
export const isStrikingArt = (type: WorkoutType): boolean => {
  return MARTIAL_ARTS_CATEGORIES.striking.types.includes(type as any);
};

/**
 * Проверить, относится ли тип к борьбе/грэпплингу
 */
export const isGrapplingArt = (type: WorkoutType): boolean => {
  return MARTIAL_ARTS_CATEGORIES.grappling.types.includes(type as any);
};

/**
 * Проверить, относится ли тип к смешанным единоборствам
 */
export const isMixedArt = (type: WorkoutType): boolean => {
  return MARTIAL_ARTS_CATEGORIES.mixed.types.includes(type as any);
};

/**
 * Получить категорию для типа тренировки (возвращает ключ категории)
 */
export const getMartialArtsCategory = (
  workoutType: WorkoutType
): keyof typeof MARTIAL_ARTS_CATEGORIES => {
  // Создаем мапу для быстрого поиска
  const categoryMap: Record<WorkoutType, keyof typeof MARTIAL_ARTS_CATEGORIES> =
    {
      // Striking
      boxing: "striking",
      kickboxing: "striking",
      // Grappling
      grappling: "grappling",
      bjj: "grappling",
      wrestling: "grappling",
      // Mixed
      mma: "mixed",
      pankration: "mixed",
    };

  return categoryMap[workoutType] || "striking"; // fallback к striking
};

/**
 * Получить данные категории по её ключу
 */
export const getCategoryData = (
  categoryKey: keyof typeof MARTIAL_ARTS_CATEGORIES
) => {
  return MARTIAL_ARTS_CATEGORIES[categoryKey];
};

/**
 * Получить иконку категории для типа тренировки
 */
export const getCategoryIcon = (workoutType: WorkoutType): string => {
  const category = getMartialArtsCategory(workoutType);
  return MARTIAL_ARTS_CATEGORIES[category].icon;
};

/**
 * Получить все типы тренировок в виде плоского массива
 */
export const getAllWorkoutTypes = (): WorkoutType[] => {
  return ALL_WORKOUT_TYPES as WorkoutType[];
};

// ========================================
// УТИЛИТЫ ДЛЯ UI КОМПОНЕНТОВ
// ========================================

// Типы цветов для UProgress (ограниченный набор)
export type ProgressColor =
  | "blue"
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
  | "indigo"
  | "violet"
  | "purple"
  | "fuchsia"
  | "pink"
  | "rose";

/**
 * Получить совместимый цвет для UProgress
 * UProgress поддерживает не все цвета BadgeColor, поэтому делаем маппинг
 */
export const getProgressColor = (color: BadgeColor): ProgressColor => {
  const progressColorMap: Record<BadgeColor, ProgressColor> = {
    primary: "primary",
    red: "red",
    orange: "orange",
    amber: "amber",
    yellow: "yellow",
    lime: "lime",
    green: "green",
    emerald: "emerald",
    teal: "teal",
    cyan: "cyan",
    sky: "sky",
    blue: "blue",
    indigo: "indigo",
    violet: "violet",
    purple: "purple",
    fuchsia: "fuchsia",
    pink: "pink",
    rose: "rose",
    gray: "blue", // gray не поддерживается, используем blue
    white: "blue", // white не поддерживается, используем blue
    black: "blue", // black не поддерживается, используем blue
  };

  return progressColorMap[color] || "blue";
};

/**
 * Получить CSS классы для иконок по цвету
 */
export const getIconColorClass = (color: BadgeColor): string => {
  const colors: Record<BadgeColor, string> = {
    primary: "text-blue-400",
    red: "text-red-400",
    orange: "text-orange-400",
    amber: "text-amber-400",
    yellow: "text-yellow-400",
    lime: "text-lime-400",
    green: "text-green-400",
    emerald: "text-emerald-400",
    teal: "text-teal-400",
    cyan: "text-cyan-400",
    sky: "text-sky-400",
    blue: "text-blue-400",
    indigo: "text-indigo-400",
    violet: "text-violet-400",
    purple: "text-purple-400",
    fuchsia: "text-fuchsia-400",
    pink: "text-pink-400",
    rose: "text-rose-400",
    gray: "text-gray-400",
    white: "text-white",
    black: "text-black",
  };
  return colors[color] || "text-blue-400";
};

/**
 * Получить CSS классы для фона иконок по цвету
 */
export const getIconBackgroundClass = (color: BadgeColor): string => {
  const colors: Record<BadgeColor, string> = {
    primary: "bg-blue-500/10",
    red: "bg-red-500/10",
    orange: "bg-orange-500/10",
    amber: "bg-amber-500/10",
    yellow: "bg-yellow-500/10",
    lime: "bg-lime-500/10",
    green: "bg-green-500/10",
    emerald: "bg-emerald-500/10",
    teal: "bg-teal-500/10",
    cyan: "bg-cyan-500/10",
    sky: "bg-sky-500/10",
    blue: "bg-blue-500/10",
    indigo: "bg-indigo-500/10",
    violet: "bg-violet-500/10",
    purple: "bg-purple-500/10",
    fuchsia: "bg-fuchsia-500/10",
    pink: "bg-pink-500/10",
    rose: "bg-rose-500/10",
    gray: "bg-gray-500/10",
    white: "bg-white/10",
    black: "bg-black/10",
  };
  return colors[color] || "bg-blue-500/10";
};
