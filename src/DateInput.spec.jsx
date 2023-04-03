import { describe, expect, it, vi } from 'vitest';
import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import DateInput from './DateInput';

import { muteConsole, restoreConsole } from '../test-utils';

const hasFullICU = (() => {
  try {
    const date = new Date(2018, 0, 1, 21);
    const formatter = new Intl.DateTimeFormat('de-DE', { hour: 'numeric' });
    return formatter.format(date).includes('21');
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

const getKey = (key) => ({
  keyCode: keyCodes[key],
  which: keyCodes[key],
  key,
});

describe('DateInput', () => {
  const defaultProps = {
    className: 'react-date-picker__inputGroup',
  };

  it('renders a native input and custom inputs', () => {
    const { container } = render(<DateInput {...defaultProps} />);

    const nativeInput = container.querySelector('input[type="date"]');
    const customInputs = container.querySelectorAll('input[data-input]');

    expect(nativeInput).toBeInTheDocument();
    expect(customInputs).toHaveLength(3);
  });

  it('does not render day input when maxDetail is "year" or less', () => {
    const { container } = render(<DateInput {...defaultProps} maxDetail="year" />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const dayInput = container.querySelector('input[name="day"]');
    const monthInput = container.querySelector('input[name="month"]');
    const yearInput = container.querySelector('input[name="year"]');

    expect(customInputs).toHaveLength(2);
    expect(dayInput).toBeFalsy();
    expect(monthInput).toBeInTheDocument();
    expect(yearInput).toBeInTheDocument();
  });

  it('does not render day and month inputs when maxDetail is "decade" or less', () => {
    const { container } = render(<DateInput {...defaultProps} maxDetail="decade" />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const dayInput = container.querySelector('input[name="day"]');
    const monthInput = container.querySelector('input[name="month"]');
    const yearInput = container.querySelector('input[name="year"]');

    expect(customInputs).toHaveLength(1);
    expect(dayInput).toBeFalsy();
    expect(monthInput).toBeFalsy();
    expect(yearInput).toBeInTheDocument();
  });

  it('shows a given date in all inputs correctly given Date (12-hour format)', () => {
    const date = new Date(2017, 8, 30);

    const { container } = render(<DateInput {...defaultProps} value={date} />);

    const nativeInput = container.querySelector('input[type="date"]');
    const customInputs = container.querySelectorAll('input[data-input]');

    expect(nativeInput).toHaveValue('2017-09-30');
    expect(customInputs[0]).toHaveValue(9);
    expect(customInputs[1]).toHaveValue(30);
    expect(customInputs[2]).toHaveValue(2017);
  });

  it('shows a given date in all inputs correctly given array of Date objects (12-hour format)', () => {
    const date = [new Date(2017, 8, 30), new Date(2017, 8, 31, 0, 0, 0, -1)];

    const { container } = render(<DateInput {...defaultProps} value={date} />);

    const nativeInput = container.querySelector('input[type="date"]');
    const customInputs = container.querySelectorAll('input[data-input]');

    expect(nativeInput).toHaveValue('2017-09-30');
    expect(customInputs[0]).toHaveValue(9);
    expect(customInputs[1]).toHaveValue(30);
    expect(customInputs[2]).toHaveValue(2017);
  });

  it('shows a given date in all inputs correctly given ISO string (12-hour format)', () => {
    const date = '2017-09-30T00:00:00.000';

    const { container } = render(<DateInput {...defaultProps} value={date} />);

    const nativeInput = container.querySelector('input[type="date"]');
    const customInputs = container.querySelectorAll('input[data-input]');

    expect(nativeInput).toHaveValue('2017-09-30');
    expect(customInputs[0]).toHaveValue(9);
    expect(customInputs[1]).toHaveValue(30);
    expect(customInputs[2]).toHaveValue(2017);
  });

  itIfFullICU('shows a given date in all inputs correctly given Date (24-hour format)', () => {
    const date = new Date(2017, 8, 30);

    const { container } = render(<DateInput {...defaultProps} locale="de-DE" value={date} />);

    const nativeInput = container.querySelector('input[type="date"]');
    const customInputs = container.querySelectorAll('input[data-input]');

    expect(nativeInput).toHaveValue('2017-09-30');
    expect(customInputs[0]).toHaveValue(30);
    expect(customInputs[1]).toHaveValue(9);
    expect(customInputs[2]).toHaveValue(2017);
  });

  itIfFullICU(
    'shows a given date in all inputs correctly given array of Date objects (24-hour format)',
    () => {
      const date = [new Date(2017, 8, 30), new Date(2017, 8, 31, 0, 0, 0, -1)];

      const { container } = render(<DateInput {...defaultProps} locale="de-DE" value={date} />);

      const nativeInput = container.querySelector('input[type="date"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(nativeInput).toHaveValue('2017-09-30');
      expect(customInputs[0]).toHaveValue(30);
      expect(customInputs[1]).toHaveValue(9);
      expect(customInputs[2]).toHaveValue(2017);
    },
  );

  itIfFullICU(
    'shows a given date in all inputs correctly given ISO string (24-hour format)',
    () => {
      const date = '2017-09-30T00:00:00.000';

      const { container } = render(<DateInput {...defaultProps} locale="de-DE" value={date} />);

      const nativeInput = container.querySelector('input[type="date"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(nativeInput).toHaveValue('2017-09-30');
      expect(customInputs[0]).toHaveValue(30);
      expect(customInputs[1]).toHaveValue(9);
      expect(customInputs[2]).toHaveValue(2017);
    },
  );

  it('shows empty value in all inputs correctly given null', () => {
    const { container } = render(<DateInput {...defaultProps} value={null} />);

    const nativeInput = container.querySelector('input[type="date"]');
    const customInputs = container.querySelectorAll('input[data-input]');

    expect(nativeInput).toHaveAttribute('value', '');
    expect(customInputs[0]).toHaveAttribute('value', '');
    expect(customInputs[1]).toHaveAttribute('value', '');
    expect(customInputs[2]).toHaveAttribute('value', '');
  });

  it('shows empty value in all inputs correctly given an array of nulls', () => {
    const { container } = render(<DateInput {...defaultProps} value={[null, null]} />);

    const nativeInput = container.querySelector('input[type="date"]');
    const customInputs = container.querySelectorAll('input[data-input]');

    expect(nativeInput).toHaveAttribute('value', '');
    expect(customInputs[0]).toHaveAttribute('value', '');
    expect(customInputs[1]).toHaveAttribute('value', '');
    expect(customInputs[2]).toHaveAttribute('value', '');
  });

  it('clears the value correctly', () => {
    const date = new Date(2017, 8, 30);

    const { container, rerender } = render(<DateInput {...defaultProps} value={date} />);

    rerender(<DateInput {...defaultProps} value={null} />);

    const nativeInput = container.querySelector('input[type="date"]');
    const customInputs = container.querySelectorAll('input[data-input]');

    expect(nativeInput).toHaveAttribute('value', '');
    expect(customInputs[0]).toHaveAttribute('value', '');
    expect(customInputs[1]).toHaveAttribute('value', '');
    expect(customInputs[2]).toHaveAttribute('value', '');
  });

  it('renders custom inputs in a proper order (12-hour format)', () => {
    const { container } = render(<DateInput {...defaultProps} />);

    const customInputs = container.querySelectorAll('input[data-input]');

    expect(customInputs[0]).toHaveAttribute('name', 'month');
    expect(customInputs[1]).toHaveAttribute('name', 'day');
    expect(customInputs[2]).toHaveAttribute('name', 'year');
  });

  itIfFullICU('renders custom inputs in a proper order (24-hour format)', () => {
    const { container } = render(<DateInput {...defaultProps} locale="de-DE" />);

    const customInputs = container.querySelectorAll('input[data-input]');

    expect(customInputs[0]).toHaveAttribute('name', 'day');
    expect(customInputs[1]).toHaveAttribute('name', 'month');
    expect(customInputs[2]).toHaveAttribute('name', 'year');
  });

  describe('renders custom inputs in a proper order given format', () => {
    it('renders "y" properly', () => {
      const { container } = render(<DateInput {...defaultProps} format="y" />);

      const componentInput = container.querySelector('input[name="year"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "yyyy" properly', () => {
      const { container } = render(<DateInput {...defaultProps} format="yyyy" />);

      const componentInput = container.querySelector('input[name="year"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "M" properly', () => {
      const { container } = render(<DateInput {...defaultProps} format="M" />);

      const componentInput = container.querySelector('input[name="month"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "MM" properly', () => {
      const { container } = render(<DateInput {...defaultProps} format="MM" />);

      const componentInput = container.querySelector('input[name="month"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "MMM" properly', () => {
      const { container } = render(<DateInput {...defaultProps} format="MMM" />);

      const componentSelect = container.querySelector('select[name="month"]');
      const customInputs = container.querySelectorAll('select');

      expect(componentSelect).toBeInTheDocument(1);
      expect(customInputs).toHaveLength(1);
    });

    it('renders "MMMM" properly', () => {
      const { container } = render(<DateInput {...defaultProps} format="MMMM" />);

      const componentSelect = container.querySelector('select[name="month"]');
      const customInputs = container.querySelectorAll('select');

      expect(componentSelect).toBeInTheDocument(1);
      expect(customInputs).toHaveLength(1);
    });

    it('renders "d" properly', () => {
      const { container } = render(<DateInput {...defaultProps} format="d" />);

      const componentInput = container.querySelector('input[name="day"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "dd" properly', () => {
      const { container } = render(<DateInput {...defaultProps} format="dd" />);

      const componentInput = container.querySelector('input[name="day"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('throws error for "ddd"', () => {
      muteConsole();

      const renderComponent = () => render(<DateInput {...defaultProps} format="ddd" />);

      expect(renderComponent).toThrow('Unsupported token: ddd');

      restoreConsole();
    });

    it('renders "yyyy-MM-dd" properly', () => {
      const { container } = render(<DateInput {...defaultProps} format="yyyy-MM-d" />);

      const monthInput = container.querySelector('input[name="month"]');
      const dayInput = container.querySelector('input[name="day"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(monthInput).toBeInTheDocument();
      expect(dayInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(3);
      expect(customInputs[0]).toHaveAttribute('name', 'year');
      expect(customInputs[1]).toHaveAttribute('name', 'month');
      expect(customInputs[2]).toHaveAttribute('name', 'day');
    });
  });

  it('renders proper input separators', () => {
    const { container } = render(<DateInput {...defaultProps} />);

    const separators = container.querySelectorAll('.react-date-picker__inputGroup__divider');

    expect(separators).toHaveLength(2);
    expect(separators[0]).toHaveTextContent('/');
    expect(separators[1]).toHaveTextContent('/');
  });

  it('renders proper amount of separators', () => {
    const { container } = render(<DateInput {...defaultProps} maxDetail="year" />);

    const separators = container.querySelectorAll('.react-date-picker__inputGroup__divider');
    const customInputs = container.querySelectorAll('input[data-input]');

    expect(separators).toHaveLength(customInputs.length - 1);
  });

  it('jumps to the next field when right arrow is pressed', () => {
    const { container } = render(<DateInput {...defaultProps} />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const monthInput = customInputs[0];
    const dayInput = customInputs[1];

    fireEvent.focus(monthInput);
    monthInput.focus();

    expect(monthInput).toHaveFocus();

    fireEvent.keyDown(monthInput, getKey('ArrowRight'));

    expect(dayInput).toHaveFocus();
  });

  it('jumps to the next field when separator key is pressed', () => {
    const { container } = render(<DateInput {...defaultProps} />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const monthInput = customInputs[0];
    const dayInput = customInputs[1];

    fireEvent.focus(monthInput);
    monthInput.focus();

    expect(monthInput).toHaveFocus();

    const separators = container.querySelectorAll('.react-date-picker__inputGroup__divider');
    const separatorKey = separators[0].textContent;
    fireEvent.keyDown(monthInput, getKey(separatorKey));

    expect(dayInput).toHaveFocus();
  });

  it('does not jump to the next field when right arrow is pressed when the last input is focused', () => {
    const { container } = render(<DateInput {...defaultProps} />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const yearInput = customInputs[2];

    fireEvent.focus(yearInput);
    yearInput.focus();

    expect(yearInput).toHaveFocus();

    fireEvent.keyDown(yearInput, getKey('ArrowRight'));

    expect(yearInput).toHaveFocus();
  });

  it('jumps to the previous field when left arrow is pressed', () => {
    const { container } = render(<DateInput {...defaultProps} />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const monthInput = customInputs[0];
    const dayInput = customInputs[1];

    fireEvent.focus(dayInput);
    dayInput.focus();

    expect(dayInput).toHaveFocus();

    fireEvent.keyDown(dayInput, getKey('ArrowLeft'));

    expect(monthInput).toHaveFocus();
  });

  it('does not jump to the previous field when left arrow is pressed when the first input is focused', () => {
    const { container } = render(<DateInput {...defaultProps} />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const monthInput = customInputs[0];

    fireEvent.focus(monthInput);
    monthInput.focus();

    expect(monthInput).toHaveFocus();

    fireEvent.keyDown(monthInput, getKey('ArrowLeft'));

    expect(monthInput).toHaveFocus();
  });

  it("jumps to the next field when a value which can't be extended to another valid value is entered", () => {
    const { container } = render(<DateInput {...defaultProps} />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const monthInput = customInputs[0];
    const dayInput = customInputs[1];

    fireEvent.focus(monthInput);

    monthInput.value = '4';
    fireEvent.keyUp(monthInput, { key: '4' });

    expect(dayInput).toHaveFocus();
  });

  it('jumps to the next field when a value as long as the length of maximum value is entered', () => {
    const { container } = render(<DateInput {...defaultProps} />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const monthInput = customInputs[0];
    const dayInput = customInputs[1];

    fireEvent.focus(monthInput);

    monthInput.value = '03';
    fireEvent.keyUp(monthInput, { key: '3' });

    expect(dayInput).toHaveFocus();
  });

  it('does not jump the next field when a value which can be extended to another valid value is entered', () => {
    const { container } = render(<DateInput {...defaultProps} />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const monthInput = customInputs[0];

    fireEvent.focus(monthInput);
    monthInput.focus();

    monthInput.value = '1';
    fireEvent.keyUp(monthInput, { key: '1' });

    expect(monthInput).toHaveFocus();
  });

  it('triggers onChange correctly when changed custom input', () => {
    const onChange = vi.fn();
    const date = new Date(2017, 8, 30);

    const { container } = render(<DateInput {...defaultProps} onChange={onChange} value={date} />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const dayInput = customInputs[1];

    fireEvent.change(dayInput, { target: { value: '20' } });

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(new Date(2017, 8, 20), false);
  });

  it('triggers onChange correctly when changed custom input with year < 100', () => {
    const onChange = vi.fn();
    const date = new Date();
    date.setFullYear(19, 8, 30);
    date.setHours(0, 0, 0, 0);

    const { container } = render(<DateInput {...defaultProps} onChange={onChange} value={date} />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const dayInput = customInputs[1];

    fireEvent.change(dayInput, { target: { value: '20' } });

    const nextDate = new Date();
    nextDate.setFullYear(19, 8, 20);
    nextDate.setHours(0, 0, 0, 0);

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(nextDate, false);
  });

  it('triggers onChange correctly when changed custom input with no year', () => {
    const onChange = vi.fn();
    const date = new Date(2017, 8, 30);

    const { container } = render(
      <DateInput {...defaultProps} format="dd.MM" onChange={onChange} value={date} />,
    );

    const customInputs = container.querySelectorAll('input[data-input]');
    const dayInput = customInputs[0];

    fireEvent.change(dayInput, { target: { value: '20' } });

    const currentYear = new Date().getFullYear();

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(new Date(currentYear, 8, 20), false);
  });

  it('triggers onChange correctly when cleared custom inputs', () => {
    const onChange = vi.fn();
    const date = new Date(2017, 8, 30);

    const { container } = render(<DateInput {...defaultProps} onChange={onChange} value={date} />);

    const customInputs = container.querySelectorAll('input[data-input]');

    customInputs.forEach((customInput) => {
      fireEvent.change(customInput, { target: { value: '' } });
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(null, false);
  });

  it('triggers onChange correctly when changed native input', () => {
    const onChange = vi.fn();
    const date = new Date(2017, 8, 30);

    const { container } = render(<DateInput {...defaultProps} onChange={onChange} value={date} />);

    const nativeInput = container.querySelector('input[type="date"]');

    fireEvent.change(nativeInput, { target: { value: '2017-09-20' } });

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(new Date(2017, 8, 20), false);
  });

  it('triggers onChange correctly when changed native input with year < 100', () => {
    const onChange = vi.fn();
    const date = new Date(2017, 8, 30);

    const { container } = render(<DateInput {...defaultProps} onChange={onChange} value={date} />);

    const nativeInput = container.querySelector('input[type="date"]');

    fireEvent.change(nativeInput, { target: { value: '0019-09-20' } });

    const nextDate = new Date();
    nextDate.setFullYear(19, 8, 20);
    nextDate.setHours(0, 0, 0, 0);

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(nextDate, false);
  });

  it('triggers onChange correctly when cleared native input', () => {
    const onChange = vi.fn();
    const date = new Date(2017, 8, 30);

    const { container } = render(<DateInput {...defaultProps} onChange={onChange} value={date} />);

    const nativeInput = container.querySelector('input[type="date"]');

    fireEvent.change(nativeInput, { target: { value: '' } });

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(null, false);
  });
});
