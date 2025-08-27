// types/components.ts - ТОЛЬКО ПРОПСЫ КОМПОНЕНТОВ
import type {
  BlogCategory,
  BlogPost,
  Booking,
  ScheduleFilter,
  ScheduleItem,
  Trainer,
  TrainerFilter,
  User,
  Workout,
  WorkoutType,
} from "./index";

// ========================================
// КОМПОНЕНТЫ ХЕДЕРА И НАВИГАЦИИ
// ========================================

export interface AppHeaderProps {
  user?: User;
  notifications?: number;
  showSearch?: boolean;
  sticky?: boolean;
}

export interface AppNavigationProps {
  collapsed?: boolean;
  user?: User;
  currentRoute?: string;
}

export interface AppFooterProps {
  year?: number;
  links?: FooterLink[];
  showSocial?: boolean;
}

export interface FooterLink {
  label: string;
  to: string;
  external?: boolean;
}

// ========================================
// КОМПОНЕНТЫ РАСПИСАНИЯ
// ========================================

export type ScheduleCalendarView = "month" | "week" | "day";

export interface ScheduleCalendarProps {
  scheduleItems: ScheduleItem[];
  selectedDate?: Date;
  view?: ScheduleCalendarView;
  onDateSelect?: (date: Date) => void;
  onEventClick?: (event: ScheduleItem) => void;
  onViewChange?: (view: string) => void;
  loading?: boolean;
  minDate?: Date;
  maxDate?: Date;
  businessHours?: {
    start: string;
    end: string;
    days: number[];
  };
  timeSlotDuration?: number;
  showWeekends?: boolean;
  eventColors?: Record<WorkoutType, string>;
}

export interface WorkoutCardProps {
  workout: Workout;
  scheduleItem?: ScheduleItem;
  showTrainer?: boolean;
  showBookButton?: boolean;
  showDetails?: boolean;
  compact?: boolean;
  onBook?: (scheduleItem: ScheduleItem) => void;
  onDetails?: (workout: Workout) => void;
  disabled?: boolean;
  booked?: boolean;
}

export interface TrainerCardProps {
  trainer: Trainer;
  showStats?: boolean;
  showSchedule?: boolean;
  showContact?: boolean;
  compact?: boolean;
  onViewProfile?: (trainer: Trainer) => void;
  onBookSession?: (trainer: Trainer) => void;
}

export interface ScheduleFilterProps {
  filters: ScheduleFilter;
  trainers: Trainer[];
  workoutTypes: WorkoutType[];
  onFiltersChange: (filters: ScheduleFilter) => void;
  onReset: () => void;
  loading?: boolean;
}

// ========================================
// КОМПОНЕНТЫ ПРОФИЛЯ
// ========================================

export interface ProfileFormProps {
  user: User;
  onSubmit: (data: Partial<User>) => Promise<void>;
  loading?: boolean;
  readonly?: boolean;
}

export interface ProfileStatsProps {
  stats: {
    totalWorkouts: number;
    totalHours: number;
    currentStreak: number;
    favoriteWorkoutType: WorkoutType;
    completionRate: number;
  };
  period?: "week" | "month" | "year";
  onPeriodChange?: (period: string) => void;
}

export interface WorkoutHistoryProps {
  bookings: Booking[];
  onViewDetails?: (booking: Booking) => void;
  onRateWorkout?: (booking: Booking) => void;
  onCancelBooking?: (booking: Booking) => void;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
  onPageChange?: (page: number) => void;
  loading?: boolean;
}

// ========================================
// КОМПОНЕНТЫ БЛОГА
// ========================================

export interface BlogCardProps {
  post: BlogPost;
  variant?: "default" | "compact" | "featured";
  showAuthor?: boolean;
  showCategory?: boolean;
  showExcerpt?: boolean;
  showReadTime?: boolean;
  onRead?: (post: BlogPost) => void;
  onLike?: (post: BlogPost) => void;
  onShare?: (post: BlogPost) => void;
}

export interface BlogListProps {
  posts: BlogPost[];
  loading?: boolean;
  variant?: "grid" | "list";
  columns?: 1 | 2 | 3 | 4;
  showPagination?: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
  onPageChange?: (page: number) => void;
  onPostClick?: (post: BlogPost) => void;
}

export interface BlogFilterProps {
  categories: BlogCategory[];
  tags: { name: string; count: number }[];
  selectedCategory?: string;
  selectedTags?: string[];
  onCategoryChange?: (category: string) => void;
  onTagsChange?: (tags: string[]) => void;
  onReset?: () => void;
}

// ========================================
// КОМПОНЕНТЫ ТРЕНЕРОВ
// ========================================

export interface TrainerProfileProps {
  trainer: Trainer;
  showSchedule?: boolean;
  showReviews?: boolean;
  showStats?: boolean;
  editable?: boolean;
  onEdit?: () => void;
  onBookSession?: () => void;
  onMessage?: () => void;
}

export interface TrainerListProps {
  trainers: Trainer[];
  loading?: boolean;
  variant?: "grid" | "list";
  columns?: 1 | 2 | 3 | 4;
  showFilters?: boolean;
  onTrainerSelect?: (trainer: Trainer) => void;
  onFiltersChange?: (filters: TrainerFilter) => void;
}

export interface TrainerFilterProps {
  specializations: string[];
  selectedSpecializations?: string[];
  experienceRange?: { min: number; max: number };
  ratingMin?: number;
  availability?: {
    date?: string;
    time?: string;
  };
  onSpecializationsChange?: (specializations: string[]) => void;
  onExperienceChange?: (range: { min: number; max: number }) => void;
  onRatingChange?: (rating: number) => void;
  onAvailabilityChange?: (availability: any) => void;
  onReset?: () => void;
}

// ========================================
// КОМПОНЕНТЫ ФОРМ
// ========================================

export interface LoginFormProps {
  onSubmit: (credentials: { email: string; password: string }) => Promise<void>;
  loading?: boolean;
  redirectTo?: string;
  showRegisterLink?: boolean;
  showForgotPassword?: boolean;
}

export interface RegisterFormProps {
  onSubmit: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    fitnessLevel: string;
  }) => Promise<void>;
  loading?: boolean;
  redirectTo?: string;
  showLoginLink?: boolean;
}

export interface BookingFormProps {
  scheduleItem: ScheduleItem;
  onSubmit: (data: { notes?: string }) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  user?: User;
}

// ========================================
// КОМПОНЕНТЫ МОДАЛОВ
// ========================================

export interface WorkoutDetailsModalProps {
  workout?: Workout;
  scheduleItem?: ScheduleItem;
  isOpen: boolean;
  onClose: () => void;
  onBook?: (scheduleItem: ScheduleItem) => void;
  showBookButton?: boolean;
}

export interface BookingConfirmModalProps {
  scheduleItem?: ScheduleItem;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { notes?: string }) => Promise<void>;
  loading?: boolean;
}

export interface CancelBookingModalProps {
  booking?: Booking;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { reason?: string }) => Promise<void>;
  loading?: boolean;
}

// ========================================
// КОМПОНЕНТЫ СОСТОЯНИЯ
// ========================================

export interface LoadingStateProps {
  loading: boolean;
  message?: string;
  spinner?: "default" | "dots" | "pulse";
  size?: "sm" | "md" | "lg";
  overlay?: boolean;
}

export interface ErrorStateProps {
  error?: string | Error;
  title?: string;
  showRetry?: boolean;
  onRetry?: () => void;
  icon?: string;
}

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// ========================================
// СЛОТЫ КОМПОНЕНТОВ
// ========================================

export interface ComponentSlots {
  "card-header"?: () => any;
  "card-body"?: () => any;
  "card-footer"?: () => any;
  "modal-header"?: () => any;
  "modal-body"?: () => any;
  "modal-footer"?: () => any;
  "table-header"?: (column: any) => any;
  "table-cell"?: (value: any, row: any, column: any) => any;
  sidebar?: () => any;
  header?: () => any;
  footer?: () => any;
  main?: () => any;
  before?: () => any;
  after?: () => any;
  loading?: () => any;
  error?: () => any;
  empty?: () => any;
}
