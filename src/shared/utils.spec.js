import {
  callIfDefined,
  safeMin,
  safeMax,
} from './utils';

describe('callIfDefined', () => {
  it('calls given function if defined', () => {
    const fn = jest.fn();
    const arg1 = 'hi';
    const arg2 = 'hello';

    callIfDefined(fn, arg1, arg2);

    expect(fn).toHaveBeenCalledWith(arg1, arg2);
  });
});

describe('safeMin', () => {
  it('returns Infinity given no values', () => {
    const result = safeMin();

    expect(result).toBe(Infinity);
  });

  it('returns the smallest value given valid numbers', () => {
    const result = safeMin(3, 4, 5);

    expect(result).toBe(3);
  });

  it('returns the smallest value given valid numbers with zero', () => {
    const result = safeMin(0, 1, 2);

    expect(result).toBe(0);
  });

  it('returns the smallest value given valid number and null', () => {
    const result = safeMin(1, 2, null);

    expect(result).toBe(1);
  });

  it('returns the smallest value given valid number and undefined', () => {
    const result = safeMin(1, 2, undefined);

    expect(result).toBe(1);
  });

  it('returns the smallest value given valid numbers as strings', () => {
    const result = safeMin('1', '2');

    expect(result).toBe(1);
  });
});

describe('safeMax', () => {
  it('returns -Infinity given no values', () => {
    const result = safeMax();

    expect(result).toBe(-Infinity);
  });

  it('returns the largest value given valid numbers', () => {
    const result = safeMax(3, 4, 5);

    expect(result).toBe(5);
  });

  it('returns the largest value given valid numbers with zero', () => {
    const result = safeMax(-2, -1, 0);

    expect(result).toBe(0);
  });

  it('returns the largest value given valid number and null', () => {
    const result = safeMax(3, 4, null);

    expect(result).toBe(4);
  });

  it('returns the largest value given valid number and undefined', () => {
    const result = safeMax(3, 4, undefined);

    expect(result).toBe(4);
  });

  it('returns the largest value given valid numbers as strings', () => {
    const result = safeMax('3', '4');

    expect(result).toBe(4);
  });
});
