import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Calendar from 'react-calendar';
import 'react-calendar/build/Calendar.less';

import detectElementOverflow from 'detect-element-overflow';

import './DatePicker.less';

import DateInput from './DateInput';

import { formatDate } from './shared/dateFormatter';
import { setLocale } from './shared/locales';
import { isCalendarType, isMaxDate, isMinDate, isValue } from './shared/propTypes';

const allViews = ['century', 'decade', 'year', 'month'];

export default class DatePicker extends Component {
  state = {
    isOpen: this.props.isOpen,
  }

  componentWillMount() {
    setLocale(this.props.locale);
  }

  componentWillReceiveProps(nextProps) {
    const { props } = this;

    if (nextProps.locale !== props.locale) {
      setLocale(nextProps.locale);
    }
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

    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
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
    const {
      maxDate,
      maxDetail,
      minDate,
      returnValue,
      value,
    } = this.props;

    const [valueFrom] = [].concat(value);

    return (
      <div className="react-date-picker__button">
        <DateInput
          maxDate={maxDate}
          maxDetail={maxDetail}
          minDate={minDate}
          onChange={this.onChange}
          placeholder={this.placeholder}
          returnValue={returnValue}
          value={valueFrom}
        />
        <button
          className="react-date-picker__button__icon"
          onClick={this.toggleCalendar}
          onFocus={this.stopPropagation}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19">
            <g stroke="black" strokeWidth="2">
              <rect width="15" height="15" x="2" y="2" fill="none" />
              <line x1="6" y1="0" x2="6" y2="4" />
              <line x1="13" y1="0" x2="13" y2="4" />
            </g>
          </svg>
        </button>
      </div>
    );
  }

  renderCalendar() {
    const { isOpen } = this.state;

    if (isOpen === null) {
      return null;
    }

    const {
      onChange,
      ...calendarProps
    } = this.props;

    const className = 'react-date-picker__calendar';

    return (
      <div
        className={`${className} ${className}--${isOpen ? 'open' : 'closed'}`}
        ref={(ref) => {
          if (!ref) {
            return;
          }

          ref.classList.remove(`${className}--above-label`);

          const collisions = detectElementOverflow(ref, document.body);

          if (collisions.collidedBottom) {
            ref.classList.add(`${className}--above-label`);
          }
        }}
      >
        <Calendar
          onChange={this.onChange}
          {...calendarProps}
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

DatePicker.defaultProps = {
  maxDetail: 'month',
  returnValue: 'start',
};

DatePicker.propTypes = {
  calendarType: isCalendarType,
  isOpen: PropTypes.bool,
  locale: PropTypes.string,
  maxDate: isMaxDate,
  maxDetail: PropTypes.oneOf(allViews),
  minDate: isMinDate,
  minDetail: PropTypes.oneOf(allViews),
  next2Label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  nextLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onChange: PropTypes.func,
  onClickDay: PropTypes.func,
  onClickDecade: PropTypes.func,
  onClickMonth: PropTypes.func,
  onClickYear: PropTypes.func,
  prev2Label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  prevLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  returnValue: PropTypes.oneOf(['start', 'end']).isRequired,
  showNeighboringMonth: PropTypes.bool,
  showWeekNumbers: PropTypes.bool,
  value: isValue,
};
