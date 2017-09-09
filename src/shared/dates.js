import {
  getYear,
  getMonthIndex,
  getDay,
  getDaysInMonth,
  getBegin,
  getEnd,
} from 'react-calendar/src/shared/dates';

export {
  getYear,
  getMonthIndex,
  getDay,
  getDaysInMonth,
  getBegin,
  getEnd,
};

/* Simple getters - getting a property of a given point in time */

export const getMonth = date => date.getMonth() + 1;

/* Complex getters - getting a property somehow related to a given point in time */

/**
 * Returns local month in ISO-like format (YYYY-MM).
 */
export const getISOLocalMonth = (value) => {
  if (!value) {
    return value;
  }

  if (!(value instanceof Date)) {
    throw new Error(`Invalid date: ${value}`);
  }

  const year = getYear(value);
  const month = `0${getMonth(value)}`.slice(-2);

  return `${year}-${month}`;
};

/**
 * Returns local date in ISO-like format (YYYY-MM-DD).
 */
export const getISOLocalDate = (value) => {
  if (!value) {
    return value;
  }

  if (!(value instanceof Date)) {
    throw new Error(`Invalid date: ${value}`);
  }

  const year = getYear(value);
  const month = `0${getMonth(value)}`.slice(-2);
  const day = `0${getDay(value)}`.slice(-2);

  return `${year}-${month}-${day}`;
};
