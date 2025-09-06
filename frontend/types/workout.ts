// types/workout.ts - Типы для тренировок

export type WorkoutType =
  | "boxing"
  | "kickboxing"
  | "grappling"
  | "bjj"
  | "wrestling"
  | "mma"
  | "pankration";

export type WorkoutDifficulty = "beginner" | "intermediate" | "advanced";

export type WorkoutStatus = "draft" | "published" | "archived";

export interface Workout {
  id: number;
  title: string;
  description: string;
  type: WorkoutType;
  difficulty: WorkoutDifficulty;
  duration: number; // в минутах
  maxParticipants: number;
  equipment?: string[];
  prerequisites?: string[];
  objectives: string[];
  status: WorkoutStatus;
  isPrivate: boolean; // доступна только для зарегистрированных
  createdAt: string;
  updatedAt: string;
}

// Фильтры для тренировок
export interface WorkoutFilter {
  type?: WorkoutType[];
  difficulty?: WorkoutDifficulty[];
  duration?: {
    min?: number;
    max?: number;
  };
  maxParticipants?: {
    min?: number;
    max?: number;
  };
  hasEquipment?: boolean;
  isPrivate?: boolean;
  status?: WorkoutStatus[];
  search?: string;
}

// Создание/обновление тренировки
export interface CreateWorkoutData {
  title: string;
  description: string;
  type: WorkoutType;
  difficulty: WorkoutDifficulty;
  duration: number;
  maxParticipants: number;
  equipment?: string[];
  prerequisites?: string[];
  objectives: string[];
  isPrivate?: boolean;
}

export type UpdateWorkoutData = Partial<CreateWorkoutData>;

// Детали тренировки с дополнительной информацией
export interface WorkoutDetails extends Workout {
  upcomingSessions: number;
  totalParticipants: number;
  averageRating: number;
  reviewsCount: number;
  popularTimes: string[];
}
