import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { act } from 'react';

import DatePicker from './DatePicker.js';

import type { Locator } from 'vitest/browser';

async function waitForElementToBeRemovedOrHidden(callback: () => HTMLElement | null) {
  const element = callback();

  if (element) {
    await vi.waitFor(() =>
      expect(element).toHaveAttribute('class', expect.stringContaining('--closed')),
    );
  }
}

describe('DatePicker', () => {
  const defaultProps = {
    dayAriaLabel: 'day',
    monthAriaLabel: 'month',
    yearAriaLabel: 'year',
  };

  it('passes default name to DateInput', async () => {
    const { container } = await render(<DatePicker {...defaultProps} />);

    const nativeInput = container.querySelector('input[type="date"]');

    expect(nativeInput).toHaveAttribute('name', 'date');
  });

  it('passes custom name to DateInput', async () => {
    const name = 'testName';

    const { container } = await render(
      <DatePicker {...defaultProps} name={name} value={new Date(2020, 10, 11)} />,
    );

    const nativeInput = container.querySelector('input[type="date"]');

    expect(nativeInput).toHaveAttribute('name', name);
  });

  it('passes autoFocus flag to DateInput', async () => {
    await render(<DatePicker {...defaultProps} autoFocus />);

    const customInputs = page.getByRole('spinbutton');

    expect(customInputs.nth(0)).toHaveFocus();
  });

  it('passes disabled flag to DateInput', async () => {
    const { container } = await render(<DatePicker {...defaultProps} disabled />);

    const nativeInput = container.querySelector('input[type="date"]');

    expect(nativeInput).toBeDisabled();
  });

  it('passes format to DateInput', async () => {
    await render(<DatePicker {...defaultProps} format="yyyy" />);

    const customInputs = page.getByRole('spinbutton');

    expect(customInputs).toHaveLength(1);
    expect(customInputs.nth(0)).toHaveAttribute('name', 'year');
  });

  it('passes aria-label props to DateInput', async () => {
    const ariaLabelProps = {
      calendarAriaLabel: 'Toggle calendar',
      clearAriaLabel: 'Clear value',
      dayAriaLabel: 'Day',
      monthAriaLabel: 'Month',
      nativeInputAriaLabel: 'Date',
      yearAriaLabel: 'Year',
    };

    const { container } = await render(<DatePicker {...ariaLabelProps} />);

    const calendarButton = page.getByTestId('calendar-button');
    const clearButton = page.getByTestId('clear-button');

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

  it('passes placeholder props to DateInput', async () => {
    const placeholderProps = {
      dayPlaceholder: 'dd',
      monthPlaceholder: 'mm',
      yearPlaceholder: 'yyyy',
    };

    await render(<DatePicker {...defaultProps} {...placeholderProps} />);

    const dayInput = page.getByRole('spinbutton', { name: 'day' });
    const monthInput = page.getByRole('spinbutton', { name: 'month' });
    const yearInput = page.getByRole('spinbutton', { name: 'year' });

    expect(dayInput).toHaveAttribute('placeholder', 'dd');
    expect(monthInput).toHaveAttribute('placeholder', 'mm');
    expect(yearInput).toHaveAttribute('placeholder', 'yyyy');
  });

  describe('passes value to DateInput', () => {
    it('passes single value to DateInput', async () => {
      const value = new Date(2019, 0, 1);

      const { container } = await render(<DatePicker {...defaultProps} value={value} />);

      const nativeInput = container.querySelector('input[type="date"]');

      expect(nativeInput).toHaveValue('2019-01-01');
    });

    it('passes the first item of an array of values to DateInput', async () => {
      const value1 = new Date(2019, 0, 1);
      const value2 = new Date(2019, 6, 1);

      const { container } = await render(<DatePicker {...defaultProps} value={[value1, value2]} />);

      const nativeInput = container.querySelector('input[type="date"]');

      expect(nativeInput).toHaveValue('2019-01-01');
    });
  });

  it('applies className to its wrapper when given a string', async () => {
    const className = 'testClassName';

    const { container } = await render(<DatePicker {...defaultProps} className={className} />);

    const wrapper = container.firstElementChild;

    expect(wrapper).toHaveClass(className);
  });

  it('applies "--open" className to its wrapper when given isOpen flag', async () => {
    const { container } = await render(<DatePicker {...defaultProps} isOpen />);

    const wrapper = container.firstElementChild;

    expect(wrapper).toHaveClass('react-date-picker--open');
  });

  it('applies calendar className to the calendar when given a string', async () => {
    const calendarClassName = 'testClassName';

    const { container } = await render(
      <DatePicker {...defaultProps} calendarProps={{ className: calendarClassName }} isOpen />,
    );

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toHaveClass(calendarClassName);
  });

  it('renders DateInput component', async () => {
    const { container } = await render(<DatePicker {...defaultProps} />);

    const nativeInput = container.querySelector('input[type="date"]');

    expect(nativeInput).toBeInTheDocument();
  });

  describe('renders clear button properly', () => {
    it('renders clear button', async () => {
      await render(<DatePicker {...defaultProps} />);

      const clearButton = page.getByTestId('clear-button');

      expect(clearButton).toBeInTheDocument();
    });

    it('renders clear icon by default when clearIcon is not given', async () => {
      await render(<DatePicker {...defaultProps} />);

      const clearButton = page.getByTestId('clear-button');

      const clearIcon = clearButton.element().querySelector('svg');

      expect(clearIcon).toBeInTheDocument();
    });

    it('renders clear icon when given clearIcon as a string', async () => {
      await render(<DatePicker {...defaultProps} clearIcon="❌" />);

      const clearButton = page.getByTestId('clear-button');

      expect(clearButton).toHaveTextContent('❌');
    });

    it('renders clear icon when given clearIcon as a React element', async () => {
      function ClearIcon() {
        return <span>❌</span>;
      }

      await render(<DatePicker {...defaultProps} clearIcon={<ClearIcon />} />);

      const clearButton = page.getByTestId('clear-button');

      expect(clearButton).toHaveTextContent('❌');
    });

    it('renders clear icon when given clearIcon as a function', async () => {
      function ClearIcon() {
        return <span>❌</span>;
      }

      await render(<DatePicker {...defaultProps} clearIcon={ClearIcon} />);

      const clearButton = page.getByTestId('clear-button');

      expect(clearButton).toHaveTextContent('❌');
    });
  });

  describe('renders calendar button properly', () => {
    it('renders calendar button', async () => {
      await render(<DatePicker {...defaultProps} />);

      const calendarButton = page.getByTestId('calendar-button');

      expect(calendarButton).toBeInTheDocument();
    });

    it('renders calendar icon by default when calendarIcon is not given', async () => {
      await render(<DatePicker {...defaultProps} />);

      const calendarButton = page.getByTestId('calendar-button');

      const calendarIcon = calendarButton.element().querySelector('svg');

      expect(calendarIcon).toBeInTheDocument();
    });

    it('renders calendar icon when given calendarIcon as a string', async () => {
      await render(<DatePicker {...defaultProps} calendarIcon="📅" />);

      const calendarButton = page.getByTestId('calendar-button');

      expect(calendarButton).toHaveTextContent('📅');
    });

    it('renders calendar icon when given calendarIcon as a React element', async () => {
      function CalendarIcon() {
        return <span>📅</span>;
      }

      await render(<DatePicker {...defaultProps} calendarIcon={<CalendarIcon />} />);

      const calendarButton = page.getByTestId('calendar-button');

      expect(calendarButton).toHaveTextContent('📅');
    });

    it('renders calendar icon when given calendarIcon as a function', async () => {
      function CalendarIcon() {
        return <span>📅</span>;
      }

      await render(<DatePicker {...defaultProps} calendarIcon={CalendarIcon} />);

      const calendarButton = page.getByTestId('calendar-button');

      expect(calendarButton).toHaveTextContent('📅');
    });
  });

  it('renders Calendar component when given isOpen flag', async () => {
    const { container } = await render(<DatePicker {...defaultProps} isOpen />);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('does not render Calendar component when given disableCalendar & isOpen flags', async () => {
    const { container } = await render(<DatePicker {...defaultProps} disableCalendar isOpen />);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).not.toBeInTheDocument();
  });

  it('opens Calendar component when given isOpen flag by changing props', async () => {
    const { container, rerender } = await render(<DatePicker {...defaultProps} />);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).not.toBeInTheDocument();

    rerender(<DatePicker {...defaultProps} isOpen />);

    const calendar2 = container.querySelector('.react-calendar');

    expect(calendar2).toBeInTheDocument();
  });

  it('opens Calendar component when clicking on a button', async () => {
    const { container } = await render(<DatePicker {...defaultProps} />);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).not.toBeInTheDocument();

    const button = page.getByTestId('calendar-button');
    await userEvent.click(button);

    const calendar2 = container.querySelector('.react-calendar');

    expect(calendar2).toBeInTheDocument();
  });

  function triggerFocusInEvent(locator: Locator) {
    const element = locator.element();

    element.dispatchEvent(
      new FocusEvent('focusin', { bubbles: true, cancelable: false, composed: true }),
    );
  }

  function triggerFocusEvent(locator: Locator) {
    triggerFocusInEvent(locator);

    const element = locator.element();

    element.dispatchEvent(
      new FocusEvent('focus', { bubbles: false, cancelable: false, composed: true }),
    );
  }

  describe('handles opening Calendar component when focusing on an input inside properly', () => {
    it('opens Calendar component when focusing on an input inside by default', async () => {
      const { container } = await render(<DatePicker {...defaultProps} />);

      const calendar = container.querySelector('.react-calendar');
      const input = page.getByRole('spinbutton', { name: 'day' });

      expect(calendar).not.toBeInTheDocument();

      act(() => {
        triggerFocusEvent(input);
      });

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeInTheDocument();
    });

    it('opens Calendar component when focusing on an input inside given openCalendarOnFocus = true', async () => {
      const { container } = await render(<DatePicker {...defaultProps} openCalendarOnFocus />);

      const calendar = container.querySelector('.react-calendar');
      const input = page.getByRole('spinbutton', { name: 'day' });

      expect(calendar).not.toBeInTheDocument();

      act(() => {
        triggerFocusEvent(input);
      });

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeInTheDocument();
    });

    it('does not open Calendar component when focusing on an input inside given openCalendarOnFocus = false', async () => {
      const { container } = await render(
        <DatePicker {...defaultProps} openCalendarOnFocus={false} />,
      );

      const calendar = container.querySelector('.react-calendar');
      const input = page.getByRole('spinbutton', { name: 'day' });

      expect(calendar).not.toBeInTheDocument();

      act(() => {
        triggerFocusEvent(input);
      });

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeFalsy();
    });

    it('does not open Calendar when focusing on an input inside given shouldOpenCalendar function returning false', async () => {
      const shouldOpenCalendar = () => false;

      const { container } = await render(
        <DatePicker {...defaultProps} shouldOpenCalendar={shouldOpenCalendar} />,
      );

      const calendar = container.querySelector('.react-calendar');
      const input = page.getByRole('spinbutton', { name: 'day' });

      expect(calendar).not.toBeInTheDocument();

      triggerFocusEvent(input);

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeFalsy();
    });

    it('does not open Calendar component when focusing on a select element', async () => {
      const { container } = await render(<DatePicker {...defaultProps} format="dd.MMMM.yyyy" />);

      const calendar = container.querySelector('.react-calendar');

      expect(calendar).not.toBeInTheDocument();

      const select = page.getByRole('combobox', { name: 'month' });
      triggerFocusEvent(select);

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeFalsy();
    });
  });

  it('closes Calendar component when clicked outside', async () => {
    const { container } = await render(<DatePicker {...defaultProps} isOpen />);

    await userEvent.click(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-date-picker__calendar'),
    );
  });

  it('closes Calendar component when focused outside', async () => {
    const { container } = await render(<DatePicker {...defaultProps} isOpen />);

    triggerFocusEvent(page.elementLocator(document.body));

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-date-picker__calendar'),
    );
  });

  function triggerTouchStart(element: HTMLElement) {
    element.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, cancelable: true }));
  }

  it('closes Calendar component when tapped outside', async () => {
    const { container } = await render(<DatePicker {...defaultProps} isOpen />);

    triggerTouchStart(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-date-picker__calendar'),
    );
  });

  function triggerFocusOutEvent(locator: Locator) {
    const element = locator.element();

    element.dispatchEvent(
      new FocusEvent('focusout', { bubbles: true, cancelable: false, composed: true }),
    );
  }

  function triggerBlurEvent(locator: Locator) {
    triggerFocusOutEvent(locator);

    const element = locator.element();

    element.dispatchEvent(
      new FocusEvent('blur', { bubbles: false, cancelable: false, composed: true }),
    );
  }

  it('does not close Calendar component when focused inside', async () => {
    const { container } = await render(<DatePicker {...defaultProps} isOpen />);

    const monthInput = page.getByRole('spinbutton', { name: 'month' });
    const dayInput = page.getByRole('spinbutton', { name: 'day' });

    triggerBlurEvent(monthInput);
    triggerFocusEvent(dayInput);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('closes Calendar when changing value by default', async () => {
    const { container } = await render(<DatePicker {...defaultProps} isOpen />);

    const firstTile = container.querySelector('.react-calendar__tile') as HTMLButtonElement;

    await act(async () => {
      await userEvent.click(firstTile);
    });

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-date-picker__calendar'),
    );
  });

  it('closes Calendar when changing value with prop closeCalendar = true', async () => {
    const { container } = await render(<DatePicker {...defaultProps} closeCalendar isOpen />);

    const firstTile = container.querySelector('.react-calendar__tile') as HTMLButtonElement;

    await act(async () => {
      await userEvent.click(firstTile);
    });

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-date-picker__calendar'),
    );
  });

  it('does not close Calendar when changing value with prop closeCalendar = false', async () => {
    const { container } = await render(
      <DatePicker {...defaultProps} closeCalendar={false} isOpen />,
    );

    const firstTile = container.querySelector('.react-calendar__tile') as HTMLButtonElement;

    await act(async () => {
      await userEvent.click(firstTile);
    });

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('does not close Calendar when changing value with shouldCloseCalendar function returning false', async () => {
    const shouldCloseCalendar = () => false;

    const { container } = await render(
      <DatePicker {...defaultProps} isOpen shouldCloseCalendar={shouldCloseCalendar} />,
    );

    const firstTile = container.querySelector('.react-calendar__tile') as HTMLButtonElement;

    await act(async () => {
      await userEvent.click(firstTile);
    });

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('does not close Calendar when changing value using inputs', async () => {
    const { container } = await render(<DatePicker {...defaultProps} isOpen />);

    const dayInput = page.getByRole('spinbutton', { name: 'day' });

    await act(async () => {
      await userEvent.fill(dayInput, '1');
    });

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('calls onChange callback when changing value', async () => {
    const value = new Date(2023, 0, 31);
    const onChange = vi.fn();

    await render(<DatePicker {...defaultProps} onChange={onChange} value={value} />);

    const dayInput = page.getByRole('spinbutton', { name: 'day' });

    await act(async () => {
      await userEvent.fill(dayInput, '1');
    });

    expect(onChange).toHaveBeenCalledWith(new Date(2023, 0, 1));
  });

  it('calls onInvalidChange callback when changing value to an invalid one', async () => {
    const value = new Date(2023, 0, 31);
    const onInvalidChange = vi.fn();

    await render(<DatePicker {...defaultProps} onInvalidChange={onInvalidChange} value={value} />);

    const dayInput = page.getByRole('spinbutton', { name: 'day' });

    await act(async () => {
      await userEvent.fill(dayInput, '32');
    });

    expect(onInvalidChange).toHaveBeenCalled();
  });

  it('clears the value when clicking on a button', async () => {
    const onChange = vi.fn();

    const { container } = await render(<DatePicker {...defaultProps} onChange={onChange} />);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).not.toBeInTheDocument();

    const button = page.getByTestId('clear-button');

    await userEvent.click(button);

    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('calls onClick callback when clicked a page (sample of mouse events family)', async () => {
    const onClick = vi.fn();

    const { container } = await render(<DatePicker {...defaultProps} onClick={onClick} />);

    const wrapper = container.firstElementChild as HTMLDivElement;
    await userEvent.click(wrapper);

    expect(onClick).toHaveBeenCalled();
  });

  it('calls onTouchStart callback when touched a page (sample of touch events family)', async () => {
    const onTouchStart = vi.fn();

    const { container } = await render(
      <DatePicker {...defaultProps} onTouchStart={onTouchStart} />,
    );

    const wrapper = container.firstElementChild as HTMLDivElement;

    triggerTouchStart(wrapper);

    expect(onTouchStart).toHaveBeenCalled();
  });
});
