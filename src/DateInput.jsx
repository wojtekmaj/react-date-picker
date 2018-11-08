import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';

import Divider from './Divider';
import DayInput from './DateInput/DayInput';
import MonthInput from './DateInput/MonthInput';
import YearInput from './DateInput/YearInput';
import NativeInput from './DateInput/NativeInput';

import { formatDate } from './shared/dateFormatter';
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

const findPreviousInput = (element) => {
  const previousElement = element.previousElementSibling; // Divider between inputs
  if (!previousElement) {
    return null;
  }
  return previousElement.previousElementSibling; // Actual input
};

const findNextInput = (element) => {
  const nextElement = element.nextElementSibling; // Divider between inputs
  if (!nextElement) {
    return null;
  }
  return nextElement.nextElementSibling; // Actual input
};

const focus = element => element && element.focus();

const removeUnwantedCharacters = str => str
  .replace(/[年月日]/g, '/')
  .split('')
  .filter(a => (
    // We don't want spaces in dates
    a.charCodeAt(0) !== 32
    // Internet Explorer specific
    && a.charCodeAt(0) !== 8206
    // Remove non-ASCII characters
    && /^[\x20-\x7F]*$/.test(a)
  ))
  .join('');

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

  // eslint-disable-next-line class-methods-use-this
  get divider() {
    const { locale } = this.props;
    const date = new Date(2017, 11, 11);

    return (
      removeUnwantedCharacters(formatDate(date, locale))
        .match(/[^0-9]/)[0]
    );
  }

  // eslint-disable-next-line class-methods-use-this
  get placeholder() {
    const { locale } = this.props;
    const date = new Date(2017, 11, 11);

    return (
      removeUnwantedCharacters(formatDate(date, locale))
        .replace('2017', 'year')
        .replace('12', 'month')
        .replace('11', 'day')
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

  isValidDate = (date) => {
    return (date >= (this.props.minDate || defaultMinDate)) && (date <= (this.props.maxDate || defaultMaxDate));
  }

  onKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowUp': {
        event.preventDefault();
        const key = event.target.name;
        const { value } = this.state;
        const nextValue = new Date(value);
        if (key === 'day') {
          nextValue.setDate(nextValue.getDate() + 1);
        }
        else if (key === 'month') {
          nextValue.setMonth(nextValue.getMonth() + 1);
        }
        else if (key === 'year') {
          nextValue.setFullYear(nextValue.getFullYear() + 1);
        }
        this.onChangeKeyEvent(nextValue);
        break;
      }
      case 'ArrowDown': {
        event.preventDefault();
        const key = event.target.name;
        const { value } = this.state;
        const nextValue = new Date(value);
        if (key === 'day') {
          nextValue.setDate(nextValue.getDate() - 1);
        }
        else if (key === 'month') {
          nextValue.setMonth(nextValue.getMonth() - 1);
        }
        else if (key === 'year') {
          nextValue.setFullYear(nextValue.getFullYear() - 1);
        }
        this.onChangeKeyEvent(nextValue);
        break;
      }
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

  onChangeKeyEvent = (proposedValue) => {
    const { onChange } = this.props;

    if (!onChange) {
      return;
    }
    const processedValue = this.getProcessedValue(proposedValue);
    return onChange(processedValue, false);
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
    const activeElement = formElements.find(el => document.activeElement === el);

    const values = {};
    formElements.forEach((formElement) => {
      values[formElement.name] = formElement.value;
    });
    if (formElements.every(formElement => !formElement.value)) {
      onChange(null, false);
    } else if (Date.parse(`${values.year}-${values.month}-${values.day}`)) {
      const proposedValue = new Date(values.year, (values.month || 1) - 1, values.day || 1);
      if (this.isValidDate(proposedValue)) {
        const processedValue = this.getProcessedValue(proposedValue);
        formElements.forEach(el => el.setCustomValidity(''));
        onChange(processedValue, false);
      }
      else {
        formElements.forEach(el => el.setCustomValidity('Invalid range'));
      }
    }
    else if (activeElement) {
      activeElement.setCustomValidity('Invalid date');
    }
  }

  renderDay() {
    const { maxDetail, showLeadingZeros } = this.props;

    // Do not display if maxDetail is "year" or less
    if (allViews.indexOf(maxDetail) < 3) {
      return null;
    }

    const { day: value } = this.state;

    return (
      <DayInput
        key="day"
        {...this.commonInputProps}
        maxDetail={maxDetail}
        showLeadingZeros={showLeadingZeros}
        value={value}
      />
    );
  }

  renderMonth() {
    const { maxDetail, showLeadingZeros } = this.props;

    // Do not display if maxDetail is "decade" or less
    if (allViews.indexOf(maxDetail) < 2) {
      return null;
    }

    const { month: value } = this.state;

    return (
      <MonthInput
        key="month"
        {...this.commonInputProps}
        maxDetail={maxDetail}
        showLeadingZeros={showLeadingZeros}
        value={value}
      />
    );
  }

  renderYear() {
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
    const { divider, placeholder } = this;

    return (
      placeholder
        .split(divider)
        .map((part) => {
          switch (part) {
            case 'day': return this.renderDay();
            case 'month': return this.renderMonth();
            case 'year': return this.renderYear();
            default: return null;
          }
        })
        .filter(Boolean)
        .reduce((result, element, index) => {
          if (index) {
            result.push(
              // eslint-disable-next-line react/no-array-index-key
              <Divider key={`separator_${index}`}>
                {divider}
              </Divider>,
            );
          }

          result.push(element);

          return result;
        }, [])
    );
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
      <div className={className}>
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
  returnValue: PropTypes.oneOf(['start', 'end', 'range']),
  required: PropTypes.bool,
  showLeadingZeros: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
};

polyfill(DateInput);
