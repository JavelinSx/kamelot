// types/calendar.ts
import type { CalendarDate } from "@internationalized/date";
import type { WorkoutType } from "./index";

// Основные интерфейсы календаря
export interface CalendarEvent {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  type: WorkoutType;
  status: EventStatus;
  description?: string;
  instructor?: {
    id: number;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  participants?: CalendarParticipant[];
  maxParticipants: number;
  currentParticipants: number;
  isUserBooked?: boolean;
  canBook?: boolean;
  canCancel?: boolean;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
}

export interface CalendarParticipant {
  id: number;
  firstName: string;
  lastName: string;
  avatar?: string;
  bookedAt: string;
  status: "confirmed" | "pending" | "cancelled";
}

export type EventStatus =
  | "scheduled"
  | "booked"
  | "completed"
  | "cancelled"
  | "no-show";

export type CalendarView = "month" | "week" | "day";

// Конфигурация календаря
export interface CalendarConfig {
  view: CalendarView;
  locale: string;
  timezone: string;
  firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = воскресенье, 1 = понедельник
  businessHours: BusinessHours;
  eventColors: Record<WorkoutType, EventColorScheme>;
  features: CalendarFeatures;
}

export interface BusinessHours {
  start: string; // "08:00"
  end: string; // "22:00"
  days: number[]; // [1,2,3,4,5,6,0] понедельник-воскресенье
  timezone: string;
}

export interface EventColorScheme {
  primary: string;
  background: string;
  border: string;
  text: string;
}

export interface CalendarFeatures {
  booking: boolean;
  cancellation: boolean;
  multipleSelection: boolean;
  dateRangeSelection: boolean;
  eventDetails: boolean;
  instructorInfo: boolean;
  participantsList: boolean;
  notifications: boolean;
  export: boolean;
}

// Фильтры и поиск
export interface CalendarFilters {
  status?: EventStatus[];
  types?: WorkoutType[];
  instructors?: number[];
  dateRange?: {
    start: CalendarDate;
    end: CalendarDate;
  };
  availability?: "available" | "full" | "any";
  userBookings?: "my-bookings" | "not-booked" | "any";
}

export interface CalendarSearchParams {
  query?: string;
  filters?: CalendarFilters;
  sortBy?: "date" | "type" | "instructor" | "availability";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

// Данные дня в календаре
export interface CalendarDay {
  date: CalendarDate;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isWeekend: boolean;
  isDisabled: boolean;
  events: CalendarEvent[];
  hasEvents: boolean;
  isFullyBooked: boolean;
}

// События календаря
export interface CalendarEventHandlers {
  onDateSelect: (date: CalendarDate) => void;
  onEventClick: (event: CalendarEvent) => void;
  onEventBook: (event: CalendarEvent) => Promise<boolean>;
  onEventCancel: (event: CalendarEvent) => Promise<boolean>;
  onViewChange: (view: CalendarView) => void;
  onNavigate: (direction: "prev" | "next" | "today") => void;
  onFilterChange: (filters: CalendarFilters) => void;
}

// Состояние календаря
export interface CalendarState {
  selectedDate: CalendarDate;
  currentView: CalendarView;
  isLoading: boolean;
  error: string | null;
  events: CalendarEvent[];
  filteredEvents: CalendarEvent[];
  activeFilters: CalendarFilters;
  selectedEvent: CalendarEvent | null;
  config: CalendarConfig;
}

// API интерфейсы
export interface CalendarAPI {
  getEvents: (params: CalendarSearchParams) => Promise<CalendarEvent[]>;
  getUserWorkouts: (
    userId: number,
    params: CalendarSearchParams
  ) => Promise<CalendarEvent[]>;
  bookEvent: (
    eventId: number
  ) => Promise<{ success: boolean; event: CalendarEvent }>;
  cancelBooking: (
    eventId: number
  ) => Promise<{ success: boolean; event: CalendarEvent }>;
  createEvent: (event: Partial<CalendarEvent>) => Promise<CalendarEvent>;
  updateEvent: (
    eventId: number,
    updates: Partial<CalendarEvent>
  ) => Promise<CalendarEvent>;
  deleteEvent: (eventId: number) => Promise<boolean>;
}

// Интеграция с внешними календарями
export interface ExternalCalendarProvider {
  name: "google" | "outlook" | "apple" | "icalendar";
  isConnected: boolean;
  syncEnabled: boolean;
  lastSync?: string;
  config: Record<string, any>;
}

export interface ExternalCalendarEvent {
  externalId: string;
  provider: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  location?: string;
  attendees?: string[];
  isRecurring: boolean;
  recurrenceRule?: string;
}

// Статистика и аналитика
export interface CalendarStats {
  totalEvents: number;
  bookedEvents: number;
  completedEvents: number;
  cancelledEvents: number;
  utilizationRate: number;
  popularTypes: Array<{
    type: WorkoutType;
    count: number;
    percentage: number;
  }>;
  busyDays: CalendarDate[];
  peakHours: Array<{
    hour: number;
    count: number;
  }>;
}

// Уведомления
export interface CalendarNotification {
  id: string;
  type: "booking" | "cancellation" | "reminder" | "change";
  eventId: number;
  userId: number;
  title: string;
  message: string;
  scheduledFor: string;
  status: "pending" | "sent" | "failed";
  createdAt: string;
}

// Настройки пользователя
export interface UserCalendarPreferences {
  userId: number;
  defaultView: CalendarView;
  timezone: string;
  locale: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    reminderMinutes: number[];
  };
  theme: {
    colorScheme: "light" | "dark" | "auto";
    primaryColor: string;
    eventColors: Record<WorkoutType, EventColorScheme>;
  };
  features: {
    showWeekends: boolean;
    show24Hour: boolean;
    showEventDetails: boolean;
    autoBook: boolean;
    allowCancellation: boolean;
  };
}

// Шаблоны событий
export interface EventTemplate {
  id: number;
  name: string;
  type: WorkoutType;
  duration: number;
  maxParticipants: number;
  description?: string;
  defaultInstructor?: number;
  recurrence?: {
    frequency: "daily" | "weekly" | "monthly";
    interval: number;
    daysOfWeek?: number[];
    endDate?: CalendarDate;
    occurrences?: number;
  };
  isActive: boolean;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

// Экспорт данных
export interface CalendarExportOptions {
  format: "ics" | "csv" | "json" | "pdf";
  dateRange: {
    start: CalendarDate;
    end: CalendarDate;
  };
  includeFields: Array<keyof CalendarEvent>;
  filters?: CalendarFilters;
}

export interface CalendarExportResult {
  filename: string;
  data: string | Uint8Array;
  mimeType: string;
  size: number;
}

// Валидация
export interface CalendarValidationRules {
  event: {
    minDuration: number; // минуты
    maxDuration: number;
    minParticipants: number;
    maxParticipants: number;
    advanceBookingDays: number;
    cancellationHours: number;
  };
  booking: {
    maxBookingsPerDay: number;
    maxBookingsPerWeek: number;
    requiresApproval: boolean;
  };
  schedule: {
    conflictResolution: "reject" | "warn" | "allow";
    gapBetweenEvents: number; // минуты
  };
}

// Утилиты для работы с календарем
export interface CalendarUtils {
  formatDate: (date: CalendarDate, format?: string) => string;
  formatTime: (time: string, format?: "12h" | "24h") => string;
  formatDuration: (minutes: number) => string;
  getWeekStart: (date: CalendarDate) => CalendarDate;
  getWeekEnd: (date: CalendarDate) => CalendarDate;
  getMonthStart: (date: CalendarDate) => CalendarDate;
  getMonthEnd: (date: CalendarDate) => CalendarDate;
  isEventConflict: (event1: CalendarEvent, event2: CalendarEvent) => boolean;
  calculateEventDuration: (start: string, end: string) => number;
  isWithinBusinessHours: (
    time: string,
    businessHours: BusinessHours
  ) => boolean;
  generateRecurringEvents: (
    template: EventTemplate,
    dateRange: { start: CalendarDate; end: CalendarDate }
  ) => CalendarEvent[];
}

// Интеграция с компонентами NuxtUI
export interface NuxtUICalendarProps {
  modelValue?:
    | CalendarDate
    | CalendarDate[]
    | { start: CalendarDate; end: CalendarDate };
  multiple?: boolean;
  range?: boolean;
  numberOfMonths?: number;
  minValue?: CalendarDate;
  maxValue?: CalendarDate;
  isDateDisabled?: (date: CalendarDate) => boolean;
  locale?: string;
  color?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  ui?: Record<string, any>;
}

export interface CalendarSlotProps {
  day: CalendarDate;
  isSelected: boolean;
  isToday: boolean;
  isDisabled: boolean;
  events: CalendarEvent[];
}

// Расширенные типы для интеграции с вашим проектом
export interface MartialArtsCalendarEvent extends CalendarEvent {
  workout: {
    id: number;
    name: string;
    type: WorkoutType;
    duration: number;
    difficulty: "beginner" | "intermediate" | "advanced";
    description?: string;
    requirements?: string[];
    equipment?: string[];
  };
  dojo?: {
    id: number;
    name: string;
    address: string;
  };
  belt?: {
    required?: string;
    awarded?: string[];
  };
  specialEvent?: {
    isCompetition: boolean;
    isExam: boolean;
    isSeminar: boolean;
    certificate?: boolean;
  };
}
