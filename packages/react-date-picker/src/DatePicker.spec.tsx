import { describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { act } from 'react-dom/test-utils';

import DatePicker from './DatePicker.js';

async function waitForElementToBeRemovedOrHidden(callback: () => HTMLElement | null) {
  const element = callback();

  if (element) {
    await vi.waitFor(() =>
      expect(element).toHaveAttribute('class', expect.stringContaining('--closed')),
    );
  }
}

describe('DatePicker', () => {
  it('passes default name to DateInput', async () => {
    const { container } = await render(<DatePicker />);

    const nativeInput = container.querySelector('input[type="date"]');

    expect(nativeInput).toHaveAttribute('name', 'date');
  });

  it('passes custom name to DateInput', async () => {
    const name = 'testName';

    const { container } = await render(<DatePicker name={name} value={new Date(2020, 10, 11)} />);

    const nativeInput = container.querySelector('input[type="date"]');

    expect(nativeInput).toHaveAttribute('name', name);
  });

  it('passes autoFocus flag to DateInput', async () => {
    const { container } = await render(<DatePicker autoFocus />);

    const customInputs = container.querySelectorAll('input[data-input]');

    expect(customInputs[0]).toHaveFocus();
  });

  it('passes disabled flag to DateInput', async () => {
    const { container } = await render(<DatePicker disabled />);

    const nativeInput = container.querySelector('input[type="date"]');

    expect(nativeInput).toBeDisabled();
  });

  it('passes format to DateInput', async () => {
    const { container } = await render(<DatePicker format="yyyy" />);

    const customInputs = container.querySelectorAll('input[data-input]');

    expect(customInputs).toHaveLength(1);
    expect(customInputs[0]).toHaveAttribute('name', 'year');
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

  it('passes placeholder props to DateInput', async () => {
    const placeholderProps = {
      dayPlaceholder: 'dd',
      monthPlaceholder: 'mm',
      yearPlaceholder: 'yyyy',
    };

    const { container } = await render(<DatePicker {...placeholderProps} />);

    const dayInput = container.querySelector('input[name="day"]');
    const monthInput = container.querySelector('input[name="month"]');
    const yearInput = container.querySelector('input[name="year"]');

    expect(dayInput).toHaveAttribute('placeholder', 'dd');
    expect(monthInput).toHaveAttribute('placeholder', 'mm');
    expect(yearInput).toHaveAttribute('placeholder', 'yyyy');
  });

  describe('passes value to DateInput', () => {
    it('passes single value to DateInput', async () => {
      const value = new Date(2019, 0, 1);

      const { container } = await render(<DatePicker value={value} />);

      const nativeInput = container.querySelector('input[type="date"]');

      expect(nativeInput).toHaveValue('2019-01-01');
    });

    it('passes the first item of an array of values to DateInput', async () => {
      const value1 = new Date(2019, 0, 1);
      const value2 = new Date(2019, 6, 1);

      const { container } = await render(<DatePicker value={[value1, value2]} />);

      const nativeInput = container.querySelector('input[type="date"]');

      expect(nativeInput).toHaveValue('2019-01-01');
    });
  });

  it('applies className to its wrapper when given a string', async () => {
    const className = 'testClassName';

    const { container } = await render(<DatePicker className={className} />);

    const wrapper = container.firstElementChild;

    expect(wrapper).toHaveClass(className);
  });

  it('applies "--open" className to its wrapper when given isOpen flag', async () => {
    const { container } = await render(<DatePicker isOpen />);

    const wrapper = container.firstElementChild;

    expect(wrapper).toHaveClass('react-date-picker--open');
  });

  it('applies calendar className to the calendar when given a string', async () => {
    const calendarClassName = 'testClassName';

    const { container } = await render(
      <DatePicker calendarProps={{ className: calendarClassName }} isOpen />,
    );

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toHaveClass(calendarClassName);
  });

  it('renders DateInput component', async () => {
    const { container } = await render(<DatePicker />);

    const nativeInput = container.querySelector('input[type="date"]');

    expect(nativeInput).toBeInTheDocument();
  });

  describe('renders clear button properly', () => {
    it('renders clear button', async () => {
      const { container } = await render(<DatePicker />);

      const clearButton = container.querySelector('button.react-date-picker__clear-button');

      expect(clearButton).toBeInTheDocument();
    });

    it('renders clear icon by default when clearIcon is not given', async () => {
      const { container } = await render(<DatePicker />);

      const clearButton = container.querySelector(
        'button.react-date-picker__clear-button',
      ) as HTMLButtonElement;

      const clearIcon = clearButton.querySelector('svg');

      expect(clearIcon).toBeInTheDocument();
    });

    it('renders clear icon when given clearIcon as a string', async () => {
      const { container } = await render(<DatePicker clearIcon="❌" />);

      const clearButton = container.querySelector('button.react-date-picker__clear-button');

      expect(clearButton).toHaveTextContent('❌');
    });

    it('renders clear icon when given clearIcon as a React element', async () => {
      function ClearIcon() {
        return <>❌</>;
      }

      const { container } = await render(<DatePicker clearIcon={<ClearIcon />} />);

      const clearButton = container.querySelector('button.react-date-picker__clear-button');

      expect(clearButton).toHaveTextContent('❌');
    });

    it('renders clear icon when given clearIcon as a function', async () => {
      function ClearIcon() {
        return <>❌</>;
      }

      const { container } = await render(<DatePicker clearIcon={ClearIcon} />);

      const clearButton = container.querySelector('button.react-date-picker__clear-button');

      expect(clearButton).toHaveTextContent('❌');
    });
  });

  describe('renders calendar button properly', () => {
    it('renders calendar button', async () => {
      const { container } = await render(<DatePicker />);

      const calendarButton = container.querySelector('button.react-date-picker__calendar-button');

      expect(calendarButton).toBeInTheDocument();
    });

    it('renders calendar icon by default when calendarIcon is not given', async () => {
      const { container } = await render(<DatePicker />);

      const calendarButton = container.querySelector(
        'button.react-date-picker__calendar-button',
      ) as HTMLButtonElement;

      const calendarIcon = calendarButton.querySelector('svg');

      expect(calendarIcon).toBeInTheDocument();
    });

    it('renders calendar icon when given calendarIcon as a string', async () => {
      const { container } = await render(<DatePicker calendarIcon="📅" />);

      const calendarButton = container.querySelector('button.react-date-picker__calendar-button');

      expect(calendarButton).toHaveTextContent('📅');
    });

    it('renders calendar icon when given calendarIcon as a React element', async () => {
      function CalendarIcon() {
        return <>📅</>;
      }

      const { container } = await render(<DatePicker calendarIcon={<CalendarIcon />} />);

      const calendarButton = container.querySelector('button.react-date-picker__calendar-button');

      expect(calendarButton).toHaveTextContent('📅');
    });

    it('renders calendar icon when given calendarIcon as a function', async () => {
      function CalendarIcon() {
        return <>📅</>;
      }

      const { container } = await render(<DatePicker calendarIcon={CalendarIcon} />);

      const calendarButton = container.querySelector('button.react-date-picker__calendar-button');

      expect(calendarButton).toHaveTextContent('📅');
    });
  });

  it('renders Calendar component when given isOpen flag', async () => {
    const { container } = await render(<DatePicker isOpen />);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('does not render Calendar component when given disableCalendar & isOpen flags', async () => {
    const { container } = await render(<DatePicker disableCalendar isOpen />);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeFalsy();
  });

  it('opens Calendar component when given isOpen flag by changing props', async () => {
    const { container, rerender } = await render(<DatePicker />);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeFalsy();

    rerender(<DatePicker isOpen />);

    const calendar2 = container.querySelector('.react-calendar');

    expect(calendar2).toBeInTheDocument();
  });

  it('opens Calendar component when clicking on a button', async () => {
    const { container } = await render(<DatePicker />);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeFalsy();

    const button = container.querySelector(
      'button.react-date-picker__calendar-button',
    ) as HTMLButtonElement;
    await userEvent.click(button);

    const calendar2 = container.querySelector('.react-calendar');

    expect(calendar2).toBeInTheDocument();
  });

  function triggerFocusInEvent(element: HTMLElement) {
    element.dispatchEvent(
      new FocusEvent('focusin', { bubbles: true, cancelable: false, composed: true }),
    );
  }

  function triggerFocusEvent(element: HTMLElement) {
    triggerFocusInEvent(element);

    element.dispatchEvent(
      new FocusEvent('focus', { bubbles: false, cancelable: false, composed: true }),
    );
  }

  describe('handles opening Calendar component when focusing on an input inside properly', () => {
    it('opens Calendar component when focusing on an input inside by default', async () => {
      const { container } = await render(<DatePicker />);

      const calendar = container.querySelector('.react-calendar');
      const input = container.querySelector('input[name="day"]') as HTMLInputElement;

      expect(calendar).toBeFalsy();

      act(() => {
        triggerFocusEvent(input);
      });

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeInTheDocument();
    });

    it('opens Calendar component when focusing on an input inside given openCalendarOnFocus = true', async () => {
      const { container } = await render(<DatePicker openCalendarOnFocus />);

      const calendar = container.querySelector('.react-calendar');
      const input = container.querySelector('input[name="day"]') as HTMLInputElement;

      expect(calendar).toBeFalsy();

      act(() => {
        triggerFocusEvent(input);
      });

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeInTheDocument();
    });

    it('does not open Calendar component when focusing on an input inside given openCalendarOnFocus = false', async () => {
      const { container } = await render(<DatePicker openCalendarOnFocus={false} />);

      const calendar = container.querySelector('.react-calendar');
      const input = container.querySelector('input[name="day"]') as HTMLInputElement;

      expect(calendar).toBeFalsy();

      act(() => {
        triggerFocusEvent(input);
      });

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeFalsy();
    });

    it('does not open Calendar when focusing on an input inside given shouldOpenCalendar function returning false', async () => {
      const shouldOpenCalendar = () => false;

      const { container } = await render(<DatePicker shouldOpenCalendar={shouldOpenCalendar} />);

      const calendar = container.querySelector('.react-calendar');
      const input = container.querySelector('input[name="day"]') as HTMLInputElement;

      expect(calendar).toBeFalsy();

      triggerFocusEvent(input);

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeFalsy();
    });

    it('does not open Calendar component when focusing on a select element', async () => {
      const { container } = await render(<DatePicker format="dd.MMMM.yyyy" />);

      const calendar = container.querySelector('.react-calendar');

      expect(calendar).toBeFalsy();

      const select = container.querySelector('select[name="month"]') as HTMLSelectElement;
      triggerFocusEvent(select);

      const calendar2 = container.querySelector('.react-calendar');

      expect(calendar2).toBeFalsy();
    });
  });

  it('closes Calendar component when clicked outside', async () => {
    const { container } = await render(<DatePicker isOpen />);

    await userEvent.click(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-date-picker__calendar'),
    );
  });

  it('closes Calendar component when focused outside', async () => {
    const { container } = await render(<DatePicker isOpen />);

    triggerFocusEvent(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-date-picker__calendar'),
    );
  });

  function triggerTouchStart(element: HTMLElement) {
    element.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, cancelable: true }));
  }

  it('closes Calendar component when tapped outside', async () => {
    const { container } = await render(<DatePicker isOpen />);

    triggerTouchStart(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-date-picker__calendar'),
    );
  });

  function triggerFocusOutEvent(element: HTMLElement) {
    element.dispatchEvent(
      new FocusEvent('focusout', { bubbles: true, cancelable: false, composed: true }),
    );
  }

  function triggerBlurEvent(element: HTMLElement) {
    triggerFocusOutEvent(element);

    element.dispatchEvent(
      new FocusEvent('blur', { bubbles: false, cancelable: false, composed: true }),
    );
  }

  it('does not close Calendar component when focused inside', async () => {
    const { container } = await render(<DatePicker isOpen />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const monthInput = customInputs[0] as HTMLInputElement;
    const dayInput = customInputs[1] as HTMLInputElement;

    triggerBlurEvent(monthInput);
    triggerFocusEvent(dayInput);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('closes Calendar when changing value by default', async () => {
    const { container } = await render(<DatePicker isOpen />);

    const firstTile = container.querySelector('.react-calendar__tile') as HTMLButtonElement;

    await act(async () => {
      await userEvent.click(firstTile);
    });

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-date-picker__calendar'),
    );
  });

  it('closes Calendar when changing value with prop closeCalendar = true', async () => {
    const { container } = await render(<DatePicker closeCalendar isOpen />);

    const firstTile = container.querySelector('.react-calendar__tile') as HTMLButtonElement;

    await act(async () => {
      await userEvent.click(firstTile);
    });

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-date-picker__calendar'),
    );
  });

  it('does not close Calendar when changing value with prop closeCalendar = false', async () => {
    const { container } = await render(<DatePicker closeCalendar={false} isOpen />);

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
      <DatePicker isOpen shouldCloseCalendar={shouldCloseCalendar} />,
    );

    const firstTile = container.querySelector('.react-calendar__tile') as HTMLButtonElement;

    await act(async () => {
      await userEvent.click(firstTile);
    });

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('does not close Calendar when changing value using inputs', async () => {
    const { container } = await render(<DatePicker isOpen />);

    const dayInput = container.querySelector('input[name="day"]') as HTMLInputElement;

    await act(async () => {
      await userEvent.fill(dayInput, '1');
    });

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeInTheDocument();
  });

  it('calls onChange callback when changing value', async () => {
    const value = new Date(2023, 0, 31);
    const onChange = vi.fn();

    const { container } = await render(<DatePicker onChange={onChange} value={value} />);

    const dayInput = container.querySelector('input[name="day"]') as HTMLInputElement;

    await act(async () => {
      await userEvent.fill(dayInput, '1');
    });

    expect(onChange).toHaveBeenCalledWith(new Date(2023, 0, 1));
  });

  it('calls onInvalidChange callback when changing value to an invalid one', async () => {
    const value = new Date(2023, 0, 31);
    const onInvalidChange = vi.fn();

    const { container } = await render(
      <DatePicker onInvalidChange={onInvalidChange} value={value} />,
    );

    const dayInput = container.querySelector('input[name="day"]') as HTMLInputElement;

    await act(async () => {
      await userEvent.fill(dayInput, '32');
    });

    expect(onInvalidChange).toHaveBeenCalled();
  });

  it('clears the value when clicking on a button', async () => {
    const onChange = vi.fn();

    const { container } = await render(<DatePicker onChange={onChange} />);

    const calendar = container.querySelector('.react-calendar');

    expect(calendar).toBeFalsy();

    const button = container.querySelector(
      'button.react-date-picker__clear-button',
    ) as HTMLButtonElement;

    await userEvent.click(button);

    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('calls onClick callback when clicked a page (sample of mouse events family)', async () => {
    const onClick = vi.fn();

    const { container } = await render(<DatePicker onClick={onClick} />);

    const wrapper = container.firstElementChild as HTMLDivElement;
    await userEvent.click(wrapper);

    expect(onClick).toHaveBeenCalled();
  });

  it('calls onTouchStart callback when touched a page (sample of touch events family)', async () => {
    const onTouchStart = vi.fn();

    const { container } = await render(<DatePicker onTouchStart={onTouchStart} />);

    const wrapper = container.firstElementChild as HTMLDivElement;

    triggerTouchStart(wrapper);

    expect(onTouchStart).toHaveBeenCalled();
  });
});
