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

export function safeMin(...args: unknown[]) {
  return Math.min(...args.filter(isValidNumber));
}

export function safeMax(...args: unknown[]) {
  return Math.max(...args.filter(isValidNumber));
}
