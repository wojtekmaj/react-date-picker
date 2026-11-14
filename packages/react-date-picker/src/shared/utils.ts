/**
 * Returns a value no smaller than min and no larger than max.
 *
 * @param {Date} value Value to return.
 * @param {Date} min Minimum return value.
 * @param {Date} max Maximum return value.
 * @returns {Date} Value between min and max.
 */
export function between<T extends Date>(value: T, min?: T | null, max?: T | null): T {
  if (min && min > value) {
    return min;
  }

  if (max && max < value) {
    return max;
  }

  return value;
}

function isValidNumber(num: unknown): num is number {
  return num !== null && num !== false && !Number.isNaN(Number(num));
}

export function safeMin(...args: unknown[]): number {
  return Math.min(...args.filter(isValidNumber));
}

export function safeMax(...args: unknown[]): number {
  return Math.max(...args.filter(isValidNumber));
}

// date validation , if user provided or need to put default date i.e. today
export function normalizeToDate<T>(v: T): Date {
  if (!v) return new Date(); // no value → today

  if (v instanceof Date) return v;

  if (typeof v === 'string') return new Date(v);

  // range value: pick start date
  if (Array.isArray(v) && v[0] instanceof Date) return v[0];

  return new Date();
}
