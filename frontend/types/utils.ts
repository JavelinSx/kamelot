// types/utils.ts - ТОЛЬКО УТИЛИТАРНЫЕ ТИПЫ

// ========================================
// УТИЛИТАРНЫЕ ТИПЫ
// ========================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type Nullable<T> = T | null;

export type Maybe<T> = T | null | undefined;

export type ArrayElement<T> = T extends (infer U)[] ? U : never;

export type ValueOf<T> = T[keyof T];

export type StringKeys<T> = Extract<keyof T, string>;

export type NumberKeys<T> = Extract<keyof T, number>;

export type EntityId<T extends string> = `${T}Id`;

export type CreateEntity<T> = Omit<T, "id" | "createdAt" | "updatedAt">;
export type UpdateEntity<T> = Partial<
  Omit<T, "id" | "createdAt" | "updatedAt">
>;

// ========================================
// ТИПЫ ДЛЯ ДАТА И ВРЕМЕНИ
// ========================================

export interface DateFormatOptions {
  locale?: string;
  format?: "short" | "medium" | "long" | "full" | string;
  timezone?: string;
}

export interface TimeFormatOptions {
  format?: "12h" | "24h";
  showSeconds?: boolean;
  timezone?: string;
}

export interface RelativeDateOptions {
  locale?: string;
  numeric?: "always" | "auto";
  style?: "long" | "short" | "narrow";
}

// ========================================
// ТИПЫ ДЛЯ ТАБЛИЦ И ФИЛЬТРАЦИИ
// ========================================

export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  searchable?: boolean;
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  align?: "left" | "center" | "right";
  fixed?: "left" | "right";
  render?: (value: any, row: T, index: number) => string | Node;
  formatter?: (value: any) => string;
}

export interface TableState<T = any> {
  data: T[];
  loading: boolean;
  error?: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  sorting: {
    field?: string;
    direction: "asc" | "desc";
  };
  filters: Record<string, any>;
}

export interface FilterOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  icon?: string;
}

export interface FilterGroup {
  key: string;
  label: string;
  type: "select" | "multiselect" | "range" | "date" | "toggle";
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
}

export interface SearchConfig {
  placeholder: string;
  minChars: number;
  debounceMs: number;
  searchIn: string[];
  highlightMatches: boolean;
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  query: string;
  suggestions?: string[];
  took: number;
}

// ========================================
// ТИПЫ ДЛЯ СТАТИСТИКИ И ГРАФИКОВ
// ========================================

export interface ChartDataPoint {
  x: string | number | Date;
  y: number;
  label?: string;
  color?: string;
}

export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  color?: string;
  type?: "line" | "bar" | "area" | "pie";
}

export interface ChartConfig {
  type: "line" | "bar" | "pie" | "doughnut" | "area";
  title?: string;
  width?: number;
  height?: number;
  responsive: boolean;
  theme: "light" | "dark";
  colors: string[];
  legend: {
    show: boolean;
    position: "top" | "bottom" | "left" | "right";
  };
  tooltip: {
    enabled: boolean;
    format?: string;
  };
}

export interface StatsCard {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
    period: string;
  };
  icon?: string;
  color?: string;
  format?: "number" | "currency" | "percentage" | "duration";
}

// ========================================
// ТИПЫ ДЛЯ ЛОКАЛИЗАЦИИ
// ========================================

export interface LocaleConfig {
  code: string;
  name: string;
  flag?: string;
  rtl: boolean;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  numberFormat: {
    decimal: string;
    thousands: string;
  };
}

export interface TranslationFunction {
  (key: string, params?: Record<string, any>): string;
}

export interface DateTimeFormat {
  short: Intl.DateTimeFormatOptions;
  long: Intl.DateTimeFormatOptions;
  numeric: Intl.DateTimeFormatOptions;
}

export interface NumberFormat {
  currency: Intl.NumberFormatOptions;
  decimal: Intl.NumberFormatOptions;
  percent: Intl.NumberFormatOptions;
}

// ========================================
// ТИПЫ ДЛЯ УВЕДОМЛЕНИЙ
// ========================================

export interface ToastOptions {
  title?: string;
  description?: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
  closable?: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
    style?: "primary" | "secondary";
  }>;
}

export interface NotificationConfig {
  position:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
  duration: number;
  maxNotifications: number;
  showProgress: boolean;
  pauseOnHover: boolean;
  newestOnTop: boolean;
}

// ========================================
// ТИПЫ ДЛЯ НАВИГАЦИИ
// ========================================

export interface NavItem {
  name: string;
  path: string;
  icon?: string;
  badge?: string | number;
  children?: NavItem[];
  meta?: {
    requiresAuth?: boolean;
    roles?: string[];
    exact?: boolean;
  };
}

export interface MenuItem {
  label: string;
  icon?: string;
  to?: string;
  click?: () => void;
  disabled?: boolean;
  divider?: boolean;
  children?: MenuItem[];
}

// ========================================
// ТИПЫ ДЛЯ МЕДИА И ФАЙЛОВ
// ========================================

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  width?: number;
  height?: number;
  alt?: string;
  createdAt: string;
}

export interface UploadOptions {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  quality?: number;
  resize?: {
    width: number;
    height: number;
  };
}

// ========================================
// ТИПЫ ДЛЯ КАЛЕНДАРЯ
// ========================================

export interface CalendarOptions {
  view: "month" | "week" | "day" | "agenda";
  locale: string;
  firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  showWeekNumbers: boolean;
  showOtherMonths: boolean;
  selectOtherMonths: boolean;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[] | ((date: Date) => boolean);
  highlightedDates?: Date[] | ((date: Date) => boolean);
  eventColor?: string | ((event: any) => string);
  dayMaxEvents?: number;
  moreLinkText?: string | ((num: number) => string);
}

// ========================================
// ТИПЫ ДЛЯ АНИМАЦИЙ
// ========================================

export interface AnimationPreset {
  name: string;
  enter: {
    from: Record<string, any>;
    to: Record<string, any>;
    duration: number;
    easing?: string;
  };
  leave: {
    from: Record<string, any>;
    to: Record<string, any>;
    duration: number;
    easing?: string;
  };
}

export interface TransitionOptions {
  name?: string;
  mode?: "in-out" | "out-in" | "default";
  duration?: number | { enter: number; leave: number };
  easing?: string;
  disabled?: boolean;
}

// ========================================
// ТИПЫ ДЛЯ ПРОИЗВОДИТЕЛЬНОСТИ
// ========================================

export interface PerformanceConfig {
  enableProfiling: boolean;
  enableDevtools: boolean;
  lazyLoading: {
    images: boolean;
    components: boolean;
    routes: boolean;
  };
  caching: {
    api: boolean;
    static: boolean;
    ttl: number;
  };
  bundleAnalysis: boolean;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  tags?: Record<string, string>;
}
