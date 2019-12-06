import { CalendarProps } from "react-calendar";

declare module "react-date-picker" {
  export default function DatePicker(props: DatePickerProps): JSX.Element;

  export interface DatePickerProps extends CalendarProps {
    autoFocus?: boolean;
    calendarAriaLabel?: string;
    calendarClassName?: string | string[];
    calendarIcon?: string | React.ReactNode;
    className?: string;
    clearAriaLabel?: string;
    clearIcon?: string | React.ReactNode;
    dayAriaLabel?: string;
    dayPlaceholder?: string;
    disabled?: boolean;
    disableCalendar?: boolean;
    format?: string;
    isOpen?: boolean;
    locale?: string;
    maxDate?: Date;
    maxDetail?: "month" | "year" | "decade" | "century";
    minDate?: Date;
    minDetail?: "month" | "year" | "decade" | "century";
    monthAriaLabel?: string;
    monthPlaceholder?: string;
    name?: string;
    nativeInputAriaLabel?: string;
    onCalendarClose?: () => void;
    onCalendarOpen?: () => void;
    onChange: (value: Date) => void;
    required?: boolean;
    returnValue?: "start" | "end" | "range";
    showLeadingZeros?: boolean;
    value?: Date | Date[];
    yearAriaLabel?: string;
    yearPlaceholder?: string;
  }
}
