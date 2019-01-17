import { appendInputValue } from '../utils';

/* eslint-disable comma-dangle */
describe('appendInputValue', () => {
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
