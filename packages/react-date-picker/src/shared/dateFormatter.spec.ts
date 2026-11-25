import { describe, expect, it, vi } from 'vitest';
import getUserLocale from 'get-user-locale';

import {
  formatMonth,
  formatShortMonth,
  getDateInputDivider,
  getDateInputFormat,
} from './dateFormatter.js';

import type { Detail } from './types.js';

describe('getDateInputFormat', () => {
  it.each([
    ['ar-EG', 'd‏/M‏/y'],
    ['fa-IR', 'y/M/d'],
    ['bn-BD', 'd/M/y'],
    ['mr-IN', 'd/M/y'],
    ['hi-IN-u-nu-deva', 'd/M/y'],
    ['en-US', 'M/d/y'],
    ['de-DE', 'd.M.y'],
    ['en-AU', 'd/M/y'],
    ['th-TH', 'd/M/y'],
  ])('returns date fields in locale order for %s', (locale, expected) => {
    expect(getDateInputFormat(locale, 'month')).toBe(expected);
  });

  it.each<[Detail, string]>([
    ['century', 'y'],
    ['decade', 'y'],
    ['year', 'M‏/y'],
    ['month', 'd‏/M‏/y'],
  ])('returns only fields required by maxDetail "%s"', (maxDetail, expected) => {
    expect(getDateInputFormat('ar-EG', maxDetail)).toBe(expected);
  });

  it('returns date fields for the Myanmar locale or its runtime fallback', () => {
    expect(getDateInputFormat('my-MM', 'month').split('/').sort()).toEqual(['M', 'd', 'y']);
  });

  it('returns a year field for calendars using a related year', () => {
    expect(getDateInputFormat('zh-CN-u-ca-chinese', 'decade')).toContain('y');
  });

  it('preserves the era when formatting a Buddhist year', () => {
    expect(getDateInputFormat('th-TH', 'decade')).toBe('พ.ศ. y');
  });

  it('uses the user locale when no locale is provided', () => {
    expect(getDateInputFormat(undefined, 'month')).toBe(
      getDateInputFormat(getUserLocale(), 'month'),
    );
  });

  it.each(['ksh', 'sc'])(
    'returns year and month fields without formatting to parts for %s',
    (locale) => {
      const formatToParts = vi
        .spyOn(Intl.DateTimeFormat.prototype, 'formatToParts')
        .mockImplementation(() => {
          throw new Error('formatToParts may abort the process for year-month patterns');
        });

      try {
        expect(getDateInputFormat(locale, 'year').split(/[-/]/).sort()).toEqual(['M', 'y']);
        expect(formatToParts).not.toHaveBeenCalled();
      } finally {
        formatToParts.mockRestore();
      }
    },
  );

  it('replaces a short year with a year field', () => {
    const DateTimeFormat = Intl.DateTimeFormat;
    const dateTimeFormat = vi.spyOn(Intl, 'DateTimeFormat').mockImplementation(
      class extends DateTimeFormat {
        constructor(...args: ConstructorParameters<typeof DateTimeFormat>) {
          super(...args);
          const [, options] = args;
          const format = this.format;
          if (options?.day && options?.month && options?.year) {
            Object.defineProperty(this, 'format', {
              value: (date: Date) => format(date).replace('2017', '17'),
            });
          }
        }
      },
    );

    try {
      expect(getDateInputFormat('en-NZ', 'month')).toBe('d/M/y');
    } finally {
      dateTimeFormat.mockRestore();
    }
  });
});

describe('getDateInputDivider', () => {
  it.each(['ar-EG', 'ar'])('uses the visible separator for keyboard navigation in %s', (locale) => {
    expect(getDateInputDivider(getDateInputFormat(locale, 'month'))).toBe('/');
  });

  it.each(['\u200e', '\u200f', '\u061c'])(
    'ignores the direction mark %j before a separator',
    (mark) => {
      expect(getDateInputDivider(`d${mark}/M${mark}/y`)).toBe('/');
      expect(getDateInputDivider(`y${mark}`)).toBeNull();
    },
  );

  it.each<[string, string | null]>([
    ['M/d/y', '/'],
    ['d.M.y', '.'],
    ['yyyy-MM-dd', '-'],
    ['y M d', ' '],
    ['y', null],
    ['', null],
  ])('preserves the separator of %j', (placeholder, expected) => {
    expect(getDateInputDivider(placeholder)).toBe(expected);
  });
});

describe('formatMonth', () => {
  it('returns proper month name', () => {
    const date = new Date(2017, 1, 1);

    const formattedDate = formatMonth('en-US', date);

    expect(formattedDate).toBe('February');
  });
});

describe('formatShortMonth', () => {
  it('returns proper short month name', () => {
    const date = new Date(2017, 1, 1);

    const formattedDate = formatShortMonth('en-US', date);

    expect(formattedDate).toBe('Feb');
  });
});
