import {
  formatDate,
  formatMonthYear,
} from '../dateFormatter';

describe('formatDate', () => {
  it('returns proper full numeric date', () => {
    const date = new Date(2017, 1, 1);

    const formattedDate = formatDate(date, 'en-US');

    expect(formattedDate).toBe('2/1/2017');
  });
});

describe('formatMonthYear', () => {
  it('returns proper month name and year', () => {
    const date = new Date(2017, 1, 1);

    const formattedDate = formatMonthYear(date, 'en-US');

    expect(formattedDate).toBe('February 2017');
  });
});
