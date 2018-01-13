import { CalendarProps } from "react-calendar";

declare module "react-date-picker" {
  export default function DatePicker(props: DatePickerProps): JSX.Element;

  export interface DatePickerProps extends CalendarProps {
    calendarClassName?: string | string[];
    calendarIcon?: JSX.Element;
    className?: string | string[];
    clearIcon?: JSX.Element;
    isOpen?: boolean;
    returnValue?: "start" | "end";
  }
}
