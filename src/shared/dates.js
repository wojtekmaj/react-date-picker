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
