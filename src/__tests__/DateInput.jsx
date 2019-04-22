import React from 'react';
import { mount } from 'enzyme';

import DateInput from '../DateInput';

import { muteConsole, restoreConsole } from './utils';

/* eslint-disable comma-dangle */

const hasFullICU = (() => {
  try {
    const date = new Date(2018, 0, 1, 21);
    const formatter = new Intl.DateTimeFormat('de-DE', { hour: 'numeric' });
    return formatter.format(date) === '21';
  } catch (err) {
    return false;
  }
})();

const itIfFullICU = hasFullICU ? it : it.skip;

const keyCodes = {
  ArrowLeft: 37,
  ArrowUp: 38,
  ArrowRight: 39,
  ArrowDown: 40,
  '-': 189,
  '.': 190,
  '/': 191,
};

const getKey = key => ({
  keyCode: keyCodes[key],
  which: keyCodes[key],
  key,
});

describe('DateInput', () => {
  const defaultProps = {
    className: 'react-date-picker__inputGroup',
  };

  it('renders a native input and custom inputs', () => {
    const component = mount(
      <DateInput {...defaultProps} />
    );

    const nativeInput = component.find('input[type="date"]');
    const customInputs = component.find('input[type="number"]');

    expect(nativeInput).toHaveLength(1);
    expect(customInputs).toHaveLength(3);
  });

  it('does not render day input when maxDetail is "year" or less', () => {
    const component = mount(
      <DateInput
        {...defaultProps}
        maxDetail="year"
      />
    );

    const customInputs = component.find('input[type="number"]');
    const dayInput = customInputs.find('input[name="day"]');
    const monthInput = customInputs.find('input[name="month"]');
    const yearInput = customInputs.find('input[name="year"]');

    expect(customInputs).toHaveLength(2);
    expect(dayInput).toHaveLength(0);
    expect(monthInput).toHaveLength(1);
    expect(yearInput).toHaveLength(1);
  });

  it('does not render day and month inputs when maxDetail is "decade" or less', () => {
    const component = mount(
      <DateInput
        {...defaultProps}
        maxDetail="decade"
      />
    );

    const customInputs = component.find('input[type="number"]');
    const dayInput = customInputs.find('input[name="day"]');
    const monthInput = customInputs.find('input[name="month"]');
    const yearInput = customInputs.find('input[name="year"]');

    expect(customInputs).toHaveLength(2);
    expect(dayInput).toHaveLength(0);
    expect(monthInput).toHaveLength(0);
    expect(yearInput).toHaveLength(1);
  });

  it('shows a given date in all inputs correctly given Date (12-hour format)', () => {
    const date = new Date(2017, 8, 30);

    const component = mount(
      <DateInput
        {...defaultProps}
        value={date}
      />
    );

    const nativeInput = component.find('input[type="date"]');
    const customInputs = component.find('input[type="number"]');

    expect(nativeInput.prop('value')).toBe('2017-09-30');
    expect(customInputs.at(0).prop('value')).toBe(9);
    expect(customInputs.at(1).prop('value')).toBe(30);
    expect(customInputs.at(2).prop('value')).toBe(2017);
  });

  it('shows a given date in all inputs correctly given array of Date objects (12-hour format)', () => {
    const date = [new Date(2017, 8, 30), new Date(2017, 8, 31, 0, 0, 0, -1)];

    const component = mount(
      <DateInput
        {...defaultProps}
        value={date}
      />
    );

    const nativeInput = component.find('input[type="date"]');
    const customInputs = component.find('input[type="number"]');

    expect(nativeInput.prop('value')).toBe('2017-09-30');
    expect(customInputs.at(0).prop('value')).toBe(9);
    expect(customInputs.at(1).prop('value')).toBe(30);
    expect(customInputs.at(2).prop('value')).toBe(2017);
  });

  it('shows a given date in all inputs correctly given ISO string (12-hour format)', () => {
    const date = '2017-09-30T00:00:00.000';

    const component = mount(
      <DateInput
        {...defaultProps}
        value={date}
      />
    );

    const nativeInput = component.find('input[type="date"]');
    const customInputs = component.find('input[type="number"]');

    expect(nativeInput.prop('value')).toBe('2017-09-30');
    expect(customInputs.at(0).prop('value')).toBe(9);
    expect(customInputs.at(1).prop('value')).toBe(30);
    expect(customInputs.at(2).prop('value')).toBe(2017);
  });

  itIfFullICU('shows a given date in all inputs correctly given Date (24-hour format)', () => {
    const date = new Date(2017, 8, 30);

    const component = mount(
      <DateInput
        {...defaultProps}
        locale="de-DE"
        value={date}
      />
    );

    const nativeInput = component.find('input[type="date"]');
    const customInputs = component.find('input[type="number"]');

    expect(nativeInput.prop('value')).toBe('2017-09-30');
    expect(customInputs.at(0).prop('value')).toBe(2017);
    expect(customInputs.at(1).prop('value')).toBe(9);
    expect(customInputs.at(2).prop('value')).toBe(30);
  });

  itIfFullICU('shows a given date in all inputs correctly given array of Date objects (24-hour format)', () => {
    const date = [new Date(2017, 8, 30), new Date(2017, 8, 31, 0, 0, 0, -1)];

    const component = mount(
      <DateInput
        {...defaultProps}
        locale="de-DE"
        value={date}
      />
    );

    const nativeInput = component.find('input[type="date"]');
    const customInputs = component.find('input[type="number"]');

    expect(nativeInput.prop('value')).toBe('2017-09-30');
    expect(customInputs.at(0).prop('value')).toBe(2017);
    expect(customInputs.at(1).prop('value')).toBe(9);
    expect(customInputs.at(2).prop('value')).toBe(30);
  });

  itIfFullICU('shows a given date in all inputs correctly given ISO string (24-hour format)', () => {
    const date = '2017-09-30T00:00:00.000';

    const component = mount(
      <DateInput
        {...defaultProps}
        locale="de-DE"
        value={date}
      />
    );

    const nativeInput = component.find('input[type="date"]');
    const customInputs = component.find('input[type="number"]');

    expect(nativeInput.prop('value')).toBe('2017-09-30');
    expect(customInputs.at(0).prop('value')).toBe(2017);
    expect(customInputs.at(1).prop('value')).toBe(9);
    expect(customInputs.at(2).prop('value')).toBe(30);
  });

  it('shows empty value in all inputs correctly given null', () => {
    const component = mount(
      <DateInput
        {...defaultProps}
        value={null}
      />
    );

    const nativeInput = component.find('input[type="date"]');
    const customInputs = component.find('input[type="number"]');

    expect(nativeInput.prop('value')).toBeFalsy();
    expect(customInputs.at(0).prop('value')).toBeFalsy();
    expect(customInputs.at(1).prop('value')).toBeFalsy();
    expect(customInputs.at(2).prop('value')).toBeFalsy();
  });

  it('shows empty value in all inputs correctly given an array of nulls', () => {
    const component = mount(
      <DateInput
        {...defaultProps}
        value={[null, null]}
      />
    );

    const nativeInput = component.find('input[type="date"]');
    const customInputs = component.find('input[type="number"]');

    expect(nativeInput.prop('value')).toBeFalsy();
    expect(customInputs.at(0).prop('value')).toBeFalsy();
    expect(customInputs.at(1).prop('value')).toBeFalsy();
    expect(customInputs.at(2).prop('value')).toBeFalsy();
  });

  it('clears the value correctly', () => {
    const date = new Date(2017, 8, 30);

    const component = mount(
      <DateInput
        {...defaultProps}
        value={date}
      />
    );

    component.setProps({ value: null });

    const nativeInput = component.find('input[type="date"]');
    const customInputs = component.find('input[type="number"]');

    expect(nativeInput.prop('value')).toBeFalsy();
    expect(customInputs.at(0).prop('value')).toBeFalsy();
    expect(customInputs.at(1).prop('value')).toBeFalsy();
    expect(customInputs.at(2).prop('value')).toBeFalsy();
  });

  it('renders custom inputs in a proper order (12-hour format)', () => {
    const component = mount(
      <DateInput {...defaultProps} />
    );

    const customInputs = component.find('input[type="number"]');

    expect(customInputs.at(0).prop('name')).toBe('month');
    expect(customInputs.at(1).prop('name')).toBe('day');
    expect(customInputs.at(2).prop('name')).toBe('year');
  });

  itIfFullICU('renders custom inputs in a proper order (24-hour format)', () => {
    const component = mount(
      <DateInput
        {...defaultProps}
        locale="de-DE"
      />
    );

    const customInputs = component.find('input[type="number"]');

    expect(customInputs.at(0).prop('name')).toBe('year');
    expect(customInputs.at(1).prop('name')).toBe('month');
    expect(customInputs.at(2).prop('name')).toBe('day');
  });

  describe('renders custom inputs in a proper order given format', () => {
    it('renders "y" properly', () => {
      const component = mount(
        <DateInput
          {...defaultProps}
          format="y"
        />
      );

      const componentInput = component.find('YearInput');
      const customInputs = component.find('input[type="number"]');

      expect(componentInput).toHaveLength(1);
      expect(customInputs).toHaveLength(1);
    });

    it('renders "yyyy" properly', () => {
      const component = mount(
        <DateInput
          {...defaultProps}
          format="yyyy"
        />
      );

      const componentInput = component.find('YearInput');
      const customInputs = component.find('input[type="number"]');

      expect(componentInput).toHaveLength(1);
      expect(customInputs).toHaveLength(1);
    });

    it('renders "M" properly', () => {
      const component = mount(
        <DateInput
          {...defaultProps}
          format="M"
        />
      );

      const componentInput = component.find('MonthInput');
      const customInputs = component.find('input[type="number"]');

      expect(componentInput).toHaveLength(1);
      expect(customInputs).toHaveLength(1);
    });

    it('renders "MM" properly', () => {
      const component = mount(
        <DateInput
          {...defaultProps}
          format="MM"
        />
      );

      const componentInput = component.find('MonthInput');
      const customInputs = component.find('input[type="number"]');

      expect(componentInput).toHaveLength(1);
      expect(customInputs).toHaveLength(1);
      expect(componentInput.prop('showLeadingZeros')).toBeTruthy();
    });

    it('throws error for "MMM"', () => {
      muteConsole();

      const renderComponent = () => mount(
        <DateInput
          {...defaultProps}
          format="MMM"
        />
      );

      expect(renderComponent).toThrow('Unsupported token: MMM');

      restoreConsole();
    });

    it('renders "d" properly', () => {
      const component = mount(
        <DateInput
          {...defaultProps}
          format="d"
        />
      );

      const componentInput = component.find('DayInput');
      const customInputs = component.find('input[type="number"]');

      expect(componentInput).toHaveLength(1);
      expect(customInputs).toHaveLength(1);
    });

    it('renders "dd" properly', () => {
      const component = mount(
        <DateInput
          {...defaultProps}
          format="dd"
        />
      );

      const componentInput = component.find('DayInput');
      const customInputs = component.find('input[type="number"]');

      expect(componentInput).toHaveLength(1);
      expect(customInputs).toHaveLength(1);
      expect(componentInput.prop('showLeadingZeros')).toBeTruthy();
    });

    it('throws error for "ddd"', () => {
      muteConsole();

      const renderComponent = () => mount(
        <DateInput
          {...defaultProps}
          format="ddd"
        />
      );

      expect(renderComponent).toThrow('Unsupported token: ddd');

      restoreConsole();
    });

    it('renders "yyyy-MM-dd" properly', () => {
      const component = mount(
        <DateInput
          {...defaultProps}
          format="yyyy-MM-d"
        />
      );

      const monthInput = component.find('MonthInput');
      const dayInput = component.find('DayInput');
      const customInputs = component.find('input[type="number"]');

      expect(monthInput).toHaveLength(1);
      expect(dayInput).toHaveLength(1);
      expect(customInputs).toHaveLength(3);
      expect(customInputs.at(0).prop('name')).toBe('year');
      expect(customInputs.at(1).prop('name')).toBe('month');
      expect(customInputs.at(2).prop('name')).toBe('day');
      expect(monthInput.prop('showLeadingZeros')).toBeTruthy();
      expect(dayInput.prop('showLeadingZeros')).toBeFalsy();
    });
  });

  it('renders proper input separators', () => {
    const component = mount(
      <DateInput {...defaultProps} />
    );

    const separators = component.find('.react-date-picker__inputGroup__divider');

    expect(separators).toHaveLength(2);
    expect(separators.at(0).text()).toBe('/');
  });

  it('renders proper amount of separators', () => {
    const component = mount(
      <DateInput
        {...defaultProps}
        maxDetail="year"
      />
    );

    const separators = component.find('.react-date-picker__inputGroup__divider');
    const customInputs = component.find('input[type="number"]');

    expect(separators).toHaveLength(customInputs.length - 1);
  });

  it('jumps to the next field when right arrow is pressed', () => {
    const component = mount(
      <DateInput {...defaultProps} />
    );

    const customInputs = component.find('input[type="number"]');
    const dayInput = customInputs.at(0);
    const monthInput = customInputs.at(1);

    dayInput.getDOMNode().focus();

    expect(document.activeElement).toBe(dayInput.getDOMNode());

    dayInput.simulate('keydown', getKey('ArrowRight'));

    expect(document.activeElement).toBe(monthInput.getDOMNode());
  });

  it('jumps to the next field when separator key is pressed', () => {
    const component = mount(
      <DateInput {...defaultProps} />
    );

    const customInputs = component.find('input[type="number"]');
    const dayInput = customInputs.at(0);
    const monthInput = customInputs.at(1);

    dayInput.getDOMNode().focus();

    expect(document.activeElement).toBe(dayInput.getDOMNode());

    const separators = component.find('.react-date-picker__inputGroup__divider');
    const separatorKey = separators.at(0).text();
    dayInput.simulate('keydown', getKey(separatorKey));

    expect(document.activeElement).toBe(monthInput.getDOMNode());
  });

  it('does not jump to the next field when right arrow is pressed when the last input is focused', () => {
    const component = mount(
      <DateInput {...defaultProps} />
    );

    const customInputs = component.find('input[type="number"]');
    const yearInput = customInputs.at(2);

    yearInput.getDOMNode().focus();

    expect(document.activeElement).toBe(yearInput.getDOMNode());

    yearInput.simulate('keydown', getKey('ArrowRight'));

    expect(document.activeElement).toBe(yearInput.getDOMNode());
  });

  it('jumps to the previous field when left arrow is pressed', () => {
    const component = mount(
      <DateInput {...defaultProps} />
    );

    const customInputs = component.find('input[type="number"]');
    const dayInput = customInputs.at(0);
    const monthInput = customInputs.at(1);

    monthInput.getDOMNode().focus();

    expect(document.activeElement).toBe(monthInput.getDOMNode());

    monthInput.simulate('keydown', getKey('ArrowLeft'));

    expect(document.activeElement).toBe(dayInput.getDOMNode());
  });

  it('does not jump to the previous field when left arrow is pressed when the first input is focused', () => {
    const component = mount(
      <DateInput {...defaultProps} />
    );

    const customInputs = component.find('input[type="number"]');
    const dayInput = customInputs.at(0);

    dayInput.getDOMNode().focus();

    expect(document.activeElement).toBe(dayInput.getDOMNode());

    dayInput.simulate('keydown', getKey('ArrowLeft'));

    expect(document.activeElement).toBe(dayInput.getDOMNode());
  });

  it('triggers onChange correctly when changed custom input', () => {
    const onChange = jest.fn();
    const date = new Date(2017, 8, 30);

    const component = mount(
      <DateInput
        {...defaultProps}
        onChange={onChange}
        value={date}
      />
    );

    const customInputs = component.find('input[type="number"]');

    customInputs.at(1).getDOMNode().value = '20';
    customInputs.at(1).simulate('change');

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(new Date(2017, 8, 20), false);
  });

  it('triggers onChange correctly when cleared custom inputs', () => {
    const onChange = jest.fn();
    const date = new Date(2017, 8, 30);

    const component = mount(
      <DateInput
        {...defaultProps}
        onChange={onChange}
        value={date}
      />
    );

    const customInputs = component.find('input[type="number"]');

    customInputs.forEach((customInput) => {
      customInput.getDOMNode().value = ''; // eslint-disable-line no-param-reassign
      customInput.simulate('change');
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(null, false);
  });

  it('triggers onChange correctly when changed native input', () => {
    const onChange = jest.fn();
    const date = new Date(2017, 8, 30);

    const component = mount(
      <DateInput
        {...defaultProps}
        onChange={onChange}
        value={date}
      />
    );

    const nativeInput = component.find('input[type="date"]');

    nativeInput.getDOMNode().value = '2017-09-20';
    nativeInput.simulate('change');

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(new Date(2017, 8, 20), false);
  });

  it('triggers onChange correctly when cleared native input', () => {
    const onChange = jest.fn();
    const date = new Date(2017, 8, 30);

    const component = mount(
      <DateInput
        {...defaultProps}
        onChange={onChange}
        value={date}
      />
    );

    const nativeInput = component.find('input[type="date"]');

    nativeInput.getDOMNode().value = '';
    nativeInput.simulate('change');

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(null, false);
  });
});
