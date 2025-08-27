// types/api.ts
import type {
  BlogPost,
  Booking,
  ScheduleItem,
  Trainer,
  User,
  Workout,
} from "./index";

// ========================================
// БАЗОВЫЕ ТИПЫ API ОТВЕТОВ
// ========================================

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
  timestamp: string;
  path: string;
}

// ========================================
// ТИПЫ ДЛЯ КАЛЕНДАРЯ И РАСПИСАНИЯ
// ========================================

export interface ScheduleResponse extends ApiResponse<ScheduleItem[]> {}

export interface ScheduleBookResponse
  extends ApiResponse<{
    booking: Booking;
    schedule: ScheduleItem;
  }> {}

export interface UserWorkoutsResponse extends ApiResponse<ScheduleItem[]> {}

export interface BookEventRequest {
  userId?: number;
  notes?: string;
}

export interface CancelBookingRequest {
  reason?: string;
}

// ========================================
// ТИПЫ ДЛЯ АУТЕНТИФИКАЦИИ
// ========================================

export interface LoginResponse
  extends ApiResponse<{
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {}

export interface RegisterResponse
  extends ApiResponse<{
    user: User;
    accessToken: string;
    refreshToken: string;
  }> {}

export interface RefreshTokenResponse
  extends ApiResponse<{
    accessToken: string;
    expiresIn: number;
  }> {}

// ========================================
// ТИПЫ ДЛЯ ПОЛЬЗОВАТЕЛЕЙ
// ========================================

export interface UserProfileResponse extends ApiResponse<User> {}

export interface UserStatsResponse
  extends ApiResponse<{
    totalWorkouts: number;
    totalHours: number;
    currentStreak: number;
    favoriteWorkoutType: string;
    completionRate: number;
    monthlyStats: Array<{
      month: string;
      workouts: number;
      hours: number;
    }>;
  }> {}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  fitnessGoals?: string;
  fitnessLevel?: "beginner" | "intermediate" | "advanced";
}

// ========================================
// ТИПЫ ДЛЯ ТРЕНЕРОВ
// ========================================

export interface TrainersResponse extends ApiResponse<Trainer[]> {}

export interface TrainerResponse extends ApiResponse<Trainer> {}

export interface TrainerScheduleResponse
  extends ApiResponse<{
    trainer: Trainer;
    schedule: ScheduleItem[];
    availability: Array<{
      date: string;
      slots: Array<{
        time: string;
        available: boolean;
      }>;
    }>;
  }> {}

// ========================================
// ТИПЫ ДЛЯ ТРЕНИРОВОК
// ========================================

export interface WorkoutsResponse extends ApiResponse<Workout[]> {}

export interface WorkoutResponse extends ApiResponse<Workout> {}

export interface CreateWorkoutRequest {
  name: string;
  type: string;
  difficulty: string;
  duration: number;
  description?: string;
  maxParticipants?: number;
  price?: number;
}

// ========================================
// ТИПЫ ДЛЯ БЛОГА
// ========================================

export interface BlogPostsResponse extends PaginatedResponse<BlogPost> {}

export interface BlogPostResponse extends ApiResponse<BlogPost> {}

export interface CreateBlogPostRequest {
  title: string;
  content: string;
  excerpt?: string;
  categoryId: number;
  tags?: string[];
  published?: boolean;
  featuredImage?: string;
}

// ========================================
// ТИПЫ ДЛЯ ФАЙЛОВ
// ========================================

export interface FileUploadResponse
  extends ApiResponse<{
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    url: string;
    path: string;
  }> {}

export interface MultipleFileUploadResponse
  extends ApiResponse<
    Array<{
      filename: string;
      originalName: string;
      mimetype: string;
      size: number;
      url: string;
      path: string;
    }>
  > {}

// ========================================
// ТИПЫ ДЛЯ ПОИСКА
// ========================================

export interface SearchRequest {
  query: string;
  filters?: Record<string, any>;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface SearchResponse<T = any> extends PaginatedResponse<T> {
  query: string;
  took: number;
  aggregations?: Record<string, any>;
}

// ========================================
// UTILITY ТИПЫ ДЛЯ $FETCH
// ========================================

// Тип для типизации ответов $fetch
export type FetchResponse<T> = T extends ApiResponse<infer U> ? U : T;

// Helper для создания типизированных $fetch функций
export type TypedFetch = {
  <T>(url: string, options?: any): Promise<T>;
};

// ========================================
// КОНКРЕТНЫЕ ЭНДПОИНТЫ
// ========================================

export interface ApiEndpoints {
  // Auth
  "POST /api/auth/login": {
    body: { email: string; password: string };
    response: LoginResponse;
  };
  "POST /api/auth/register": {
    body: RegisterData;
    response: RegisterResponse;
  };
  "POST /api/auth/refresh": {
    response: RefreshTokenResponse;
  };

  // Schedule
  "GET /api/schedule": {
    query?: {
      startDate?: string;
      endDate?: string;
      trainerId?: number;
      workoutType?: string;
    };
    response: ScheduleResponse;
  };
  "POST /api/schedule/:id/book": {
    body?: BookEventRequest;
    response: ScheduleBookResponse;
  };
  "POST /api/schedule/:id/cancel": {
    body?: CancelBookingRequest;
    response: ApiResponse<boolean>;
  };

  // Users
  "GET /api/users/:id": {
    response: UserProfileResponse;
  };
  "PUT /api/users/:id": {
    body: UpdateUserRequest;
    response: UserProfileResponse;
  };
  "GET /api/users/:id/stats": {
    response: UserStatsResponse;
  };
  "GET /api/users/workouts": {
    query: {
      userId: number;
      startDate?: string;
      endDate?: string;
    };
    response: UserWorkoutsResponse;
  };

  // Trainers
  "GET /api/trainers": {
    query?: {
      specialization?: string[];
      experience?: { min?: number; max?: number };
      rating?: { min?: number };
      availability?: { date?: string; time?: string };
      search?: string;
    };
    response: TrainersResponse;
  };
  "GET /api/trainers/:id": {
    response: TrainerResponse;
  };
  "GET /api/trainers/:id/schedule": {
    query?: {
      startDate?: string;
      endDate?: string;
    };
    response: TrainerScheduleResponse;
  };

  // Workouts
  "GET /api/workouts": {
    query?: {
      type?: string;
      difficulty?: string;
      duration?: { min?: number; max?: number };
    };
    response: WorkoutsResponse;
  };
  "GET /api/workouts/:id": {
    response: WorkoutResponse;
  };
  "POST /api/workouts": {
    body: CreateWorkoutRequest;
    response: WorkoutResponse;
  };

  // Blog
  "GET /api/blog/posts": {
    query?: {
      page?: number;
      limit?: number;
      category?: string;
      tags?: string[];
      search?: string;
    };
    response: BlogPostsResponse;
  };
  "GET /api/blog/posts/:id": {
    response: BlogPostResponse;
  };
  "POST /api/blog/posts": {
    body: CreateBlogPostRequest;
    response: BlogPostResponse;
  };

  // Files
  "POST /api/upload": {
    body: FormData;
    response: FileUploadResponse;
  };
  "POST /api/upload/multiple": {
    body: FormData;
    response: MultipleFileUploadResponse;
  };
}

// Тип для извлечения типа ответа по эндпоинту
export type EndpointResponse<T extends keyof ApiEndpoints> =
  ApiEndpoints[T] extends { response: infer R } ? R : never;

// Тип для извлечения типа тела запроса по эндпоинту
export type EndpointBody<T extends keyof ApiEndpoints> =
  ApiEndpoints[T] extends { body: infer B } ? B : never;

// Тип для извлечения типа query параметров по эндпоинту
export type EndpointQuery<T extends keyof ApiEndpoints> =
  ApiEndpoints[T] extends { query: infer Q } ? Q : never;
