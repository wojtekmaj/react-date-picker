import { describe, expect, it, vi } from 'vitest';
import getUserLocale from 'get-user-locale';

import { formatMonth, formatShortMonth, getDateInputFormat } from './dateFormatter.js';

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

  it('replaces a short year with a year field', () => {
    const formatToParts = vi.spyOn(Intl.DateTimeFormat.prototype, 'formatToParts');
    formatToParts.mockReturnValueOnce([
      { type: 'day', value: '11' },
      { type: 'literal', value: '/' },
      { type: 'month', value: '12' },
      { type: 'literal', value: '/' },
      { type: 'year', value: '17' },
    ]);

    try {
      expect(getDateInputFormat('en-AU', 'month')).toBe('d/M/y');
    } finally {
      formatToParts.mockRestore();
    }
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
