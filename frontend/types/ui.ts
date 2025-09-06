// types/ui.ts - Типы для UI компонентов

// Базовые UI типы

export type Variant = "solid" | "outline" | "soft" | "ghost" | "link";

// Состояния загрузки и ошибок
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  message?: string;
  code?: string | number;
}

// Модальные окна
export interface ModalState {
  isOpen: boolean;
  title?: string;
  size?: Size | "full";
  persistent?: boolean;
}

// Табы
export interface TabItem {
  key: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  badge?: string | number;
}

// Хлебные крошки
export interface BreadcrumbItem {
  label: string;
  to?: string;
  icon?: string;
  disabled?: boolean;
}

// Селекты и опции
export interface SelectOption<T = string | number> {
  label: string;
  value: T;
  disabled?: boolean;
  icon?: string;
  description?: string;
  group?: string;
}

// Таблицы
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
  render?: (value: any, row: T, index: number) => string | any;
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

// Фильтры
export interface FilterOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  icon?: string;
  count?: number;
}

export interface FilterGroup {
  key: string;
  label: string;
  type: "select" | "multiselect" | "range" | "date" | "toggle" | "checkbox";
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

// Поиск
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

// Уведомления
export interface Notification {
  id: string;
  title: string;
  description?: string;
  type: "info" | "success" | "warning" | "error";
  icon?: string;
  timeout?: number;
  actions?: NotificationAction[];
  persistent?: boolean;
}

export interface NotificationAction {
  label: string;
  action: () => void;
  style?: "primary" | "secondary";
}

// Формы
export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "url"
    | "search"
    | "date"
    | "time"
    | "datetime-local";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  validation?: ValidationRule[];
}

export interface ValidationRule {
  type: "required" | "email" | "min" | "max" | "pattern" | "custom";
  value?: any;
  message: string;
  validator?: (value: any) => boolean;
}

// Пагинация
export interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
}

// Календарь
export interface CalendarProps {
  selectedDate?: Date;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  locale?: string;
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

// Файлы
export interface FileUpload {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  url?: string;
  error?: string;
}

export interface FileUploadConfig {
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
  dragAndDrop?: boolean;
}

// Тосты
export interface Toast {
  id: string;
  title: string;
  description?: string;
  color?: Color;
  icon?: string;
  timeout?: number;
  callback?: () => void;
}
