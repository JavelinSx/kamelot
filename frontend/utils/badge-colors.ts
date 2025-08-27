// utils/badge-colors.ts

// Допустимые цвета для UBadge в NuxtUI
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
  | "gray";

// Функция для получения цвета боевого искусства
export const getMartialArtColor = (type: string): BadgeColor => {
  const colors: Record<string, BadgeColor> = {
    karate: "orange",
    boxing: "red",
    mma: "purple",
    kickboxing: "pink",
    judo: "blue",
    taekwondo: "blue",
    muay_thai: "yellow",
    bjj: "indigo",
    wrestling: "green",
    fitness: "gray",
  };
  return colors[type] || "gray";
};

// Функция для получения цвета уровня сложности
export const getDifficultyColor = (difficulty: string): BadgeColor => {
  const colors: Record<string, BadgeColor> = {
    easy: "green",
    medium: "yellow",
    hard: "red",
  };
  return colors[difficulty] || "gray";
};

// Функция для получения цвета статуса
export const getStatusColor = (status: string): BadgeColor => {
  const colors: Record<string, BadgeColor> = {
    scheduled: "blue",
    in_progress: "yellow",
    completed: "green",
    cancelled: "red",
    active: "green",
    inactive: "gray",
    booked: "blue",
    confirmed: "green",
    pending: "yellow",
    rejected: "red",
  };
  return colors[status] || "gray";
};

// Функция для получения цвета специализации
export const getSpecializationColor = (specialization: string): BadgeColor => {
  // Используем хэш строки для консистентного цвета
  const hash = specialization.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

  const colors: BadgeColor[] = [
    "blue",
    "green",
    "purple",
    "orange",
    "pink",
    "cyan",
    "indigo",
    "teal",
    "emerald",
    "violet",
  ];

  return colors[Math.abs(hash) % colors.length];
};

// Функция для безопасного приведения цвета
export const ensureBadgeColor = (color: any): BadgeColor => {
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
    "gray",
  ];

  return validColors.includes(color) ? color : "gray";
};
