// types/booking.ts - Типы для бронирований

import type { ScheduleItem, User } from "./index";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show"
  | "waiting_list";

export interface Booking {
  id: number;
  scheduleItem: ScheduleItem;
  user: User;
  status: BookingStatus;
  bookedAt: string;
  confirmedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  notes?: string;
  rating?: number;
  review?: string;
  paymentStatus?: PaymentStatus;
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentStatus = "pending" | "paid" | "refunded" | "failed";

// Создание бронирования
export interface CreateBookingData {
  scheduleItemId: number;
  notes?: string;
}

// Отмена бронирования
export interface CancelBookingData {
  reason?: string;
  requestRefund?: boolean;
}

// Оценка тренировки
export interface RateWorkoutData {
  rating: number;
  review?: string;
}

// Фильтры для бронирований пользователя
export interface BookingFilter {
  status?: BookingStatus[];
  dateRange?: {
    start: string;
    end: string;
  };
  workoutType?: string[];
  trainerId?: number[];
  search?: string;
}

// Статистика бронирований
export interface BookingStats {
  total: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  noShow: number;
  completionRate: number;
  averageRating: number;
  totalHours: number;
}

// История бронирований
export interface BookingHistory {
  bookings: Booking[];
  stats: BookingStats;
  upcomingCount: number;
  pastCount: number;
}

// Уведомления о бронированиях
export interface BookingNotification {
  id: number;
  bookingId: number;
  type: BookingNotificationType;
  message: string;
  isRead: boolean;
  scheduledAt: string;
  sentAt?: string;
  createdAt: string;
}

export type BookingNotificationType =
  | "booking_confirmed"
  | "booking_cancelled"
  | "workout_reminder"
  | "workout_starting"
  | "workout_completed"
  | "review_request"
  | "schedule_changed";
