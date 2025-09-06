// types/calendar.ts - Типы для календаря и его UI

import type { ScheduleItem, ScheduleStatus, WorkoutType } from "./index";

// ========================================
// ОСНОВНЫЕ ТИПЫ КАЛЕНДАРЯ
// ========================================

export type CalendarView = "month" | "week" | "day" | "agenda";

export interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  type: WorkoutType;
  trainer: string;
  status: ScheduleStatus;
  isBooked: boolean;
  availableSpots: number;
  maxSpots: number;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps?: {
    scheduleItem: ScheduleItem;
    canBook: boolean;
    canCancel: boolean;
    description?: string;
    location?: string;
    price?: number;
  };
}

// ========================================
// КОНФИГУРАЦИЯ КАЛЕНДАРЯ
// ========================================

export interface CalendarConfig {
  view: CalendarView;
  locale: string;
  timezone: string;
  firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = воскресенье
  businessHours: BusinessHours;
  display: CalendarDisplay;
  features: CalendarFeatures;
}

export interface BusinessHours {
  start: string; // "08:00"
  end: string; // "22:00"
  days: number[]; // [1,2,3,4,5,6] пн-сб
}

export interface CalendarDisplay {
  showWeekends: boolean;
  showWeekNumbers: boolean;
  showTime: boolean;
  timeFormat: "12h" | "24h";
  dayMaxEvents: number;
  eventLimit: boolean;
  moreLinkText: string;
  slotDuration: number; // минут
  slotHeight: number; // пикселей
}

export interface CalendarFeatures {
  booking: boolean;
  cancellation: boolean;
  eventDetails: boolean;
  dateNavigation: boolean;
  viewSwitching: boolean;
  export: boolean;
  print: boolean;
}

// ========================================
// ФИЛЬТРЫ КАЛЕНДАРЯ
// ========================================

export interface CalendarFilters {
  status?: ScheduleStatus[];
  types?: WorkoutType[];
  trainers?: number[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  availability?: "available" | "full" | "any";
  userBookings?: "my-bookings" | "not-booked" | "any";
  timeRange?: {
    start: string; // "09:00"
    end: string; // "18:00"
  };
}

// ========================================
// СОСТОЯНИЕ КАЛЕНДАРЯ
// ========================================

export interface CalendarState {
  currentDate: Date;
  selectedDate?: Date;
  selectedEvents: CalendarEvent[];
  view: CalendarView;
  filters: CalendarFilters;
  loading: boolean;
  error?: string;
  events: CalendarEvent[];
}

// ========================================
// ЦВЕТОВЫЕ СХЕМЫ
// ========================================

export interface EventColorScheme {
  primary: string;
  background: string;
  border: string;
  text: string;
}

export interface CalendarTheme {
  colorScheme: "light" | "dark" | "auto";
  primaryColor: string;
  eventColors: Record<WorkoutType, EventColorScheme>;
  customColors?: {
    background: string;
    text: string;
    border: string;
    accent: string;
  };
}

// ========================================
// ВЗАИМОДЕЙСТВИЕ С КАЛЕНДАРЕМ
// ========================================

export interface CalendarEventHandlers {
  onDateSelect?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onEventHover?: (event: CalendarEvent) => void;
  onSlotSelect?: (slotInfo: { start: Date; end: Date }) => void;
  onViewChange?: (view: CalendarView) => void;
  onNavigate?: (date: Date) => void;
  onBook?: (event: CalendarEvent) => void;
  onCancel?: (event: CalendarEvent) => void;
}

export interface CalendarAction {
  type:
    | "select-date"
    | "select-event"
    | "book-event"
    | "cancel-booking"
    | "change-view";
  payload: any;
  timestamp: Date;
}

// ========================================
// НАВИГАЦИЯ И ОТОБРАЖЕНИЕ
// ========================================

export interface CalendarNavigation {
  showToday: boolean;
  showPrevNext: boolean;
  showViewSwitcher: boolean;
  showDatePicker: boolean;
  allowNavigation: boolean;
  minDate?: Date;
  maxDate?: Date;
}

export interface CalendarDate {
  year: number;
  month: number;
  day: number;
}

export interface CalendarMonth {
  year: number;
  month: number;
  weeks: CalendarWeek[];
  events: CalendarEvent[];
}

export interface CalendarWeek {
  weekNumber: number;
  days: CalendarDay[];
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isWeekend: boolean;
  isHoliday?: boolean;
  events: CalendarEvent[];
  availableSlots: number;
  workingHours?: {
    start: string;
    end: string;
  };
}

// ========================================
// ВРЕМЕННЫЕ СЛОТЫ
// ========================================

export interface DayTimeSlots {
  date: Date;
  slots: TimeSlot[];
  workingHours: {
    start: string;
    end: string;
  };
}

// ========================================
// ЭКСПОРТ И ПЕЧАТЬ
// ========================================

export interface CalendarExportOptions {
  format: "ics" | "csv" | "json" | "pdf";
  dateRange: {
    start: Date;
    end: Date;
  };
  includeFields: Array<keyof CalendarEvent>;
  filters?: CalendarFilters;
  timezone?: string;
}

export interface CalendarPrintOptions {
  view: CalendarView;
  dateRange: {
    start: Date;
    end: Date;
  };
  showDetails: boolean;
  showColors: boolean;
  pageSize: "A4" | "A3" | "Letter";
  orientation: "portrait" | "landscape";
}

// ========================================
// ПОЛЬЗОВАТЕЛЬСКИЕ НАСТРОЙКИ
// ========================================

export interface UserCalendarPreferences {
  userId: number;
  defaultView: CalendarView;
  timezone: string;
  locale: string;
  theme: CalendarTheme;
  features: Partial<CalendarFeatures>;
  filters: Partial<CalendarFilters>;
  notifications: {
    enabled: boolean;
    reminderMinutes: number[];
    channels: ("email" | "push" | "sms")[];
  };
}

// ========================================
// МОБИЛЬНАЯ АДАПТАЦИЯ
// ========================================

export interface CalendarMobileConfig {
  compactMode: boolean;
  swipeNavigation: boolean;
  touchGestures: boolean;
  responsiveBreakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  mobileViews: CalendarView[];
}

// ========================================
// ПРОИЗВОДИТЕЛЬНОСТЬ
// ========================================

export interface CalendarPerformance {
  virtualScrolling: boolean;
  lazyLoading: boolean;
  eventBatching: boolean;
  renderOptimization: boolean;
  maxEventsPerDay: number;
  cacheTimeout: number; // минут
}
