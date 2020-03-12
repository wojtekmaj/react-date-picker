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

/**
 * Calls a function, if it's defined, with specified arguments
 * @param {Function} fn
 * @param {Object} args
 */
export function callIfDefined(fn, ...args) {
  if (fn && typeof fn === 'function') {
    fn(...args);
  }
}

function isValidNumber(a) {
  return typeof a === 'number' && !isNaN(a);
}

export function safeMin(...args) {
  return Math.min(...args.filter(isValidNumber));
}

export function safeMax(...args) {
  return Math.max(...args.filter(isValidNumber));
}
