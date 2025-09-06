// utils/martial-arts.ts - Централизованные утилиты для всех типов данных

import type {
  FitnessLevel,
  ScheduleStatus,
  WorkoutDifficulty,
  WorkoutType,
} from "@/types";
import type { BadgeColor } from "@/types/constants";
import {
  DIFFICULTY_COLORS,
  DIFFICULTY_LABELS,
  FITNESS_LEVEL_LABELS,
  SCHEDULE_STATUS_COLORS,
  SCHEDULE_STATUS_LABELS,
  WORKOUT_TYPE_COLORS,
  WORKOUT_TYPE_EMOJI,
  WORKOUT_TYPE_ICON_BACKGROUNDS,
  WORKOUT_TYPE_ICONS,
  WORKOUT_TYPE_LABELS,
} from "@/types/constants";

// ========================================
// ТИПЫ ТРЕНИРОВОК
// ========================================

/**
 * Получить лейбл для типа тренировки
 */
export const getWorkoutTypeLabel = (type: string): string => {
  return WORKOUT_TYPE_LABELS[type as WorkoutType] || type;
};

/**
 * Получить цвет для типа единоборства
 */
export const getWorkoutTypeColor = (type: string): BadgeColor => {
  return WORKOUT_TYPE_COLORS[type as WorkoutType] || "gray";
};

/**
 * Получить иконку Heroicons для типа тренировки
 */
export const getWorkoutTypeIcon = (type: string): string => {
  return WORKOUT_TYPE_ICONS[type as WorkoutType] || "i-heroicons-academic-cap";
};

/**
 * Получить emoji для типа тренировки
 */
export const getWorkoutTypeEmoji = (type: string): string => {
  return WORKOUT_TYPE_EMOJI[type as WorkoutType] || "🥋";
};

/**
 * Получить CSS класс для фона иконки типа тренировки
 */
export const getWorkoutTypeIconBg = (type: string): string => {
  return WORKOUT_TYPE_ICON_BACKGROUNDS[type as WorkoutType] || "bg-gray-600";
};

// ========================================
// СЛОЖНОСТЬ ТРЕНИРОВОК
// ========================================

/**
 * Получить лейбл для уровня сложности
 */
export const getDifficultyLabel = (difficulty: string): string => {
  return DIFFICULTY_LABELS[difficulty as WorkoutDifficulty] || difficulty;
};

/**
 * Получить цвет для уровня сложности
 */
export const getDifficultyColor = (difficulty: string): BadgeColor => {
  return DIFFICULTY_COLORS[difficulty as WorkoutDifficulty] || "gray";
};

// ========================================
// СТАТУСЫ РАСПИСАНИЯ
// ========================================

/**
 * Получить лейбл для статуса расписания
 */
export const getStatusLabel = (status: string): string => {
  return SCHEDULE_STATUS_LABELS[status as ScheduleStatus] || status;
};

/**
 * Получить цвет для статуса расписания
 */
export const getStatusColor = (status: string): BadgeColor => {
  return SCHEDULE_STATUS_COLORS[status as ScheduleStatus] || "gray";
};

// ========================================
// УРОВНИ ФИЗИЧЕСКОЙ ПОДГОТОВКИ
// ========================================

/**
 * Получить лейбл для уровня физической подготовки
 */
export const getFitnessLevelLabel = (level: string): string => {
  return FITNESS_LEVEL_LABELS[level as FitnessLevel] || level;
};

/**
 * Получить цвет для уровня физической подготовки
 */
export const getFitnessLevelColor = (level: string): BadgeColor => {
  const colors = {
    beginner: "green" as BadgeColor,
    intermediate: "yellow" as BadgeColor,
    advanced: "red" as BadgeColor,
  };
  return colors[level as FitnessLevel] || "gray";
};

// ========================================
// РЕЙТИНГИ И ПРОЦЕНТЫ
// ========================================

/**
 * Получить цвет на основе рейтинга (1-5 звезд)
 */
export const getRatingColor = (rating: number): BadgeColor => {
  if (rating >= 4.5) return "green";
  if (rating >= 4.0) return "lime";
  if (rating >= 3.5) return "yellow";
  if (rating >= 3.0) return "orange";
  return "red";
};

/**
 * Получить цвет на основе процентного значения
 */
export const getPercentageColor = (percentage: number): BadgeColor => {
  if (percentage >= 90) return "green";
  if (percentage >= 75) return "lime";
  if (percentage >= 60) return "yellow";
  if (percentage >= 40) return "orange";
  return "red";
};

// ========================================
// БЕЗОПАСНАЯ ТИПИЗАЦИЯ
// ========================================

/**
 * Безопасное приведение к BadgeColor с fallback
 */
export const ensureBadgeColor = (
  color: any,
  fallback: BadgeColor = "emerald"
): BadgeColor => {
  const validColors: BadgeColor[] = [
    "primary",
    "red",
    "orange",
    "amber",
    "yellow",
    "lime",
    "green",
    "emerald",
    "teal",
    "cyan",
    "sky",
    "blue",
    "indigo",
    "violet",
    "purple",
    "fuchsia",
    "pink",
    "rose",
  ];
  return validColors.includes(color) ? color : fallback;
};

// ========================================
// КАТЕГОРИИ ЕДИНОБОРСТВ
// ========================================

const CATEGORY_DEFINITIONS = {
  striking: {
    label: "Ударные единоборства",
    types: ["boxing", "kickboxing"] as WorkoutType[],
    description:
      "Боевые искусства, основанные на ударной технике руками и ногами",
    icon: "👊",
    color: "red" as BadgeColor,
  },
  grappling: {
    label: "Борьба и грэпплинг",
    types: ["grappling", "bjj", "wrestling"] as WorkoutType[],
    description:
      "Единоборства, основанные на захватах, бросках и борьбе в партере",
    icon: "🤼",
    color: "blue" as BadgeColor,
  },
  mixed: {
    label: "Смешанные единоборства",
    types: ["mma", "pankration"] as WorkoutType[],
    description: "Комбинация ударной техники, борьбы и других дисциплин",
    icon: "🥊",
    color: "purple" as BadgeColor,
  },
};

type CategoryKey = keyof typeof CATEGORY_DEFINITIONS;

/**
 * Получить категорию для типа единоборства
 */
export const getMartialArtCategory = (type: WorkoutType): CategoryKey => {
  for (const [categoryKey, category] of Object.entries(CATEGORY_DEFINITIONS)) {
    if (category.types.includes(type)) {
      return categoryKey as CategoryKey;
    }
  }
  return "mixed"; // fallback
};

/**
 * Получить все типы тренировок для категории
 */
export const getWorkoutTypesByCategory = (
  category: CategoryKey
): WorkoutType[] => {
  return CATEGORY_DEFINITIONS[category].types;
};

/**
 * Получить информацию о категории
 */
export const getCategoryInfo = (category: CategoryKey) => {
  return CATEGORY_DEFINITIONS[category];
};

/**
 * Сгруппировать типы тренировок по категориям
 */
export const groupWorkoutTypesByCategory = (types: WorkoutType[]) => {
  const grouped: Record<CategoryKey, WorkoutType[]> = {
    striking: [],
    grappling: [],
    mixed: [],
  };

  // Группируем типы
  types.forEach((type) => {
    const category = getMartialArtCategory(type);
    grouped[category].push(type);
  });

  // Возвращаем только непустые категории
  return Object.entries(grouped)
    .filter(([_, categoryTypes]) => categoryTypes.length > 0)
    .map(([categoryKey, categoryTypes]) => {
      const info = CATEGORY_DEFINITIONS[categoryKey as CategoryKey];
      return {
        key: categoryKey as CategoryKey,
        workoutTypes: categoryTypes,
        name: info.label,
        description: info.description,
        icon: info.icon,
        color: info.color,
      };
    });
};

// ========================================
// ВАЛИДАЦИЯ
// ========================================

/**
 * Проверить, является ли строка валидным типом тренировки
 */
export const isValidWorkoutType = (type: string): type is WorkoutType => {
  return Object.keys(WORKOUT_TYPE_LABELS).includes(type);
};

/**
 * Получить безопасный тип тренировки с fallback
 */
export const getSafeWorkoutType = (
  type: string,
  fallback: WorkoutType = "mma"
): WorkoutType => {
  return isValidWorkoutType(type) ? type : fallback;
};

// ========================================
// ФОРМАТИРОВАНИЕ
// ========================================

/**
 * Отформатировать список типов тренировок для отображения
 */
export const formatWorkoutTypesList = (
  types: WorkoutType[],
  options: {
    maxItems?: number;
    separator?: string;
    showIcons?: boolean;
    moreText?: string;
  } = {}
): string => {
  const {
    maxItems = 3,
    separator = ", ",
    showIcons = false,
    moreText = "ещё",
  } = options;

  const displayTypes = types.slice(0, maxItems);
  const remaining = types.length - maxItems;

  const formatted = displayTypes
    .map((type) => {
      const label = getWorkoutTypeLabel(type);
      const icon = showIcons ? getWorkoutTypeEmoji(type) : "";
      return icon ? `${icon} ${label}` : label;
    })
    .join(separator);

  if (remaining > 0) {
    return `${formatted}${separator}+${remaining} ${moreText}`;
  }

  return formatted;
};

/**
 * Создать описание тренировки на основе типа
 */
export const generateWorkoutDescription = (type: WorkoutType): string => {
  const category = getMartialArtCategory(type);
  const categoryInfo = CATEGORY_DEFINITIONS[category];
  const label = getWorkoutTypeLabel(type);

  return `${label} - ${categoryInfo.description}`;
};

// ========================================
// СТАТИСТИКА И АНАЛИТИКА
// ========================================

/**
 * Подсчитать статистику по типам тренировок
 */
export const calculateWorkoutTypeStats = (
  items: Array<{ type: WorkoutType; [key: string]: any }>
) => {
  const stats = items.reduce((acc, item) => {
    const type = item.type;
    if (!acc[type]) {
      acc[type] = {
        type,
        label: getWorkoutTypeLabel(type),
        color: getWorkoutTypeColor(type),
        category: getMartialArtCategory(type),
        count: 0,
      };
    }
    acc[type].count++;
    return acc;
  }, {} as Record<WorkoutType, any>);

  const sortedStats = Object.values(stats).sort((a, b) => b.count - a.count);
  const groupedCategories = groupWorkoutTypesByCategory(
    sortedStats.map((s) => s.type)
  );

  return {
    byType: sortedStats,
    byCategory: groupedCategories
      .map((cat) => ({
        key: cat.key,
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        color: cat.color,
        workoutTypes: cat.workoutTypes,
        count: cat.workoutTypes.reduce(
          (sum, type) => sum + (stats[type]?.count || 0),
          0
        ),
      }))
      .sort((a, b) => b.count - a.count),
    total: items.length,
    uniqueTypes: Object.keys(stats).length,
  };
};

// ========================================
// ЭКСПОРТ КАТЕГОРИЙ (для совместимости)
// ========================================

export const MARTIAL_ARTS_CATEGORIES = CATEGORY_DEFINITIONS;

// ========================================
// LEGACY ПОДДЕРЖКА (для совместимости)
// ========================================

/**
 * @deprecated Используйте getWorkoutTypeColor
 */
export const getMartialArtColor = getWorkoutTypeColor;

/**
 * @deprecated Используйте getWorkoutTypeIcon
 */
export const getWorkoutIcon = getWorkoutTypeIcon;
