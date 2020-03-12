import {
  between,
  callIfDefined,
} from './utils';

describe('between', () => {
  it('returns value when value is within set boundaries', () => {
    const value = new Date(2017, 6, 1);
    const min = new Date(2017, 0, 1);
    const max = new Date(2017, 11, 1);
    const result = between(value, min, max);

    expect(result).toBe(value);
  });

  it('returns min when value is smaller than min', () => {
    const value = new Date(2017, 0, 1);
    const min = new Date(2017, 6, 1);
    const max = new Date(2017, 11, 1);
    const result = between(value, min, max);

    expect(result).toBe(min);
  });

  it('returns max when value is larger than max', () => {
    const value = new Date(2017, 11, 1);
    const min = new Date(2017, 0, 1);
    const max = new Date(2017, 6, 1);
    const result = between(value, min, max);

    expect(result).toBe(max);
  });

  it('returns value when min and max are not provided', () => {
    const value = new Date(2017, 6, 1);
    const result = between(value, null, undefined);

    expect(result).toBe(value);
  });
});

describe('callIfDefined', () => {
  it('calls given function if defined', () => {
    const fn = jest.fn();
    const arg1 = 'hi';
    const arg2 = 'hello';

    callIfDefined(fn, arg1, arg2);

    expect(fn).toHaveBeenCalledWith(arg1, arg2);
  });
});
