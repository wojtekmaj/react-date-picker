import {
  getMonth,
  getISOLocalMonth,
  getISOLocalDate,
} from '../dates';

describe('getMonth', () => {
  it('returns proper month', () => {
    const date = new Date(2017, 0, 1);

    const monthIndex = getMonth(date);

    expect(monthIndex).toBe(1);
  });
});

describe('getISOLocalMonth', () => {
  it('returns proper ISO month', () => {
    const date = new Date(Date.UTC(2017, 0, 1));

    const ISOMonth = getISOLocalMonth(date);

    expect(ISOMonth).toBe('2017-01');
  });

  it('returns nothing when given nothing', () => {
    expect(getISOLocalMonth()).toBeUndefined();
  });

  it('throws an error when given nonsense data', () => {
    const text = 'wololo';
    const flag = true;

    expect(() => getISOLocalMonth(text)).toThrow();
    expect(() => getISOLocalMonth(flag)).toThrow();
  });
});

describe('getISOLocalDate', () => {
  it('returns proper ISO date', () => {
    const date = new Date(Date.UTC(2017, 0, 1));

    const ISODate = getISOLocalDate(date);

    expect(ISODate).toBe('2017-01-01');
  });

  it('returns nothing when given nothing', () => {
    expect(getISOLocalDate()).toBeUndefined();
  });

  it('throws an error when given nonsense data', () => {
    const text = 'wololo';
    const flag = true;

    expect(() => getISOLocalDate(text)).toThrow();
    expect(() => getISOLocalDate(flag)).toThrow();
  });
});
