import { CalendarProps } from "react-calendar";

declare module "react-date-picker" {
  export default function DatePicker(props: DatePickerProps): JSX.Element;

  export interface DatePickerProps extends CalendarProps {
    calendarClassName?: string | string[];
    calendarIcon?: JSX.Element | null;
    className?: string | string[];
    clearIcon?: JSX.Element | null;
    disabled?: boolean;
    format?: string;
    isOpen?: boolean;
    name?: string;
    onCalendarOpen?: () => void;
    onCalendarClose?: () => void;
    required?: boolean;
    showLeadingZeros?: boolean;
  }
}
