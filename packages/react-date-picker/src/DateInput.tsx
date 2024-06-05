'use client';

import { useEffect, useRef, useState } from 'react';
import { getYear, getMonthHuman, getDate } from '@wojtekmaj/date-utils';

import Divider from './Divider.js';
import DayInput from './DateInput/DayInput.js';
import MonthInput from './DateInput/MonthInput.js';
import MonthSelect from './DateInput/MonthSelect.js';
import YearInput from './DateInput/YearInput.js';
import NativeInput from './DateInput/NativeInput.js';

import { getFormatter } from './shared/dateFormatter.js';
import { getBegin, getEnd } from './shared/dates.js';
import { between } from './shared/utils.js';

import type { Detail, LooseValuePiece, Value } from './shared/types.js';

const getFormatterOptionsCache: Record<string, Intl.DateTimeFormatOptions> = {};

const defaultMinDate = new Date();
defaultMinDate.setFullYear(1, 0, 1);
defaultMinDate.setHours(0, 0, 0, 0);
const defaultMaxDate = new Date(8.64e15);
const allViews = ['century', 'decade', 'year', 'month'] as const;
const allValueTypes = [...allViews.slice(1), 'day'] as const;

function toDate(value: Date | string): Date {
  if (value instanceof Date) {
    return value;
  }

  return new Date(value);
}

/**
 * Returns value type that can be returned with currently applied settings.
 */
function getValueType<T extends number>(view: (typeof allViews)[T]): (typeof allValueTypes)[T] {
  const index = allViews.indexOf(view) as T;

  return allValueTypes[index];
}

function getValue(
  value: string | Date | null | undefined | (string | Date | null | undefined)[],
  index: 0 | 1,
): Date | null {
  const rawValue = Array.isArray(value) ? value[index] : value;

  if (!rawValue) {
    return null;
  }

  const valueDate = toDate(rawValue);

  if (Number.isNaN(valueDate.getTime())) {
    throw new Error(`Invalid date: ${value}`);
  }

  return valueDate;
}

type DetailArgs = {
  value?: LooseValuePiece;
  minDate?: Date;
  maxDate?: Date;
  maxDetail: Detail;
};

function getDetailValue(
  { value, minDate, maxDate, maxDetail }: DetailArgs,
  index: 0 | 1,
): Date | null {
  const valuePiece = getValue(value, index);

  if (!valuePiece) {
    return null;
  }

  const valueType = getValueType(maxDetail);

  const detailValueFrom = (() => {
    switch (index) {
      case 0:
        return getBegin(valueType, valuePiece);
      case 1:
        return getEnd(valueType, valuePiece);
      default:
        throw new Error(`Invalid index value: ${index}`);
    }
  })();

  return between(detailValueFrom, minDate, maxDate);
}

const getDetailValueFrom = (args: DetailArgs) => getDetailValue(args, 0);

const getDetailValueTo = (args: DetailArgs) => getDetailValue(args, 1);

const getDetailValueArray = (args: DetailArgs) =>
  [getDetailValueFrom, getDetailValueTo].map((fn) => fn(args)) as [
    ReturnType<typeof getDetailValueFrom>,
    ReturnType<typeof getDetailValueTo>,
  ];

function isInternalInput(element: HTMLElement) {
  return element.dataset.input === 'true';
}

function findInput(
  element: HTMLElement,
  property: 'previousElementSibling' | 'nextElementSibling',
) {
  let nextElement: HTMLElement | null = element;
  do {
    nextElement = nextElement[property] as HTMLElement | null;
  } while (nextElement && !isInternalInput(nextElement));
  return nextElement;
}

function focus(element?: HTMLElement | null) {
  if (element) {
    element.focus();
  }
}

type RenderFunction = (match: string, index: number) => React.ReactNode;

function renderCustomInputs(
  placeholder: string,
  elementFunctions: Record<string, RenderFunction>,
  allowMultipleInstances: boolean,
) {
  const usedFunctions: RenderFunction[] = [];
  const pattern = new RegExp(
    Object.keys(elementFunctions)
      .map((el) => `${el}+`)
      .join('|'),
    'g',
  );
  const matches = placeholder.match(pattern);

  return placeholder.split(pattern).reduce<React.ReactNode[]>((arr, element, index) => {
    const divider = element && (
      // biome-ignore lint/suspicious/noArrayIndexKey: index is stable here
      <Divider key={`separator_${index}`}>{element}</Divider>
    );
    arr.push(divider);
    const currentMatch = matches?.[index];

    if (currentMatch) {
      const renderFunction =
        elementFunctions[currentMatch] ||
        elementFunctions[
          Object.keys(elementFunctions).find((elementFunction) =>
            currentMatch.match(elementFunction),
          ) as string
        ];

      if (!renderFunction) {
        return arr;
      }

      if (!allowMultipleInstances && usedFunctions.includes(renderFunction)) {
        arr.push(currentMatch);
      } else {
        arr.push(renderFunction(currentMatch, index));
        usedFunctions.push(renderFunction);
      }
    }

    return arr;
  }, []);
}

type DateInputProps = {
  autoFocus?: boolean;
  className: string;
  dayAriaLabel?: string;
  dayPlaceholder?: string;
  disabled?: boolean;
  format?: string;
  isCalendarOpen?: boolean | null;
  locale?: string;
  maxDate?: Date;
  maxDetail?: Detail;
  minDate?: Date;
  monthAriaLabel?: string;
  monthPlaceholder?: string;
  name?: string;
  nativeInputAriaLabel?: string;
  onChange?: (value: Value, shouldCloseCalendar: boolean) => void;
  onInvalidChange?: () => void;
  required?: boolean;
  returnValue?: 'start' | 'end' | 'range';
  showLeadingZeros?: boolean;
  value?: LooseValuePiece;
  yearAriaLabel?: string;
  yearPlaceholder?: string;
};

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
  onInvalidChange,
  required,
  returnValue = 'start',
  showLeadingZeros,
  value: valueProps,
  yearAriaLabel,
  yearPlaceholder,
}: DateInputProps) {
  const [year, setYear] = useState<string | null>(null);
  const [month, setMonth] = useState<string | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [value, setValue] = useState<Date | null>(null);
  const yearInput = useRef<HTMLInputElement>(null);
  const monthInput = useRef<HTMLInputElement>(null);
  const monthSelect = useRef<HTMLSelectElement>(null);
  const dayInput = useRef<HTMLInputElement>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(isCalendarOpenProps);
  const lastPressedKey = useRef<KeyboardEvent['key'] | undefined>(undefined);

  useEffect(() => {
    setIsCalendarOpen(isCalendarOpenProps);
  }, [isCalendarOpenProps]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect intentionally triggered on props change
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
      setValue(nextValue);
    } else {
      setYear(null);
      setMonth(null);
      setDay(null);
      setValue(null);
    }
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
        const options: Intl.DateTimeFormatOptions = { year: 'numeric' };
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
  function getProcessedValue(value: Date) {
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

      const datePieces = ['year', 'month', 'day'] as const;
      const datePieceReplacements = ['y', 'M', 'd'];

      function formatDatePiece(name: keyof Intl.DateTimeFormatOptions, dateToFormat: Date) {
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
          const datePieceReplacement = datePieceReplacements[index] as string;
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

  function onClick(event: React.MouseEvent<HTMLDivElement> & { target: HTMLDivElement }) {
    if (event.target === event.currentTarget) {
      // Wrapper was directly clicked
      const firstInput = event.target.children[1] as HTMLInputElement;
      focus(firstInput);
    }
  }

  function onKeyDown(
    event:
      | (React.KeyboardEvent<HTMLInputElement> & { target: HTMLInputElement })
      | (React.KeyboardEvent<HTMLSelectElement> & { target: HTMLSelectElement }),
  ) {
    lastPressedKey.current = event.key;

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

  function onKeyUp(event: React.KeyboardEvent<HTMLInputElement> & { target: HTMLInputElement }) {
    const { key, target: input } = event;

    const isLastPressedKey = lastPressedKey.current === key;

    if (!isLastPressedKey) {
      return;
    }

    const isNumberKey = !Number.isNaN(Number(key));

    if (!isNumberKey) {
      return;
    }

    const max = input.getAttribute('max');

    if (!max) {
      return;
    }

    const { value } = input;

    /**
     * Given 1, the smallest possible number the user could type by adding another digit is 10.
     * 10 would be a valid value given max = 12, so we won't jump to the next input.
     * However, given 2, smallers possible number would be 20, and thus keeping the focus in
     * this field doesn't make sense.
     */
    if (Number(value) * 10 > Number(max) || value.length >= max.length) {
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

    type NonFalsy<T> = T extends false | 0 | '' | null | undefined | 0n ? never : T;

    function filterBoolean<T>(value: T): value is NonFalsy<typeof value> {
      return Boolean(value);
    }

    const formElements = [
      dayInput.current,
      monthInput.current,
      monthSelect.current,
      yearInput.current,
    ].filter(filterBoolean);

    const values: Record<string, number> = {};
    for (const formElement of formElements) {
      values[formElement.name] =
        'valueAsNumber' in formElement ? formElement.valueAsNumber : Number(formElement.value);
    }

    const isEveryValueEmpty = formElements.every((formElement) => !formElement.value);

    if (isEveryValueEmpty) {
      onChangeProps(null, false);
      return;
    }

    const isEveryValueFilled = formElements.every((formElement) => formElement.value);
    const isEveryValueValid = formElements.every((formElement) => formElement.validity.valid);

    if (isEveryValueFilled && isEveryValueValid) {
      const year = Number(values.year || new Date().getFullYear());
      const monthIndex = Number(values.month || 1) - 1;
      const day = Number(values.day || 1);

      const proposedValue = new Date();
      proposedValue.setFullYear(year, monthIndex, day);
      proposedValue.setHours(0, 0, 0, 0);

      const processedValue = getProcessedValue(proposedValue);
      onChangeProps(processedValue, false);
      return;
    }

    if (!onInvalidChange) {
      return;
    }

    onInvalidChange();
  }

  /**
   * Called when non-native date input is changed.
   */
  function onChange(
    event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>,
  ) {
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
  function onChangeNative(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;

    if (!onChangeProps) {
      return;
    }

    const processedValue = (() => {
      if (!value) {
        return null;
      }

      const [yearString, monthString, dayString] = value.split('-') as [string, string, string];
      const year = Number(yearString);
      const monthIndex = Number(monthString) - 1 || 0;
      const day = Number(dayString) || 1;

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
    required: Boolean(required || isCalendarOpen),
  };

  function renderDay(currentMatch: string, index: number) {
    if (currentMatch && currentMatch.length > 2) {
      throw new Error(`Unsupported token: ${currentMatch}`);
    }

    const showLeadingZerosFromFormat = currentMatch && currentMatch.length === 2;

    return (
      <DayInput
        key="day"
        {...commonInputProps}
        ariaLabel={dayAriaLabel}
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

  function renderMonth(currentMatch: string, index: number) {
    if (currentMatch && currentMatch.length > 4) {
      throw new Error(`Unsupported token: ${currentMatch}`);
    }

    if (currentMatch.length > 2) {
      return (
        <MonthSelect
          key="month"
          {...commonInputProps}
          ariaLabel={monthAriaLabel}
          autoFocus={index === 0 && autoFocus}
          inputRef={monthSelect}
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
        autoFocus={index === 0 && autoFocus}
        inputRef={monthInput}
        placeholder={monthPlaceholder}
        showLeadingZeros={showLeadingZerosFromFormat || showLeadingZeros}
        value={month}
        year={year}
      />
    );
  }

  function renderYear(currentMatch: string, index: number) {
    return (
      <YearInput
        key="year"
        {...commonInputProps}
        ariaLabel={yearAriaLabel}
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
    // biome-ignore lint/a11y/useKeyWithClickEvents: This interaction is designed for mouse users only
    <div className={className} onClick={onClick}>
      {renderNativeInput()}
      {renderCustomInputsInternal()}
    </div>
  );
}
