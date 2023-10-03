import { describe, expect, it, vi } from 'vitest';
import React from 'react';
import { act, fireEvent, render, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DatePicker from './DatePicker.js';

async function waitForElementToBeRemovedOrHidden(callback: () => HTMLElement | null) {
  const element = callback();

  if (element) {
    try {
      await waitFor(() =>
        expect(element).toHaveAttribute('class', expect.stringContaining('--closed')),
      );
    } catch (error) {
      await waitForElementToBeRemoved(element);
    }
  }
}

describe('DatePicker', () => {
  it('passes default name to DateInput', () => {
    const { container } = render(<DatePicker />);

    const nativeInput = container.querySelector('input[type="date"]');

    expect(nativeInput).toHaveAttribute('name', 'date');
  });

  it('passes custom name to DateInput', () => {
    const name = 'testName';

    const { container } = render(<DatePicker name={name} value={new Date(2020, 10, 11)} />);

    const nativeInput = container.querySelector('input[type="date"]');

    expect(nativeInput).toHaveAttribute('name', name);
  });

  it('passes autoFocus flag to DateInput', () => {
    // eslint-disable-next-line jsx-a11y/no-autofocus
    const { container } = render(<DatePicker autoFocus />);

    const customInputs = container.querySelectorAll('input[data-input]');

    expect(customInputs[0]).toHaveFocus();
  });

  it('passes disabled flag to DateInput', () => {
    const { container } = render(<DatePicker disabled />);

    const nativeInput = container.querySelector('input[type="date"]');

    expect(nativeInput).toBeDisabled();
  });

  it('passes format to DateInput', () => {
    const { container } = render(<DatePicker format="yyyy" />);

    const customInputs = container.querySelectorAll('input[data-input]');

    expect(customInputs).toHaveLength(1);
    expect(customInputs[0]).toHaveAttribute('name', 'year');
  });

  it('passes aria-label props to DateInput', () => {
    const ariaLabelProps = {
      calendarAriaLabel: 'Toggle calendar',
      clearAriaLabel: 'Clear value',
      dayAriaLabel: 'Day',
      monthAriaLabel: 'Month',
      nativeInputAriaLabel: 'Date',
      yearAriaLabel: 'Year',
    };

    const { container } = render(<DatePicker {...ariaLabelProps} />);

    const calendarButton = container.querySelector('button.react-date-picker__calendar-button');
    const clearButton = container.querySelector('button.react-date-picker__clear-button');

    const nativeInput = container.querySelector('input[type="date"]');
    const dayInput = container.querySelector('input[name="day"]');
    const monthInput = container.querySelector('input[name="month"]');
    const yearInput = container.querySelector('input[name="year"]');

    expect(calendarButton).toHaveAttribute('aria-label', ariaLabelProps.calendarAriaLabel);
    expect(clearButton).toHaveAttribute('aria-label', ariaLabelProps.clearAriaLabel);

    expect(nativeInput).toHaveAttribute('aria-label', ariaLabelProps.nativeInputAriaLabel);
    expect(dayInput).toHaveAttribute('aria-label', ariaLabelProps.dayAriaLabel);
    expect(monthInput).toHaveAttribute('aria-label', ariaLabelProps.monthAriaLabel);
    expect(yearInput).toHaveAttribute('aria-label', ariaLabelProps.yearAriaLabel);
  });

  it('passes placeholder props to DateInput', () => {
    const placeholderProps = {
      dayPlaceholder: 'dd',
      monthPlaceholder: 'mm',
      yearPlaceholder: 'yyyy',
    };

    const { container } = render(<DatePicker {...placeholderProps} />);

    const dayInput = container.querySelector('input[name="day"]');
    const monthInput = container.querySelector('input[name="month"]');
    const yearInput = container.querySelector('input[name="year"]');

    expect(dayInput).toHaveAttribute('placeholder', 'dd');
    expect(monthInput).toHaveAttribute('placeholder', 'mm');
    expect(yearInput).toHaveAttribute('placeholder', 'yyyy');
  });

  describe('passes value to DateInput', () => {
    it('passes single value to DateInput', () => {
      const value = new Date(2019, 0, 1);

      const { container } = render(<DatePicker value={value} />);

      const nativeInput = container.querySelector('input[type="date"]');

      expect(nativeInput).toHaveValue('2019-01-01');
    });

    it('passes the first item of an array of values to DateInput', () => {
      const value1 = new Date(2019, 0, 1);
      const value2 = new Date(2019, 6, 1);

      const { container } = render(<DatePicker value={[value1, value2]} />);

      const nativeInput = container.querySelector('input[type="date"]');

      expect(nativeInput).toHaveValue('2019-01-01');
    });
  });

  it('applies className to its wrapper when given a string', () => {
    const className = 'testClassName';

    const { container } = render(<DatePicker className={className} />);

    const wrapper = container.firstElementChild;

    expect(wrapper).toHaveClass(className);
  });

  it('applies "--open" className to its wrapper when given isOpen flag', () => {
    const { container } = render(<DatePicker isOpen />);

    const wrapper = container.firstElementChild;

    expect(wrapper).toHaveClass('react-date-picker--open');
  });

  it('applies calendarClassName to the calendar when given a string', () => {
    const calendarClassName = 'testClassName';

    const { container } = render(<DatePicker calendarClassName={calendarClassName} isOpen />);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toHaveClass(calendarClassName);
  });

  it('renders DateInput component', () => {
    const { container } = render(<DatePicker />);

    const nativeInput = container.querySelector('input[type="date"]');

    expect(nativeInput).toBeInTheDocument();
  });

  describe('renders clear button properly', () => {
    it('renders clear button', () => {
      const { container } = render(<DatePicker />);

      const clearButton = container.querySelector('button.react-date-picker__clear-button');

      expect(clearButton).toBeInTheDocument();
    });

    it('renders clear icon by default when clearIcon is not given', () => {
      const { container } = render(<DatePicker />);

      const clearButton = container.querySelector(
        'button.react-date-picker__clear-button',
      ) as HTMLButtonElement;

      const clearIcon = clearButton.querySelector('svg');

      expect(clearIcon).toBeInTheDocument();
    });

    it('renders clear icon when given clearIcon as a string', () => {
      const { container } = render(<DatePicker clearIcon="❌" />);

      const clearButton = container.querySelector('button.react-date-picker__clear-button');

      expect(clearButton).toHaveTextContent('❌');
    });

    it('renders clear icon when given clearIcon as a React element', () => {
      function ClearIcon() {
        return <>❌</>;
      }

      const { container } = render(<DatePicker clearIcon={<ClearIcon />} />);

      const clearButton = container.querySelector('button.react-date-picker__clear-button');

      expect(clearButton).toHaveTextContent('❌');
    });

    it('renders clear icon when given clearIcon as a function', () => {
      function ClearIcon() {
        return <>❌</>;
      }

      const { container } = render(<DatePicker clearIcon={ClearIcon} />);

      const clearButton = container.querySelector('button.react-date-picker__clear-button');

      expect(clearButton).toHaveTextContent('❌');
    });
  });

  describe('renders calendar button properly', () => {
    it('renders calendar button', () => {
      const { container } = render(<DatePicker />);

      const calendarButton = container.querySelector('button.react-date-picker__calendar-button');

      expect(calendarButton).toBeInTheDocument();
    });

    it('renders calendar icon by default when calendarIcon is not given', () => {
      const { container } = render(<DatePicker />);

      const calendarButton = container.querySelector(
        'button.react-date-picker__calendar-button',
      ) as HTMLButtonElement;

      const calendarIcon = calendarButton.querySelector('svg');

      expect(calendarIcon).toBeInTheDocument();
    });

    it('renders calendar icon when given calendarIcon as a string', () => {
      const { container } = render(<DatePicker calendarIcon="📅" />);

      const calendarButton = container.querySelector('button.react-date-picker__calendar-button');

      expect(calendarButton).toHaveTextContent('📅');
    });

    it('renders calendar icon when given calendarIcon as a React element', () => {
      function CalendarIcon() {
        return <>📅</>;
      }

      const { container } = render(<DatePicker calendarIcon={<CalendarIcon />} />);

      const calendarButton = container.querySelector('button.react-date-picker__calendar-button');

      expect(calendarButton).toHaveTextContent('📅');
    });

    it('renders calendar icon when given calendarIcon as a function', () => {
      function CalendarIcon() {
        return <>📅</>;
      }

      const { container } = render(<DatePicker calendarIcon={CalendarIcon} />);

      const calendarButton = container.querySelector('button.react-date-picker__calendar-button');

      expect(calendarButton).toHaveTextContent('📅');
    });
  });

  it('renders Calendar component when given isOpen flag', () => {
    const { container } = render(<DatePicker isOpen />);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('does not render Calendar component when given disableCalendar & isOpen flags', () => {
    const { container } = render(<DatePicker disableCalendar isOpen />);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeFalsy();
  });

  it('opens Calendar component when given isOpen flag by changing props', () => {
    const { container, rerender } = render(<DatePicker />);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeFalsy();

    rerender(<DatePicker isOpen />);

    const calendar2 = container.querySelector('.react-calendar');

    expect(calendar2).toBeInTheDocument();
  });

  it('opens Calendar component when clicking on a button', () => {
    const { container } = render(<DatePicker />);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeFalsy();

    const button = container.querySelector(
      'button.react-date-picker__calendar-button',
    ) as HTMLButtonElement;
    fireEvent.click(button);

    const calendar2 = container.querySelector('.react-calendar');

    expect(calendar2).toBeInTheDocument();
  });

  describe('handles opening Calendar component when focusing on an input inside properly', () => {
    it('opens Calendar component when focusing on an input inside by default', () => {
      const { container } = render(<DatePicker />);

      const calendar = container.querySelector('.react-calendar');
      const input = container.querySelector('input[name="day"]') as HTMLInputElement;

      expect(calendar).toBeFalsy();

      fireEvent.focus(input);

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeInTheDocument();
    });

    it('opens Calendar component when focusing on an input inside given openCalendarOnFocus = true', () => {
      const { container } = render(<DatePicker openCalendarOnFocus />);

      const calendar = container.querySelector('.react-calendar');
      const input = container.querySelector('input[name="day"]') as HTMLInputElement;

      expect(calendar).toBeFalsy();

      fireEvent.focus(input);

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeInTheDocument();
    });

    it('does not open Calendar component when focusing on an input inside given openCalendarOnFocus = false', () => {
      const { container } = render(<DatePicker openCalendarOnFocus={false} />);

      const calendar = container.querySelector('.react-calendar');
      const input = container.querySelector('input[name="day"]') as HTMLInputElement;

      expect(calendar).toBeFalsy();

      fireEvent.focus(input);

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeFalsy();
    });

    it('does not open Calendar when focusing on an input inside given shouldOpenCalendar function returning false', () => {
      const shouldOpenCalendar = () => false;

      const { container } = render(<DatePicker shouldOpenCalendar={shouldOpenCalendar} />);

      const calendar = container.querySelector('.react-calendar');
      const input = container.querySelector('input[name="day"]') as HTMLInputElement;

      expect(calendar).toBeFalsy();

      fireEvent.focus(input);

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeFalsy();
    });

    it('does not open Calendar component when focusing on a select element', () => {
      const { container } = render(<DatePicker format="dd.MMMM.yyyy" />);

      const calendar = container.querySelector('.react-calendar');

      expect(calendar).toBeFalsy();

      const select = container.querySelector('select[name="month"]') as HTMLSelectElement;
      fireEvent.focus(select);

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeFalsy();
    });
  });

  it('closes Calendar component when clicked outside', async () => {
    const { container } = render(<DatePicker isOpen />);

    userEvent.click(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-date-picker__calendar'),
    );
  });

  it('closes Calendar component when focused outside', async () => {
    const { container } = render(<DatePicker isOpen />);

    fireEvent.focus(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-date-picker__calendar'),
    );
  });

  it('closes Calendar component when tapped outside', async () => {
    const { container } = render(<DatePicker isOpen />);

    fireEvent.touchStart(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-date-picker__calendar'),
    );
  });

  it('does not close Calendar component when focused inside', () => {
    const { container } = render(<DatePicker isOpen />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const monthInput = customInputs[0] as HTMLInputElement;
    const dayInput = customInputs[1] as HTMLInputElement;

    fireEvent.blur(monthInput);
    fireEvent.focus(dayInput);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('closes Calendar when changing value by default', async () => {
    const { container } = render(<DatePicker isOpen />);

    const firstTile = container.querySelector('.react-calendar__tile') as HTMLButtonElement;

    act(() => {
      fireEvent.click(firstTile);
    });

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-date-picker__calendar'),
    );
  });

  it('closes Calendar when changing value with prop closeCalendar = true', async () => {
    const { container } = render(<DatePicker closeCalendar isOpen />);

    const firstTile = container.querySelector('.react-calendar__tile') as HTMLButtonElement;

    act(() => {
      fireEvent.click(firstTile);
    });

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-date-picker__calendar'),
    );
  });

  it('does not close Calendar when changing value with prop closeCalendar = false', () => {
    const { container } = render(<DatePicker closeCalendar={false} isOpen />);

    const firstTile = container.querySelector('.react-calendar__tile') as HTMLButtonElement;

    act(() => {
      fireEvent.click(firstTile);
    });

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('does not close Calendar when changing value with shouldCloseCalendar function returning false', () => {
    const shouldCloseCalendar = () => false;

    const { container } = render(<DatePicker isOpen shouldCloseCalendar={shouldCloseCalendar} />);

    const firstTile = container.querySelector('.react-calendar__tile') as HTMLButtonElement;

    act(() => {
      fireEvent.click(firstTile);
    });

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('does not close Calendar when changing value using inputs', () => {
    const { container } = render(<DatePicker isOpen />);

    const dayInput = container.querySelector('input[name="day"]') as HTMLInputElement;

    act(() => {
      fireEvent.change(dayInput, { target: { value: '1' } });
    });

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('calls onChange callback when changing value', () => {
    const value = new Date(2023, 0, 31);
    const onChange = vi.fn();

    const { container } = render(<DatePicker onChange={onChange} value={value} />);

    const dayInput = container.querySelector('input[name="day"]') as HTMLInputElement;

    act(() => {
      fireEvent.change(dayInput, { target: { value: '1' } });
    });

    expect(onChange).toHaveBeenCalledWith(new Date(2023, 0, 1));
  });

  it('calls onInvalidChange callback when changing value to an invalid one', () => {
    const value = new Date(2023, 0, 31);
    const onInvalidChange = vi.fn();

    const { container } = render(<DatePicker onInvalidChange={onInvalidChange} value={value} />);

    const dayInput = container.querySelector('input[name="day"]') as HTMLInputElement;

    act(() => {
      fireEvent.change(dayInput, { target: { value: '32' } });
    });

    expect(onInvalidChange).toHaveBeenCalled();
  });

  it('clears the value when clicking on a button', () => {
    const onChange = vi.fn();

    const { container } = render(<DatePicker onChange={onChange} />);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeFalsy();

    const button = container.querySelector(
      'button.react-date-picker__clear-button',
    ) as HTMLButtonElement;

    fireEvent.click(button);

    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('calls onClick callback when clicked a page (sample of mouse events family)', () => {
    const onClick = vi.fn();

    const { container } = render(<DatePicker onClick={onClick} />);

    const wrapper = container.firstElementChild as HTMLDivElement;
    fireEvent.click(wrapper);

    expect(onClick).toHaveBeenCalled();
  });

  it('calls onTouchStart callback when touched a page (sample of touch events family)', () => {
    const onTouchStart = vi.fn();

    const { container } = render(<DatePicker onTouchStart={onTouchStart} />);

    const wrapper = container.firstElementChild as HTMLDivElement;
    fireEvent.touchStart(wrapper);

    expect(onTouchStart).toHaveBeenCalled();
  });
});
