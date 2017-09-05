import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Calendar from 'react-calendar';
import 'react-calendar/src/Calendar.less';

import detectElementOverflow from 'detect-element-overflow';

import './DatePicker.less';

import {
  isCalendarType,
  isMaxDate,
  isMinDate,
} from './shared/propTypes';

export default class DatePicker extends Component {
  state = {
    isOpen: this.props.isOpen,
    value: this.props.value,
  }

  toggleCalendar = () => {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  onChange = (value) => {
    this.setState({
      value,
      isOpen: false,
    });

    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }

  get formattedDate() {
    const { value } = this.state;
    const { locale } = this.props;

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

  get divider() {
    const { locale } = this.props;
    const date = new Date(2017, 11, 11);

    return date.toLocaleDateString(locale || false).match(/[^0-9]/)[0];
  }

  renderInput() {
    const { value } = this.state;

    return (
      <div className="react-date-picker__input">
        <button onClick={this.toggleCalendar}>Cal</button>
        <input
          type="text"
          placeholder={this.placeholder}
          value={value ? this.formattedDate : ''}
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
        />
      </div>
    );
  }

  render() {
    return (
      <div className="react-date-picker">
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
