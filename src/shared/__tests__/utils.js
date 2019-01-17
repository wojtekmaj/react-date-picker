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

  it('set value to max when value is higher than max', () => {
    defaultArgs.event.target.value = '20';
    const { event, onChange } = defaultArgs;

    appendInputValue(event, onChange);
    expect(event.target.value).toEqual('12');
  });

  it('triggers onChange correctly when value is higher than max', () => {
    defaultArgs.event.target.value = '20';
    const { event, onChange } = defaultArgs;

    appendInputValue(event, onChange);
    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(event);
  });

  it('find next input when key is higher than first character of max', () => {
    defaultArgs.event.target.value = '2';
    const { event, onChange } = defaultArgs;

    appendInputValue(event, onChange);
  });
});
