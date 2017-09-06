import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Calendar from 'react-calendar';
import 'react-calendar/src/Calendar.less';

import detectElementOverflow from 'detect-element-overflow';

import './DatePicker.less';

import DateInput from './DateInput';

import {
  isCalendarType,
  isMaxDate,
  isMinDate,
} from './shared/propTypes';

export default class DatePicker extends Component {
  state = {
    isOpen: this.props.isOpen,
  }

  openCalendar = () => {
    this.setState({ isOpen: true });
  }

  closeCalendar = () => {
    this.setState({ isOpen: false });
  }

  toggleCalendar = () => {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  onChange = (value, closeCalendar = true) => {
    this.setState({
      isOpen: !closeCalendar,
    });

    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }

  get formattedDate() {
    const { locale, value } = this.props;

    return value.toLocaleDateString(locale || false);
  }

  get placeholder() {
    const { locale } = this.props;
    const date = new Date(2017, 11, 11);

    return (
      date.toLocaleDateString(locale || false)
        .replace('2017', 'YYYY')
        .replace('12', 'MM')
        .replace('11', 'DD')
    );
  }

  onFocus = () => {
    this.blurRequested = false;

    this.openCalendar();
  }

  onBlur = () => {
    this.blurRequested = true;

    setTimeout(() => {
      if (this.blurRequested) {
        this.closeCalendar();

        this.blurRequested = false;
      }
    }, 100);
  }

  stopPropagation = event => event.stopPropagation()

  renderInput() {
    const { locale, value } = this.props;

    return (
      <div className="react-date-picker__button">
        <button
          className="react-date-picker__button__icon"
          onClick={this.toggleCalendar}
          onFocus={this.stopPropagation}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19">
            <g className="stroke-primary" stroke="black" strokeWidth="2">
              <rect width="15" height="15" x="2" y="2" fill="none" />
              <line x1="6" y1="0" x2="6" y2="4" />
              <line x1="13" y1="0" x2="13" y2="4" />
            </g>
          </svg>
        </button>
        <DateInput
          locale={locale}
          onChange={this.onChange}
          placeholder={this.placeholder}
          value={value}
        />
      </div>
    );
  }

  renderCalendar() {
    const { isOpen } = this.state;

    if (isOpen === null) {
      return null;
    }

    const {
      calendarType,
      locale,
      maxDate,
      minDate,
      value,
    } = this.props;

    return (
      <div
        className={`react-date-picker__calendar react-date-picker__calendar--${isOpen ? 'open' : 'closed'}`}
        ref={(ref) => {
          if (!ref) {
            return;
          }

          const collisions = detectElementOverflow(ref, document.body);
        }}
      >
        <Calendar
          calendarType={calendarType}
          locale={locale}
          maxDate={maxDate}
          minDate={minDate}
          onChange={this.onChange}
          value={value}
        />
      </div>
    );
  }

  render() {
    return (
      <div
        className="react-date-picker"
        onFocus={this.onFocus}
        onBlur={this.onBlur}
      >
        {this.renderInput()}
        {this.renderCalendar()}
      </div>
    );
  }
}

DatePicker.propTypes = {
  calendarType: isCalendarType,
  isOpen: PropTypes.bool,
  locale: PropTypes.string,
  maxDate: isMaxDate,
  minDate: isMinDate,
  onChange: PropTypes.func,
  value: PropTypes.instanceOf(Date),
};
