import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { getYear, getMonthHuman, getDate } from '@wojtekmaj/date-utils';

import Divider from './Divider';
import DayInput from './DateInput/DayInput';
import MonthInput from './DateInput/MonthInput';
import MonthSelect from './DateInput/MonthSelect';
import YearInput from './DateInput/YearInput';
import NativeInput from './DateInput/NativeInput';

import { getFormatter } from './shared/dateFormatter';
import { getBegin, getEnd } from './shared/dates';
import { isMaxDate, isMinDate } from './shared/propTypes';
import { between } from './shared/utils';

const getFormatterOptionsCache = {};

const defaultMinDate = new Date();
defaultMinDate.setFullYear(1, 0, 1);
defaultMinDate.setHours(0, 0, 0, 0);
const defaultMaxDate = new Date(8.64e15);
const allViews = ['century', 'decade', 'year', 'month'];
const allValueTypes = [...allViews.slice(1), 'day'];

function toDate(value) {
  if (value instanceof Date) {
    return value;
  }

  return new Date(value);
}

/**
 * Returns value type that can be returned with currently applied settings.
 */
function getValueType(maxDetail) {
  return allValueTypes[allViews.indexOf(maxDetail)];
}

function getValue(value, index) {
  if (!value) {
    return null;
  }

  const rawValue = Array.isArray(value) && value.length === 2 ? value[index] : value;

  if (!rawValue) {
    return null;
  }

  const valueDate = toDate(rawValue);

  if (isNaN(valueDate.getTime())) {
    throw new Error(`Invalid date: ${value}`);
  }

  return valueDate;
}

function getDetailValue({ value, minDate, maxDate, maxDetail }, index) {
  const valuePiece = getValue(value, index);

  if (!valuePiece) {
    return null;
  }

  const valueType = getValueType(maxDetail);
  const detailValueFrom = [getBegin, getEnd][index](valueType, valuePiece);

  return between(detailValueFrom, minDate, maxDate);
}

const getDetailValueFrom = (args) => getDetailValue(args, 0);

const getDetailValueTo = (args) => getDetailValue(args, 1);

const getDetailValueArray = (args) => {
  const { value } = args;

  if (Array.isArray(value)) {
    return value;
  }

  return [getDetailValueFrom, getDetailValueTo].map((fn) => fn(args));
};

function isInternalInput(element) {
  return element.dataset.input === 'true';
}

function findInput(element, property) {
  let nextElement = element;
  do {
    nextElement = nextElement[property];
  } while (nextElement && !isInternalInput(nextElement));
  return nextElement;
}

function focus(element) {
  if (element) {
    element.focus();
  }
}

function renderCustomInputs(placeholder, elementFunctions, allowMultipleInstances) {
  const usedFunctions = [];
  const pattern = new RegExp(
    Object.keys(elementFunctions)
      .map((el) => `${el}+`)
      .join('|'),
    'g',
  );
  const matches = placeholder.match(pattern);

  return placeholder.split(pattern).reduce((arr, element, index) => {
    const divider = element && (
      // eslint-disable-next-line react/no-array-index-key
      <Divider key={`separator_${index}`}>{element}</Divider>
    );
    const res = [...arr, divider];
    const currentMatch = matches && matches[index];

    if (currentMatch) {
      const renderFunction =
        elementFunctions[currentMatch] ||
        elementFunctions[
          Object.keys(elementFunctions).find((elementFunction) =>
            currentMatch.match(elementFunction),
          )
        ];

      if (!allowMultipleInstances && usedFunctions.includes(renderFunction)) {
        res.push(currentMatch);
      } else {
        res.push(renderFunction(currentMatch, index));
        usedFunctions.push(renderFunction);
      }
    }
    return res;
  }, []);
}

const isValue = PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]);

export default function DateInput({
  autoFocus,
  className,
  dayAriaLabel,
  dayPlaceholder,
  disabled,
  format,
  isCalendarOpen: isCalendarOpenProps = null,
  locale,
  maxDate,
  maxDetail = 'month',
  minDate,
  monthAriaLabel,
  monthPlaceholder,
  name = 'date',
  nativeInputAriaLabel,
  onChange: onChangeProps,
  required,
  returnValue = 'start',
  showLeadingZeros,
  value: valueProps,
  yearAriaLabel,
  yearPlaceholder,
}) {
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);
  const [day, setDay] = useState(null);
  const [value, setValue] = useState(null);
  const yearInput = useRef();
  const monthInput = useRef();
  const dayInput = useRef();
  const [isCalendarOpen, setIsCalendarOpen] = useState(isCalendarOpenProps);

  useEffect(() => {
    setIsCalendarOpen(isCalendarOpenProps);
  }, [isCalendarOpenProps]);

  useEffect(() => {
    const nextValue = getDetailValueFrom({
      value: valueProps,
      minDate,
      maxDate,
      maxDetail,
    });

    if (nextValue) {
      setYear(getYear(nextValue).toString());
      setMonth(getMonthHuman(nextValue).toString());
      setDay(getDate(nextValue).toString());
    } else {
      setYear(null);
      setMonth(null);
      setDay(null);
    }
    setValue(nextValue);
  }, [
    valueProps,
    minDate,
    maxDate,
    maxDetail,
    // Toggling calendar visibility resets values
    isCalendarOpen,
  ]);

  const valueType = getValueType(maxDetail);

  const formatDate = (() => {
    const level = allViews.indexOf(maxDetail);
    const formatterOptions =
      getFormatterOptionsCache[level] ||
      (() => {
        const options = { year: 'numeric' };
        if (level >= 2) {
          options.month = 'numeric';
        }
        if (level >= 3) {
          options.day = 'numeric';
        }

        getFormatterOptionsCache[level] = options;

        return options;
      })();

    return getFormatter(formatterOptions);
  })();

  /**
   * Gets current value in a desired format.
   */
  function getProcessedValue(value) {
    const processFunction = (() => {
      switch (returnValue) {
        case 'start':
          return getDetailValueFrom;
        case 'end':
          return getDetailValueTo;
        case 'range':
          return getDetailValueArray;
        default:
          throw new Error('Invalid returnValue.');
      }
    })();

    return processFunction({
      value,
      minDate,
      maxDate,
      maxDetail,
    });
  }

  const placeholder =
    format ||
    (() => {
      const year = 2017;
      const monthIndex = 11;
      const day = 11;

      const date = new Date(year, monthIndex, day);
      const formattedDate = formatDate(locale, date);

      const datePieces = ['year', 'month', 'day'];
      const datePieceReplacements = ['y', 'M', 'd'];

      function formatDatePiece(name, dateToFormat) {
        const formatterOptions =
          getFormatterOptionsCache[name] ||
          (() => {
            const options = { [name]: 'numeric' };

            getFormatterOptionsCache[name] = options;

            return options;
          })();

        return getFormatter(formatterOptions)(locale, dateToFormat).match(/\d{1,}/);
      }

      let placeholder = formattedDate;
      datePieces.forEach((datePiece, index) => {
        const match = formatDatePiece(datePiece, date);

        if (match) {
          const formattedDatePiece = match[0];
          const datePieceReplacement = datePieceReplacements[index];
          placeholder = placeholder.replace(formattedDatePiece, datePieceReplacement);
        }
      });
      // See: https://github.com/wojtekmaj/react-date-picker/issues/396
      placeholder = placeholder.replace('17', 'y');

      return placeholder;
    })();

  const divider = (() => {
    const dividers = placeholder.match(/[^0-9a-z]/i);
    return dividers ? dividers[0] : null;
  })();

  function onClick(event) {
    if (event.target === event.currentTarget) {
      // Wrapper was directly clicked
      const firstInput = event.target.children[1];
      focus(firstInput);
    }
  }

  function onKeyDown(event) {
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowRight':
      case divider: {
        event.preventDefault();

        const { target: input } = event;
        const property =
          event.key === 'ArrowLeft' ? 'previousElementSibling' : 'nextElementSibling';
        const nextInput = findInput(input, property);
        focus(nextInput);
        break;
      }
      default:
    }
  }

  function onKeyUp(event) {
    const { key, target: input } = event;

    const isNumberKey = !isNaN(parseInt(key, 10));

    if (!isNumberKey) {
      return;
    }

    const { value } = input;
    const max = input.getAttribute('max');

    /**
     * Given 1, the smallest possible number the user could type by adding another digit is 10.
     * 10 would be a valid value given max = 12, so we won't jump to the next input.
     * However, given 2, smallers possible number would be 20, and thus keeping the focus in
     * this field doesn't make sense.
     */
    if (value * 10 > max || value.length >= max.length) {
      const property = 'nextElementSibling';
      const nextInput = findInput(input, property);
      focus(nextInput);
    }
  }

  /**
   * Called after internal onChange. Checks input validity. If all fields are valid,
   * calls props.onChange.
   */
  function onChangeExternal() {
    if (!onChangeProps) {
      return;
    }

    const formElements = [dayInput.current, monthInput.current, yearInput.current].filter(Boolean);

    const values = {};
    formElements.forEach((formElement) => {
      values[formElement.name] =
        'valueAsNumber' in formElement
          ? formElement.valueAsNumber
          : parseInt(formElement.value, 10);
    });

    if (formElements.every((formElement) => !formElement.value)) {
      onChangeProps(null, false);
    } else if (
      formElements.every((formElement) => formElement.value && formElement.validity.valid)
    ) {
      const year = values.year || new Date().getFullYear();
      const monthIndex = (values.month || 1) - 1;
      const day = values.day || 1;

      const proposedValue = new Date();
      proposedValue.setFullYear(year, monthIndex, day);
      proposedValue.setHours(0, 0, 0, 0);

      const processedValue = getProcessedValue(proposedValue);
      onChangeProps(processedValue, false);
    }
  }

  /**
   * Called when non-native date input is changed.
   */
  function onChange(event) {
    const { name, value } = event.target;

    switch (name) {
      case 'year':
        setYear(value);
        break;
      case 'month':
        setMonth(value);
        break;
      case 'day':
        setDay(value);
        break;
    }

    onChangeExternal();
  }

  /**
   * Called when native date input is changed.
   */
  function onChangeNative(event) {
    const { value } = event.target;

    if (!onChangeProps) {
      return;
    }

    const processedValue = (() => {
      if (!value) {
        return null;
      }

      const [yearString, monthString, dayString] = value.split('-');
      const year = parseInt(yearString, 10);
      const monthIndex = parseInt(monthString, 10) - 1 || 0;
      const day = parseInt(dayString, 10) || 1;

      const proposedValue = new Date();
      proposedValue.setFullYear(year, monthIndex, day);
      proposedValue.setHours(0, 0, 0, 0);

      return proposedValue;
    })();

    onChangeProps(processedValue, false);
  }

  const commonInputProps = {
    className,
    disabled,
    maxDate: maxDate || defaultMaxDate,
    minDate: minDate || defaultMinDate,
    onChange,
    onKeyDown,
    onKeyUp,
    // This is only for showing validity when editing
    required: required || isCalendarOpen,
  };

  function renderDay(currentMatch, index) {
    if (currentMatch && currentMatch.length > 2) {
      throw new Error(`Unsupported token: ${currentMatch}`);
    }

    const showLeadingZerosFromFormat = currentMatch && currentMatch.length === 2;

    return (
      <DayInput
        key="day"
        {...commonInputProps}
        ariaLabel={dayAriaLabel}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={index === 0 && autoFocus}
        inputRef={dayInput}
        month={month}
        placeholder={dayPlaceholder}
        showLeadingZeros={showLeadingZerosFromFormat || showLeadingZeros}
        value={day}
        year={year}
      />
    );
  }

  function renderMonth(currentMatch, index) {
    if (currentMatch && currentMatch.length > 4) {
      throw new Error(`Unsupported token: ${currentMatch}`);
    }

    if (currentMatch.length > 2) {
      return (
        <MonthSelect
          key="month"
          {...commonInputProps}
          ariaLabel={monthAriaLabel}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={index === 0 && autoFocus}
          inputRef={monthInput}
          locale={locale}
          placeholder={monthPlaceholder}
          short={currentMatch.length === 3}
          value={month}
          year={year}
        />
      );
    }

    const showLeadingZerosFromFormat = currentMatch && currentMatch.length === 2;

    return (
      <MonthInput
        key="month"
        {...commonInputProps}
        ariaLabel={monthAriaLabel}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={index === 0 && autoFocus}
        inputRef={monthInput}
        placeholder={monthPlaceholder}
        showLeadingZeros={showLeadingZerosFromFormat || showLeadingZeros}
        value={month}
        year={year}
      />
    );
  }

  function renderYear(currentMatch, index) {
    return (
      <YearInput
        key="year"
        {...commonInputProps}
        ariaLabel={yearAriaLabel}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={index === 0 && autoFocus}
        inputRef={yearInput}
        placeholder={yearPlaceholder}
        value={year}
        valueType={valueType}
      />
    );
  }

  function renderCustomInputsInternal() {
    const elementFunctions = {
      d: renderDay,
      M: renderMonth,
      y: renderYear,
    };

    const allowMultipleInstances = typeof format !== 'undefined';
    return renderCustomInputs(placeholder, elementFunctions, allowMultipleInstances);
  }

  function renderNativeInput() {
    return (
      <NativeInput
        key="date"
        ariaLabel={nativeInputAriaLabel}
        disabled={disabled}
        maxDate={maxDate || defaultMaxDate}
        minDate={minDate || defaultMinDate}
        name={name}
        onChange={onChangeNative}
        required={required}
        value={value}
        valueType={valueType}
      />
    );
  }

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className={className} onClick={onClick}>
      {renderNativeInput()}
      {renderCustomInputsInternal()}
    </div>
  );
}

DateInput.propTypes = {
  autoFocus: PropTypes.bool,
  className: PropTypes.string.isRequired,
  dayAriaLabel: PropTypes.string,
  dayPlaceholder: PropTypes.string,
  disabled: PropTypes.bool,
  format: PropTypes.string,
  isCalendarOpen: PropTypes.bool,
  locale: PropTypes.string,
  maxDate: isMaxDate,
  maxDetail: PropTypes.oneOf(allViews),
  minDate: isMinDate,
  monthAriaLabel: PropTypes.string,
  monthPlaceholder: PropTypes.string,
  name: PropTypes.string,
  nativeInputAriaLabel: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  returnValue: PropTypes.oneOf(['start', 'end', 'range']),
  showLeadingZeros: PropTypes.bool,
  value: PropTypes.oneOfType([isValue, PropTypes.arrayOf(isValue)]),
  yearAriaLabel: PropTypes.string,
  yearPlaceholder: PropTypes.string,
};
