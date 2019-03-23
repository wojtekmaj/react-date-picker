import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import makeEventProps from 'make-event-props';
import mergeClassNames from 'merge-class-names';
import Fit from 'react-fit';

import Calendar from 'react-calendar/dist/entry.nostyle';

import DateInput from './DateInput';

import { callIfDefined } from './shared/utils';

const baseClassName = 'react-date-picker';

export default class DatePicker extends PureComponent {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.isOpen !== prevState.isOpenProps) {
      return {
        isOpen: nextProps.isOpen,
        isOpenProps: nextProps.isOpen,
      };
    }

    return null;
  }

  state = {};

  get eventProps() {
    return makeEventProps(this.props);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.onOutsideAction);
    document.addEventListener('focusin', this.onOutsideAction);
  }

  componentDidUpdate(prevProps, prevState) {
    const { isOpen } = this.state;
    const { onCalendarClose, onCalendarOpen } = this.props;

    if (isOpen !== prevState.isOpen) {
      callIfDefined(isOpen ? onCalendarOpen : onCalendarClose);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onOutsideAction);
    document.removeEventListener('focusin', this.onOutsideAction);
  }

  onOutsideAction = (event) => {
    if (this.wrapper && !this.wrapper.contains(event.target)) {
      this.closeCalendar();
    }
  }

  openCalendar = () => {
    this.setState({ isOpen: true });
  }

  closeCalendar = () => {
    this.setState((prevState) => {
      if (!prevState.isOpen) {
        return null;
      }

      return { isOpen: false };
    });
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

  onFocus = (event) => {
    const { disabled, onFocus } = this.props;

    if (onFocus) {
      onFocus(event);
    }

    // Internet Explorer still fires onFocus on disabled elements
    if (disabled) {
      return;
    }

    this.openCalendar();
  }

  stopPropagation = event => event.stopPropagation();

  clear = () => this.onChange(null);

  renderInputs() {
    const {
      calendarIcon,
      clearIcon,
      disabled,
      locale,
      maxDate,
      maxDetail,
      minDate,
      name,
      returnValue,
      required,
      showLeadingZeros,
      value,
    } = this.props;
    const { isOpen } = this.state;

    const [valueFrom] = [].concat(value);

    return (
      <div className={`${baseClassName}__wrapper`}>
        <DateInput
          className={`${baseClassName}__inputGroup`}
          disabled={disabled}
          locale={locale}
          isCalendarOpen={isOpen}
          maxDate={maxDate}
          maxDetail={maxDetail}
          minDate={minDate}
          name={name}
          onChange={this.onChange}
          returnValue={returnValue}
          required={required}
          showLeadingZeros={showLeadingZeros}
          value={valueFrom}
        />
        {clearIcon !== null && (
          <button
            className={`${baseClassName}__clear-button ${baseClassName}__button`}
            disabled={disabled}
            onClick={this.clear}
            onFocus={this.stopPropagation}
            type="button"
          >
            {clearIcon}
          </button>
        )}
        {calendarIcon !== null && (
          <button
            className={`${baseClassName}__calendar-button ${baseClassName}__button`}
            disabled={disabled}
            onClick={this.toggleCalendar}
            onFocus={this.stopPropagation}
            onBlur={this.resetValue}
            type="button"
          >
            {calendarIcon}
          </button>
        )}
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
      value,
      ...calendarProps
    } = this.props;

    const className = `${baseClassName}__calendar`;

    return (
      <Fit>
        <div className={mergeClassNames(className, `${className}--${isOpen ? 'open' : 'closed'}`)}>
          <Calendar
            className={calendarClassName}
            onChange={this.onChange}
            value={value || null}
            {...calendarProps}
          />
        </div>
      </Fit>
    );
  }

  render() {
    const { className, disabled } = this.props;
    const { isOpen } = this.state;

    return (
      <div
        className={mergeClassNames(
          baseClassName,
          `${baseClassName}--${isOpen ? 'open' : 'closed'}`,
          `${baseClassName}--${disabled ? 'disabled' : 'enabled'}`,
          className,
        )}
        {...this.eventProps}
        onFocus={this.onFocus}
        ref={(ref) => {
          if (!ref) {
            return;
          }

          this.wrapper = ref;
        }}
      >
        {this.renderInputs()}
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
  returnValue: 'start',
};

DatePicker.propTypes = {
  ...Calendar.propTypes,
  calendarClassName: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  calendarIcon: PropTypes.node,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  clearIcon: PropTypes.node,
  disabled: PropTypes.bool,
  isOpen: PropTypes.bool,
  name: PropTypes.string,
  returnValue: PropTypes.oneOf(['start', 'end', 'range']),
  onCalendarClose: PropTypes.func,
  onCalendarOpen: PropTypes.func,
  required: PropTypes.bool,
  showLeadingZeros: PropTypes.bool,
};

polyfill(DatePicker);
