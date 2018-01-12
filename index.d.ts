import {CalendarProps} from "react-calendar";


declare module "react-date-picker" {
  type Detail = "month" | "year" | "decade" | "century"

  export default function DatePicker(props: DatePickerProps): JSX.Element;

  export interface DatePickerProps extends CalendarProps {
    calendarClassName?: string | string[];
    calendarIcon?: JSX.Element;
    clearIcon?: JSX.Element;
    isOpen?: boolean;
  }

  export interface CalendarTileProperties {
    date: Date;
    view: Detail;
  }

  export interface ViewCallbackProperties {
    activeStartDate: Date;
    view: Detail;
  }
}
