"use client";

import {
  createElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import makeEventProps from "make-event-props";
import Calendar, { type OnArgs } from "react-calendar";
import Fit from "react-fit";

import DateInput from "./DateInput.js";

import type {
  ClassName,
  CloseReason,
  Detail,
  LooseValue,
  OpenReason,
  Value,
} from "./shared/types.js";
import type { View } from "react-calendar/src/shared/types.js";
import { normalizeToDate } from "./shared/utils.js";

const baseClassName = "react-date-picker";
const outsideActionEvents = ["mousedown", "focusin", "touchstart"] as const;

const iconProps = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 19,
  height: 19,
  viewBox: "0 0 19 19",
  stroke: "black",
  strokeWidth: 2,
};

const CalendarIcon = (
  <svg
    {...iconProps}
    aria-hidden="true"
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
    aria-hidden="true"
    className={`${baseClassName}__clear-button__icon ${baseClassName}__button__icon`}
  >
    <line x1="4" x2="15" y1="4" y2="15" />
    <line x1="15" x2="4" y1="4" y2="15" />
  </svg>
);

type ReactNodeLike =
  | React.ReactNode
  | string
  | number
  | boolean
  | null
  | undefined;

type Icon = ReactNodeLike | ReactNodeLike[];

type IconOrRenderFunction = Icon | React.ComponentType | React.ReactElement;

type CalendarProps = Omit<
  React.ComponentPropsWithoutRef<typeof Calendar>,
  "onChange" | "selectRange" | "value"
>;

type EventProps = ReturnType<typeof makeEventProps>;

export type DatePickerProps = {
  /**
   * Automatically focuses the input on mount.
   *
   * @example true
   */
  autoFocus?: boolean;
  /**
   * `aria-label` for the calendar button.
   *
   * @example 'Toggle calendar'
   */
  calendarAriaLabel?: string;
  /**
   * Content of the calendar button. Setting the value explicitly to `null` will hide the icon.
   *
   * @example 'Calendar'
   * @example <CalendarIcon />
   * @example CalendarIcon
   */
  calendarIcon?: IconOrRenderFunction | null;
  /**
   * Props to pass to React-Calendar component.
   */
  calendarProps?: CalendarProps;
  /**
   * Class name(s) that will be added along with `"react-date-picker"` to the main React-Date-Picker `<div>` element.
   *
   * @example 'class1 class2'
   * @example ['class1', 'class2 class3']
   */
  className?: ClassName;
  /**
   * `aria-label` for the clear button.
   *
   * @example 'Clear value'
   */
  clearAriaLabel?: string;
  /**
   * Content of the clear button. Setting the value explicitly to `null` will hide the icon.
   *
   * @example 'Clear'
   * @example <ClearIcon />
   * @example ClearIcon
   */
  clearIcon?: IconOrRenderFunction | null;
  /**
   * Whether to close the calendar on value selection.
   *
   * **Note**: It's recommended to use `shouldCloseCalendar` function instead.
   *
   * @default true
   * @example false
   */
  closeCalendar?: boolean;
  /**
   * `data-testid` attribute for the main React-Date-Picker `<div>` element.
   *
   * @example 'date-picker'
   */
  "data-testid"?: string;
  /**
   * `aria-label` for the day input.
   *
   * @example 'Day'
   */
  dayAriaLabel?: string;
  /**
   * `placeholder` for the day input.
   *
   * @default '--'
   * @example 'dd'
   */
  dayPlaceholder?: string;
  /**
   * When set to `true`, will remove the calendar and the button toggling its visibility.
   *
   * @default false
   * @example true
   */
  disableCalendar?: boolean;
  /**
   * Whether the date picker should be disabled.
   *
   * @default false
   * @example true
   */
  disabled?: boolean;
  /**
   * Input format based on [Unicode Technical Standard #35](https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table). Supported values are: `y`, `M`, `MM`, `MMM`, `MMMM`, `d`, `dd`.
   *
   * **Note**: When using SSR, setting this prop may help resolving hydration errors caused by locale mismatch between server and client.
   *
   * @example 'y-MM-dd'
   */
  format?: string;
  /**
   * `id` attribute for the main React-Date-Picker `<div>` element.
   *
   * @example 'date-picker'
   */
  id?: string;
  /**
   * Whether the calendar should be opened.
   *
   * @default false
   * @example true
   */
  isOpen?: boolean;
  /**
   * Locale that should be used by the date picker and the calendar. Can be any [IETF language tag](https://en.wikipedia.org/wiki/IETF_language_tag).
   *
   * **Note**: When using SSR, setting this prop may help resolving hydration errors caused by locale mismatch between server and client.
   *
   * @example 'hu-HU'
   */
  locale?: string;
  /**
   * Maximum date that the user can select. Periods partially overlapped by maxDate will also be selectable, although React-Date-Picker will ensure that no later date is selected.
   *
   * @example new Date()
   */
  maxDate?: Date;
  /**
   * The most detailed calendar view that the user shall see. View defined here also becomes the one on which clicking an item in the calendar will select a date and pass it to onChange. Can be `"month"`, `"year"`, `"decade"` or `"century"`.
   *
   * @default 'month'
   * @example 'year'
   */
  maxDetail?: Detail;
  /**
   * Minimum date that the user can select. Periods partially overlapped by minDate will also be selectable, although React-Date-Picker will ensure that no earlier date is selected.
   *
   * @example new Date()
   */
  minDate?: Date;
  /**
   * `aria-label` for the month input.
   *
   * @example 'Month'
   */
  monthAriaLabel?: string;
  /**
   * `placeholder` for the month input.
   *
   * @default '--'
   * @example 'mm'
   */
  monthPlaceholder?: string;
  /**
   * Input name.
   *
   * @default 'date'
   */
  name?: string;
  /**
   * `aria-label` for the native date input.
   *
   * @example 'Date'
   */
  nativeInputAriaLabel?: string;
  /**
   * Function called when the calendar closes.
   *
   * @example () => alert('Calendar closed')
   */
  onCalendarClose?: () => void;
  /**
   * Function called when the calendar opens.
   *
   * @example () => alert('Calendar opened')
   */
  onCalendarOpen?: () => void;
  /**
   * Function called when the user picks a valid date. If any of the fields were excluded using custom `format`, `new Date(y, 0, 1, 0, 0, 0)`, where `y` is the current year, is going to serve as a "base".
   *
   * @example (value) => alert('New date is: ', value)
   */
  onChange?: (value: Value) => void;
  /**
   * Function called when the user focuses an input.
   *
   * @example (event) => alert('Focused input: ', event.target.name)
   */
  onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void;
  /**
   * Function called when the user picks an invalid date.
   *
   * @example () => alert('Invalid date')
   */
  onInvalidChange?: () => void;
  /**
   * Whether to open the calendar on input focus. **Note**: It's recommended to use `shouldOpenCalendar` function instead.
   *
   * @default true
   * @example false
   */
  openCalendarOnFocus?: boolean;
  /**
   * Element to render the calendar in using portal.
   *
   * @example document.getElementById('my-div')
   */
  portalContainer?: HTMLElement | null;
  /**
   * Whether date input should be required.
   *
   * @default false
   * @example true
   */
  required?: boolean;
  /**
   * Which dates shall be passed by the calendar to the onChange function and onClick{Period} functions. Can be `"start"`, `"end"` or `"range"`. The latter will cause an array with start and end values to be passed.
   *
   * @default 'start'
   * @example 'range'
   */
  returnValue?: "start" | "end" | "range";
  /**
   * Function called before the calendar closes. `reason` can be `"buttonClick"`, `"escape"`, `"outsideAction"`, or `"select"`. If it returns `false`, the calendar will not close.
   *
   * @example ({ reason }) => reason !== 'outsideAction'
   */
  shouldCloseCalendar?: (props: { reason: CloseReason }) => boolean;
  /**
   * Function called before the calendar opens. `reason` can be `"buttonClick"` or `"focus"`. If it returns `false`, the calendar will not open.
   *
   * @example ({ reason }) => reason !== 'focus'
   */
  shouldOpenCalendar?: (props: { reason: OpenReason }) => boolean;
  /**
   * Whether leading zeros should be rendered in date inputs.
   *
   * @default false
   * @example true
   */
  showLeadingZeros?: boolean;
  /**
   * Input value. Note that if you pass an array of values, only first value will be fully utilized.
   *
   * @example new Date(2017, 0, 1)
   * @example [new Date(2017, 0, 1), new Date(2017, 7, 1)]
   * @example ['2017-01-01', '2017-08-01']
   */
  value?: LooseValue;
  /**
   * `aria-label` for the year input.
   *
   * @example 'Year'
   */
  yearAriaLabel?: string;
  /**
   * `placeholder` for the year input.
   *
   * @default '----'
   * @example 'yyyy'
   */
  yearPlaceholder?: string;
} & Omit<EventProps, "onChange" | "onFocus">;

export default function DatePicker(props: DatePickerProps): React.ReactElement {
  const {
    autoFocus,
    calendarAriaLabel,
    calendarIcon = CalendarIcon,
    className,
    clearAriaLabel,
    clearIcon = ClearIcon,
    closeCalendar: shouldCloseCalendarOnSelect = true,
    "data-testid": dataTestid,
    dayAriaLabel,
    dayPlaceholder,
    disableCalendar,
    disabled,
    format,
    id,
    isOpen: isOpenProps = null,
    locale,
    maxDate,
    maxDetail = "month",
    minDate,
    monthAriaLabel,
    monthPlaceholder,
    name = "date",
    nativeInputAriaLabel,
    onCalendarClose,
    onCalendarOpen,
    onChange: onChangeProps,
    onFocus: onFocusProps,
    onInvalidChange,
    openCalendarOnFocus = true,
    required,
    returnValue = "start",
    shouldCloseCalendar,
    shouldOpenCalendar,
    showLeadingZeros,
    value,
    yearAriaLabel,
    yearPlaceholder,
    ...otherProps
  } = props;

  const [isOpen, setIsOpen] = useState<boolean | null>(isOpenProps);
  const [internalActiveStartDate, setInternalActiveStartDate] =
    useState<Date | null>(null);
  const [internalView, setInternalView] = useState<View>("month");
  const wrapper = useRef<HTMLDivElement>(null);
  const calendarWrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsOpen(isOpenProps);
  }, [isOpenProps]);

  // made this callback and preventing it to re render
  const openCalendar = useCallback(
    ({ reason }: { reason: OpenReason }) => {
      if (shouldOpenCalendar) {
        if (!shouldOpenCalendar({ reason })) {
          return;
        }
      }
      const startDate = normalizeToDate(value);
      setInternalActiveStartDate(startDate);
      setInternalView(maxDetail === "month" ? "month" : maxDetail);

      setIsOpen(true);

      if (onCalendarOpen) {
        onCalendarOpen();
      }
    },
    [value, onCalendarOpen, shouldOpenCalendar]
  );

  const closeCalendar = useCallback(
    ({ reason }: { reason: CloseReason }) => {
      if (shouldCloseCalendar) {
        if (!shouldCloseCalendar({ reason })) {
          return;
        }
      }

      setIsOpen(false);

      if (onCalendarClose) {
        onCalendarClose();
      }
    },
    [onCalendarClose, shouldCloseCalendar]
  );

  // user to get to the month view everytime , even though they drilled up to decade/century and closed the calender without selecting date
  function onActiveStartDateChange({
    action,
    activeStartDate,
    view,
    value,
  }: OnArgs) {
    let nextDate = activeStartDate;
    switch (action) {
      case "drillUp":
      case "drillDown":
      case "next":
      case "prev":
      case "next2":
      case "prev2":
      case "onChange":
        nextDate = activeStartDate;
        break;

      default:
        nextDate = activeStartDate;
    }

    setInternalActiveStartDate(nextDate);
    setInternalView(view);
  }

  function toggleCalendar() {
    if (isOpen) {
      closeCalendar({ reason: "buttonClick" });
    } else {
      openCalendar({ reason: "buttonClick" });
    }
  }

  function onChange(
    value: Value,
    shouldCloseCalendar: boolean = shouldCloseCalendarOnSelect
  ) {
    if (shouldCloseCalendar) {
      closeCalendar({ reason: "select" });
    }

    if (onChangeProps) {
      onChangeProps(value);
    }
  }

  function onFocus(event: React.FocusEvent<HTMLInputElement>) {
    if (onFocusProps) {
      onFocusProps(event);
    }

    if (
      // Internet Explorer still fires onFocus on disabled elements
      disabled ||
      isOpen ||
      !openCalendarOnFocus ||
      event.target.dataset.select === "true"
    ) {
      return;
    }

    openCalendar({ reason: "focus" });
  }

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCalendar({ reason: "escape" });
      }
    },
    [closeCalendar]
  );

  function clear() {
    onChange(null);
  }

  function stopPropagation(event: React.FocusEvent) {
    event.stopPropagation();
  }

  const onOutsideAction = useCallback(
    (event: Event) => {
      const { current: wrapperEl } = wrapper;
      const { current: calendarWrapperEl } = calendarWrapper;

      // Try event.composedPath first to handle clicks inside a Shadow DOM.
      const target = (
        "composedPath" in event
          ? event.composedPath()[0]
          : (event as Event).target
      ) as HTMLElement;

      if (
        target &&
        wrapperEl &&
        !wrapperEl.contains(target) &&
        (!calendarWrapperEl || !calendarWrapperEl.contains(target))
      ) {
        closeCalendar({ reason: "outsideAction" });
      }
    },
    [closeCalendar]
  );

  const handleOutsideActionListeners = useCallback(
    (shouldListen = isOpen) => {
      for (const event of outsideActionEvents) {
        if (shouldListen) {
          document.addEventListener(event, onOutsideAction);
        } else {
          document.removeEventListener(event, onOutsideAction);
        }
      }

      if (shouldListen) {
        document.addEventListener("keydown", onKeyDown);
      } else {
        document.removeEventListener("keydown", onKeyDown);
      }
    },
    [isOpen, onOutsideAction, onKeyDown]
  );

  useEffect(() => {
    handleOutsideActionListeners();

    return () => {
      handleOutsideActionListeners(false);
    };
  }, [handleOutsideActionListeners]);

  function renderInputs() {
    const [valueFrom] = Array.isArray(value) ? value : [value];

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
          onChange={onChange}
          onInvalidChange={onInvalidChange}
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
            {typeof clearIcon === "function"
              ? createElement(clearIcon)
              : clearIcon}
          </button>
        )}
        {calendarIcon !== null && !disableCalendar && (
          <button
            aria-expanded={isOpen || false}
            aria-label={calendarAriaLabel}
            className={`${baseClassName}__calendar-button ${baseClassName}__button`}
            disabled={disabled}
            onClick={toggleCalendar}
            onFocus={stopPropagation}
            type="button"
          >
            {typeof calendarIcon === "function"
              ? createElement(calendarIcon)
              : calendarIcon}
          </button>
        )}
      </div>
    );
  }

  function renderCalendar() {
    if (isOpen === null || disableCalendar) {
      return null;
    }

    const { calendarProps, portalContainer, value } = props;

    const className = `${baseClassName}__calendar`;
    const classNames = clsx(
      className,
      `${className}--${isOpen ? "open" : "closed"}`
    );

    const calendar = (
      <Calendar
        locale={locale}
        maxDate={maxDate}
        maxDetail={maxDetail}
        minDate={minDate}
        onChange={(value) => onChange(value)}
        value={value}
        activeStartDate={internalActiveStartDate ?? undefined}
        onActiveStartDateChange={onActiveStartDateChange}
        view={internalView}
        {...calendarProps}
      />
    );

    return portalContainer ? (
      createPortal(
        <div ref={calendarWrapper} className={classNames}>
          {calendar}
        </div>,
        portalContainer
      )
    ) : (
      <Fit>
        <div
          ref={(ref) => {
            if (ref && !isOpen) {
              ref.removeAttribute("style");
            }
          }}
          className={classNames}
        >
          {calendar}
        </div>
      </Fit>
    );
  }

  const eventProps = useMemo(
    () => makeEventProps(otherProps),
    // biome-ignore lint/correctness/useExhaustiveDependencies: FIXME
    [otherProps]
  );

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: False positive caused by non interactive wrapper listening for bubbling events
    <div
      className={clsx(
        baseClassName,
        `${baseClassName}--${isOpen ? "open" : "closed"}`,
        `${baseClassName}--${disabled ? "disabled" : "enabled"}`,
        className
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
