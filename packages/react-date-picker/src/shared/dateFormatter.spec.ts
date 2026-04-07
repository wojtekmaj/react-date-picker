import { describe, expect, it } from 'vitest';

import { formatMonth, formatShortMonth } from './dateFormatter.js';

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
