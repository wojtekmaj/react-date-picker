import getUserLocale from 'get-user-locale';

import type { Detail } from './types.js';

const formatterCache = new Map();

function getDateTimeFormat(
  locale: string | undefined,
  options: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormat {
  const localeWithDefault = locale || getUserLocale();

  if (!formatterCache.has(localeWithDefault)) {
    formatterCache.set(localeWithDefault, new Map());
  }

  const formatterCacheLocale = formatterCache.get(localeWithDefault);

  if (!formatterCacheLocale.has(options)) {
    const formatter = new Intl.DateTimeFormat(localeWithDefault || undefined, options);

    formatterCacheLocale.set(options, formatter);
  }

  return formatterCacheLocale.get(options);
}

export function getFormatter(
  options: Intl.DateTimeFormatOptions,
): (locale: string | undefined, date: Date) => string {
  return (locale, date) => getDateTimeFormat(locale, options).format(date);
}

const dateInputOptions: Record<Detail, Intl.DateTimeFormatOptions> = {
  century: { year: 'numeric' },
  decade: { year: 'numeric' },
  year: { year: 'numeric', month: 'numeric' },
  month: { year: 'numeric', month: 'numeric', day: 'numeric' },
};

const dateInputTokens: Record<string, string> = {
  year: 'y',
  relatedYear: 'y',
  month: 'M',
  day: 'd',
};

export function getDateInputFormat(locale: string | undefined, maxDetail: Detail): string {
  const formatter = getDateTimeFormat(locale, dateInputOptions[maxDetail]);

  return formatter
    .formatToParts(new Date(2017, 11, 11))
    .map(({ type, value }) => dateInputTokens[type] || value)
    .join('');
}

/**
 * Changes the hour in a Date to ensure right date formatting even if DST is messed up.
 * Workaround for bug in WebKit and Firefox with historical dates.
 * For more details, see:
 * https://bugs.chromium.org/p/chromium/issues/detail?id=750465
 * https://bugzilla.mozilla.org/show_bug.cgi?id=1385643
 *
 * @param {Date} date Date.
 * @returns {Date} Date with hour set to 12.
 */
function toSafeHour(date: Date): Date {
  const safeDate = new Date(date);
  return new Date(safeDate.setHours(12));
}

function getSafeFormatter(
  options: Intl.DateTimeFormatOptions,
): (locale: string | undefined, date: Date) => string {
  return (locale, date) => getFormatter(options)(locale, toSafeHour(date));
}

const formatMonthOptions = { month: 'long' } satisfies Intl.DateTimeFormatOptions;
const formatShortMonthOptions = { month: 'short' } satisfies Intl.DateTimeFormatOptions;

export const formatMonth: (locale: string | undefined, date: Date) => string =
  getSafeFormatter(formatMonthOptions);
export const formatShortMonth: (locale: string | undefined, date: Date) => string =
  getSafeFormatter(formatShortMonthOptions);
