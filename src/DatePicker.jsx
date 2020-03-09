import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import makeEventProps from 'make-event-props';
import mergeClassNames from 'merge-class-names';
import Fit from 'react-fit';

import Calendar from 'react-calendar/dist/entry.nostyle';

import DateInput from './DateInput';

import { isMaxDate, isMinDate } from './shared/propTypes';
import { callIfDefined } from './shared/utils';

const baseClassName = 'react-date-picker';
const outsideActionEvents = ['mousedown', 'focusin', 'touchstart'];
const allViews = ['century', 'decade', 'year', 'month'];

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

  componentDidMount() {
    this.handleOutsideActionListeners();
  }

  componentDidUpdate(prevProps, prevState) {
    const { isOpen } = this.state;
    const { onCalendarClose, onCalendarOpen } = this.props;

    if (isOpen !== prevState.isOpen) {
      this.handleOutsideActionListeners();
      callIfDefined(isOpen ? onCalendarOpen : onCalendarClose);
    }
  }

  componentWillUnmount() {
    this.handleOutsideActionListeners(false);
  }

  get eventProps() {
    return makeEventProps(this.props);
  }

  onOutsideAction = (event) => {
    if (this.wrapper && !this.wrapper.contains(event.target)) {
      this.closeCalendar();
    }
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

  stopPropagation = event => event.stopPropagation();

  clear = () => this.onChange(null);

  handleOutsideActionListeners(shouldListen) {
    const { isOpen } = this.state;

    const shouldListenWithFallback = typeof shouldListen !== 'undefined' ? shouldListen : isOpen;
    const fnName = shouldListenWithFallback ? 'addEventListener' : 'removeEventListener';
    outsideActionEvents.forEach(eventName => document[fnName](eventName, this.onOutsideAction));
  }

  renderInputs() {
    const {
      autoFocus,
      calendarAriaLabel,
      calendarIcon,
      clearAriaLabel,
      clearIcon,
      dayAriaLabel,
      dayPlaceholder,
      disableCalendar,
      disabled,
      format,
      locale,
      maxDate,
      maxDetail,
      minDate,
      monthAriaLabel,
      monthPlaceholder,
      name,
      nativeInputAriaLabel,
      required,
      returnValue,
      showLeadingZeros,
      value,
      yearAriaLabel,
      yearPlaceholder,
    } = this.props;
    const { isOpen } = this.state;

    const [valueFrom] = [].concat(value);

    const ariaLabelProps = {
      dayAriaLabel,
      monthAriaLabel,
      nativeInputAriaLabel,
      yearAriaLabel,
    };

    const placeholderProps = {
      dayPlaceholder,
      monthPlaceholder,
      yearPlaceholder,
    };

    return (
      <div className={`${baseClassName}__wrapper`}>
        <DateInput
          {...ariaLabelProps}
          {...placeholderProps}
          autoFocus={autoFocus}
          className={`${baseClassName}__inputGroup`}
          disabled={disabled}
          format={format}
          isCalendarOpen={isOpen}
          locale={locale}
          maxDate={maxDate}
          maxDetail={maxDetail}
          minDate={minDate}
          name={name}
          onChange={this.onChange}
          required={required}
          returnValue={returnValue}
          showLeadingZeros={showLeadingZeros}
          value={valueFrom}
        />
        {clearIcon !== null && (
          <button
            aria-label={clearAriaLabel}
            className={`${baseClassName}__clear-button ${baseClassName}__button`}
            disabled={disabled}
            onClick={this.clear}
            onFocus={this.stopPropagation}
            type="button"
          >
            {clearIcon}
          </button>
        )}
        {calendarIcon !== null && !disableCalendar && (
          <button
            aria-label={calendarAriaLabel}
            className={`${baseClassName}__calendar-button ${baseClassName}__button`}
            disabled={disabled}
            onBlur={this.resetValue}
            onClick={this.toggleCalendar}
            onFocus={this.stopPropagation}
            type="button"
          >
            {calendarIcon}
          </button>
        )}
      </div>
    );
  }

  renderCalendar() {
    const { disableCalendar } = this.props;
    const { isOpen } = this.state;

    if (isOpen === null || disableCalendar) {
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

const iconProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 19,
  height: 19,
  viewBox: '0 0 19 19',
  stroke: 'black',
  strokeWidth: 2,
};

const CalendarIcon = (
  <svg
    {...iconProps}
    className={`${baseClassName}__calendar-button__icon ${baseClassName}__button__icon`}
  >
    <rect fill="none" height="15" width="15" x="2" y="2" />
    <line x1="6" x2="6" y1="0" y2="4" />
    <line x1="13" x2="13" y1="0" y2="4" />
  </svg>
);

const ClearIcon = (
  <svg
    {...iconProps}
    className={`${baseClassName}__clear-button__icon ${baseClassName}__button__icon`}
  >
    <line x1="4" x2="15" y1="4" y2="15" />
    <line x1="15" x2="4" y1="4" y2="15" />
  </svg>
);

DatePicker.defaultProps = {
  calendarIcon: CalendarIcon,
  clearIcon: ClearIcon,
  isOpen: null,
  returnValue: 'start',
};

const isValue = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.instanceOf(Date),
]);

DatePicker.propTypes = {
  autoFocus: PropTypes.bool,
  calendarAriaLabel: PropTypes.string,
  calendarClassName: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  calendarIcon: PropTypes.node,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  clearAriaLabel: PropTypes.string,
  clearIcon: PropTypes.node,
  dayAriaLabel: PropTypes.string,
  dayPlaceholder: PropTypes.string,
  disableCalendar: PropTypes.bool,
  disabled: PropTypes.bool,
  format: PropTypes.string,
  isOpen: PropTypes.bool,
  locale: PropTypes.string,
  maxDate: isMaxDate,
  maxDetail: PropTypes.oneOf(allViews),
  minDate: isMinDate,
  monthAriaLabel: PropTypes.string,
  monthPlaceholder: PropTypes.string,
  name: PropTypes.string,
  nativeInputAriaLabel: PropTypes.string,
  onCalendarClose: PropTypes.func,
  onCalendarOpen: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  required: PropTypes.bool,
  returnValue: PropTypes.oneOf(['start', 'end', 'range']),
  showLeadingZeros: PropTypes.bool,
  value: PropTypes.oneOfType([
    isValue,
    PropTypes.arrayOf(isValue),
  ]),
  yearAriaLabel: PropTypes.string,
  yearPlaceholder: PropTypes.string,
};
