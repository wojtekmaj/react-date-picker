import { CalendarProps } from "react-calendar";

declare module "react-date-picker" {
  export default function DatePicker(props: DatePickerProps): JSX.Element;

  export interface DatePickerProps extends CalendarProps {
    calendarButtonPosition?: 'left' | 'right';
    calendarClassName?: string | string[];
    calendarIcon?: JSX.Element | null;
    className?: string | string[];
    clearIcon?: JSX.Element | null;
    dayPlaceholder?: string;
    disabled?: boolean;
    format?: string;
    isOpen?: boolean;
    monthPlaceholder?: string;
    name?: string;
    onCalendarOpen?: () => void;
    onCalendarClose?: () => void;
    required?: boolean;
    showLeadingZeros?: boolean;
    yearPlaceholder?: string;
  }
}
