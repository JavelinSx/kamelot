// types/trainer.ts - Типы для тренеров

import type { User, WorkoutType } from "./index";

export interface Trainer {
  id: number;
  user: User;
  specializations: WorkoutType[];
  experience: number; // лет опыта
  bio: string;
  certifications: string[];
  achievements: string[];
  rating: number;
  reviewsCount: number;
  isActive: boolean;
  workingHours?: WorkingHours;
  schedule?: TrainerSchedule;
  price: number; // основная цена за занятие
  stats?: TrainerStats;
  createdAt?: string;
  updatedAt?: string;
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
  start: string; // HH:mm формат
  end: string; // HH:mm формат
}

// Новый тип для расписания тренера (из fake-trainers)
export interface TrainerSchedule {
  monday?: TrainerTimeSlot[];
  tuesday?: TrainerTimeSlot[];
  wednesday?: TrainerTimeSlot[];
  thursday?: TrainerTimeSlot[];
  friday?: TrainerTimeSlot[];
  saturday?: TrainerTimeSlot[];
  sunday?: TrainerTimeSlot[];
}

export interface TrainerTimeSlot {
  start: string; // HH:mm формат
  end: string; // HH:mm формат
  type: WorkoutType; // тип тренировки
}

export interface TrainerPricing {
  groupSession: number;
  personalSession: number;
  currency: string;
}

export interface TrainerStats {
  totalStudents: number;
  totalHours?: number;
  completedSessions?: number;
  sessionsCompleted?: number; // добавлено для совместимости
  averageRating: number;
  specialtyDistribution?: Record<WorkoutType, number>;
  yearsExperience?: number; // добавлено для совместимости
}

// Фильтры для поиска тренеров
export interface TrainerFilter {
  specializations?: WorkoutType[];
  experience?: {
    min?: number;
    max?: number;
  };
  rating?: {
    min?: number;
  };
  availability?: {
    date?: string;
    timeSlot?: string;
  };
  priceRange?: {
    min?: number;
    max?: number;
  };
  search?: string;
  isActive?: boolean;
}

// Отзывы о тренерах
export interface TrainerReview {
  id: number;
  trainerId: number;
  userId: number;
  rating: number;
  comment: string;
  workoutType: WorkoutType;
  sessionDate: string;
  isVerified: boolean;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

// Создание отзыва
export interface CreateTrainerReview {
  trainerId: number;
  rating: number;
  comment: string;
  workoutType: WorkoutType;
  sessionDate: string;
}
