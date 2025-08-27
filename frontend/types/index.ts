// types/index.ts - ОСНОВНЫЕ ТИПЫ (единственный источник истины)

// ========================================
// ПОЛЬЗОВАТЕЛИ И АУТЕНТИФИКАЦИЯ
// ========================================

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: "male" | "female";
  fitnessGoals?: string;
  fitnessLevel?: "beginner" | "intermediate" | "advanced";
  role: "user" | "trainer";
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  favoriteMartialArts?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  fitnessLevel: "beginner" | "intermediate" | "advanced";
}

// ========================================
// ТРЕНЕРЫ
// ========================================

export interface Trainer {
  id: number;
  user: User;
  specialization: string[];
  experience: number;
  achievements: string[];
  schedule: any;
  price: number;
  stats: any;
  bio: string;
  certifications: string[];
  rating: number;
  reviewsCount: number;
  isActive: boolean;
  workingHours?: WorkingHours;
}

export interface WorkingHours {
  monday?: TimeSlot[];
  tuesday?: TimeSlot[];
  wednesday?: TimeSlot[];
  thursday?: TimeSlot[];
  friday?: TimeSlot[];
  saturday?: TimeSlot[];
  sunday?: TimeSlot[];
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface TrainerFilter {
  specialization?: string[];
  experience?: { min?: number; max?: number };
  rating?: { min?: number };
  availability?: { date?: string; time?: string };
  search?: string;
  isActive?: boolean;
}

// ========================================
// ТРЕНИРОВКИ
// ========================================

export type WorkoutType =
  | "mma"
  | "grappling"
  | "bjj"
  | "kickboxing"
  | "pankration"
  | "boxing"
  | "wrestling"
  | "grappling";

// ========================================
// РАСПИСАНИЕ
// ========================================

export interface ScheduleItem {
  id: number;
  workout: Workout;
  trainer: Trainer;
  startTime: string;
  endTime: string;
  currentParticipants: number;
  maxParticipants: number;
  status: ScheduleStatus;
  location?: string;
  price?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ScheduleStatus =
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "postponed";

export interface ScheduleFilter {
  date?: string;
  trainerId?: number[];
  dateRange?: { start: string; end: string };
  trainer?: number[];
  workoutType?: WorkoutType[];
  difficulty?: DifficultyType[];
  time?: { start?: string; end?: string };
  status?: ScheduleStatus[];
  availableOnly?: boolean;
}

// ========================================
// ЗАПИСИ НА ТРЕНИРОВКИ
// ========================================

export interface Booking {
  id: number;
  user: User;
  scheduleItem: ScheduleItem;
  status: BookingStatus;
  bookedAt: string;
  cancelledAt?: string;
  cancellationReason?: string;
  attendedAt?: string;
  notes?: string;
  rating?: number;
  review?: string;
}

export type BookingStatus =
  | "booked"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show"
  | "pending"
  | "waiting_list";

export interface CreateBookingData {
  scheduleItemId: number;
  notes?: string;
}

// ========================================
// БЛОГ
// ========================================

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  author: User;
  category: BlogCategory;
  tags: string[];
  isPublished: boolean;
  publishedAt?: string;
  readTime?: number;
  views: number;
  likes: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  postsCount: number;
  count?: number;
}

export interface BlogFilter {
  category?: string;
  tags?: string[];
  author?: number;
  dateRange?: { start: string; end: string };
  search?: string;
  published?: boolean;
}

// ========================================
// СТАТИСТИКА
// ========================================

export interface UserStats {
  totalWorkouts: number;
  totalHours: number;
  totalCalories: number;
  currentStreak: number;
  longestStreak: number;
  favoriteWorkoutType: WorkoutType;
  averageWorkoutsPerWeek: number;
  completionRate: number;
  monthlyStats: MonthlyStats[];
  weeklyActivity: WeeklyActivity[];
  workoutChange: number;
  averagePerWeek: number;
}

export interface MonthlyStats {
  month: string;
  workouts: number;
  hours: number;
  calories: number;
}

export interface WeeklyActivity {
  date: string;
  workouts: number;
  duration: number;
  intensity: "low" | "medium" | "high";
}

// ========================================
// УВЕДОМЛЕНИЯ
// ========================================

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  priority: "low" | "medium" | "high";
  createdAt: string;
  readAt?: string;
}

export type NotificationType =
  | "booking_confirmed"
  | "booking_cancelled"
  | "workout_reminder"
  | "new_blog_post"
  | "trainer_message"
  | "schedule_change"
  | "achievement"
  | "system";

// ========================================
// UI КОМПОНЕНТЫ
// ========================================

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  icon?: string;
  description?: string;
}

export interface TabItem {
  key: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  badge?: string | number;
}

export interface BreadcrumbItem {
  label: string;
  to?: string;
  icon?: string;
  disabled?: boolean;
}

export interface CalendarEvent {
  id: number;
  title: string;
  start: string;
  end: string;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps: {
    scheduleItem: ScheduleItem;
    isBooked: boolean;
    canBook: boolean;
  };
}

// ========================================
// УТИЛИТЫ
// ========================================

export interface DateRange {
  start: Date | string;
  end: Date | string;
}

export interface TimeRange {
  start: string;
  end: string;
}

export interface FileUpload {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  url?: string;
  error?: string;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  message?: string;
  code?: string | number;
}

export interface ModalState {
  isOpen: boolean;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  persistent?: boolean;
}

// ========================================
// CONSTANTS
// ========================================

export const WORKOUT_TYPES: Record<WorkoutType, string> = {
  boxing: "Бокс",
  kickboxing: "Кикбоксинг",
  grappling: "Грэпплинг",
  bjj: "Бразильское джиу-джитсу",
  wrestling: "Борьба",
  mma: "ММА (Смешанные боевые искусства)",
  pankration: "Панкратион",
};

export const DIFFICULTY_LEVELS = {
  easy: { label: "Легкий", color: "green" },
  medium: { label: "Средний", color: "yellow" },
  hard: { label: "Сложный", color: "red" },
} as const;

export const FITNESS_LEVELS = {
  beginner: { label: "Начинающий", description: "Новичок в фитнесе" },
  intermediate: { label: "Средний", description: "Есть опыт тренировок" },
  advanced: { label: "Продвинутый", description: "Опытный спортсмен" },
} as const;

export const BOOKING_STATUSES = {
  booked: { label: "Забронировано", color: "blue" },
  confirmed: { label: "Подтверждено", color: "green" },
  cancelled: { label: "Отменено", color: "red" },
  completed: { label: "Завершено", color: "gray" },
  no_show: { label: "Не явился", color: "orange" },
  waiting_list: { label: "Лист ожидания", color: "yellow" },
} as const;

// ========================================
// ТИПЫ ДЛЯ COMPOSABLES
// ========================================

export interface UseAuthReturn {
  user: ComputedRef<User | null>;
  isAuthenticated: ComputedRef<boolean>;
  isLoading: Ref<boolean>;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

export interface UseScheduleReturn {
  schedule: Ref<ScheduleItem[]>;
  loading: Ref<boolean>;
  error: Ref<string | null>;
  filters: Ref<ScheduleFilter>;
  fetchSchedule: (filters?: ScheduleFilter) => Promise<void>;
  bookWorkout: (scheduleId: number, data?: CreateBookingData) => Promise<void>;
  cancelBooking: (bookingId: number, reason?: string) => Promise<void>;
}

export interface UseTrainersReturn {
  trainers: Ref<Trainer[]>;
  loading: Ref<boolean>;
  error: Ref<string | null>;
  filters: Ref<TrainerFilter>;
  fetchTrainers: (filters?: TrainerFilter) => Promise<void>;
  getTrainer: (id: number) => Promise<Trainer>;
}

export interface UseBlogReturn {
  posts: Ref<BlogPost[]>;
  categories: Ref<BlogCategory[]>;
  loading: Ref<boolean>;
  error: Ref<string | null>;
  filters: Ref<BlogFilter>;
  fetchPosts: (filters?: BlogFilter) => Promise<void>;
  getPost: (slug: string) => Promise<BlogPost>;
  likePost: (id: number) => Promise<void>;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  fitnessGoals?: string;
  fitnessLevel?: "beginner" | "intermediate" | "advanced";
  avatar?: string;
}

export interface TrainerFilters {
  specialization?: string[];
  experience?: {
    min?: number;
    max?: number;
  };
  rating?: {
    min?: number;
  };
  availability?: {
    day?: string;
    time?: string;
  };
  search?: string;
  isActive?: boolean; // Добавлен недостающий тип
}

export interface Workout {
  id: number;
  name: string; // Добавлено
  type: WorkoutType;
  difficulty: DifficultyType;
  duration: number;
  calories: number; // Переименовано с caloriesBurn
  description?: string;
  price?: number;
  maxParticipants?: number;
  category: string;
}

export type DifficultyType = "easy" | "medium" | "hard";
export type StatusType =
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface ScheduleEvent {
  id: number;
  workout: Workout;
  trainer: Trainer;
  startTime: string;
  endTime: string;
  date: string;
  currentParticipants: number;
  maxParticipants: number;
  status: StatusType;
}
