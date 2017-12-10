import React, { Component } from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'merge-class-names';

import Calendar from 'react-calendar/build/entry.nostyle';

import detectElementOverflow from 'detect-element-overflow';

import DateInput from './DateInput';

import { isCalendarType, isMaxDate, isMinDate, isValue } from './shared/propTypes';

const allViews = ['century', 'decade', 'year', 'month'];

export default class DatePicker extends Component {
  state = {
    isOpen: this.props.isOpen,
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.onClick);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onClick);
  }

  componentWillReceiveProps(nextProps) {
    const { props } = this;

    if (nextProps.isOpen !== props.isOpen) {
      this.setState({ isOpen: nextProps.isOpen });
    }
  }

  onClick = (event) => {
    if (this.wrapper && !this.wrapper.contains(event.target)) {
      this.closeCalendar();
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

  onFocus = () => {
    this.openCalendar();
  }

  stopPropagation = event => event.stopPropagation()

  clear = () => this.onChange(null);

  renderInput() {
    const {
      calendarIcon,
      clearIcon,
      locale,
      maxDate,
      maxDetail,
      minDate,
      returnValue,
      required,
      value,
    } = this.props;
    const { isOpen } = this.state;

    const [valueFrom] = [].concat(value);

    return (
      <div className="react-date-picker__button">
        <DateInput
          locale={locale}
          isCalendarOpen={isOpen}
          maxDate={maxDate}
          maxDetail={maxDetail}
          minDate={minDate}
          onChange={this.onChange}
          placeholder={this.placeholder}
          returnValue={returnValue}
          required={required}
          value={valueFrom}
        />
        <button
          className="react-date-picker__button__icon"
          onClick={this.clear}
          onFocus={this.stopPropagation}
          type="button"
        >
          {clearIcon}
        </button>
        <button
          className="react-date-picker__button__icon"
          onClick={this.toggleCalendar}
          onFocus={this.stopPropagation}
          onBlur={this.resetValue}
          type="button"
        >
          {calendarIcon}
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
      calendarClassName,
      className: datePickerClassName, // Unused, here to exclude it from calendarProps
      onChange,
      ...calendarProps
    } = this.props;

    const className = 'react-date-picker__calendar';

    return (
      <div
        className={mergeClassNames(
          className,
          `${className}--${isOpen ? 'open' : 'closed'}`,
        )}
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
          className={calendarClassName}
          onChange={this.onChange}
          {...calendarProps}
        />
      </div>
    );
  }

  render() {
    const { isOpen } = this.state;

    const className = 'react-date-picker';

    return (
      <div
        className={mergeClassNames(
          className,
          `${className}--${isOpen ? 'open' : 'closed'}`,
          this.props.className,
        )}
        onFocus={this.onFocus}
        ref={(ref) => { this.wrapper = ref; }}
      >
        {this.renderInput()}
        {this.renderCalendar()}
      </div>
    );
  }
}

const CalendarIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19">
    <g stroke="black" strokeWidth="2">
      <rect width="15" height="15" x="2" y="2" fill="none" />
      <line x1="6" y1="0" x2="6" y2="4" />
      <line x1="13" y1="0" x2="13" y2="4" />
    </g>
  </svg>
);

const ClearIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19">
    <g stroke="black" strokeWidth="2">
      <line x1="4" y1="4" x2="15" y2="15" />
      <line x1="15" y1="4" x2="4" y2="15" />
    </g>
  </svg>
);

DatePicker.defaultProps = {
  calendarIcon: CalendarIcon,
  clearIcon: ClearIcon,
  isOpen: null,
  maxDetail: 'month',
  returnValue: 'start',
};

DatePicker.propTypes = {
  calendarClassName: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  calendarIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  calendarType: isCalendarType,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  clearIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
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
  returnValue: PropTypes.oneOf(['start', 'end']),
  required: PropTypes.bool,
  showNeighboringMonth: PropTypes.bool,
  showWeekNumbers: PropTypes.bool,
  value: isValue,
};
