import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { formatDate } from './shared/dateFormatter';
import {
  getBegin,
  getDay,
  getDaysInMonth,
  getEnd,
  getISOLocalDate,
  getISOLocalMonth,
  getMonth,
  getYear,
} from './shared/dates';
import { setLocale } from './shared/locales';
import { isMaxDate, isMinDate } from './shared/propTypes';

const allViews = ['century', 'decade', 'year', 'month'];
const allValueTypes = [...allViews.slice(1), 'day'];

const updateInputWidth = (element) => {
  const span = document.createElement('span');
  span.innerHTML = element.value;

  const container = element.parentElement;

  container.appendChild(span);

  const width = span.clientWidth + 4;
  element.style.width = `${width}px`;

  container.removeChild(span);
};

const min = (...args) => Math.min(...args.filter(a => typeof a === 'number'));
const max = (...args) => Math.max(...args.filter(a => typeof a === 'number'));

export default class DateInput extends Component {
  getValueFrom(value) {
    if (!value) {
      return value;
    }
    const { minDate } = this.props;
    const rawValueFrom = value instanceof Array ? value[0] : value;
    const valueFrom = getBegin(this.valueType, rawValueFrom);
    return (
      minDate && minDate > valueFrom ?
        minDate :
        valueFrom
    );
  }

  getValueTo(value) {
    if (!value) {
      return value;
    }
    const { maxDate } = this.props;
    const rawValueFrom = value instanceof Array ? value[1] : value;
    const valueTo = getEnd(this.valueType, rawValueFrom);
    return (
      maxDate && maxDate < valueTo ?
        maxDate :
        valueTo
    );
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
    year: '',
    month: '',
    day: '',
  }

  componentDidMount() {
    setLocale(this.props.locale);
    this.updateValues();
  }

  componentWillReceiveProps(nextProps) {
    const { props } = this;

    if (nextProps.locale !== props.locale) {
      setLocale(nextProps.locale);
    }

    if (
      (!!nextProps.value !== !!props.value) ||
      (nextProps.value && props.value && (nextProps.value.getTime() !== props.value.getTime()))
    ) {
      this.updateValues(nextProps);
    }
  }

  get maxDay() {
    const { maxDate } = this.props;
    const { month, year } = this.state;
    return min(
      this.currentMonthMaxDays,
      maxDate && year === getYear(maxDate) && month === getMonth(maxDate) && getDay(maxDate),
    );
  }

  get minDay() {
    const { minDate } = this.props;
    const { month, year } = this.state;
    return max(
      1, minDate && year === getYear(minDate) && month === getMonth(minDate) && getDay(minDate),
    );
  }

  get maxMonth() {
    const { maxDate } = this.props;
    const { year } = this.state;
    return min(12, maxDate && year === getYear(maxDate) && getMonth(maxDate));
  }

  get minMonth() {
    const { minDate } = this.props;
    const { year } = this.state;
    return max(1, minDate && year === getYear(minDate) && getMonth(minDate));
  }

  get maxYear() {
    const { maxDate } = this.props;
    return maxDate ? getYear(maxDate) : null;
  }

  get minYear() {
    const { minDate } = this.props;
    return max(1000, minDate && getYear(minDate));
  }

  /**
   * Returns value type that can be returned with currently applied settings.
   */
  get valueType() {
    const { maxDetail } = this.props;
    return allValueTypes[allViews.indexOf(maxDetail)];
  }

  get nativeInputType() {
    switch (this.valueType) {
      case 'decade':
      case 'year':
        return 'number';
      case 'month':
        return 'month';
      case 'day':
        return 'date';
      default:
        throw new Error('Invalid valueType.');
    }
  }

  get nativeValueParser() {
    switch (this.valueType) {
      case 'century':
      case 'decade':
      case 'year':
        return getYear;
      case 'month':
        return getISOLocalMonth;
      case 'day':
        return getISOLocalDate;
      default:
        throw new Error('Invalid valueType.');
    }
  }

  get yearStep() {
    if (this.valueType === 'century') {
      return 10;
    }
    return 1;
  }

  // eslint-disable-next-line class-methods-use-this
  get divider() {
    const date = new Date(2017, 11, 11);

    return (
      formatDate(date)
        .split('')
        // Internet Explorer specific
        .filter(a => a.charCodeAt(0) !== 8206)
        .join('')
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
      formatDate(date)
        .replace('2017', 'year')
        .replace('12', 'month')
        .replace('11', 'day')
    );
  }

  get currentMonthMaxDays() {
    const { value } = this.props;

    if (!value) {
      return null;
    }

    return getDaysInMonth(value);
  }

  get commonInputProps() {
    return {
      type: 'number',
      onChange: this.onChange,
      onKeyDown: this.onKeyDown,
      required: true,
      ref: (ref) => {
        if (!ref) {
          return;
        }

        // Save a reference to each input field
        this[`${ref.name}Input`] = ref;

        updateInputWidth(ref);
      },
    };
  }

  updateValues(props = this.props) {
    const { value } = props;

    this.setState({
      year: value ? getYear(value) : '',
      month: value ? getMonth(value) : '',
      day: value ? getDay(value) : '',
    });
  }

  onKeyDown = (event) => {
    if (event.key === this.divider) {
      event.preventDefault();

      const input = event.target;
      const nextElement = input.nextElementSibling; // Divider between inputs

      if (!nextElement) {
        return;
      }

      const nextInput = nextElement.nextElementSibling;

      if (!nextInput) {
        return;
      }

      nextInput.focus();
      nextInput.select();
    }
  }

  /**
   * Called when non-native date input is changed.
   */
  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });

    updateInputWidth(event.target);

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
    const formElements = [this.dayInput, this.monthInput, this.yearInput].filter(a => a);

    const values = {};
    formElements.forEach((formElement) => {
      values[formElement.name] = formElement.value;
    });

    if (formElements.every(formElement => formElement.checkValidity())) {
      const proposedValue = new Date(values.year, values.month - 1 || 0, values.day || 1);
      const processedValue = this.getProcessedValue(proposedValue);
      if (this.props.onChange) {
        this.props.onChange(processedValue, false);
      }
    }
  }

  stopPropagation = event => event.stopPropagation()

  renderDay() {
    const { maxDetail } = this.props;

    // Do not display if maxDetail is "year" or less
    if (allViews.indexOf(maxDetail) < 3) {
      return null;
    }

    return (
      <input
        className="react-date-picker__button__input__day"
        name="day"
        key="day"
        max={this.maxDay}
        min={this.minDay}
        value={this.state.day}
        {...this.commonInputProps}
      />
    );
  }

  renderMonth() {
    const { maxDetail } = this.props;

    // Do not display if maxDetail is "decade" or less
    if (allViews.indexOf(maxDetail) < 2) {
      return null;
    }

    return (
      <input
        className="react-date-picker__button__input__month"
        name="month"
        key="month"
        max={this.maxMonth}
        min={this.minMonth}
        value={this.state.month}
        {...this.commonInputProps}
      />
    );
  }

  renderYear() {
    return (
      <input
        className="react-date-picker__button__input__year"
        name="year"
        key="year"
        max={this.maxYear}
        min={this.minYear}
        step={this.yearStep}
        value={this.state.year}
        {...this.commonInputProps}
      />
    );
  }

  renderCustomInputs() {
    const { divider, dividerElement, placeholder } = this;

    return (
      placeholder
        .split('')
        // Internet Explorer specific
        .filter(a => a.charCodeAt(0) !== 8206)
        .join('')
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
    const { nativeValueParser } = this;
    const { maxDate, minDate, value } = this.props;

    return (
      <input
        type={this.nativeInputType}
        max={maxDate ? nativeValueParser(maxDate) : null}
        min={minDate ? nativeValueParser(minDate) : null}
        name="date"
        key="date"
        onChange={this.onChangeNative}
        onFocus={this.stopPropagation}
        step={this.yearStep}
        style={{
          visibility: 'hidden',
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
        }}
        value={value ? nativeValueParser(value) : ''}
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
  maxDate: isMaxDate,
  maxDetail: PropTypes.oneOf(allViews),
  minDate: isMinDate,
  onChange: PropTypes.func,
  returnValue: PropTypes.oneOf(['start', 'end']),
  value: PropTypes.instanceOf(Date),
};
