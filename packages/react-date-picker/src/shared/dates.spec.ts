import { describe, expect, it } from 'vitest';

import { getBegin, getEnd } from './dates.js';

describe('getBegin', () => {
  it('returns proper beginning of the decade', () => {
    const date = new Date(2017, 0, 1);
    const beginOfDecadeDate = new Date(2011, 0, 1);

    const beginOfDecade = getBegin('decade', date);

    expect(beginOfDecade).toEqual(beginOfDecadeDate);
  });

  it('returns proper beginning of the year', () => {
    const date = new Date(2017, 0, 1);
    const beginOfYearDate = new Date(2017, 0, 1);

    const beginOfYear = getBegin('year', date);

    expect(beginOfYear).toEqual(beginOfYearDate);
  });

  it('returns proper beginning of the month', () => {
    const date = new Date(2017, 0, 1);
    const beginOfMonthDate = new Date(2017, 0, 1);

    const monthRange = getBegin('month', date);

    expect(monthRange).toEqual(beginOfMonthDate);
  });

  it('returns proper beginning of the day', () => {
    const date = new Date(2017, 0, 1);
    const beginOfDayDate = new Date(2017, 0, 1);

    const beginOfDay = getBegin('day', date);

    expect(beginOfDay).toEqual(beginOfDayDate);
  });

  it('throws an error when given unrecognized range type', () => {
    const date = new Date(2017, 0, 1);

    // @ts-expect-error-next-line
    expect(() => getBegin('hamster', date)).toThrow();
  });
});

describe('getEnd', () => {
  it('returns proper end of the decade', () => {
    const date = new Date(2017, 0, 1);
    const endOfDecadeDate = new Date(2020, 11, 31, 23, 59, 59, 999);

    const endOfDecade = getEnd('decade', date);

    expect(endOfDecade).toEqual(endOfDecadeDate);
  });

  it('returns proper end of the year', () => {
    const date = new Date(2017, 0, 1);
    const endOfYearDate = new Date(2017, 11, 31, 23, 59, 59, 999);

    const endOfYear = getEnd('year', date);

    expect(endOfYear).toEqual(endOfYearDate);
  });

  it('returns proper end of the month', () => {
    const date = new Date(2017, 0, 1);
    const endOfMonthDate = new Date(2017, 0, 31, 23, 59, 59, 999);

    const monthRange = getEnd('month', date);

    expect(monthRange).toEqual(endOfMonthDate);
  });

  it('returns proper end of the day', () => {
    const date = new Date(2017, 0, 1);
    const endOfDayDate = new Date(2017, 0, 1, 23, 59, 59, 999);

    const endOfDay = getEnd('day', date);

    expect(endOfDay).toEqual(endOfDayDate);
  });

  it('throws an error when given unrecognized range type', () => {
    const date = new Date(2017, 0, 1);

    // @ts-expect-error-next-line
    expect(() => getEnd('hamster', date)).toThrow();
  });
});
