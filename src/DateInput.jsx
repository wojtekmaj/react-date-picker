import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';

import Divider from './Divider';
import DayInput from './DateInput/DayInput';
import MonthInput from './DateInput/MonthInput';
import YearInput from './DateInput/YearInput';
import NativeInput from './DateInput/NativeInput';

import { getFormatter } from './shared/dateFormatter';
import {
  getBegin,
  getDay,
  getEnd,
  getMonth,
  getYear,
} from './shared/dates';
import { isMaxDate, isMinDate } from './shared/propTypes';
import { between } from './shared/utils';

const defaultMinDate = new Date(-8.64e15);
const defaultMaxDate = new Date(8.64e15);
const allViews = ['century', 'decade', 'year', 'month'];
const allValueTypes = [...allViews.slice(1), 'day'];

const datesAreDifferent = (date1, date2) => (
  (date1 && !date2)
  || (!date1 && date2)
  || (date1 && date2 && date1.getTime() !== date2.getTime())
);

/**
 * Returns value type that can be returned with currently applied settings.
 */
const getValueType = maxDetail => allValueTypes[allViews.indexOf(maxDetail)];

const getValueFrom = (value) => {
  if (!value) {
    return null;
  }

  const rawValueFrom = value instanceof Array && value.length === 2 ? value[0] : value;

  if (!rawValueFrom) {
    return null;
  }

  const valueFromDate = new Date(rawValueFrom);

  if (isNaN(valueFromDate.getTime())) {
    throw new Error(`Invalid date: ${value}`);
  }

  return valueFromDate;
};

const getDetailValueFrom = (value, minDate, maxDate, maxDetail) => {
  const valueFrom = getValueFrom(value);

  if (!valueFrom) {
    return null;
  }

  const detailValueFrom = getBegin(getValueType(maxDetail), valueFrom);

  return between(detailValueFrom, minDate, maxDate);
};

const getValueTo = (value) => {
  if (!value) {
    return null;
  }

  const rawValueTo = value instanceof Array && value.length === 2 ? value[1] : value;

  if (!rawValueTo) {
    return null;
  }

  const valueToDate = new Date(rawValueTo);

  if (isNaN(valueToDate.getTime())) {
    throw new Error(`Invalid date: ${value}`);
  }

  return valueToDate;
};

const getDetailValueTo = (value, minDate, maxDate, maxDetail) => {
  const valueTo = getValueTo(value);

  if (!valueTo) {
    return null;
  }

  const detailValueTo = getEnd(getValueType(maxDetail), valueTo);

  return between(detailValueTo, minDate, maxDate);
};

const getDetailValueArray = (value, minDate, maxDate, maxDetail) => {
  if (value instanceof Array) {
    return value;
  }

  return [
    getDetailValueFrom(value, minDate, maxDate, maxDetail),
    getDetailValueTo(value, minDate, maxDate, maxDetail),
  ];
};

const isValidInput = element => element.tagName === 'INPUT' && element.type === 'number';

const findPreviousInput = (element) => {
  let previousElement = element;
  do {
    previousElement = previousElement.previousElementSibling;
  } while (previousElement && !isValidInput(previousElement));
  return previousElement;
};

const findNextInput = (element) => {
  let nextElement = element;
  do {
    nextElement = nextElement.nextElementSibling;
  } while (nextElement && !isValidInput(nextElement));
  return nextElement;
};

const focus = element => element && element.focus();

const renderCustomInputs = (placeholder, elementFunctions) => {
  const pattern = new RegExp(Object.keys(elementFunctions).join('|'), 'gi');
  const matches = placeholder.match(pattern);
  return placeholder.split(pattern)
    .reduce((arr, element, index) => {
      const divider = element && (
        // eslint-disable-next-line react/no-array-index-key
        <Divider key={`separator_${index}`}>
          {element}
        </Divider>
      );
      const res = [...arr, divider];
      const currentMatch = matches && matches[index];
      if (currentMatch) {
        const otherMatches = [...matches];
        otherMatches.splice(index, 1);
        if (otherMatches.includes(currentMatch)) {
          throw new Error(`You can't render ${currentMatch} more than once.`);
        }
        const renderFunction = elementFunctions[currentMatch];
        if (!renderFunction) {
          throw new Error(`Missing render function for ${currentMatch}`);
        }
        res.push(renderFunction());
      }
      return res;
    }, []);
};

export default class DateInput extends PureComponent {
  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      minDate, maxDate, maxDetail,
    } = nextProps;

    const nextState = {};

    /**
     * If isCalendarOpen flag has changed, we have to update it.
     * It's saved in state purely for use in getDerivedStateFromProps.
     */
    if (nextProps.isCalendarOpen !== prevState.isCalendarOpen) {
      nextState.isCalendarOpen = nextProps.isCalendarOpen;
    }

    /**
     * If the next value is different from the current one  (with an exception of situation in
     * which values provided are limited by minDate and maxDate so that the dates are the same),
     * get a new one.
     */
    const nextValue = getDetailValueFrom(nextProps.value, minDate, maxDate, maxDetail);
    const values = [nextValue, prevState.value];
    if (
      // Toggling calendar visibility resets values
      nextState.isCalendarOpen // Flag was toggled
      || datesAreDifferent(
        ...values.map(value => getDetailValueFrom(value, minDate, maxDate, maxDetail)),
      )
      || datesAreDifferent(
        ...values.map(value => getDetailValueTo(value, minDate, maxDate, maxDetail)),
      )
    ) {
      if (nextValue) {
        nextState.year = getYear(nextValue);
        nextState.month = getMonth(nextValue);
        nextState.day = getDay(nextValue);
      } else {
        nextState.year = null;
        nextState.month = null;
        nextState.day = null;
      }
      nextState.value = nextValue;
    }

    return nextState;
  }

  state = {
    year: null,
    month: null,
    day: null,
  };

  get formatDate() {
    const { locale, maxDetail } = this.props;

    const options = { year: 'numeric' };
    const level = allViews.indexOf(maxDetail);
    if (level >= 2) {
      options.month = 'numeric';
    }
    if (level >= 3) {
      options.day = 'numeric';
    }

    return getFormatter(locale, options);
  }

  get formatNumber() {
    const { locale } = this.props;

    const options = { useGrouping: false };

    return getFormatter(locale, options);
  }

  /**
   * Gets current value in a desired format.
   */
  getProcessedValue(value) {
    const {
      minDate, maxDate, maxDetail, returnValue,
    } = this.props;

    switch (returnValue) {
      case 'start':
        return getDetailValueFrom(value, minDate, maxDate, maxDetail);
      case 'end':
        return getDetailValueTo(value, minDate, maxDate, maxDetail);
      case 'range':
        return getDetailValueArray(value, minDate, maxDate, maxDetail);
      default:
        throw new Error('Invalid returnValue.');
    }
  }

  get divider() {
    return this.placeholder.match(/[^0-9a-z]/i)[0];
  }

  get placeholder() {
    const { format } = this.props;

    if (format) {
      return format;
    }

    const year = 2017;
    const monthIndex = 11;
    const day = 11;

    const date = new Date(year, monthIndex, day);

    return (
      this.formatDate(date)
        .replace(this.formatNumber(year), 'y')
        .replace(this.formatNumber(monthIndex + 1), 'M')
        .replace(this.formatNumber(day), 'd')
    );
  }

  get commonInputProps() {
    const {
      className,
      disabled,
      isCalendarOpen,
      maxDate,
      minDate,
      required,
    } = this.props;

    return {
      className,
      disabled,
      maxDate: maxDate || defaultMaxDate,
      minDate: minDate || defaultMinDate,
      onChange: this.onChange,
      onKeyDown: this.onKeyDown,
      // This is only for showing validity when editing
      required: required || isCalendarOpen,
      itemRef: (ref, name) => {
        // Save a reference to each input field
        this[`${name}Input`] = ref;
      },
    };
  }

  get valueType() {
    const { maxDetail } = this.props;

    return getValueType(maxDetail);
  }

  onClick = (event) => {
    if (event.target === event.currentTarget) {
      // Wrapper was directly clicked
      const firstInput = event.target.children[1];
      focus(firstInput);
    }
  }

  onKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowLeft': {
        event.preventDefault();

        const input = event.target;
        const previousInput = findPreviousInput(input);
        focus(previousInput);
        break;
      }
      case 'ArrowRight':
      case this.divider: {
        event.preventDefault();

        const input = event.target;
        const nextInput = findNextInput(input);
        focus(nextInput);
        break;
      }
      default:
    }
  }

  /**
   * Called when non-native date input is changed.
   */
  onChange = (event) => {
    const { name, value } = event.target;

    this.setState(
      { [name]: value ? parseInt(value, 10) : null },
      this.onChangeExternal,
    );
  }

  /**
   * Called when native date input is changed.
   */
  onChangeNative = (event) => {
    const { onChange } = this.props;
    const { value } = event.target;

    if (!onChange) {
      return;
    }

    const processedValue = (() => {
      if (!value) {
        return null;
      }

      const [yearString, monthString, dayString] = value.split('-');
      const year = parseInt(yearString, 10);
      const monthIndex = parseInt(monthString, 10) - 1 || 0;
      const date = parseInt(dayString, 10) || 1;

      return new Date(year, monthIndex, date);
    })();

    onChange(processedValue, false);
  }

  /**
   * Called after internal onChange. Checks input validity. If all fields are valid,
   * calls props.onChange.
   */
  onChangeExternal = () => {
    const { onChange } = this.props;

    if (!onChange) {
      return;
    }

    const formElements = [this.dayInput, this.monthInput, this.yearInput].filter(Boolean);

    const values = {};
    formElements.forEach((formElement) => {
      values[formElement.name] = formElement.value;
    });

    if (formElements.every(formElement => !formElement.value)) {
      onChange(null, false);
    } else if (
      formElements.every(formElement => formElement.value && formElement.checkValidity())
    ) {
      const proposedValue = new Date(values.year, (values.month || 1) - 1, values.day || 1);
      const processedValue = this.getProcessedValue(proposedValue);
      onChange(processedValue, false);
    }
  }

  renderDay = (showLeadingZerosFromFormat) => {
    const { showLeadingZeros } = this.props;
    const { day: value, month, year } = this.state;

    return (
      <DayInput
        key="day"
        {...this.commonInputProps}
        month={month}
        showLeadingZeros={showLeadingZerosFromFormat || showLeadingZeros}
        value={value}
        year={year}
      />
    );
  }

  renderMonth = (showLeadingZerosFromFormat) => {
    const { showLeadingZeros } = this.props;
    const { month: value, year } = this.state;

    return (
      <MonthInput
        key="month"
        {...this.commonInputProps}
        showLeadingZeros={showLeadingZerosFromFormat || showLeadingZeros}
        value={value}
        year={year}
      />
    );
  }

  renderYear = () => {
    const { year } = this.state;

    return (
      <YearInput
        key="year"
        {...this.commonInputProps}
        value={year}
        valueType={this.valueType}
      />
    );
  }

  renderCustomInputs() {
    const { placeholder } = this;
    const elementFunctions = {
      dd: () => this.renderDay(true),
      d: this.renderDay,
      MM: () => this.renderMonth(true),
      M: this.renderMonth,
      y: this.renderYear,
    };

    return renderCustomInputs(placeholder, elementFunctions);
  }

  renderNativeInput() {
    const {
      disabled,
      maxDate,
      minDate,
      name,
      required,
      value,
    } = this.props;

    return (
      <NativeInput
        key="date"
        disabled={disabled}
        maxDate={maxDate || defaultMaxDate}
        minDate={minDate || defaultMinDate}
        name={name}
        onChange={this.onChangeNative}
        required={required}
        value={value}
        valueType={this.valueType}
      />
    );
  }

  render() {
    const { className } = this.props;

    return (
      <div
        className={className}
        onClick={this.onClick}
        role="presentation"
      >
        {this.renderNativeInput()}
        {this.renderCustomInputs()}
      </div>
    );
  }
}

DateInput.defaultProps = {
  maxDetail: 'month',
  name: 'date',
  returnValue: 'start',
};

DateInput.propTypes = {
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  isCalendarOpen: PropTypes.bool,
  locale: PropTypes.string,
  maxDate: isMaxDate,
  maxDetail: PropTypes.oneOf(allViews),
  minDate: isMinDate,
  name: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  returnValue: PropTypes.oneOf(['start', 'end', 'range']),
  showLeadingZeros: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
};

polyfill(DateInput);
