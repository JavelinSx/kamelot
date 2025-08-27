// utils/type-safe.ts
/**
 * Типобезопасные утилиты для работы с объектами
 */

/**
 * Типобезопасная версия Object.entries
 */
export function typedEntries<T extends Record<string, any>>(
  obj: T
): Array<[keyof T, T[keyof T]]> {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>;
}

/**
 * Типобезопасная версия Object.keys
 */
export function typedKeys<T extends Record<string, any>>(
  obj: T
): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}

/**
 * Типобезопасная версия Object.values
 */
export function typedValues<T extends Record<string, any>>(
  obj: T
): Array<T[keyof T]> {
  return Object.values(obj) as Array<T[keyof T]>;
}

/**
 * Фильтрация записей объекта с сохранением типов
 */
export function filterEntries<T extends Record<string, any>>(
  obj: T,
  predicate: (entry: [keyof T, T[keyof T]]) => boolean
): Array<[keyof T, T[keyof T]]> {
  return typedEntries(obj).filter(predicate);
}

/**
 * Маппинг записей объекта с сохранением типов
 */
export function mapEntries<T extends Record<string, any>, R>(
  obj: T,
  mapper: (entry: [keyof T, T[keyof T]]) => R
): R[] {
  return typedEntries(obj).map(mapper);
}

/**
 * Создание нового объекта из отфильтрованных записей
 */
export function filterObject<T extends Record<string, any>>(
  obj: T,
  predicate: (entry: [keyof T, T[keyof T]]) => boolean
): Partial<T> {
  const filtered = filterEntries(obj, predicate);
  return Object.fromEntries(filtered) as Partial<T>;
}

/**
 * Получение записей с определенным типом значения
 */
export function getEntriesByType<T extends Record<string, any>, V>(
  obj: T,
  typeGuard: (value: any) => value is V
): Array<[keyof T, V]> {
  return typedEntries(obj).filter(([_, value]) => typeGuard(value)) as Array<
    [keyof T, V]
  >;
}
