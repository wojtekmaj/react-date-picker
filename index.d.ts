import { CalendarProps } from "react-calendar";

declare module "react-date-picker" {
  export default function DatePicker(props: DatePickerProps): JSX.Element;

  export interface DatePickerProps extends CalendarProps {
    calendarClassName?: string | string[];
    calendarIcon?: React.ReactElement;
    className?: string | string[];
    clearAriaLabel?: string;
    clearIcon?: React.ReactElement;
    clockAriaLabel?: string;
    dayAriaLabel?: string;
    disabled?: boolean;
    format?: string;
    isOpen?: boolean;
    monthAriaLabel?: string;
    name?: string;
    nativeInputAriaLabel?: string;
    required?: boolean;
    showLeadingZeros?: boolean;
  }
}
