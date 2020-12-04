import React from 'react';
import { mount } from 'enzyme';

import DatePicker from './DatePicker';

describe('DatePicker', () => {
  it('passes default name to DateInput', () => {
    const component = mount(
      <DatePicker />,
    );

    const dateInput = component.find('DateInput');

    expect(dateInput.prop('name')).toBe('date');
  });

  it('passes custom name to DateInput', () => {
    const name = 'testName';

    const component = mount(
      <DatePicker name={name} />,
    );

    const dateInput = component.find('DateInput');

    expect(dateInput.prop('name')).toBe(name);
  });

  it('passes autoFocus flag to DateInput', () => {
    const component = mount(
      <DatePicker autoFocus />,
    );

    const dateInput = component.find('DateInput');

    expect(dateInput.prop('autoFocus')).toBeTruthy();
  });

  it('passes disabled flag to DateInput', () => {
    const component = mount(
      <DatePicker disabled />,
    );

    const dateInput = component.find('DateInput');

    expect(dateInput.prop('disabled')).toBeTruthy();
  });

  it('passes format to DateInput', () => {
    const format = 'y-MM-dd';

    const component = mount(
      <DatePicker format={format} />,
    );

    const dateInput = component.find('DateInput');

    expect(dateInput.prop('format')).toBe(format);
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

    const component = mount(
      <DatePicker {...ariaLabelProps} />,
    );

    const calendarButton = component.find('button.react-date-picker__calendar-button');
    const clearButton = component.find('button.react-date-picker__clear-button');
    const dateInput = component.find('DateInput');

    expect(calendarButton.prop('aria-label')).toBe(ariaLabelProps.calendarAriaLabel);
    expect(clearButton.prop('aria-label')).toBe(ariaLabelProps.clearAriaLabel);
    expect(dateInput.prop('dayAriaLabel')).toBe(ariaLabelProps.dayAriaLabel);
    expect(dateInput.prop('monthAriaLabel')).toBe(ariaLabelProps.monthAriaLabel);
    expect(dateInput.prop('nativeInputAriaLabel')).toBe(ariaLabelProps.nativeInputAriaLabel);
    expect(dateInput.prop('yearAriaLabel')).toBe(ariaLabelProps.yearAriaLabel);
  });

  it('passes placeholder props to DateInput', () => {
    const placeholderProps = {
      dayPlaceholder: 'dd',
      monthPlaceholder: 'mm',
      yearPlaceholder: 'yyyy',
    };

    const component = mount(
      <DatePicker {...placeholderProps} />,
    );

    const dateInput = component.find('DateInput');

    expect(dateInput.prop('dayPlaceholder')).toBe(placeholderProps.dayPlaceholder);
    expect(dateInput.prop('monthPlaceholder')).toBe(placeholderProps.monthPlaceholder);
    expect(dateInput.prop('yearPlaceholder')).toBe(placeholderProps.yearPlaceholder);
  });

  describe('passes value to DateInput', () => {
    it('passes single value to DateInput', () => {
      const value = new Date(2019, 0, 1);

      const component = mount(
        <DatePicker value={value} />,
      );

      const dateInput = component.find('DateInput');

      expect(dateInput.prop('value')).toBe(value);
    });

    it('passes the first item of an array of values to DateInput', () => {
      const value1 = new Date(2019, 0, 1);
      const value2 = new Date(2019, 6, 1);

      const component = mount(
        <DatePicker value={[value1, value2]} />,
      );

      const dateInput = component.find('DateInput');

      expect(dateInput.prop('value')).toBe(value1);
    });
  });

  it('applies className to its wrapper when given a string', () => {
    const className = 'testClassName';

    const component = mount(
      <DatePicker className={className} />,
    );

    const wrapperClassName = component.prop('className');

    expect(wrapperClassName.includes(className)).toBe(true);
  });

  it('applies calendarClassName to the calendar when given a string', () => {
    const calendarClassName = 'testClassName';

    const component = mount(
      <DatePicker
        calendarClassName={calendarClassName}
        isOpen
      />,
    );

    const calendar = component.find('Calendar');
    const calendarWrapperClassName = calendar.prop('className');

    expect(calendarWrapperClassName.includes(calendarClassName)).toBe(true);
  });

  it('renders DateInput component', () => {
    const component = mount(
      <DatePicker />,
    );

    const dateInput = component.find('DateInput');

    expect(dateInput).toHaveLength(1);
  });

  it('renders clear button', () => {
    const component = mount(
      <DatePicker />,
    );

    const clearButton = component.find('button.react-date-picker__clear-button');

    expect(clearButton).toHaveLength(1);
  });

  it('renders calendar button', () => {
    const component = mount(
      <DatePicker />,
    );

    const calendarButton = component.find('button.react-date-picker__calendar-button');

    expect(calendarButton).toHaveLength(1);
  });

  it('renders DateInput and Calendar components when given isOpen flag', () => {
    const component = mount(
      <DatePicker isOpen />,
    );

    const dateInput = component.find('DateInput');
    const calendar = component.find('Calendar');

    expect(dateInput).toHaveLength(1);
    expect(calendar).toHaveLength(1);
  });

  it('does not render Calendar component when given disableCalendar & isOpen flags', () => {
    const component = mount(
      <DatePicker disableCalendar isOpen />,
    );

    const dateInput = component.find('DateInput');
    const calendar = component.find('Calendar');

    expect(dateInput).toHaveLength(1);
    expect(calendar).toHaveLength(0);
  });

  it('opens Calendar component when given isOpen flag by changing props', () => {
    const component = mount(
      <DatePicker />,
    );

    const calendar = component.find('Calendar');

    expect(calendar).toHaveLength(0);

    component.setProps({ isOpen: true });
    component.update();

    const calendar2 = component.find('Calendar');

    expect(calendar2).toHaveLength(1);
  });

  it('opens Calendar component when clicking on a button', () => {
    const component = mount(
      <DatePicker />,
    );

    const calendar = component.find('Calendar');
    const button = component.find('button.react-date-picker__calendar-button');

    expect(calendar).toHaveLength(0);

    button.simulate('click');
    component.update();

    const calendar2 = component.find('Calendar');

    expect(calendar2).toHaveLength(1);
  });

  it('opens Calendar component when focusing on an input inside', () => {
    const component = mount(
      <DatePicker />,
    );

    const calendar = component.find('Calendar');
    const input = component.find('input[name="day"]');

    expect(calendar).toHaveLength(0);

    input.simulate('focus');
    component.update();

    const calendar2 = component.find('Calendar');

    expect(calendar2).toHaveLength(1);
  });

  it('closes Calendar component when clicked outside', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const component = mount(
      <DatePicker isOpen />,
      { attachTo: root },
    );

    const event = document.createEvent('MouseEvent');
    event.initEvent('mousedown', true, true);
    document.body.dispatchEvent(event);
    component.update();

    expect(component.state('isOpen')).toBe(false);
  });

  it('closes Calendar component when focused outside', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const component = mount(
      <DatePicker isOpen />,
      { attachTo: root },
    );

    const event = document.createEvent('FocusEvent');
    event.initEvent('focusin', true, true);
    document.body.dispatchEvent(event);
    component.update();

    expect(component.state('isOpen')).toBe(false);
  });

  it('closes Calendar component when tapped outside', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const component = mount(
      <DatePicker isOpen />,
      { attachTo: root },
    );

    const event = document.createEvent('TouchEvent');
    event.initEvent('touchstart', true, true);
    document.body.dispatchEvent(event);
    component.update();

    expect(component.state('isOpen')).toBe(false);
  });

  it('does not close Calendar component when focused inside', () => {
    const component = mount(
      <DatePicker isOpen />,
    );

    const customInputs = component.find('input[data-input]');
    const dayInput = customInputs.at(0);
    const monthInput = customInputs.at(1);

    dayInput.simulate('blur');
    monthInput.simulate('focus');
    component.update();

    expect(component.state('isOpen')).toBe(true);
  });

  it('closes Calendar when calling internal onChange by default', () => {
    const component = mount(
      <DatePicker isOpen />,
    );

    const { onChange } = component.instance();

    onChange(new Date());

    expect(component.state('isOpen')).toBe(false);
  });

  it('does not close Calendar when calling internal onChange with prop closeCalendar = false', () => {
    const component = mount(
      <DatePicker
        closeCalendar={false}
        isOpen
      />,
    );

    const { onChange } = component.instance();

    onChange(new Date());

    expect(component.state('isOpen')).toBe(true);
  });

  it('does not close Calendar when calling internal onChange with closeCalendar = false', () => {
    const component = mount(
      <DatePicker isOpen />,
    );

    const { onChange } = component.instance();

    onChange(new Date(), false);

    expect(component.state('isOpen')).toBe(true);
  });

  it('calls onChange callback when calling internal onChange', () => {
    const nextValue = new Date(2019, 0, 1);
    const onChange = jest.fn();

    const component = mount(
      <DatePicker onChange={onChange} />,
    );

    const { onChange: onChangeInternal } = component.instance();

    onChangeInternal(nextValue);

    expect(onChange).toHaveBeenCalledWith(nextValue);
  });

  it('clears the value when clicking on a button', () => {
    const onChange = jest.fn();

    const component = mount(
      <DatePicker onChange={onChange} />,
    );

    const calendar = component.find('Calendar');
    const button = component.find('button.react-date-picker__clear-button');

    expect(calendar).toHaveLength(0);

    button.simulate('click');
    component.update();

    expect(onChange).toHaveBeenCalledWith(null);
  });
});
