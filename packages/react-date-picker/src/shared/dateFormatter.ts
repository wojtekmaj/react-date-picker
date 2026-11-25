import getUserLocale from 'get-user-locale';

import type { Detail } from './types.js';

const formatterCache = new Map();

export function getFormatter(
  options: Intl.DateTimeFormatOptions,
): (locale: string | undefined, date: Date) => string {
  return function formatter(locale: string | undefined, date: Date): string {
    const localeWithDefault = locale || getUserLocale();

    if (!formatterCache.has(localeWithDefault)) {
      formatterCache.set(localeWithDefault, new Map());
    }

    const formatterCacheLocale = formatterCache.get(localeWithDefault);

    if (!formatterCacheLocale.has(options)) {
      const formatter = new Intl.DateTimeFormat(localeWithDefault || undefined, options);

      formatterCacheLocale.set(options, formatter.format.bind(formatter));
    }

    return formatterCacheLocale.get(options)(date);
  };
}

// Not part of Intl.DateTimeFormatOptions in the ES2018 library typings
const latinDigits = { numberingSystem: 'latn' };

const dateInputOptions: Record<Detail, Intl.DateTimeFormatOptions> = {
  century: { year: 'numeric', ...latinDigits },
  decade: { year: 'numeric', ...latinDigits },
  year: { year: 'numeric', month: 'numeric', ...latinDigits },
  month: { year: 'numeric', month: 'numeric', day: 'numeric', ...latinDigits },
};

const datePieces = [
  { options: { year: 'numeric', ...latinDigits }, replacement: 'y' },
  { options: { month: 'numeric', ...latinDigits }, replacement: 'M' },
  { options: { day: 'numeric', ...latinDigits }, replacement: 'd' },
] satisfies { options: Intl.DateTimeFormatOptions; replacement: string }[];

export function getDateInputFormat(locale: string | undefined, maxDetail: Detail): string {
  const date = new Date(2017, 11, 11);

  let placeholder = getFormatter(dateInputOptions[maxDetail])(locale, date);
  for (const { options, replacement } of datePieces) {
    const match = getFormatter(options)(locale, date).match(/\d{1,}/);

    if (match) {
      placeholder = placeholder.replace(match[0], replacement);
    }
  }
  // See https://github.com/wojtekmaj/react-date-picker/issues/396
  return placeholder.replace('17', 'y');
}

export function getDateInputDivider(placeholder: string): string | null {
  const dividers = placeholder.match(/[^0-9a-z\u200e\u200f\u061c]/i);
  return dividers ? dividers[0] : null;
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
