import {
  getYear,
  getMonthIndex,
  getDay,
  getDaysInMonth,
  getISOLocalDate,
} from 'react-calendar/src/shared/dates';

export {
  getYear,
  getMonthIndex,
  getDay,
  getDaysInMonth,
  getISOLocalDate,
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
  const month = `0${getMonthIndex(value) + 1}`.slice(-2);

  return `${year}-${month}`;
};
