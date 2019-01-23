import { appendInputValue, isPositiveInteger } from '../utils';

/* eslint-disable comma-dangle */

const defaultArgs = {
  event: {
    target: {
      value: '2',
      max: '12',
      min: '1'
    },
    key: '2'
  },
  onChange: jest.fn()
};

describe('appendInputValue', () => {
  describe('when value is higher than max', () => {
    const { event, onChange } = defaultArgs;

    beforeAll(() => {
      defaultArgs.event.target.value = '20';
      appendInputValue(event, onChange);
    });

    it('set value to max', () => {
      expect(event.target.value).toEqual('12');
    });

    it('triggers onChange correctly', () => {
      expect(onChange).toHaveBeenCalled();
      expect(onChange).toHaveBeenCalledWith(event);
    });
  });
});

describe('isPositiveInteger', () => {
  it('should not accept e', () => {
    expect(isPositiveInteger('e')).toBe(false);
  });

  it('should not accept +', () => {
    expect(isPositiveInteger('+')).toBe(false);
  });

  it('should not accept .', () => {
    expect(isPositiveInteger('.')).toBe(false);
  });

  it('should not accept ,', () => {
    expect(isPositiveInteger(',')).toBe(false);
  });

  it('should accept 1', () => {
    expect(isPositiveInteger('1')).toBe(true);
  });

  it('should accept 9', () => {
    expect(isPositiveInteger('9')).toBe(true);
  });

  it('should accept 0', () => {
    expect(isPositiveInteger('0')).toBe(true);
  });
});
