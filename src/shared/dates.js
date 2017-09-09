/* Simple getters - getting a property of a given point in time */

export const getYear = (date) => {
  if (date instanceof Date) {
    return date.getFullYear();
  }

  if (typeof date === 'number') {
    return date;
  }

  const year = parseInt(date, 10);

  if (typeof date === 'string' && !isNaN(year)) {
    return year;
  }

  throw new Error(`Failed to get year from date: ${date}.`);
};

export const getMonthIndex = date => date.getMonth();

export const getMonth = date => date.getMonth() + 1;

export const getDay = date => date.getDate();

/* Complex getters - getting a property somehow related to a given point in time */

/**
 * Returns a number of days in a month of a given date.
 *
 * @param {Date} date Date.
 */
export const getDaysInMonth = (date) => {
  const year = getYear(date);
  const monthIndex = getMonthIndex(date);
  return new Date(year, monthIndex + 1, 0).getDate();
};

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
  const month = `0${getMonthIndex(value) + 1}`.slice(-2);
  const day = `0${getDay(value)}`.slice(-2);

  return `${year}-${month}-${day}`;
};
