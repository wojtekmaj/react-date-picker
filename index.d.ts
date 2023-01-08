import React from 'react';
import { CalendarProps } from 'react-calendar';

declare module 'react-date-picker' {
  export class DatePicker extends React.PureComponent<DatePickerProps, { isOpen: boolean }> {}

  export interface DatePickerProps extends CalendarProps {
    autoFocus?: boolean;
    calendarAriaLabel?: string;
    calendarClassName?: string | string[];
    calendarIcon?: JSX.Element | null;
    className?: string | string[];
    clearAriaLabel?: string;
    clearIcon?: JSX.Element | null;
    closeCalendar?: boolean;
    dayAriaLabel?: string;
    dayPlaceholder?: string;
    disabled?: boolean;
    disableCalendar?: boolean;
    format?: string;
    isOpen?: boolean;
    monthAriaLabel?: string;
    monthPlaceholder?: string;
    name?: string;
    nativeInputAriaLabel?: string;
    onCalendarClose?: () => void;
    onCalendarOpen?: () => void;
    openCalendarOnFocus?: boolean;
    portalContainer?: HTMLElement;
    required?: boolean;
    showLeadingZeros?: boolean;
    yearAriaLabel?: string;
    yearPlaceholder?: string;
  }
}
