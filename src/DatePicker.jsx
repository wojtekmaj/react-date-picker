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

  componentWillReceiveProps(nextProps) {
    const { props } = this;

    if (nextProps.isOpen !== props.isOpen) {
      this.setState({ isOpen: nextProps.isOpen });
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
      locale,
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
          locale={locale}
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
          type="button"
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
    return (
      <div
        className={mergeClassNames('react-date-picker', this.props.className)}
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
  isOpen: null,
  maxDetail: 'month',
  returnValue: 'start',
};

DatePicker.propTypes = {
  calendarClassName: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  calendarType: isCalendarType,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
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
