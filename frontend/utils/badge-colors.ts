// utils/badge-utils.ts - Утилиты для безопасной работы с цветами UBadge

import type { BadgeColor } from "@/types/constants";

/**
 * Безопасное приведение значения к цвету Badge
 * Если переданное значение не является валидным цветом Badge, возвращает fallback
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

/**
 * Получить цвет для статуса бронирования с типизацией
 */
export const getBookingStatusColor = (status: string): BadgeColor => {
  const colors: Record<string, BadgeColor> = {
    pending: "yellow",
    confirmed: "blue",
    completed: "green",
    cancelled: "red",
    no_show: "orange",
    waiting_list: "emerald",
  };

  return ensureBadgeColor(colors[status], "emerald");
};

/**
 * Получить цвет для статуса расписания с типизацией
 */
export const getScheduleStatusColor = (status: string): BadgeColor => {
  const colors: Record<string, BadgeColor> = {
    scheduled: "blue",
    in_progress: "yellow",
    completed: "green",
    cancelled: "red",
    postponed: "orange",
  };

  return ensureBadgeColor(colors[status], "emerald");
};

/**
 * Получить цвет для уровня сложности с типизацией
 */
export const getDifficultyColor = (difficulty: string): BadgeColor => {
  const colors: Record<string, BadgeColor> = {
    beginner: "green",
    intermediate: "yellow",
    advanced: "red",
  };

  return ensureBadgeColor(colors[difficulty], "emerald");
};

/**
 * Получить цвет для типа тренировки с типизацией
 */
export const getWorkoutTypeColor = (type: string): BadgeColor => {
  const colors: Record<string, BadgeColor> = {
    boxing: "red",
    kickboxing: "orange",
    grappling: "blue",
    bjj: "cyan",
    wrestling: "indigo",
    mma: "purple",
    pankration: "emerald",
  };

  return ensureBadgeColor(colors[type], "emerald");
};

/**
 * Получить цвет для уровня физической подготовки
 */
export const getFitnessLevelColor = (level: string): BadgeColor => {
  const colors: Record<string, BadgeColor> = {
    beginner: "green",
    intermediate: "yellow",
    advanced: "red",
  };

  return ensureBadgeColor(colors[level], "emerald");
};

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
