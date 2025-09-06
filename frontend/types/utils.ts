// types/utils.ts - Утилитарные типы

// Базовые утилитарные типы
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

export type SymbolKeys<T> = Extract<keyof T, symbol>;

// Типы для сущностей
export type EntityId = number;

export type CreateEntity<T> = Omit<T, "id" | "createdAt" | "updatedAt">;

export type UpdateEntity<T> = Partial<
  Omit<T, "id" | "createdAt" | "updatedAt">
>;

export type EntityWithTimestamps<T> = T & {
  createdAt: string;
  updatedAt: string;
};

// Типы для дат и времени
export interface DateRange {
  start: Date | string;
  end: Date | string;
}

export interface TimeRange {
  start: string; // HH:mm
  end: string; // HH:mm
}

export interface DateTimeRange {
  start: Date | string;
  end: Date | string;
}

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

// Типы для ключей объектов
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export type PickByType<T, U> = Pick<T, KeysOfType<T, U>>;

export type OmitByType<T, U> = Omit<T, KeysOfType<T, U>>;

// Функциональные типы
export type Predicate<T> = (value: T) => boolean;

export type Mapper<T, U> = (value: T) => U;

export type Reducer<T, U> = (accumulator: U, current: T, index: number) => U;

export type Comparator<T> = (a: T, b: T) => number;

// Типы для промисов
export type PromiseValue<T> = T extends Promise<infer U> ? U : T;

export type AsyncFunction<T extends any[], R> = (...args: T) => Promise<R>;

export type SyncFunction<T extends any[], R> = (...args: T) => R;

// Типы для событий
export type EventHandler<T = Event> = (event: T) => void;

export type EventMap = Record<string, any>;

export type EventKey<T extends EventMap> = string & keyof T;

export type EventCallback<T extends EventMap, K extends EventKey<T>> = (
  payload: T[K]
) => void;

// Типы для валидации
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export type Validator<T> = (value: T) => ValidationResult;

export type ValidatorRule<T> = {
  validate: Validator<T>;
  message: string;
  type: string;
};

// Типы для состояния
export type Status = "idle" | "loading" | "success" | "error";

export interface AsyncState<T> {
  data: T | null;
  status: Status;
  error: string | null;
}

export interface Resource<T> extends AsyncState<T> {
  refetch: () => Promise<void>;
  mutate: (data: T) => void;
}

// Типы для координат и размеров
export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Rectangle extends Point, Size {}

export interface Bounds {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

// Типы для цветов
export type HexColor = `#${string}`;

export type RgbColor = `rgb(${number}, ${number}, ${number})`;

export type RgbaColor = `rgba(${number}, ${number}, ${number}, ${number})`;

export type Color = HexColor | RgbColor | RgbaColor | string;

// Типы для медиа
export interface ImageInfo {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
}

export interface VideoInfo {
  src: string;
  poster?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
}

// Типы для браузера
export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export interface MediaQuery {
  matches: boolean;
  breakpoint: Breakpoint;
}

export interface ViewportSize extends Size {
  breakpoint: Breakpoint;
}

// Типы для сортировки
export type SortDirection = "asc" | "desc";

export interface SortConfig<T> {
  field: keyof T;
  direction: SortDirection;
}

export type SortFunction<T> = (a: T, b: T) => number;

// Типы для группировки
export type GroupKey = string | number;

export type GroupFunction<T> = (item: T) => GroupKey;

export interface Group<T> {
  key: GroupKey;
  items: T[];
  count: number;
}

// Типы для дерева данных
export interface TreeNode<T = any> {
  id: string | number;
  parentId?: string | number | null;
  data: T;
  children?: TreeNode<T>[];
  level?: number;
  expanded?: boolean;
}

export type TreeData<T> = TreeNode<T>[];

// Типы для конфигурации
export interface Config {
  [key: string]: any;
}

export type ConfigProvider<T extends Config> = () => T;

export type ConfigResolver<T extends Config> = (config: T) => T;

// Типы для метаданных
export interface MetaData {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  image?: string;
  url?: string;
  type?: string;
}

// Условные типы
export type If<C extends boolean, T, F> = C extends true ? T : F;

export type IsArray<T> = T extends any[] ? true : false;

export type IsObject<T> = T extends object
  ? T extends any[]
    ? false
    : true
  : false;

export type IsFunction<T> = T extends (...args: any[]) => any ? true : false;

export type IsString<T> = T extends string ? true : false;

export type IsNumber<T> = T extends number ? true : false;

export type IsBoolean<T> = T extends boolean ? true : false;
