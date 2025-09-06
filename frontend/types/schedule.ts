// types/schedule.ts - Типы для расписания тренировок

import type { Trainer, Workout } from "./index";

// ========================================
// ОСНОВНЫЕ ТИПЫ РАСПИСАНИЯ
// ========================================

export type ScheduleStatus =
  | "scheduled" // запланирована
  | "in_progress" // идёт сейчас
  | "completed" // завершена
  | "cancelled" // отменена
  | "postponed"; // отложена

export interface ScheduleItem {
  id: number;
  workout: Workout;
  trainer: Trainer;
  startTime: string; // ISO string
  endTime: string; // ISO string
  currentParticipants: number;
  maxParticipants: number;
  status: ScheduleStatus;
  location?: string;
  price?: number;
  notes?: string;
  isRecurring?: boolean;
  isPrivate?: boolean;
  recurringPattern?: RecurringPattern;
  createdAt: string;
  updatedAt: string;
}

// ========================================
// ПОВТОРЯЮЩИЕСЯ СОБЫТИЯ
// ========================================

export interface RecurringPattern {
  type: "daily" | "weekly" | "monthly";
  interval: number; // каждые N дней/недель/месяцев
  daysOfWeek?: number[]; // для weekly: 0=воскресенье, 1=понедельник и т.д.
  endDate?: string;
  maxOccurrences?: number;
  exceptions?: string[]; // даты исключений
}

// ========================================
// ФИЛЬТРЫ ДЛЯ РАСПИСАНИЯ
// ========================================

export interface ScheduleFilter {
  dateRange?: {
    start: string;
    end: string;
  };
  trainerId?: number[];
  workoutType?: string[];
  difficulty?: string[];
  status?: ScheduleStatus[];
  location?: string[];
  availableOnly?: boolean; // только с доступными местами
  timeRange?: {
    start: string; // HH:mm
    end: string; // HH:mm
  };
  priceRange?: {
    min?: number;
    max?: number;
  };
}

// ========================================
// СОЗДАНИЕ/ОБНОВЛЕНИЕ РАСПИСАНИЯ
// ========================================

export interface CreateScheduleData {
  workoutId: number;
  trainerId: number;
  startTime: string;
  endTime: string;
  maxParticipants?: number;
  location?: string;
  price?: number;
  notes?: string;
  isRecurring?: boolean;
  recurringPattern?: RecurringPattern;
}

export type UpdateScheduleData = Partial<Omit<CreateScheduleData, "workoutId">>;

// ========================================
// ДОСТУПНОСТЬ ТРЕНЕРОВ
// ========================================

export interface AvailabilitySlot {
  start: string;
  end: string;
  isAvailable: boolean;
  scheduleItemId?: number;
  reason?: string; // причина недоступности
}

export interface TrainerAvailability {
  trainerId: number;
  date: string;
  slots: AvailabilitySlot[];
  workingHours: {
    start: string;
    end: string;
  };
  breaks: Array<{
    start: string;
    end: string;
    reason?: string;
  }>;
  isAvailable: boolean;
  unavailabilityReason?: string;
}

// ========================================
// ШАБЛОНЫ РАСПИСАНИЯ
// ========================================

export interface ScheduleTemplate {
  id: number;
  name: string;
  workoutId: number;
  trainerId: number;
  duration: number; // в минутах
  maxParticipants: number;
  location?: string;
  price?: number;
  defaultTimeSlots: Array<{
    dayOfWeek: number; // 0-6
    startTime: string; // HH:mm
  }>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ========================================
// КОНФЛИКТЫ И ВАЛИДАЦИЯ
// ========================================

export interface ScheduleConflict {
  type: "trainer_busy" | "location_busy" | "time_overlap" | "capacity_exceeded";
  message: string;
  conflictingItems: ScheduleItem[];
  severity: "warning" | "error";
}

export interface ScheduleValidationResult {
  isValid: boolean;
  conflicts: ScheduleConflict[];
  warnings: string[];
}

// ========================================
// СТАТИСТИКА РАСПИСАНИЯ
// ========================================

export interface ScheduleStats {
  totalItems: number;
  activeItems: number;
  completedItems: number;
  cancelledItems: number;
  utilizationRate: number; // процент заполненности
  popularTimeSlots: Array<{
    hour: number;
    count: number;
    utilizationRate: number;
  }>;
  trainerWorkload: Array<{
    trainerId: number;
    hoursScheduled: number;
    sessionsCount: number;
  }>;
}

// ========================================
// РАСПИСАНИЕ ПО ПЕРИОДАМ
// ========================================

export interface WeeklySchedule {
  weekStart: string; // дата начала недели
  weekEnd: string; // дата конца недели
  days: DaySchedule[];
  stats: {
    totalSessions: number;
    totalHours: number;
    averageUtilization: number;
  };
}

export interface DaySchedule {
  date: string;
  dayOfWeek: number;
  scheduleItems: ScheduleItem[];
  availabilitySlots: AvailabilitySlot[];
  workingHours: {
    start: string;
    end: string;
  };
  isWorkingDay: boolean;
}

// ========================================
// BULK ОПЕРАЦИИ
// ========================================

export interface BulkScheduleOperation {
  action: "create" | "update" | "delete" | "cancel";
  items: Array<{
    id?: number;
    data: CreateScheduleData | UpdateScheduleData;
  }>;
  options?: {
    ignoreConflicts?: boolean;
    sendNotifications?: boolean;
    updateRecurring?: boolean;
  };
}

export interface BulkScheduleResult {
  success: number;
  failed: number;
  results: Array<{
    success: boolean;
    item?: ScheduleItem;
    error?: string;
  }>;
  conflicts: ScheduleConflict[];
}
