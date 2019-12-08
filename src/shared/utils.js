export {
  between,
  callIfDefined,
} from 'react-calendar/dist/umd/shared/utils';

const isValidNumber = a => typeof a === 'number' && !isNaN(a);

export const min = (...args) => Math.min(...args.filter(isValidNumber));
export const max = (...args) => Math.max(...args.filter(isValidNumber));
