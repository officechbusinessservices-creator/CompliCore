/**
 * Joins class names, filtering falsy values.
 * Avoids a clsx dependency while keeping conditional className patterns clean.
 */
export function cn(...classes: (string | undefined | null | false | 0)[]): string {
  return classes.filter(Boolean).join(' ')
}
