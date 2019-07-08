import getUserLocale from 'get-user-locale';

/* eslint-disable import/prefer-default-export */

export const getFormatter = options => (locale, date) => (
  date.toLocaleString(locale || getUserLocale(), options)
);

/**
 * Changes the hour in a Date to ensure right date formatting even if DST is messed up.
 * Workaround for bug in WebKit and Firefox with historical dates.
 * For more details, see:
 * https://bugs.chromium.org/p/chromium/issues/detail?id=750465
 * https://bugzilla.mozilla.org/show_bug.cgi?id=1385643
 *
 * @param {Date} date Date.
 */
const toSafeHour = (date) => {
  const safeDate = new Date(date);
  return new Date(safeDate.setHours(12));
};

const getSafeFormatter = options => (locale, date) => (
  getFormatter(options)(locale, toSafeHour(date))
);

const formatMonthOptions = { month: 'long' };
const formatShortMonthOptions = { month: 'short' };

export const formatMonth = getSafeFormatter(formatMonthOptions);
export const formatShortMonth = getSafeFormatter(formatShortMonthOptions);
