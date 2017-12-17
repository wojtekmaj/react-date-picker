import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
import { setLocale } from './shared/locales';
import { isMaxDate, isMinDate } from './shared/propTypes';
import { between } from './shared/utils';

const allViews = ['century', 'decade', 'year', 'month'];
const allValueTypes = [...allViews.slice(1), 'day'];

const datesAreDifferent = (date1, date2) => (
  (date1 && !date2) ||
  (!date1 && date2) ||
  (date1 && date2 && date1.getTime() !== date2.getTime())
);

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

const selectIfPossible = (element) => {
  if (!element) {
    return;
  }
  element.focus();
  element.select();
};

const removeUnwantedCharacters = str => str
  .split('')
  // We don't want spaces in dates
  .filter(a => a.charCodeAt(0) !== 32)
  // Internet Explorer specific
  .filter(a => a.charCodeAt(0) !== 8206)
  .join('');

export default class DateInput extends Component {
  getValueFrom(value) {
    if (!value) {
      return null;
    }

    const { minDate, maxDate } = this.props;
    const rawValueFrom = value instanceof Array ? value[0] : value;
    const valueFromDate = new Date(rawValueFrom);

    if (Number.isNaN(valueFromDate.getTime())) {
      throw new Error(`Invalid date: ${value}`);
    }

    const valueFrom = getBegin(this.valueType, valueFromDate);

    return between(valueFrom, minDate, maxDate);
  }

  getValueTo(value) {
    if (!value) {
      return null;
    }

    const { minDate, maxDate } = this.props;
    const rawValueTo = value instanceof Array ? value[1] : value;
    const valueToDate = new Date(rawValueTo);

    if (Number.isNaN(valueToDate.getTime())) {
      throw new Error(`Invalid date: ${value}`);
    }

    const valueTo = getEnd(this.valueType, valueToDate);

    return between(valueTo, minDate, maxDate);
  }

  /**
   * Gets current value in a desired format.
   */
  getProcessedValue(value) {
    const { returnValue } = this.props;

    switch (returnValue) {
      case 'start':
        return this.getValueFrom(value);
      case 'end':
        return this.getValueTo(value);
      default:
        throw new Error('Invalid returnValue.');
    }
  }

  state = {
    year: null,
    month: null,
    day: null,
  }

  componentWillMount() {
    setLocale(this.props.locale);
    this.updateValues();
  }

  componentWillReceiveProps(nextProps) {
    const { props } = this;
    const { value: nextValue } = nextProps;
    const { value } = this.props;

    if (nextProps.locale !== props.locale) {
      setLocale(nextProps.locale);
    }

    const nextValueFrom = this.getValueFrom(nextValue);
    const valueFrom = this.getValueFrom(value);

    const nextValueTo = this.getValueTo(nextValue);
    const valueTo = this.getValueTo(value);

    if (
      // Toggling calendar visibility resets values
      (nextProps.isCalendarOpen !== props.isCalendarOpen) ||
      datesAreDifferent(nextValueFrom, valueFrom) ||
      datesAreDifferent(nextValueTo, valueTo)
    ) {
      this.updateValues(nextProps);
    }
  }

  /**
   * Returns value type that can be returned with currently applied settings.
   */
  get valueType() {
    const { maxDetail } = this.props;
    return allValueTypes[allViews.indexOf(maxDetail)];
  }

  // eslint-disable-next-line class-methods-use-this
  get divider() {
    const date = new Date(2017, 11, 11);

    return (
      removeUnwantedCharacters(formatDate(date))
        .match(/[^0-9]/)[0]
    );
  }

  get dividerElement() {
    return (
      <span className="react-date-picker__button__input__divider">
        {this.divider}
      </span>
    );
  }

  // eslint-disable-next-line class-methods-use-this
  get placeholder() {
    const date = new Date(2017, 11, 11);

    return (
      removeUnwantedCharacters(formatDate(date))
        .replace('2017', 'year')
        .replace('12', 'month')
        .replace('11', 'day')
    );
  }

  get commonInputProps() {
    return {
      maxDate: this.props.maxDate,
      minDate: this.props.minDate,
      onChange: this.onChange,
      onKeyDown: this.onKeyDown,
      // This is only for showing validity when editing
      required: this.props.required || this.props.isCalendarOpen,
      itemRef: (ref) => {
        if (!ref) return;

        // Save a reference to each input field
        this[`${ref.name}Input`] = ref;
      },
    };
  }

  updateValues(props = this.props) {
    const value = this.getValueFrom(props.value);

    this.setState({
      year: value ? getYear(value) : null,
      month: value ? getMonth(value) : null,
      day: value ? getDay(value) : null,
    });
  }

  onKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowLeft': {
        event.preventDefault();

        const input = event.target;
        const previousInput = findPreviousInput(input);
        selectIfPossible(previousInput);
        break;
      }
      case 'ArrowRight':
      case this.divider: {
        event.preventDefault();

        const input = event.target;
        const nextInput = findNextInput(input);
        selectIfPossible(nextInput);
        break;
      }
      default:
    }
  }

  /**
   * Called when non-native date input is changed.
   */
  onChange = (event) => {
    this.setState({ [event.target.name]: parseInt(event.target.value, 10) });

    this.onChangeExternal();
  }

  /**
   * Called when native date input is changed.
   */
  onChangeNative = (event) => {
    const { value } = event.target;

    if (this.props.onChange) {
      this.props.onChange(new Date(value));
    }
  }

  /**
   * Called after internal onChange. Checks input validity. If all fields are valid,
   * calls props.onChange.
   */
  onChangeExternal = () => {
    if (this.props.onChange) {
      const formElements = [this.dayInput, this.monthInput, this.yearInput].filter(a => a);

      const values = {};
      formElements.forEach((formElement) => {
        values[formElement.name] = formElement.value;
      });

      if (formElements.every(formElement => formElement.value && formElement.checkValidity())) {
        const proposedValue = new Date(values.year, (values.month || 1) - 1, values.day || 1);
        const processedValue = this.getProcessedValue(proposedValue);
        this.props.onChange(processedValue, false);
      }
    }
  }

  renderDay() {
    return (
      <DayInput
        key="day"
        maxDetail={this.props.maxDetail}
        month={this.state.month}
        year={this.state.year}
        value={this.state.day}
        {...this.commonInputProps}
      />
    );
  }

  renderMonth() {
    return (
      <MonthInput
        key="month"
        maxDetail={this.props.maxDetail}
        minDate={this.props.minDate}
        value={this.state.month}
        {...this.commonInputProps}
      />
    );
  }

  renderYear() {
    return (
      <YearInput
        key="year"
        value={this.state.year}
        valueType={this.valueType}
        {...this.commonInputProps}
      />
    );
  }

  renderCustomInputs() {
    const { divider, dividerElement, placeholder } = this;

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
        .filter(part => part)
        .reduce((result, element, index, array) => {
          result.push(element);

          if (index + 1 < array.length) {
            // eslint-disable-next-line react/no-array-index-key
            result.push(React.cloneElement(dividerElement, { key: `separator_${index}` }));
          }

          return result;
        }, [])
    );
  }

  renderNativeInput() {
    return (
      <NativeInput
        key="date"
        maxDate={this.props.maxDate}
        minDate={this.props.minDate}
        onChange={this.onChangeNative}
        required={this.props.required}
        value={this.props.value}
        valueType={this.valueType}
      />
    );
  }

  render() {
    return (
      <div className="react-date-picker__button__input">
        {this.renderNativeInput()}
        {this.renderCustomInputs()}
      </div>
    );
  }
}

DateInput.defaultProps = {
  maxDetail: 'month',
  returnValue: 'start',
};

DateInput.propTypes = {
  locale: PropTypes.string,
  isCalendarOpen: PropTypes.bool,
  maxDate: isMaxDate,
  maxDetail: PropTypes.oneOf(allViews),
  minDate: isMinDate,
  onChange: PropTypes.func,
  returnValue: PropTypes.oneOf(['start', 'end']),
  required: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
};
