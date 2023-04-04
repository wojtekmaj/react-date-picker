import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import makeEventProps from 'make-event-props';
import clsx from 'clsx';
import Calendar from 'react-calendar';
import Fit from 'react-fit';

import DateInput from './DateInput';

import { isMaxDate, isMinDate } from './shared/propTypes';

const baseClassName = 'react-date-picker';
const outsideActionEvents = ['mousedown', 'focusin', 'touchstart'];
const allViews = ['century', 'decade', 'year', 'month'];

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

export default function DatePicker(props) {
  const {
    autoFocus,
    calendarAriaLabel,
    calendarIcon = CalendarIcon,
    className,
    clearAriaLabel,
    clearIcon = ClearIcon,
    closeCalendar: shouldCloseCalendarProps = true,
    'data-testid': dataTestid,
    dayAriaLabel,
    dayPlaceholder,
    disableCalendar,
    disabled,
    format,
    id,
    isOpen: isOpenProps = null,
    locale,
    maxDate,
    maxDetail = 'month',
    minDate,
    monthAriaLabel,
    monthPlaceholder,
    name = 'date',
    nativeInputAriaLabel,
    onCalendarClose,
    onCalendarOpen,
    onChange: onChangeProps,
    onFocus: onFocusProps,
    openCalendarOnFocus = true,
    required,
    returnValue = 'start',
    showLeadingZeros,
    value,
    yearAriaLabel,
    yearPlaceholder,
    ...otherProps
  } = props;

  const [isOpen, setIsOpen] = useState(isOpenProps);
  const wrapper = useRef();
  const calendarWrapper = useRef();

  useEffect(() => {
    setIsOpen(isOpenProps);
  }, [isOpenProps]);

  function openCalendar() {
    setIsOpen(true);

    if (onCalendarOpen) {
      onCalendarOpen();
    }
  }

  const closeCalendar = useCallback(() => {
    setIsOpen(false);

    if (onCalendarClose) {
      onCalendarClose();
    }
  }, [onCalendarClose]);

  function toggleCalendar() {
    if (isOpen) {
      closeCalendar();
    } else {
      openCalendar();
    }
  }

  function onChange(value, shouldCloseCalendar = shouldCloseCalendarProps) {
    if (shouldCloseCalendar) {
      closeCalendar();
    }

    if (onChangeProps) {
      onChangeProps(value);
    }
  }

  function onFocus(event) {
    if (onFocusProps) {
      onFocusProps(event);
    }

    if (
      // Internet Explorer still fires onFocus on disabled elements
      disabled ||
      isOpen ||
      !openCalendarOnFocus ||
      event.target.dataset.select === 'true'
    ) {
      return;
    }

    openCalendar();
  }

  const onKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        closeCalendar();
      }
    },
    [closeCalendar],
  );

  function clear() {
    onChange(null);
  }

  function stopPropagation(event) {
    event.stopPropagation();
  }

  const onOutsideAction = useCallback(
    (event) => {
      const { current: wrapperEl } = wrapper;
      const { current: calendarWrapperEl } = calendarWrapper;

      // Try event.composedPath first to handle clicks inside a Shadow DOM.
      const target = 'composedPath' in event ? event.composedPath()[0] : event.target;

      if (
        target &&
        wrapperEl &&
        !wrapperEl.contains(target) &&
        (!calendarWrapperEl || !calendarWrapperEl.contains(target))
      ) {
        closeCalendar();
      }
    },
    [calendarWrapper, closeCalendar, wrapper],
  );

  const handleOutsideActionListeners = useCallback(
    (shouldListen = isOpen) => {
      const action = shouldListen ? 'addEventListener' : 'removeEventListener';

      outsideActionEvents.forEach((event) => {
        document[action](event, onOutsideAction);
      });

      document[action]('keydown', onKeyDown);
    },
    [isOpen, onOutsideAction, onKeyDown],
  );

  useEffect(() => {
    handleOutsideActionListeners();

    return () => {
      handleOutsideActionListeners(false);
    };
  }, [handleOutsideActionListeners]);

  function renderInputs() {
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
          // eslint-disable-next-line jsx-a11y/no-autofocus
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
          onChange={onChange}
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
            onClick={clear}
            onFocus={stopPropagation}
            type="button"
          >
            {typeof clearIcon === 'function' ? React.createElement(clearIcon) : clearIcon}
          </button>
        )}
        {calendarIcon !== null && !disableCalendar && (
          <button
            aria-label={calendarAriaLabel}
            className={`${baseClassName}__calendar-button ${baseClassName}__button`}
            disabled={disabled}
            onClick={toggleCalendar}
            onFocus={stopPropagation}
            type="button"
          >
            {typeof calendarIcon === 'function' ? React.createElement(calendarIcon) : calendarIcon}
          </button>
        )}
      </div>
    );
  }

  function renderCalendar() {
    if (isOpen === null || disableCalendar) {
      return null;
    }

    const {
      calendarClassName,
      className: datePickerClassName, // Unused, here to exclude it from calendarProps
      onChange: onChangeProps, // Unused, here to exclude it from calendarProps
      portalContainer,
      value,
      ...calendarProps
    } = props;

    const className = `${baseClassName}__calendar`;
    const classNames = clsx(className, `${className}--${isOpen ? 'open' : 'closed'}`);

    const calendar = (
      <Calendar
        className={calendarClassName}
        onChange={(value) => onChange(value)}
        value={value || null}
        {...calendarProps}
      />
    );

    return portalContainer ? (
      createPortal(
        <div ref={calendarWrapper} className={classNames}>
          {calendar}
        </div>,
        portalContainer,
      )
    ) : (
      <Fit>
        <div
          ref={(ref) => {
            if (ref && !isOpen) {
              ref.removeAttribute('style');
            }
          }}
          className={classNames}
        >
          {calendar}
        </div>
      </Fit>
    );
  }

  const eventProps = useMemo(() => makeEventProps(otherProps), [otherProps]);

  return (
    <div
      className={clsx(
        baseClassName,
        `${baseClassName}--${isOpen ? 'open' : 'closed'}`,
        `${baseClassName}--${disabled ? 'disabled' : 'enabled'}`,
        className,
      )}
      data-testid={dataTestid}
      id={id}
      {...eventProps}
      onFocus={onFocus}
      ref={wrapper}
    >
      {renderInputs()}
      {renderCalendar()}
    </div>
  );
}

const isValue = PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]);

DatePicker.propTypes = {
  autoFocus: PropTypes.bool,
  calendarAriaLabel: PropTypes.string,
  calendarClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  calendarIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  clearAriaLabel: PropTypes.string,
  clearIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  closeCalendar: PropTypes.bool,
  'data-testid': PropTypes.string,
  dayAriaLabel: PropTypes.string,
  dayPlaceholder: PropTypes.string,
  disableCalendar: PropTypes.bool,
  disabled: PropTypes.bool,
  format: PropTypes.string,
  id: PropTypes.string,
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
  openCalendarOnFocus: PropTypes.bool,
  portalContainer: PropTypes.object,
  required: PropTypes.bool,
  returnValue: PropTypes.oneOf(['start', 'end', 'range']),
  showLeadingZeros: PropTypes.bool,
  value: PropTypes.oneOfType([isValue, PropTypes.arrayOf(isValue)]),
  yearAriaLabel: PropTypes.string,
  yearPlaceholder: PropTypes.string,
};
