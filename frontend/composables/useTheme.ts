// composables/useTheme.ts - Composable для работы с темой

type CategoryType = "striking" | "grappling" | "mixed" | "traditional";
type DifficultyType = "beginner" | "intermediate" | "advanced";
type StatusType = "active" | "inactive" | "pending" | "cancelled" | "completed";
export const useTheme = () => {
  const isDark = ref(true); // Всегда темная тема для боевых единоборств

  const theme = computed(() => ({
    name: "fight-club",
    isDark: isDark.value,
    colors: {
      primary: {
        50: "#fef2f2",
        100: "#fee2e2",
        200: "#fecaca",
        300: "#fca5a5",
        400: "#f87171",
        500: "#ef4444",
        600: "#dc2626",
        700: "#b91c1c",
        800: "#991b1b",
        900: "#7f1d1d",
        950: "#450a0a",
      },
      gray: {
        50: "#fafafa",
        100: "#f5f5f5",
        200: "#e5e5e5",
        300: "#d4d4d4",
        400: "#a3a3a3",
        500: "#737373",
        600: "#525252",
        700: "#404040",
        750: "#262626",
        800: "#1f1f1f",
        850: "#1a1a1a",
        900: "#111111",
        950: "#0a0a0a",
      },
    },
    gradients: {
      primary: "linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%)",
      primaryDark: "linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%)",
      black: "linear-gradient(135deg, #111111 0%, #000000 100%)",
    },
    shadows: {
      red: "0 10px 15px -3px rgb(220 38 38 / 0.1), 0 4px 6px -2px rgb(220 38 38 / 0.05)",
      redLg: "0 25px 50px -12px rgb(220 38 38 / 0.25)",
      dark: "0 25px 50px -12px rgb(0 0 0 / 0.5)",
    },
  }));

  const getCategoryColor = (category: string): string => {
    const colors: Record<CategoryType, string> = {
      striking: "red",
      grappling: "blue",
      mixed: "purple",
      traditional: "green",
    };
    return colors[category as CategoryType] || "gray";
  };

  const getDifficultyColor = (difficulty: string): string => {
    const colors: Record<DifficultyType, string> = {
      beginner: "green",
      intermediate: "yellow",
      advanced: "red",
    };
    return colors[difficulty as DifficultyType] || "gray";
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<StatusType, string> = {
      active: "green",
      inactive: "gray",
      pending: "yellow",
      cancelled: "red",
      completed: "blue",
    };
    return colors[status as StatusType] || "gray";
  };

  return {
    theme,
    isDark,
    getCategoryColor,
    getDifficultyColor,
    getStatusColor,
  };
};
