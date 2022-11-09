import React, { createRef } from 'react';
import { act, fireEvent, render, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DatePicker from './DatePicker';

async function waitForElementToBeRemovedOrHidden(callback) {
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

  // See https://github.com/jsdom/jsdom/issues/3041
  it.skip('passes autoFocus flag to DateInput', () => {
    // eslint-disable-next-line jsx-a11y/no-autofocus
    const { container } = render(<DatePicker autoFocus />);

    const customInputs = container.querySelectorAll('input[data-input]');

    expect(customInputs[0]).toHaveAttribute('autoFocus');
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

    const wrapper = container.firstChild;

    expect(wrapper).toHaveClass(className);
  });

  it('applies "--open" className to its wrapper when given isOpen flag', () => {
    const { container } = render(<DatePicker isOpen />);

    const wrapper = container.firstChild;

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

  it('renders clear button', () => {
    const { container } = render(<DatePicker />);

    const clearButton = container.querySelector('button.react-date-picker__clear-button');

    expect(clearButton).toBeInTheDocument();
  });

  it('renders calendar button', () => {
    const { container } = render(<DatePicker />);

    const calendarButton = container.querySelector('button.react-date-picker__calendar-button');

    expect(calendarButton).toBeInTheDocument();
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

    const button = container.querySelector('button.react-date-picker__calendar-button');
    fireEvent.click(button);

    const calendar2 = container.querySelector('.react-calendar');

    expect(calendar2).toBeInTheDocument();
  });

  describe('handles opening Calendar component when focusing on an input inside properly', () => {
    it('opens Calendar component when focusing on an input inside by default', () => {
      const { container } = render(<DatePicker />);

      const calendar = container.querySelector('.react-calendar');

      expect(calendar).toBeFalsy();

      const input = container.querySelector('input[name="day"]');
      fireEvent.focus(input);

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeInTheDocument();
    });

    it('opens Calendar component when focusing on an input inside given openCalendarOnFocus = true', () => {
      const { container } = render(<DatePicker openCalendarOnFocus />);

      const calendar = container.querySelector('.react-calendar');

      expect(calendar).toBeFalsy();

      const input = container.querySelector('input[name="day"]');
      fireEvent.focus(input);

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeInTheDocument();
    });

    it('does not open Calendar component when focusing on an input inside given openCalendarOnFocus = false', () => {
      const { container } = render(<DatePicker openCalendarOnFocus={false} />);

      const calendar = container.querySelector('.react-calendar');

      expect(calendar).toBeFalsy();

      const input = container.querySelector('input[name="day"]');
      fireEvent.focus(input);

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeFalsy();
    });

    it('does not open Calendar component when focusing on a select element', () => {
      const { container } = render(<DatePicker format="dd.MMMM.yyyy" />);

      const calendar = container.querySelector('.react-calendar');

      expect(calendar).toBeFalsy();

      const select = container.querySelector('select[name="month"]');
      fireEvent.focus(select);

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeFalsy();
    });
  });

  it('closes Calendar component when clicked outside', async () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const { container } = render(<DatePicker isOpen />, { attachTo: root });

    userEvent.click(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-date-picker__calendar'),
    );
  });

  it('closes Calendar component when focused outside', async () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const { container } = render(<DatePicker isOpen />, { attachTo: root });

    fireEvent.focus(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-date-picker__calendar'),
    );
  });

  it('closes Calendar component when tapped outside', async () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const { container } = render(<DatePicker isOpen />, { attachTo: root });

    fireEvent.touchStart(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-date-picker__calendar'),
    );
  });

  it('does not close Calendar component when focused inside', () => {
    const { container } = render(<DatePicker isOpen />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const dayInput = customInputs[0];
    const monthInput = customInputs[1];

    fireEvent.blur(dayInput);
    fireEvent.focus(monthInput);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('closes Calendar when calling internal onChange by default', async () => {
    const instance = createRef();

    const { container } = render(<DatePicker isOpen ref={instance} />);

    const { onChange: onChangeInternal } = instance.current;

    act(() => {
      onChangeInternal(new Date());
    });

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-date-picker__calendar'),
    );
  });

  it('does not close Calendar when calling internal onChange with prop closeCalendar = false', () => {
    const instance = createRef();

    const { container } = render(<DatePicker closeCalendar={false} isOpen ref={instance} />);

    const { onChange: onChangeInternal } = instance.current;

    act(() => {
      onChangeInternal(new Date());
    });

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('does not close Calendar when calling internal onChange with closeCalendar = false', () => {
    const instance = createRef();

    const { container } = render(<DatePicker isOpen ref={instance} />);

    const { onChange: onChangeInternal } = instance.current;

    act(() => {
      onChangeInternal(new Date(), false);
    });

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('calls onChange callback when calling internal onChange', () => {
    const instance = createRef();
    const nextValue = new Date(2019, 0, 1);
    const onChange = jest.fn();

    render(<DatePicker onChange={onChange} ref={instance} />);

    const { onChange: onChangeInternal } = instance.current;

    act(() => {
      onChangeInternal(nextValue);
    });

    expect(onChange).toHaveBeenCalledWith(nextValue);
  });

  it('clears the value when clicking on a button', () => {
    const onChange = jest.fn();

    const { container } = render(<DatePicker onChange={onChange} />);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeFalsy();

    const button = container.querySelector('button.react-date-picker__clear-button');

    fireEvent.click(button);

    expect(onChange).toHaveBeenCalledWith(null);
  });
});
