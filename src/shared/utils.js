import { getFormatter } from './dateFormatter';

/**
 * Returns a value no smaller than min and no larger than max.
 *
 * @param {*} value Value to return.
 * @param {*} min Minimum return value.
 * @param {*} max Maximum return value.
 */
export function between(value, min, max) {
  if (min && min > value) {
    return min;
  }
  if (max && max < value) {
    return max;
  }
  return value;
}

export function getYearOffset(locale) {
  const now = new Date();
  return Number(
    getFormatter({ year: 'numeric' })(locale, now).match(/\d{1,}/)[0],
  ) - now.getFullYear();
}

function isValidNumber(num) {
  return num !== null && num !== false && !Number.isNaN(Number(num));
}

export function safeMin(...args) {
  return Math.min(...args.filter(isValidNumber));
}

export function safeMax(...args) {
  return Math.max(...args.filter(isValidNumber));
}
