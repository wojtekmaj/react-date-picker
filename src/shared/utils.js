export {
  between,
  callIfDefined,
} from 'react-calendar/dist/shared/utils';

function isValidNumber(a) {
  return typeof a === 'number' && !isNaN(a);
}

export function safeMin(...args) {
  return Math.min(...args.filter(isValidNumber));
}

export function safeMax(...args) {
  return Math.max(...args.filter(isValidNumber));
}
