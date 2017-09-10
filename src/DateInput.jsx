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
import { isMaxDate, isMinDate } from './shared/propTypes';

const allViews = ['century', 'decade', 'year', 'month'];
const allValueTypes = [...allViews.slice(1), 'day'];

const updateInputWidth = (element) => {
  const span = document.createElement('span');
  span.innerHTML = element.value;

  const container = element.parentElement;

  container.appendChild(span);

  const width = span.clientWidth;
  element.style.width = `${width}px`;

  container.removeChild(span);
};

const min = (...args) => Math.min(...args.filter(a => typeof a === 'number'));
const max = (...args) => Math.max(...args.filter(a => typeof a === 'number'));
const between = (value, minValue = -Infinity, maxValue = Infinity) =>
  Math.min(Math.max(value, minValue), maxValue);

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
    this.updateValues();
  }

  componentWillReceiveProps(nextProps) {
    const { props } = this;

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

  get day() {
    return between(this.state.day, this.minDay, this.maxDay);
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

  get month() {
    return between(this.state.month, this.minMonth, this.maxMonth);
  }

  get maxYear() {
    const { maxDate } = this.props;
    return maxDate ? getYear(maxDate) : null;
  }

  get minYear() {
    const { minDate } = this.props;
    return max(1000, minDate && getYear(minDate));
  }

  get year() {
    return between(this.state.year, this.minYear, this.maxYear);
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
        throw new Error('Invalid maxDetail.');
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
        throw new Error('Invalid maxDetail.');
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

    return formatDate(date)
      .split('')
      .filter(a => a.charCodeAt(0) !== 8206)
      .join('')
      .match(/[^0-9]/)[0];
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

  onSubmit = (event) => {
    if (event.preventDefault) {
      event.preventDefault();
    }

    const form = event.target;

    const values = {};

    for (let i = 0; i < form.length; i += 1) {
      values[form[i].name] = form[i].value;
    }

    if (form.checkValidity()) {
      const proposedValue = new Date(values.year, values.month - 1 || 0, values.day || 1);
      const processedValue = this.getProcessedValue(proposedValue);
      this.props.onChange(processedValue);
    }
  }

  onKeyDown = (event) => {
    if (event.key === this.divider) {
      event.preventDefault();

      const input = event.target;
      const nextInput = input.nextElementSibling;

      if (nextInput) {
        nextInput.focus();
        nextInput.select();
      }
    }
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });

    updateInputWidth(event.target);

    this.onSubmit({ target: event.target.form });
  }

  onChangeNative = (event) => {
    const { value } = event.target;

    this.props.onChange(new Date(value));
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
        value={this.day}
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
        value={this.month}
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
        value={this.year}
        {...this.commonInputProps}
      />
    );
  }

  renderCustomInputs() {
    const { divider } = this;
    const { placeholder } = this.props;

    return (
      placeholder
        .split('')
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
            result.push(divider);
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
        max={minDate ? nativeValueParser(maxDate) : null}
        min={minDate ? nativeValueParser(minDate) : null}
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
        <form onSubmit={this.onSubmit}>
          <button type="submit" style={{ display: 'none' }} />
          {this.renderNativeInput()}
          {this.renderCustomInputs()}
        </form>
      </div>
    );
  }
}

DateInput.propTypes = {
  locale: PropTypes.string,
  maxDate: isMaxDate,
  maxDetail: PropTypes.oneOf(allViews).isRequired,
  minDate: isMinDate,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  returnValue: PropTypes.oneOf(['start', 'end']).isRequired,
  value: PropTypes.instanceOf(Date),
};
