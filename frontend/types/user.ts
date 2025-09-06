// types/user.ts - Типы для пользователей и аутентификации

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  fitnessLevel?: FitnessLevel;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "user" | "trainer" | "admin";

export type FitnessLevel = "beginner" | "intermediate" | "advanced";

// Аутентификация
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
  fitnessLevel: FitnessLevel;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// Профиль пользователя
export interface UserProfile extends User {
  preferences?: UserPreferences;
  stats?: UserStats;
}

export interface UserPreferences {
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  language: string;
  timezone: string;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  workoutReminders: boolean;
  scheduleChanges: boolean;
  promotions: boolean;
}

export interface PrivacySettings {
  profileVisibility: "public" | "private" | "friends";
  showActivity: boolean;
  showStats: boolean;
}

export interface UserStats {
  totalWorkouts: number;
  totalHours: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  favoriteWorkoutTypes: string[];
}

// Обновление профиля
export type UpdateUserData = Partial<
  Omit<User, "id" | "email" | "role" | "createdAt" | "updatedAt">
>;

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
