import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'merge-class-names';
import detectElementOverflow from 'detect-element-overflow';

import Calendar from 'react-calendar/dist/entry.nostyle';

import DateInput from './DateInput';

export default class DatePicker extends PureComponent {
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

  renderInputs() {
    const { disabled } = this.props;
    const [valueFrom] = [].concat(this.props.value);

    return (
      <div className="react-date-picker__button">
        <DateInput
          disabled={disabled}
          locale={this.props.locale}
          isCalendarOpen={this.state.isOpen}
          maxDate={this.props.maxDate}
          maxDetail={this.props.maxDetail}
          minDate={this.props.minDate}
          name={this.props.name}
          onChange={this.onChange}
          returnValue={this.props.returnValue}
          required={this.props.required}
          showLeadingZeros={this.props.showLeadingZeros}
          value={valueFrom}
        />
        <button
          className="react-date-picker__clear-button react-date-picker__button__icon"
          disabled={disabled}
          onClick={this.clear}
          onFocus={this.stopPropagation}
          type="button"
        >
          {this.props.clearIcon}
        </button>
        <button
          className="react-date-picker__calendar-button react-date-picker__button__icon"
          disabled={disabled}
          onClick={this.toggleCalendar}
          onFocus={this.stopPropagation}
          onBlur={this.resetValue}
          type="button"
        >
          {this.props.calendarIcon}
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
      value,
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
          if (!ref || !isOpen) {
            return;
          }

          ref.classList.remove(`${className}--above-label`);

          const collisions = detectElementOverflow(ref, document.body);

          if (collisions.collidedBottom) {
            const overflowTopAfterChange =
              collisions.overflowTop + ref.clientHeight + this.wrapper.clientHeight;

            // If it's going to make situation any better, display the calendar above the input
            if (overflowTopAfterChange < collisions.overflowBottom) {
              ref.classList.add(`${className}--above-label`);
            }
          }
        }}
      >
        <Calendar
          className={calendarClassName}
          onChange={this.onChange}
          value={value || null}
          {...calendarProps}
        />
      </div>
    );
  }

  render() {
    const className = 'react-date-picker';

    return (
      <div
        className={mergeClassNames(
          className,
          `${className}--${this.state.isOpen ? 'open' : 'closed'}`,
          `${className}--${this.props.disabled ? 'disabled' : 'enabled'}`,
          this.props.className,
        )}
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
  returnValue: PropTypes.oneOf(['start', 'end']),
  showLeadingZeros: PropTypes.bool,
};
