import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';

import DateInput from './DateInput.js';

import { muteConsole, restoreConsole } from '../../../test-utils.js';

vi.useFakeTimers();

const hasFullICU = (() => {
  try {
    const date = new Date(2018, 0, 1, 21);
    const formatter = new Intl.DateTimeFormat('de-DE', { hour: 'numeric' });
    return formatter.format(date).includes('21');
  } catch {
    return false;
  }
})();

const itIfFullICU = it.skipIf(!hasFullICU);

describe('DateInput', () => {
  const defaultProps = {
    className: 'react-date-picker__inputGroup',
    dayAriaLabel: 'day',
    monthAriaLabel: 'month',
    yearAriaLabel: 'year',
  };

  it('renders a native input and custom inputs', async () => {
    const { container } = await render(<DateInput {...defaultProps} />);

    const nativeInput = container.querySelector('input[type="date"]');
    const customInputs = page.getByRole('spinbutton');

    expect(nativeInput).toBeInTheDocument();
    expect(customInputs).toHaveLength(3);
  });

  it('does not render day input when maxDetail is "year" or less', async () => {
    await render(<DateInput {...defaultProps} maxDetail="year" />);

    const customInputs = page.getByRole('spinbutton');
    const dayInput = page.getByRole('spinbutton', { name: 'day' });
    const monthInput = page.getByRole('spinbutton', { name: 'month' });
    const yearInput = page.getByRole('spinbutton', { name: 'year' });

    expect(customInputs).toHaveLength(2);
    expect(dayInput).not.toBeInTheDocument();
    expect(monthInput).toBeInTheDocument();
    expect(yearInput).toBeInTheDocument();
  });

  it('does not render day and month inputs when maxDetail is "decade" or less', async () => {
    await render(<DateInput {...defaultProps} maxDetail="decade" />);

    const customInputs = page.getByRole('spinbutton');
    const dayInput = page.getByRole('spinbutton', { name: 'day' });
    const monthInput = page.getByRole('spinbutton', { name: 'month' });
    const yearInput = page.getByRole('spinbutton', { name: 'year' });

    expect(customInputs).toHaveLength(1);
    expect(dayInput).not.toBeInTheDocument();
    expect(monthInput).not.toBeInTheDocument();
    expect(yearInput).toBeInTheDocument();
  });

  it('shows a given date in all inputs correctly given Date (12-hour format)', async () => {
    const date = new Date(2017, 8, 30);

    const { container } = await render(<DateInput {...defaultProps} value={date} />);

    const nativeInput = container.querySelector('input[type="date"]');
    const customInputs = page.getByRole('spinbutton');

    expect(nativeInput).toHaveValue('2017-09-30');
    expect(customInputs.nth(0)).toHaveValue(9);
    expect(customInputs.nth(1)).toHaveValue(30);
    expect(customInputs.nth(2)).toHaveValue(2017);
  });

  it('shows a given date in all inputs correctly given ISO string (12-hour format)', async () => {
    const date = '2017-09-30T00:00:00.000';

    const { container } = await render(<DateInput {...defaultProps} value={date} />);

    const nativeInput = container.querySelector('input[type="date"]');
    const customInputs = page.getByRole('spinbutton');

    expect(nativeInput).toHaveValue('2017-09-30');
    expect(customInputs.nth(0)).toHaveValue(9);
    expect(customInputs.nth(1)).toHaveValue(30);
    expect(customInputs.nth(2)).toHaveValue(2017);
  });

  itIfFullICU(
    'shows a given date in all inputs correctly given Date (24-hour format)',
    async () => {
      const date = new Date(2017, 8, 30);

      const { container } = await render(
        <DateInput {...defaultProps} locale="de-DE" value={date} />,
      );

      const nativeInput = container.querySelector('input[type="date"]');
      const customInputs = page.getByRole('spinbutton');

      expect(nativeInput).toHaveValue('2017-09-30');
      expect(customInputs.nth(0)).toHaveValue(30);
      expect(customInputs.nth(1)).toHaveValue(9);
      expect(customInputs.nth(2)).toHaveValue(2017);
    },
  );

  itIfFullICU(
    'shows a given date in all inputs correctly given ISO string (24-hour format)',
    async () => {
      const date = '2017-09-30T00:00:00.000';

      const { container } = await render(
        <DateInput {...defaultProps} locale="de-DE" value={date} />,
      );

      const nativeInput = container.querySelector('input[type="date"]');
      const customInputs = page.getByRole('spinbutton');

      expect(nativeInput).toHaveValue('2017-09-30');
      expect(customInputs.nth(0)).toHaveValue(30);
      expect(customInputs.nth(1)).toHaveValue(9);
      expect(customInputs.nth(2)).toHaveValue(2017);
    },
  );

  it('shows empty value in all inputs correctly given null', async () => {
    const { container } = await render(<DateInput {...defaultProps} value={null} />);

    const nativeInput = container.querySelector('input[type="date"]');
    const customInputs = page.getByRole('spinbutton');

    expect(nativeInput).toHaveAttribute('value', '');
    expect(customInputs.nth(0)).toHaveAttribute('value', '');
    expect(customInputs.nth(1)).toHaveAttribute('value', '');
    expect(customInputs.nth(2)).toHaveAttribute('value', '');
  });

  it('clears the value correctly', async () => {
    const date = new Date(2017, 8, 30);

    const { container, rerender } = await render(<DateInput {...defaultProps} value={date} />);

    rerender(<DateInput {...defaultProps} value={null} />);

    const nativeInput = container.querySelector('input[type="date"]');
    const customInputs = page.getByRole('spinbutton');

    expect(nativeInput).toHaveAttribute('value', '');
    expect(customInputs.nth(0)).toHaveAttribute('value', '');
    expect(customInputs.nth(1)).toHaveAttribute('value', '');
    expect(customInputs.nth(2)).toHaveAttribute('value', '');
  });

  it('renders custom inputs in a proper order (12-hour format)', async () => {
    await render(<DateInput {...defaultProps} />);

    const customInputs = page.getByRole('spinbutton');

    expect(customInputs.nth(0)).toHaveAttribute('name', 'month');
    expect(customInputs.nth(1)).toHaveAttribute('name', 'day');
    expect(customInputs.nth(2)).toHaveAttribute('name', 'year');
  });

  itIfFullICU('renders custom inputs in a proper order (24-hour format)', async () => {
    await render(<DateInput {...defaultProps} locale="de-DE" />);

    const customInputs = page.getByRole('spinbutton');

    expect(customInputs.nth(0)).toHaveAttribute('name', 'day');
    expect(customInputs.nth(1)).toHaveAttribute('name', 'month');
    expect(customInputs.nth(2)).toHaveAttribute('name', 'year');
  });

  describe('renders custom inputs in a proper order given format', () => {
    it('renders "y" properly', async () => {
      await render(<DateInput {...defaultProps} format="y" />);

      const componentInput = page.getByRole('spinbutton', { name: 'year' });
      const customInputs = page.getByRole('spinbutton');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "yyyy" properly', async () => {
      await render(<DateInput {...defaultProps} format="yyyy" />);

      const componentInput = page.getByRole('spinbutton', { name: 'year' });
      const customInputs = page.getByRole('spinbutton');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "M" properly', async () => {
      await render(<DateInput {...defaultProps} format="M" />);

      const componentInput = page.getByRole('spinbutton', { name: 'month' });
      const customInputs = page.getByRole('spinbutton');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "MM" properly', async () => {
      await render(<DateInput {...defaultProps} format="MM" />);

      const componentInput = page.getByRole('spinbutton', { name: 'month' });
      const customInputs = page.getByRole('spinbutton');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "MMM" properly', async () => {
      await render(<DateInput {...defaultProps} format="MMM" />);

      const componentSelect = page.getByRole('combobox', { name: 'month' });
      const customInputs = page.getByRole('combobox');

      expect(componentSelect).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "MMMM" properly', async () => {
      await render(<DateInput {...defaultProps} format="MMMM" />);

      const componentSelect = page.getByRole('combobox', { name: 'month' });
      const customInputs = page.getByRole('combobox');

      expect(componentSelect).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "d" properly', async () => {
      await render(<DateInput {...defaultProps} format="d" />);

      const componentInput = page.getByRole('spinbutton', { name: 'day' });
      const customInputs = page.getByRole('spinbutton');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "dd" properly', async () => {
      await render(<DateInput {...defaultProps} format="dd" />);

      const componentInput = page.getByRole('spinbutton', { name: 'day' });
      const customInputs = page.getByRole('spinbutton');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('throws error for "ddd"', async () => {
      muteConsole();

      const renderComponent = () => render(<DateInput {...defaultProps} format="ddd" />);

      await expect(renderComponent).rejects.toThrowError('Unsupported token: ddd');

      restoreConsole();
    });

    it('renders "yyyy-MM-dd" properly', async () => {
      await render(<DateInput {...defaultProps} format="yyyy-MM-d" />);

      const monthInput = page.getByRole('spinbutton', { name: 'month' });
      const dayInput = page.getByRole('spinbutton', { name: 'day' });
      const customInputs = page.getByRole('spinbutton');

      expect(monthInput).toBeInTheDocument();
      expect(dayInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(3);
      expect(customInputs.nth(0)).toHaveAttribute('name', 'year');
      expect(customInputs.nth(1)).toHaveAttribute('name', 'month');
      expect(customInputs.nth(2)).toHaveAttribute('name', 'day');
    });
  });

  it('renders proper input separators', async () => {
    await render(<DateInput {...defaultProps} />);

    const separators = page.getByTestId('divider');

    expect(separators).toHaveLength(2);
    expect(separators.nth(0)).toHaveTextContent('/');
    expect(separators.nth(1)).toHaveTextContent('/');
  });

  it('renders proper amount of separators', async () => {
    await render(<DateInput {...defaultProps} maxDetail="year" />);

    const separators = page.getByTestId('divider');
    const customInputs = page.getByRole('spinbutton');

    expect(separators).toHaveLength(customInputs.length - 1);
  });

  it('jumps to the next field when right arrow is pressed', async () => {
    await render(<DateInput {...defaultProps} />);

    const monthInput = page.getByRole('spinbutton', { name: 'month' });
    const dayInput = page.getByRole('spinbutton', { name: 'day' });

    await userEvent.type(monthInput, '{arrowright}');

    expect(dayInput).toHaveFocus();
  });

  it('jumps to the next field when separator key is pressed', async () => {
    await render(<DateInput {...defaultProps} />);

    const monthInput = page.getByRole('spinbutton', { name: 'month' });
    const dayInput = page.getByRole('spinbutton', { name: 'day' });

    const separator = page.getByTestId('divider').first();
    const separatorKey = separator.element().textContent;

    await userEvent.type(monthInput, separatorKey);

    expect(dayInput).toHaveFocus();
  });

  it('does not jump to the next field when right arrow is pressed when the last input is focused', async () => {
    await render(<DateInput {...defaultProps} />);

    const yearInput = page.getByRole('spinbutton', { name: 'year' });

    await userEvent.type(yearInput, '{arrowright}');

    expect(yearInput).toHaveFocus();
  });

  it('jumps to the previous field when left arrow is pressed', async () => {
    await render(<DateInput {...defaultProps} />);

    const monthInput = page.getByRole('spinbutton', { name: 'month' });
    const dayInput = page.getByRole('spinbutton', { name: 'day' });

    await userEvent.type(dayInput, '{arrowleft}');

    expect(monthInput).toHaveFocus();
  });

  it('does not jump to the previous field when left arrow is pressed when the first input is focused', async () => {
    await render(<DateInput {...defaultProps} />);

    const monthInput = page.getByRole('spinbutton', { name: 'month' });

    await userEvent.type(monthInput, '{arrowleft}');

    expect(monthInput).toHaveFocus();
  });

  it("jumps to the next field when a value which can't be extended to another valid value is entered", async () => {
    await render(<DateInput {...defaultProps} />);

    const monthInput = page.getByRole('spinbutton', { name: 'month' });
    const dayInput = page.getByRole('spinbutton', { name: 'day' });

    await userEvent.type(monthInput, '4');

    expect(dayInput).toHaveFocus();
  });

  it('jumps to the next field when a value as long as the length of maximum value is entered', async () => {
    await render(<DateInput {...defaultProps} />);

    const monthInput = page.getByRole('spinbutton', { name: 'month' });
    const dayInput = page.getByRole('spinbutton', { name: 'day' });

    await userEvent.type(monthInput, '03');

    expect(dayInput).toHaveFocus();
  });

  function triggerKeyDown(element: HTMLElement, { key }: { key: string }) {
    element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
  }

  function triggerKeyPress(element: HTMLElement, { key }: { key: string }) {
    element.dispatchEvent(new KeyboardEvent('keypress', { key, bubbles: true, cancelable: true }));
  }

  function triggerKeyUp(element: HTMLElement, { key }: { key: string }) {
    element.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true, cancelable: true }));
  }

  it("jumps to the next field when a value which can't be extended to another valid value is entered by typing with multiple keys", async () => {
    function getActiveElement() {
      return document.activeElement as HTMLInputElement;
    }

    function keyDown(key: string, initial = false) {
      const element = getActiveElement();
      triggerKeyDown(element, { key });
      triggerKeyPress(element, { key });
      element.value = (initial ? '' : element.value) + key;
    }

    function keyUp(key: string) {
      triggerKeyUp(getActiveElement(), { key });
    }

    const date = new Date(2023, 3, 1);

    await render(<DateInput {...defaultProps} locale="de-DE" value={date} />);

    const dayInput = page.getByRole('spinbutton', { name: 'day' });
    const monthInput = page.getByRole('spinbutton', { name: 'month' });

    dayInput.element().focus();
    expect(dayInput).toHaveFocus();

    keyDown('1', true);
    keyDown('2');

    keyUp('1');
    expect(dayInput).toHaveFocus();

    keyUp('2');
    expect(monthInput).toHaveFocus();
  });

  it('does not jump the next field when a value which can be extended to another valid value is entered', async () => {
    await render(<DateInput {...defaultProps} />);

    const monthInput = page.getByRole('spinbutton', { name: 'month' });

    await userEvent.type(monthInput, '1');

    expect(monthInput).toHaveFocus();
  });

  it('triggers onChange correctly when changed custom input', async () => {
    const onChange = vi.fn();
    const date = new Date(2017, 8, 30);

    await render(<DateInput {...defaultProps} onChange={onChange} value={date} />);

    const dayInput = page.getByRole('spinbutton', { name: 'day' });

    await userEvent.fill(dayInput, '20');

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(new Date(2017, 8, 20), false);
  });

  it('triggers onChange correctly when changed custom input with year < 100', async () => {
    const onChange = vi.fn();
    const date = new Date();
    date.setFullYear(19, 8, 30);
    date.setHours(0, 0, 0, 0);

    await render(<DateInput {...defaultProps} onChange={onChange} value={date} />);

    const dayInput = page.getByRole('spinbutton', { name: 'day' });

    await userEvent.fill(dayInput, '20');

    const nextDate = new Date();
    nextDate.setFullYear(19, 8, 20);
    nextDate.setHours(0, 0, 0, 0);

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(nextDate, false);
  });

  it('triggers onChange correctly when changed custom input with no year', async () => {
    const onChange = vi.fn();
    const date = new Date(2017, 8, 30);

    await render(<DateInput {...defaultProps} format="dd.MM" onChange={onChange} value={date} />);

    const dayInput = page.getByRole('spinbutton', { name: 'day' });

    await userEvent.fill(dayInput, '20');

    const currentYear = new Date().getFullYear();

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(new Date(currentYear, 8, 20), false);
  });

  it('triggers onChange correctly when cleared custom inputs', async () => {
    const onChange = vi.fn();
    const date = new Date(2017, 8, 30);

    await render(<DateInput {...defaultProps} onChange={onChange} value={date} />);

    const customInputs = page.getByRole('spinbutton').elements();

    for (const customInput of customInputs) {
      await userEvent.clear(customInput);
    }

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(null, false);
  });

  function setNativeValue(element: HTMLInputElement, value: string) {
    const prototype = Object.getPrototypeOf(element);
    const propertyDescriptor = Object.getOwnPropertyDescriptor(prototype, 'value');
    const prototypeValueSetter = propertyDescriptor?.set;

    if (prototypeValueSetter) {
      prototypeValueSetter.call(element, value);
    }
  }

  function triggerChange(element: HTMLInputElement, value: string) {
    setNativeValue(element, value);
    element.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
  }

  it('triggers onChange correctly when changed native input', async () => {
    const onChange = vi.fn();
    const date = new Date(2017, 8, 30);

    const { container } = await render(
      <DateInput {...defaultProps} onChange={onChange} value={date} />,
    );

    const nativeInput = container.querySelector('input[type="date"]') as HTMLInputElement;

    triggerChange(nativeInput, '2017-09-20');

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(new Date(2017, 8, 20), false);
  });

  it('triggers onChange correctly when changed native input with year < 100', async () => {
    const onChange = vi.fn();
    const date = new Date(2017, 8, 30);

    const { container } = await render(
      <DateInput {...defaultProps} onChange={onChange} value={date} />,
    );

    const nativeInput = container.querySelector('input[type="date"]') as HTMLInputElement;

    triggerChange(nativeInput, '0019-09-20');

    const nextDate = new Date();
    nextDate.setFullYear(19, 8, 20);
    nextDate.setHours(0, 0, 0, 0);

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(nextDate, false);
  });

  it('triggers onChange correctly when cleared native input', async () => {
    const onChange = vi.fn();
    const date = new Date(2017, 8, 30);

    const { container } = await render(
      <DateInput {...defaultProps} onChange={onChange} value={date} />,
    );

    const nativeInput = container.querySelector('input[type="date"]') as HTMLInputElement;

    triggerChange(nativeInput, '');

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(null, false);
  });
});
