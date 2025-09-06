// types/api.ts - Типы для API запросов и ответов (интегрированная версия)

import type {
  BlogPost,
  Booking,
  ScheduleItem,
  Trainer,
  User,
  Workout,
} from "./index";

// ========================================
// БАЗОВЫЕ ТИПЫ ОТВЕТОВ
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
  meta: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
  timestamp: string;
  path: string;
  details?: Record<string, any>;
}

// ========================================
// ПАРАМЕТРЫ ЗАПРОСОВ
// ========================================

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface SearchParams extends PaginationParams {
  query?: string;
  filters?: Record<string, any>;
}

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
// ТИПЫ ДЛЯ ФАЙЛОВ
// ========================================

export interface FileUploadResponse {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  path: string;
}

export interface MultiFileUploadResponse {
  files: FileUploadResponse[];
  failed: Array<{
    filename: string;
    error: string;
  }>;
}

// ========================================
// АУТЕНТИФИКАЦИЯ
// ========================================

export interface LoginResponse
  extends ApiResponse<{
    user: User;
    tokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  }> {}

export interface RegisterResponse
  extends ApiResponse<{
    user: User;
    tokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  }> {}

export interface RefreshTokenResponse
  extends ApiResponse<{
    tokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  }> {}

// ========================================
// РАСПИСАНИЕ И БРОНИРОВАНИЯ
// ========================================

export interface ScheduleResponse extends ApiResponse<ScheduleItem[]> {}

export interface ScheduleBookResponse
  extends ApiResponse<{
    booking: Booking;
    schedule: ScheduleItem;
  }> {}

export interface BookEventRequest {
  userId?: number;
  notes?: string;
}

export interface CancelBookingRequest {
  reason?: string;
  requestRefund?: boolean;
}

export interface UserWorkoutsResponse extends ApiResponse<ScheduleItem[]> {}

export interface BookingResponse
  extends ApiResponse<{
    booking: Booking;
    schedule: ScheduleItem;
    message?: string;
  }> {}

// ========================================
// ТРЕНЕРЫ
// ========================================

export interface TrainersResponse extends PaginatedResponse<Trainer> {}

export interface TrainerResponse extends ApiResponse<Trainer> {}

export interface CreateTrainerRequest {
  userId: number;
  specializations: string[];
  experience: number;
  bio: string;
  certifications: string[];
  pricing: {
    groupSession: number;
    personalSession: number;
  };
}

// ========================================
// ТРЕНИРОВКИ
// ========================================

export interface WorkoutsResponse extends PaginatedResponse<Workout> {}

export interface WorkoutResponse extends ApiResponse<Workout> {}

export interface CreateWorkoutRequest {
  title: string;
  description: string;
  type: string;
  difficulty: string;
  duration: number;
  maxParticipants: number;
  equipment?: string[];
  objectives: string[];
  isPrivate?: boolean;
}

// ========================================
// БЛОГ
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
// КОНКРЕТНЫЕ API ЭНДПОИНТЫ
// ========================================

export interface ApiEndpoints {
  // Auth
  "POST /api/auth/login": {
    body: { email: string; password: string };
    response: LoginResponse;
  };

  "POST /api/auth/register": {
    body: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phone?: string;
      dateOfBirth?: string;
      gender?: string;
      fitnessLevel: string;
    };
    response: RegisterResponse;
  };

  "POST /api/auth/refresh": {
    response: RefreshTokenResponse;
  };

  "GET /api/auth/me": {
    response: ApiResponse<{ user: User }>;
  };

  "POST /api/auth/logout": {
    response: ApiResponse<null>;
  };

  // Schedule
  "GET /api/schedule": {
    query?: {
      start?: string;
      end?: string;
      trainerId?: number;
      workoutType?: string;
      includePrivate?: boolean;
    };
    response: ScheduleResponse;
  };

  "POST /api/schedule/:id/book": {
    body?: BookEventRequest;
    response: ScheduleBookResponse;
  };

  "POST /api/schedule/:id/cancel": {
    body?: CancelBookingRequest;
    response: ApiResponse<null>;
  };

  // Bookings
  "GET /api/user/bookings": {
    query?: {
      status?: string;
      page?: number;
      limit?: number;
    };
    response: PaginatedResponse<Booking>;
  };

  "DELETE /api/bookings/:id": {
    body?: { reason?: string };
    response: ApiResponse<null>;
  };

  "POST /api/bookings/:id/rate": {
    body: { rating: number; review?: string };
    response: ApiResponse<null>;
  };

  // Trainers
  "GET /api/trainers": {
    query?: {
      specialization?: string[];
      experience?: number;
      rating?: number;
      page?: number;
      limit?: number;
    };
    response: TrainersResponse;
  };

  "GET /api/trainers/:id": {
    response: TrainerResponse;
  };

  // Workouts
  "GET /api/workouts": {
    query?: {
      type?: string[];
      difficulty?: string[];
      page?: number;
      limit?: number;
    };
    response: WorkoutsResponse;
  };

  "GET /api/workouts/:id": {
    response: WorkoutResponse;
  };

  "GET /api/workouts/popular": {
    query?: { limit?: number };
    response: WorkoutsResponse;
  };

  // Blog
  "GET /api/blog/posts": {
    query?: SearchParams;
    response: BlogPostsResponse;
  };

  "GET /api/blog/posts/:id": {
    response: BlogPostResponse;
  };

  // Files
  "POST /api/upload": {
    body: FormData;
    response: ApiResponse<FileUploadResponse>;
  };

  "POST /api/upload/multiple": {
    body: FormData;
    response: ApiResponse<MultiFileUploadResponse>;
  };
}

// ========================================
// УТИЛИТЫ ДЛЯ ТИПИЗАЦИИ
// ========================================

export type ExtractApiResponse<T> = T extends ApiResponse<infer U> ? U : T;
export type ExtractApiBody<T> = T extends { body: infer U } ? U : never;
export type ExtractApiQuery<T> = T extends { query: infer U } ? U : never;

// Хелпер для создания типизированных API клиентов
export type TypedApiClient = {
  [K in keyof ApiEndpoints]: K extends `${infer Method} ${infer Path}`
    ? {
        method: Method;
        path: Path;
        params: ApiEndpoints[K] extends { body: any }
          ? { body: ExtractApiBody<ApiEndpoints[K]> }
          : ApiEndpoints[K] extends { query: any }
          ? { query?: ExtractApiQuery<ApiEndpoints[K]> }
          : {};
        response: ExtractApiResponse<ApiEndpoints[K]["response"]>;
      }
    : never;
};

// Тип для типизации $fetch функций
export type FetchResponse<T> = T extends ApiResponse<infer U> ? U : T;

export type TypedFetch = {
  <T>(url: string, options?: any): Promise<T>;
};
